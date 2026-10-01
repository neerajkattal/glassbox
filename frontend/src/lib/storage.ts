/** localStorage that never throws (private windows, blocked storage). */

const PREFIX = "glassbox:";

export function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: string): void {
  try {
    window.localStorage.setItem(PREFIX + key, value);
  } catch {
    // Storage is a convenience only; ignore failures.
  }
}
