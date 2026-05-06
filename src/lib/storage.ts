/**
 * Type-safe localStorage wrapper.
 * Returns null on read failures, swallows write failures to console.
 * SSR-safe: no-ops if window is undefined.
 */

const isBrowser = (): boolean => typeof window !== "undefined";

export function readStorage<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`storage.read(${key}) failed:`, err);
    return null;
  }
}

export function writeStorage<T>(key: string, value: T): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`storage.write(${key}) failed:`, err);
    return false;
  }
}

export function removeStorage(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    console.error(`storage.remove(${key}) failed:`, err);
  }
}
