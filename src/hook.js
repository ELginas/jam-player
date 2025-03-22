import { initialize } from "react-devtools-core";

let hasRoot = false;

console.log("Hook script");

const interval = setInterval(tryInitialize, 200);
function tryInitialize() {
  if (hasRoot) {
    return;
  }
  initialize();
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  const renderers = [...hook.renderers.keys()];
  if (renderers.length === 0) {
    console.log("hook: no renderer");
    return;
  }
  const rendererId = renderers[0];
  const fiberRoots = hook.getFiberRoots(rendererId);
  if (fiberRoots.size === 0) {
    console.log("hook: no fibers");
    return;
  }

  console.log("hook", window.__REACT_DEVTOOLS_GLOBAL_HOOK__, fiberRoots);
  hasRoot = true;
  clearInterval(interval);
}

tryInitialize();
