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
