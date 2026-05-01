// Browser stub for Node.js perf_hooks module.
// lean4monaco/vscode references perf_hooks which doesn't exist in browser.
export const performance = globalThis.performance || {
  now: () => Date.now(),
  timeOrigin: Date.now(),
};
export default { performance };
