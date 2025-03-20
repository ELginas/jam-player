async function getStorageItem(key, _default) {
  const data = await browser.storage.local.get(key);
  if (data === undefined || data[key] === undefined) {
    return _default;
  }
  const entry = data[key];
  return JSON.parse(entry);
}

async function setStorageItem(key, value) {
  await browser.storage.local.set({
    [key]: JSON.stringify(value),
  });
}

(async () => {
  const queue = await getStorageItem("queue", []);

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(`Message received: ${message}`);
    if (message.type === "toggleAddQueue") {
      if (queue.includes(message.item)) {
        console.log(`Removed "${message.item}" from the queue`);
        queue.splice(queue.indexOf(message.item));
        sendResponse(false);
      } else {
        console.log(`Add "${message.item}" to the queue`);
        queue.push(message.item);
        sendResponse(true);
      }
      setStorageItem("queue", queue);
    }
    if (message.type === "isInQueue") {
      sendResponse(queue.includes(message.item));
    }
    if (message.type === "getQueue") {
      sendResponse(queue);
    }
  });

  console.log("Jam player background script initialized");
})();
