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
