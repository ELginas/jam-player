import browser from "webextension-polyfill";

export async function launchGame() {
  return await browser.runtime.sendMessage({
    type: "launchGame",
  });
}

export async function canLaunchGame() {
  return await browser.runtime.sendMessage({
    type: "canLaunchGame",
  });
}

export async function nextGame() {
  return await browser.runtime.sendMessage({
    type: "nextGame",
  });
}

export async function getQueue() {
  return await browser.runtime.sendMessage({
    type: "getQueue",
  });
}

export async function isInQueue(gameId: number) {
  return await browser.runtime.sendMessage({
    type: "isInQueue",
    gameId,
  });
}

export async function toggleAddQueue(gameId: number, data: object) {
  return await browser.runtime.sendMessage({
    type: "toggleAddQueue",
    gameId,
    data,
  });
}

function waitForWindowEvent(eventCallback) {
  return new Promise((resolve) => {
    const listener = function (event) {
      const result = eventCallback(event);
      if (result === undefined) {
        return;
      }

      window.removeEventListener("message", listener);
      resolve(result);
    };

    window.addEventListener("message", listener);
  });
}

export async function requestJamEntry(gameId: number) {
  window.postMessage({
    type: "requestJamEntry",
    gameId,
  });
  const result = await waitForWindowEvent((e) => {
    const message = e.data;
    if (message.type === "responseJamEntry") {
      return message.result;
    }
  });
  return result;
}

export async function addGameSelectorTab() {
  return await browser.runtime.sendMessage({
    type: "addGameSelectorTab",
  });
}

export async function clearQueue() {
  return await browser.runtime.sendMessage({
    type: "clearQueue",
  });
}
