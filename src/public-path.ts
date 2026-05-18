// public-path-and-survicate.ts
export const getUrlBase = (path = ''): string => {
  const l = window.location;
  const pathname = l.pathname || '/';

  // If path already absolute, normalize it
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // If not a br_ prefixed site, return the provided path as-is
  const firstSegment = pathname.split('/').filter(Boolean)[0] || '';
  if (!/^br_/.test(firstSegment)) {
    return normalizedPath;
  }

  // Build base using the first path segment (e.g., /br_xxx)
  return `/${firstSegment}${normalizedPath}`;
};

export function setBotPublicPath(path: string) {
  try {
    // Some bundlers expose this global; guard against readonly globals
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (typeof path !== 'string') return;
    // Reset then set to ensure runtime updates are picked up
    try { w.__webpack_public_path__ = ''; } catch (_) {}
    try { w.__webpack_public_path__ = path; } catch (_) {}
  } catch (_) {
    // swallow errors to avoid breaking app initialization
  }
}

export const getImageLocation = (image_name: string) => {
  const name = image_name ? image_name.replace(/^\/+/, '') : '';
  return `assets/images/${name}`;
};

declare global {
  interface Window {
    Survicate?: {
      track: (attribute: string, value: string) => void;
    };
    __webpack_public_path__?: string;
  }
}

const SCRIPt_ID = 'dbot-survicate';
let initSurvicateCalled = false;
const setSurvicateCalledValue = (value: boolean) => {
  initSurvicateCalled = value;
};

const safeJsonParse = <T = any>(value: string | null): T | undefined => {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch (_) {
    return undefined;
  }
};

const loadScriptWithTimeout = (src: string, timeoutMs = 8000): Promise<void> =>
  new Promise((resolve, reject) => {
    if (document.getElementById(SCRIPt_ID)) return resolve();

    const script = document.createElement('script');
    script.id = SCRIPt_ID;
    script.async = true;
    script.src = src;

    let settled = false;
    const cleanup = () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    const onLoad = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const onError = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('Script load error'));
    };

    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('Script load timeout'));
    }, timeoutMs);

    script.onload = () => {
      window.clearTimeout(timer);
      onLoad();
    };
    script.onerror = () => {
      window.clearTimeout(timer);
      onError();
    };

    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  });

const setSurvicateUserAttributes = (country?: string, type?: string, creationDate?: string) => {
  try {
    if (!window.Survicate) return;
    if (country) window.Survicate.track('userCountry', country);
    if (type) window.Survicate.track('accountType', type);
    if (creationDate) window.Survicate.track('accountCreationDate', creationDate);
  } catch (_) {}
};

const initSurvicate = async () => {
  if (initSurvicateCalled) return;
  setSurvicateCalledValue(true);

  // Read storage safely
  const active_loginid = localStorage.getItem('active_loginid') || undefined;
  const client_accounts = safeJsonParse<Record<string, any>>(localStorage.getItem('accountsList')) || undefined;

  const setAttributesIfAvailable = () => {
    try {
      if (!active_loginid || !client_accounts) return;
      const account = client_accounts[active_loginid] || {};
      const { residence, account_type, created_at } = account;
      setSurvicateUserAttributes(residence, account_type, created_at);
    } catch (_) {}
  };

  // If script already present, just set attributes and show box if exists
  if (document.getElementById(SCRIPt_ID)) {
    const survicateBox = document.getElementById('survicate-box');
    if (survicateBox) survicateBox.style.display = 'block';
    setAttributesIfAvailable();
    return;
  }

  // If offline, skip loading now; rely on background sync or next visit
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    // Optionally schedule a retry via visibilitychange or online event
    const onOnline = () => {
      window.removeEventListener('online', onOnline);
      initSurvicate().catch(() => {});
    };
    window.addEventListener('online', onOnline);
    return;
  }

  // Load script with timeout and then set attributes
  try {
    await loadScriptWithTimeout('https://survey.survicate.com/workspaces/83b651f6b3eca1ab4551d95760fe5deb/web_surveys.js', 8000);
    setAttributesIfAvailable();
  } catch (_) {
    // Fail silently; Survicate is non-critical
  }
};

export { initSurvicate, setSurvicateCalledValue };
