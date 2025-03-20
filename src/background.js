let queue;
let gameTabs;

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

async function launchGame() {
  const url = "https://mr-walkman.itch.io/run-piggy-run";
  const tab = await browser.tabs.create({
    url,
  });
  await addGameTab(tab.id, url);
}

async function addGameTab(tabId, url) {
  console.log(`Game tab "${tabId}" added`);
  gameTabs.push({
    tabId,
    url,
  });
  await setStorageItem("gameTabs", gameTabs);
}

function hasGameTab(tabId) {
  return getGameTabIndex(tabId) !== -1;
}

function getGameTabIndex(tabId) {
  return gameTabs.findIndex((gameTab) => gameTab.tabId === tabId);
}

async function removeGameTab(tabId) {
  const index = getGameTabIndex(tabId);
  gameTabs.splice(index);
  await setStorageItem("gameTabs", gameTabs);
}

async function gameTabClosed(tabId) {
  console.log(`Game tab "${tabId}" closed`);
  await removeGameTab();
}

(async () => {
  queue = await getStorageItem("queue", []);
  gameTabs = await getStorageItem("gameTabs", []);

  browser.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
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
      if (message.type === "launchGame") {
        await launchGame();
      }
    }
  );

  browser.tabs.onRemoved.addListener(async (tabId) => {
    if (hasGameTab(tabId)) {
      await gameTabClosed(tabId);
    }
  });

  browser.tabs.onUpdated.addListener(
    async (tabId, changeInfo) => {
      const gameTabIndex = getGameTabIndex(tabId);
      if (
        gameTabIndex !== -1 &&
        gameTabs[gameTabIndex].url !== changeInfo.url
      ) {
        await gameTabClosed(tabId);
      }
    },
    {
      properties: ["url"],
    }
  );

  console.log("Jam player background script initialized");
})();
