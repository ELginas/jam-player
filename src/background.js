const queue = [];

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
  }
  if (message.type === "isInQueue") {
    sendResponse(queue.includes(message.item));
  }
});

console.log("Jam player background script initialized");
