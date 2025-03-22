let gameTabs: { tabId: number; url: string }[];

async function getStorageItem(key: string, _default: any) {
  const data = await browser.storage.local.get(key);
  if (data === undefined || data[key] === undefined) {
    return _default;
  }
  const entry = data[key];
  return JSON.parse(entry);
}

async function removeStorageItem(key: string) {
  await browser.storage.local.remove(key);
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

const queue = {
  data: [],
  async add(gameId: number, data: object) {
    this.data.push({
      gameId,
      data,
    });
    await this._sync();
  },
  async remove(gameId: number) {
    this.data.splice(this.index(gameId));
    await this._sync();
  },
  async toggle(gameId: number, data: object) {
    if (!this.has(gameId)) {
      await this.add(gameId, data);
      return true;
    } else {
      await this.remove(gameId);
      return false;
    }
  },
  index(gameId: number) {
    return this.data.findIndex((jamEntry) => jamEntry.data.game.id === gameId);
  },
  has(gameId: number) {
    return this.index(gameId) !== -1;
  },
  get(gameId: number) {
    return this.data[this.index(gameId)];
  },
  async _sync() {
    if (this.data.length !== 0) {
      await setStorageItem("queue", this.data);
    } else {
      await removeStorageItem("queue");
    }
  },
  async load_from_save() {
    this.data = await getStorageItem("queue", []);
  },
};

(async () => {
  await queue.load_from_save();
  gameTabs = await getStorageItem("gameTabs", []);

  browser.runtime.onMessage.addListener(async (message, sender) => {
    console.log(`Message received: ${message}`);
    if (message.type === "toggleAddQueue") {
      return await queue.toggle(message.gameId, message.data);
    }
    if (message.type === "isInQueue") {
      return queue.has(message.gameId);
    }
    if (message.type === "getQueue") {
      return queue.data;
    }
    if (message.type === "launchGame") {
      await launchGame();
    }
    if (message.type === "nextGame") {
      console.log("next game");
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
