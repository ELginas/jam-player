export async function launchGame() {
  return await browser.runtime.sendMessage({
    type: "launchGame",
  });
}

export async function getQueue() {
  return await browser.runtime.sendMessage({
    type: "getQueue",
  });
}

export async function injectHook() {
  return await browser.runtime.sendMessage({
    type: "injectHook",
  });
}

export async function isInQueue(gameId: string) {
  return await browser.runtime.sendMessage({
    type: "isInQueue",
    item: gameId,
  });
}

export async function toggleAddQueue(gameId: string) {
  return await browser.runtime.sendMessage({
    type: "toggleAddQueue",
    item: gameId,
  });
}
