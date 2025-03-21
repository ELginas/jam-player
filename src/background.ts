let queue: string[];
let gameTabs: { tabId: number; url: string }[];

async function getStorageItem(key: string, _default: any) {
  const data = await browser.storage.local.get(key);
  if (data === undefined || data[key] === undefined) {
    return _default;
  }
  const entry = data[key];
  return JSON.parse(entry);
}

async function setStorageItem(key: string, value: any) {
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

async function addGameTab(tabId: number, url: string) {
  console.log(`Game tab "${tabId}" added`);
  gameTabs.push({
    tabId,
    url,
  });
  await setStorageItem("gameTabs", gameTabs);
}

function hasGameTab(tabId: number) {
  return getGameTabIndex(tabId) !== -1;
}

function getGameTabIndex(tabId: number) {
  return gameTabs.findIndex(
    (gameTab: { tabId: any }) => gameTab.tabId === tabId
  );
}

async function removeGameTab(tabId: number) {
  const index = getGameTabIndex(tabId);
  gameTabs.splice(index);
  await setStorageItem("gameTabs", gameTabs);
}

async function gameTabClosed(tabId: number) {
  console.log(`Game tab "${tabId}" closed`);
  const url = "https://itch.io/jam/godot-wild-jam-70/rate/2781818";
  await browser.tabs.create({
    url,
  });
  await removeGameTab(tabId);
}

async function injectHook(tabId: number) {
  return await browser.scripting.executeScript({
    files: ["hook.js"],
    target: {
      tabId,
    },
    // @ts-ignore
    world: "MAIN",
  });
}

(async () => {
  queue = await getStorageItem("queue", []);
  gameTabs = await getStorageItem("gameTabs", []);

  browser.runtime.onMessage.addListener(async (message, sender) => {
    console.log(`Message received: ${message}`);
    if (message.type === "toggleAddQueue") {
      let response: boolean;
      if (queue.includes(message.item)) {
        console.log(`Removed "${message.item}" from the queue`);
        queue.splice(queue.indexOf(message.item));
        response = false;
      } else {
        console.log(`Add "${message.item}" to the queue`);
        queue.push(message.item);
        response = true;
      }
      setStorageItem("queue", queue);
      return response;
    }
    if (message.type === "isInQueue") {
      return queue.includes(message.item);
    }
    if (message.type === "getQueue") {
      return queue;
    }
    if (message.type === "launchGame") {
      await launchGame();
    }
    if (message.type === "nextGame") {
      console.log("next game");
    }
    if (message.type === "injectHook") {
      return await injectHook(sender.tab.id);
    }
  });

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
