export const LEAN_VERSIONS = [
  { label: 'Mathlib v4.28.0', value: 'mathlib-v4.28.0' },
  { label: 'Mathlib v4.24.0', value: 'mathlib-v4.24.0' },
] as const;

export const DEFAULT_VERSION = 'mathlib-v4.28.0';

export type LeanVersion = typeof LEAN_VERSIONS[number]['value'];

export function getWssUrl(version: LeanVersion): string {
  return `wss://live.lean-lang.org/websocket/${version}`;
}

export function getProjectFolder(version: LeanVersion): string {
  return version;
}

export function getVersionLabel(version: LeanVersion): string {
  return LEAN_VERSIONS.find(v => v.value === version)?.label ?? version;
}

const STORAGE_KEY = 'leetproof:lean-version';

export function loadSavedVersion(): LeanVersion {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LEAN_VERSIONS.some(v => v.value === saved)) return saved as LeanVersion;
  } catch {}
  return DEFAULT_VERSION;
}

export function saveVersion(version: LeanVersion): void {
  try { localStorage.setItem(STORAGE_KEY, version); } catch {}
}
