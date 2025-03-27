import { initialize } from "react-devtools-core";
import { isFirefox } from "$lib/utils";

(() => {
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log("React hook already defined.");
    return;
  }

  let root = null;

  console.log("Hook script");

  function findRoot(fiberRoots) {
    return [...fiberRoots].filter((root) =>
      root.containerInfo?.id.startsWith("view_jam_entries_")
    )[0];
  }

  const interval = setInterval(tryInitialize, 200);
  function tryInitialize() {
    if (root != null) {
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

    root = findRoot(fiberRoots);
    if (root == null) {
      return;
    }
    console.log("root", root);

    console.log("hook", window.__REACT_DEVTOOLS_GLOBAL_HOOK__, fiberRoots);
    clearInterval(interval);
  }

  window.getJamEntry = (gameId) => {
    const entries = root.current.child.memoizedState;
    return entries.jam_games.filter(
      (jamEntry) => jamEntry.game.id === gameId
    )[0];
  };

  if (!isFirefox()) {
    window.addEventListener("message", (e) => {
      const message = e.data;
      if (message.type === "requestJamEntry") {
        const result = window.getJamEntry(message.gameId);
        window.postMessage({
          type: "responseJamEntry",
          result,
        });
      }
    });
  }

  tryInitialize();
})();
