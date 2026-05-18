/* ════════════════════════════════════════════════════════
   XENON TICK ANALYSER  ·  Upgraded script.js
   Aligns with upgraded engine: typed ring buffer, RAF
   batching, exponential backoff, streak detection,
   DocumentFragment chips, price-direction flash.
════════════════════════════════════════════════════════ */

'use strict';

// ── Constants ──────────────────────────────────────────
const ENDPOINT         = 'wss://ws.derivws.com/websockets/v3?app_id=107255';
const CIRCLES_SYMBOL_KEY = 'circles.selected_symbol.v1';

// ── WebSocket state ────────────────────────────────────
let ws           = null;
let wsRetryDelay = 1500;          // grows exponentially on disconnect

// ── Symbol / price state ───────────────────────────────
let currentSymbol = null;
const symbolMeta  = new Map();    // symbol → { decimals }
let currentPipSize = 2;
let lastRawPrice   = null;        // for up/down flash

// ── Ring-buffer state ──────────────────────────────────
let MAX_SAMPLES  = 1000;
let digitsQueue  = new Uint8Array(MAX_SAMPLES);   // circular buffer
let queueHead    = 0;             // next write index
let queueLen     = 0;             // filled count (≤ MAX_SAMPLES)
let freq         = new Int32Array(10);

// ── RAF dirty-flag batching ────────────────────────────
let rafPending  = false;
let dirtyFlags  = 0;
const D_CIRCLES = 1, D_OU = 2, D_MD = 4, D_EO = 8, D_ALL = 15;

// ── Sequence-chip display counts ───────────────────────
let ouShowCount = 10;
let mdShowCount = 10;
const EO_SHOW   = 50;

// ── DOM refs ───────────────────────────────────────────
const $            = id => document.getElementById(id);
const symbolsEl    = $('symbols');
const priceEl      = $('price');
const digitEl      = $('digit');
const digitsContainer = $('digits');
const samplesCountEl  = $('samples-count');
const ticksWindowEl   = $('ticks-window');
const ouThresholdEl   = $('ou-threshold');
const ouUnderPctEl    = $('ou-under-pct');
const ouEqualPctEl    = $('ou-equal-pct');
const ouOverPctEl     = $('ou-over-pct');
const ouUnderFillEl   = $('ou-under-fill');
const ouEqualFillEl   = $('ou-equal-fill');
const ouOverFillEl    = $('ou-over-fill');
const ouSeqChipsEl    = $('ou-seq-chips');
const ouMoreBtn       = $('ou-more');
const mdMatchPctEl    = $('md-match-pct');
const mdDifferPctEl   = $('md-differ-pct');
const mdMatchFillEl   = $('md-match-fill');
const mdDifferFillEl  = $('md-differ-fill');
const mdSeqChipsEl    = $('md-seq-chips');
const mdMoreBtn       = $('md-more');
const eoEvenPctEl     = $('eo-even-pct');
const eoOddPctEl      = $('eo-odd-pct');
const eoEvenFillEl    = $('eo-even-fill');
const eoOddFillEl     = $('eo-odd-fill');
const eoSeqChipsEl    = $('eo-seq-chips');
const eoMoreBtn       = $('eo-more');
const appTitleEl      = $('app-title');
const labelMarketEl   = $('label-market');
const labelWindowEl   = $('label-window');
const digitsTitleEl   = $('digits-title');
const legendCurrentEl = $('legend-current');
const legendLeastEl   = $('legend-least');
const labelOuEl       = $('label-ou');
// Optional elements added by upgraded HTML (graceful if absent)
const statusDotEl   = $('status-dot');
const statusLabelEl = $('status-label');
const connToastEl   = $('conn-toast');
const connMsgEl     = $('conn-msg');
const streakBarEl   = $('streak-bar');
const streakMsgEl   = $('streak-msg');
const eoRatioEl     = $('eo-ratio');

/* ══════════════════════════════════════════════════════
   TITLE / HEADING SECURITY  (preserved from original)
══════════════════════════════════════════════════════ */
(function secureTitle() {
    try {
        const codes = [88,101,110,111,110,32,84,105,99,107,32,65,110,97,108,121,115,101,114];
        const title  = String.fromCharCode(...codes);
        if (appTitleEl) appTitleEl.textContent = title;
        document.title = title;

        const restore = () => {
            if (document.title !== title) document.title = title;
            if (appTitleEl && appTitleEl.textContent !== title) appTitleEl.textContent = title;
        };

        if (appTitleEl && window.MutationObserver) {
            new MutationObserver(restore)
                .observe(appTitleEl, { childList: true, characterData: true, subtree: true });
        }

        try {
            const desc =
                Object.getOwnPropertyDescriptor(Document.prototype, 'title') ||
                Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'title');
            if (desc?.set) {
                const native = desc.set.bind(document);
                Object.defineProperty(document, 'title', {
                    configurable: false, enumerable: true,
                    get: desc.get ? desc.get.bind(document) : () => title,
                    set: () => { requestAnimationFrame(restore); return native(title); },
                });
            } else {
                setInterval(restore, 2000);
            }
        } catch (_) { setInterval(restore, 2000); }
    } catch (_) {}
})();

(function secureHeadings() {
    const from  = arr => String.fromCharCode(...arr);
    const texts = {
        labelMarket:    from([83,101,108,101,99,116,32,77,97,114,107,101,116,58]),
        labelWindow:    from([84,105,99,107,115,32,119,105,110,100,111,119,58]),
        legendCurrent:  from([99,117,114,114,101,110,116,32,100,105,103,105,116,32,47,32,109,111,115,116]),
        legendLeast:    from([108,101,97,115,116,32,102,114,101,113,117,101,110,99,121]),
        labelOu:        from([79,118,101,114,47,85,110,100,101,114,58]),
    };

    const applyAll = () => {
        if (labelMarketEl)   labelMarketEl.textContent   = texts.labelMarket;
        if (labelWindowEl)   labelWindowEl.textContent   = texts.labelWindow;
        if (digitsTitleEl)   digitsTitleEl.textContent   = `Last ${MAX_SAMPLES} ticks digit distribution`;
        if (legendCurrentEl) legendCurrentEl.textContent = texts.legendCurrent;
        if (legendLeastEl)   legendLeastEl.textContent   = texts.legendLeast;
        if (labelOuEl)       labelOuEl.textContent       = texts.labelOu;
    };

    applyAll();

    if (window.MutationObserver) {
        const mo = new MutationObserver(applyAll);
        [labelMarketEl, labelWindowEl, digitsTitleEl, legendCurrentEl, legendLeastEl, labelOuEl]
            .filter(Boolean)
            .forEach(el => mo.observe(el, { childList: true, characterData: true, subtree: true }));
    }
})();

/* ══════════════════════════════════════════════════════
   THEME MIRROR  (preserved from original)
══════════════════════════════════════════════════════ */
(function mirrorTheme() {
    const root = document.documentElement;
    const applyDark = v => { if (typeof v === 'boolean') root.classList.toggle('dark', v); };

    const isParentDark = () => {
        try {
            const pd = window.parent?.document;
            if (!pd || pd === document) return null;
            const pel = pd.documentElement;
            if (pel.classList.contains('dark') || pel.getAttribute('data-theme') === 'dark') return true;
            const pb = pd.body;
            if (pb && (pb.classList.contains('dark') || pb.getAttribute('data-theme') === 'dark')) return true;
            return false;
        } catch (_) { return null; }
    };

    const init = isParentDark();
    if (init === null) applyDark(window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);
    else applyDark(init);

    window.addEventListener('message', e => {
        const d = e.data;
        if (d && typeof d === 'object' && d.type === 'theme' && 'isDark' in d) applyDark(!!d.isDark);
    });

    try {
        const pd = window.parent?.document;
        if (pd && pd !== document) {
            const pel = pd.documentElement;
            new window.parent.MutationObserver(
                () => applyDark(pel.classList.contains('dark') || pel.getAttribute('data-theme') === 'dark')
            ).observe(pel, { attributes: true, attributeFilter: ['class', 'data-theme'] });
        }
    } catch (_) {}

    setInterval(() => { const v = isParentDark(); if (v !== null) applyDark(v); }, 2000);
})();

/* ══════════════════════════════════════════════════════
   UTILITY
══════════════════════════════════════════════════════ */
function toFixedWithPip(price, pipSize) {
    return Number(price).toFixed(Number.isFinite(pipSize) ? pipSize : 2);
}

function extractLastDigit(price, pipSize) {
    const s  = toFixedWithPip(price, pipSize).replace('.', '');
    const ch = s.charAt(s.length - 1);
    const d  = Number(ch);
    return Number.isFinite(d) ? d : 0;
}

function pctStr(n, total) {
    return total ? `${(n / total * 100).toFixed(1)}%` : '0.0%';
}
function pctWidth(n, total) {
    return total ? `${(n / total * 100).toFixed(1)}%` : '0%';
}

/* ══════════════════════════════════════════════════════
   STATUS / CONNECTION UI  (optional elements)
══════════════════════════════════════════════════════ */
function setStatus(state) {
    // 'connecting' | 'live' | 'error'
    if (statusDotEl) {
        statusDotEl.className =
            'status-dot' + (state === 'live' ? ' live' : state === 'error' ? ' error' : '');
    }
    if (statusLabelEl) {
        statusLabelEl.textContent =
            state === 'live' ? 'Live' : state === 'error' ? 'Error' : 'Connecting…';
    }
    if (connToastEl) {
        if (state === 'connecting') {
            connToastEl.classList.add('visible');
            if (connMsgEl) connMsgEl.textContent = 'Reconnecting…';
        } else {
            connToastEl.classList.remove('visible');
        }
    }
}

/* ══════════════════════════════════════════════════════
   RING BUFFER MANAGEMENT
══════════════════════════════════════════════════════ */

/** Resize buffer to newMax, preserving the most recent data. */
function resizeBuffer(newMax) {
    const snapshot = recentDigits(queueLen);           // oldest→newest
    MAX_SAMPLES  = newMax;
    digitsQueue  = new Uint8Array(newMax);
    freq.fill(0);
    queueHead = 0;
    queueLen  = 0;
    // Re-push only the newest newMax values
    const start = snapshot.length > newMax ? snapshot.length - newMax : 0;
    for (let i = start; i < snapshot.length; i++) {
        digitsQueue[queueHead] = snapshot[i];
        freq[snapshot[i]]++;
        queueHead = (queueHead + 1) % newMax;
        queueLen  = Math.min(queueLen + 1, newMax);
    }
    if (digitsTitleEl) digitsTitleEl.textContent = `Last ${MAX_SAMPLES} ticks digit distribution`;
}

function resetBuffer() {
    digitsQueue = new Uint8Array(MAX_SAMPLES);
    freq.fill(0);
    queueHead = 0;
    queueLen  = 0;
}

/** Push one digit into the ring; evicts oldest when full. */
function pushDigit(d) {
    if (queueLen === MAX_SAMPLES) {
        // evict oldest
        freq[digitsQueue[queueHead]]--;
    }
    digitsQueue[queueHead] = d;
    freq[d]++;
    queueHead = (queueHead + 1) % MAX_SAMPLES;
    queueLen  = Math.min(queueLen + 1, MAX_SAMPLES);
}

/** Iterate all buffered digits in chronological order (oldest first). */
function forEachDigit(cb) {
    if (queueLen < MAX_SAMPLES) {
        for (let i = 0; i < queueLen; i++) cb(digitsQueue[i]);
    } else {
        for (let i = 0; i < MAX_SAMPLES; i++) cb(digitsQueue[(queueHead + i) % MAX_SAMPLES]);
    }
}

/** Return a Uint8Array of the n most recent digits, oldest at index 0. */
function recentDigits(n) {
    const len = Math.min(n, queueLen);
    const out = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        const age = len - 1 - i;          // 0 = newest
        const idx = queueLen < MAX_SAMPLES
            ? queueLen - 1 - age
            : ((queueHead - 1 - age) + MAX_SAMPLES * 2) % MAX_SAMPLES;
        out[i] = digitsQueue[idx];
    }
    return out;
}

/* ══════════════════════════════════════════════════════
   STREAK DETECTION
══════════════════════════════════════════════════════ */
function checkStreak() {
    if (!streakBarEl || queueLen < 3) {
        streakBarEl?.classList.remove('visible');
        return;
    }
    const recent = recentDigits(10);
    const last   = recent[recent.length - 1];
    let run = 1;
    for (let i = recent.length - 2; i >= 0; i--) {
        if (recent[i] === last) run++;
        else break;
    }
    if (run >= 4) {
        if (streakMsgEl) streakMsgEl.textContent = `Digit ${last} appeared ${run}× in a row`;
        streakBarEl.classList.add('visible');
    } else {
        streakBarEl.classList.remove('visible');
    }
}

/* ══════════════════════════════════════════════════════
   DIGIT CIRCLE UI  (compatible with original HTML + CSS)
══════════════════════════════════════════════════════ */
function initDigitUI() {
    digitsContainer.innerHTML = '';
    for (let d = 0; d < 10; d++) {
        const row    = document.createElement('div');
        row.className = 'digit-item';

        const circle  = document.createElement('div');
        circle.className    = 'circle';
        circle.dataset.digit = String(d);

        const content = document.createElement('div');
        content.className = 'circle-content';

        const num = document.createElement('div');
        num.className   = 'circle-num';
        num.textContent = String(d);

        const pct = document.createElement('div');
        pct.className   = 'circle-pct';
        pct.textContent = '0%';

        content.appendChild(num);
        content.appendChild(pct);
        circle.appendChild(content);

        // Click → set O/U threshold
        circle.addEventListener('click', () => {
            ouThresholdEl.value = String(d);
            scheduleUpdate(D_OU | D_MD);
        });

        row.appendChild(circle);
        digitsContainer.appendChild(row);
    }
}

/* ══════════════════════════════════════════════════════
   RAF BATCHING
══════════════════════════════════════════════════════ */
function scheduleUpdate(flags) {
    dirtyFlags |= flags;
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(flush);
}

function flush() {
    rafPending = false;
    const f = dirtyFlags;
    dirtyFlags = 0;
    if (f & D_CIRCLES) renderCircles();
    if (f & D_OU)      renderOverUnder();
    if (f & D_MD)      renderMatchesDiffers();
    if (f & D_EO)      renderEvenOdd();
    checkStreak();
}

/* ══════════════════════════════════════════════════════
   RENDER: CIRCLES
══════════════════════════════════════════════════════ */
function renderCircles() {
    // Compute frequency ranks
    let maxF = 0, secondF = 0, minF = Infinity, secondMinF = Infinity;
    for (let i = 0; i < 10; i++) {
        if (freq[i] > maxF)              { secondF = maxF;    maxF = freq[i]; }
        else if (freq[i] > secondF)      { secondF = freq[i]; }
        if (freq[i] < minF)              { secondMinF = minF; minF = freq[i]; }
        else if (freq[i] < secondMinF && freq[i] > minF) { secondMinF = freq[i]; }
    }

    // Current (most recent) digit
    const cur = queueLen > 0
        ? digitsQueue[(queueHead - 1 + MAX_SAMPLES) % MAX_SAMPLES]
        : null;

    for (let d = 0; d < 10; d++) {
        const row    = digitsContainer.children[d];
        if (!row) continue;
        const circle = row.querySelector('.circle');
        const pctEl  = row.querySelector('.circle-pct');
        if (!circle || !pctEl) continue;

        const p = queueLen ? (freq[d] / queueLen) * 100 : 0;
        pctEl.textContent = `${p.toFixed(1)}%`;
        circle.style.setProperty('--pct', p);

        circle.classList.toggle('current',    cur === d);
        circle.classList.toggle('top',        maxF > 0    && freq[d] === maxF);
        circle.classList.toggle('second',     secondF > 0 && freq[d] === secondF && freq[d] !== maxF);
        circle.classList.toggle('least',      queueLen > 0 && freq[d] === minF);
        circle.classList.toggle('secondleast', Number.isFinite(secondMinF) && freq[d] === secondMinF && freq[d] !== minF);
    }

    samplesCountEl.textContent = `${queueLen}/${MAX_SAMPLES}`;
    if (digitsTitleEl) digitsTitleEl.textContent = `Last ${MAX_SAMPLES} ticks digit distribution`;
}

/* ══════════════════════════════════════════════════════
   RENDER: OVER / UNDER
══════════════════════════════════════════════════════ */
function renderOverUnder() {
    const threshold = parseInt(ouThresholdEl.value, 10);
    if (!Number.isFinite(threshold)) return;

    let under = 0, equal = 0, over = 0;
    forEachDigit(v => {
        if      (v < threshold) under++;
        else if (v > threshold) over++;
        else                    equal++;
    });

    const total = Math.max(queueLen, 1);
    ouUnderPctEl.textContent  = pctStr(under, total);
    ouEqualPctEl.textContent  = pctStr(equal, total);
    ouOverPctEl.textContent   = pctStr(over,  total);
    if (ouUnderFillEl) ouUnderFillEl.style.width = pctWidth(under, total);
    if (ouEqualFillEl) ouEqualFillEl.style.width = pctWidth(equal, total);
    if (ouOverFillEl)  ouOverFillEl.style.width  = pctWidth(over,  total);

    if (!ouSeqChipsEl) return;
    const recent = recentDigits(Math.min(ouShowCount, queueLen));
    const frag   = document.createDocumentFragment();
    for (let i = 0; i < recent.length; i++) {
        const v    = recent[i];
        const chip = document.createElement('div');
        let cls = 'equal', txt = '=';
        if      (v < threshold) { cls = 'under'; txt = 'U'; }
        else if (v > threshold) { cls = 'over';  txt = 'O'; }
        chip.className   = `ou-chip ${cls}`;
        chip.textContent = txt;
        frag.appendChild(chip);
    }
    ouSeqChipsEl.replaceChildren(frag);
}

/* ══════════════════════════════════════════════════════
   RENDER: MATCHES / DIFFERS
══════════════════════════════════════════════════════ */
function renderMatchesDiffers() {
    const sel = parseInt(ouThresholdEl.value, 10);
    if (!Number.isFinite(sel)) return;

    let match = 0, differ = 0;
    forEachDigit(v => { if (v === sel) match++; else differ++; });

    const total = Math.max(queueLen, 1);
    if (mdMatchPctEl)  mdMatchPctEl.textContent  = pctStr(match,  total);
    if (mdDifferPctEl) mdDifferPctEl.textContent = pctStr(differ, total);
    if (mdMatchFillEl)  mdMatchFillEl.style.width  = pctWidth(match,  total);
    if (mdDifferFillEl) mdDifferFillEl.style.width = pctWidth(differ, total);

    if (!mdSeqChipsEl) return;
    const recent = recentDigits(Math.min(mdShowCount, queueLen));
    const frag   = document.createDocumentFragment();
    for (let i = 0; i < recent.length; i++) {
        const chip  = document.createElement('div');
        const isM   = recent[i] === sel;
        chip.className   = `md-chip ${isM ? 'match' : 'differ'}`;
        chip.textContent = isM ? 'M' : 'D';
        frag.appendChild(chip);
    }
    mdSeqChipsEl.replaceChildren(frag);
}

/* ══════════════════════════════════════════════════════
   RENDER: EVEN / ODD
══════════════════════════════════════════════════════ */
function renderEvenOdd() {
    let even = 0, odd = 0;
    forEachDigit(v => { if (v % 2 === 0) even++; else odd++; });

    const total = Math.max(queueLen, 1);
    if (eoEvenPctEl) eoEvenPctEl.textContent = pctStr(even, total);
    if (eoOddPctEl)  eoOddPctEl.textContent  = pctStr(odd,  total);
    if (eoEvenFillEl) eoEvenFillEl.style.width = pctWidth(even, total);
    if (eoOddFillEl)  eoOddFillEl.style.width  = pctWidth(odd,  total);
    // Optional ratio display (upgraded HTML only)
    if (eoRatioEl) eoRatioEl.textContent = `${even}E / ${odd}O`;

    if (!eoSeqChipsEl) return;
    const recent = recentDigits(Math.min(EO_SHOW, queueLen));
    const frag   = document.createDocumentFragment();
    for (let i = 0; i < recent.length; i++) {
        const chip  = document.createElement('div');
        const isE   = recent[i] % 2 === 0;
        chip.className   = `eo-chip ${isE ? 'even' : 'odd'}`;
        chip.textContent = isE ? 'E' : 'O';
        frag.appendChild(chip);
    }
    eoSeqChipsEl.replaceChildren(frag);
}

/* ══════════════════════════════════════════════════════
   WEBSOCKET
══════════════════════════════════════════════════════ */
function connect() {
    setStatus('connecting');
    ws = new WebSocket(ENDPOINT);

    ws.onopen = () => {
        wsRetryDelay = 1500;          // reset backoff
        setStatus('live');
        ws.send(JSON.stringify({ active_symbols: 'brief', product_type: 'basic' }));
        if (currentSymbol) {
            requestHistory(currentSymbol);
            ws.send(JSON.stringify({ ticks: currentSymbol, subscribe: 1 }));
        }
    };

    ws.onmessage = e => {
        let data;
        try { data = JSON.parse(e.data); } catch { return; }
        if (data.active_symbols) handleSymbols(data.active_symbols);
        if (data.history)        handleHistory(data.history);
        if (data.tick)           handleTick(data.tick);
        if (data.error)          console.error('Deriv WS error:', data.error);
    };

    ws.onclose = () => {
        setStatus('connecting');
        wsRetryDelay = Math.min(wsRetryDelay * 1.5, 30000);   // exponential backoff, cap 30 s
        setTimeout(connect, wsRetryDelay);
    };

    ws.onerror = () => ws.close();    // triggers onclose → retry
}

function requestHistory(symbol) {
    ws.send(JSON.stringify({
        ticks_history:    symbol,
        adjust_start_time: 1,
        count:            MAX_SAMPLES,
        end:              'latest',
        start:            1,
        style:            'ticks',
    }));
}

/* ── Message handlers ─────────────────────────────── */
function handleSymbols(list) {
    // Volatility indices only
    const vols = list.filter(
        s => s.market === 'synthetic_index' && /Volatility/i.test(s.display_name)
    );

    symbolMeta.clear();
    vols.forEach(s => {
        const pip = Number(s.pip ?? s.pip_size ?? 0.01);
        let dec = 2;
        if (Number.isFinite(pip)) {
            const str = String(pip);
            dec = str.includes('.') ? str.split('.')[1].length : 0;
        }
        symbolMeta.set(s.symbol, { decimals: dec });
    });

    const oneS = vols.filter(s => /(1s)/i.test(s.display_name) || /_1s$/i.test(s.symbol));
    const std  = vols.filter(s => !oneS.includes(s));

    symbolsEl.innerHTML = '';
    const addGroup = (label, items) => {
        if (!items.length) return;
        const grp = document.createElement('optgroup');
        grp.label = label;
        items.forEach(s => {
            const opt = document.createElement('option');
            opt.value       = s.symbol;
            opt.textContent = s.display_name;
            grp.appendChild(opt);
        });
        symbolsEl.appendChild(grp);
    };
    addGroup('Volatility (1s)', oneS);
    addGroup('Volatility', std);

    // Restore saved symbol
    let saved = null;
    try { saved = localStorage.getItem(CIRCLES_SYMBOL_KEY); } catch (_) {}
    const allSyms  = vols.map(s => s.symbol);
    const fallback = vols[0]?.symbol ?? null;
    subscribe((saved && allSyms.includes(saved)) ? saved : fallback);
}

function handleHistory(history) {
    if (!Array.isArray(history.prices)) return;
    currentPipSize = Number(history.pip_size ?? currentPipSize ?? 2);
    resetBuffer();

    const meta = symbolMeta.get(currentSymbol);
    const dec  = meta?.decimals ?? currentPipSize;
    history.prices.forEach(q => pushDigit(extractLastDigit(q, dec)));

    scheduleUpdate(D_ALL);
}

function handleTick(tick) {
    const { quote, symbol } = tick;
    if (symbol !== currentSymbol) return;
    currentPipSize = Number(tick.pip_size ?? currentPipSize ?? 2);

    const meta = symbolMeta.get(currentSymbol);
    const dec  = meta?.decimals ?? currentPipSize;
    const fmt  = toFixedWithPip(quote, dec);
    const d    = extractLastDigit(quote, dec);

    // Price direction flash (up / down CSS classes)
    if (priceEl) {
        if (lastRawPrice !== null) {
            priceEl.classList.toggle('up',   quote > lastRawPrice);
            priceEl.classList.toggle('down', quote < lastRawPrice);
        }
        priceEl.textContent = fmt;
    }
    lastRawPrice = quote;
    if (digitEl) digitEl.textContent = String(d);

    pushDigit(d);
    scheduleUpdate(D_ALL);
}

/* ══════════════════════════════════════════════════════
   SUBSCRIBE
══════════════════════════════════════════════════════ */
function subscribe(symbol) {
    if (!symbol || symbol === currentSymbol) return;
    currentSymbol = symbol;
    try { localStorage.setItem(CIRCLES_SYMBOL_KEY, symbol); } catch (_) {}
    if (symbolsEl && symbolsEl.value !== symbol) symbolsEl.value = symbol;

    resetBuffer();
    if (priceEl) priceEl.textContent = '—';
    if (digitEl) digitEl.textContent = '—';
    scheduleUpdate(D_ALL);

    if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ forget_all: 'ticks' }));
        requestHistory(symbol);
        ws.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
    }
}

/* ══════════════════════════════════════════════════════
   CONTROLS
══════════════════════════════════════════════════════ */
symbolsEl.addEventListener('change', e => subscribe(e.target.value));

ticksWindowEl.addEventListener('change', () => {
    let val = parseInt(ticksWindowEl.value, 10);
    if (!Number.isFinite(val)) val = 1000;
    val = Math.max(50, Math.min(5000, val));
    ticksWindowEl.value = String(val);

    // Resize preserves existing data (no full reset)
    resizeBuffer(val);
    scheduleUpdate(D_ALL);

    if (currentSymbol && ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ forget_all: 'ticks' }));
        requestHistory(currentSymbol);
        ws.send(JSON.stringify({ ticks: currentSymbol, subscribe: 1 }));
    }
});

// Over/Under threshold initialisation
function initOverUnder() {
    ouThresholdEl.innerHTML = '';
    for (let i = 0; i <= 9; i++) {
        const opt = document.createElement('option');
        opt.value = opt.textContent = String(i);
        ouThresholdEl.appendChild(opt);
    }
    ouThresholdEl.value = '5';
    ouThresholdEl.addEventListener('change', () => scheduleUpdate(D_OU | D_MD));
}

ouMoreBtn?.addEventListener('click', () => {
    ouShowCount = ouShowCount === 10 ? 50 : 10;
    ouMoreBtn.textContent = ouShowCount === 10 ? 'More' : 'Less';
    scheduleUpdate(D_OU);
});

mdMoreBtn?.addEventListener('click', () => {
    mdShowCount = mdShowCount === 10 ? 50 : 10;
    mdMoreBtn.textContent = mdShowCount === 10 ? 'More' : 'Less';
    scheduleUpdate(D_MD);
});

// E/O more button (optional — original had it commented out)
eoMoreBtn?.addEventListener('click', () => {
    // No-op: EO_SHOW is constant (50); hook is here for future use
});

/* ══════════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════════ */
initDigitUI();
initOverUnder();
scheduleUpdate(D_ALL);
connect();
