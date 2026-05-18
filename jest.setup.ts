/**
 * jest.setup.ts
 *
 * Global test setup helpers and environment shims for Jest + Testing Library.
 * - Provides a robust, typed localStorage mock that resets between tests.
 * - Adds a safe matchMedia mock compatible with common test scenarios.
 * - Exports helpers so tests can opt-in to the localStorage mock lifecycle.
 */

import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom/jest-globals';

type LocalStore = Record<string, string>;

/**
 * A lightweight, fully typed localStorage mock.
 * - Implements the Storage interface surface used in most apps.
 * - Keeps an internal store object and updates `length` dynamically.
 */
class LocalStorageMock implements Storage {
    private store: LocalStore = {};

    get length(): number {
        return Object.keys(this.store).length;
    }

    clear(): void {
        this.store = {};
    }

    getItem(key: string): string | null {
        return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
    }

    key(index: number): string | null {
        const keys = Object.keys(this.store);
        return keys[index] ?? null;
    }

    removeItem(key: string): void {
        delete this.store[key];
    }

    setItem(key: string, value: string): void {
        this.store[key] = String(value);
    }

    // Helper for tests to inspect the internal store (not part of Storage)
    __getStore(): LocalStore {
        return { ...this.store };
    }
}

let originalLocalStorage: Storage | undefined;
const localStorageMock = new LocalStorageMock();

/**
 * Replace global.localStorage with the mock before each test.
 * Call this in tests that rely on localStorage, or rely on the automatic
 * beforeEach hook below which enables it for all tests.
 */
export const mockLocalStorageBeforeEachTest = (): void => {
    originalLocalStorage = (global as any).localStorage;
    Object.defineProperty(global, 'localStorage', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: localStorageMock,
    });
};

/**
 * Restore the original localStorage after each test.
 */
export const restoreLocalStorageAfterEachTest = (): void => {
    Object.defineProperty(global, 'localStorage', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: originalLocalStorage ?? undefined,
    });
};

/**
 * By default we do NOT replace localStorage globally for every test file,
 * because not all tests need it and some libraries rely on the real implementation.
 * If you want the mock globally, uncomment the automatic hooks below.
 *
 * Example usage in a test file:
 *   import { mockLocalStorageBeforeEachTest, restoreLocalStorageAfterEachTest } from '../jest.setup';
 *   beforeEach(mockLocalStorageBeforeEachTest);
 *   afterEach(restoreLocalStorageAfterEachTest);
 */

/* Uncomment to enable mock for all tests by default */
// beforeEach(() => mockLocalStorageBeforeEachTest());
// afterEach(() => restoreLocalStorageAfterEachTest());

/**
 * matchMedia mock compatible with window.matchMedia usage in components.
 * - Returns an object with addEventListener/removeEventListener where supported.
 * - Keeps API surface similar to browsers so libraries like MUI behave correctly.
 */
function createMatchMediaMock(matches = false) {
    return (query: string) => {
        const listeners: Array<(ev: MediaQueryListEvent) => void> = [];
        const mql: Partial<MediaQueryList> = {
            matches,
            media: query,
            onchange: null,
            addListener: (fn: EventListenerOrEventListenerObject) => {
                // legacy API: convert to function and store
                if (typeof fn === 'function') {
                    listeners.push((ev: MediaQueryListEvent) => fn.call(null, ev));
                }
            },
            removeListener: () => {
                // no-op for legacy API
            },
            addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
                if (type === 'change' && typeof listener === 'function') {
                    listeners.push(listener as (ev: MediaQueryListEvent) => void);
                }
            },
            removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
                if (type === 'change' && typeof listener === 'function') {
                    const idx = listeners.indexOf(listener as (ev: MediaQueryListEvent) => void);
                    if (idx !== -1) listeners.splice(idx, 1);
                }
            },
            dispatchEvent: (ev: Event) => {
                // minimal dispatch to satisfy some libs; return true if handled
                try {
                    listeners.forEach(fn => fn(ev as MediaQueryListEvent));
                } catch {
                    // swallow errors to avoid failing tests due to listener issues
                }
                return true;
            },
        };
        return mql as MediaQueryList;
    };
}

// Provide a default matchMedia mock on the window object if not present
if (typeof window !== 'undefined' && !window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: createMatchMediaMock(false),
    });
}

// Export the mock instance for tests that need to inspect or manipulate it
export const __localStorageMockInstance = localStorageMock;
