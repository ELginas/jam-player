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

async function canLaunchGame() {
  return queue.front() !== undefined;
}

async function launchGame() {
  if (!canLaunchGame()) {
    return;
  }
  const jamEntry = queue.front();
  const url = jamEntry.data.game.url;
  const tab = await browser.tabs.create({
    url,
  });
  await gameTabs.add(tab.id, jamEntry.gameId, url);
}

const gameTabs = {
  data: [],
  async add(tabId: number, gameId: number, url: string) {
    console.log(`Game tab "${tabId}" for "${gameId}" added`);
    this.data.push({
      tabId,
      gameId,
      url,
    });
    await this._sync();
  },
  async remove(tabId: number) {
    this.data.splice(this.index(tabId));
    this._sync();
  },
  index(tabId: number) {
    return this.data.findIndex(
      (gameTab: { tabId: any }) => gameTab.tabId === tabId
    );
  },
  has(tabId: number) {
    return this.index(tabId) !== -1;
  },
  get(tabId: number) {
    const index = this.index(tabId);
    if (index === -1) {
      return;
    }
    return this.data[index];
  },
  async _sync() {
    if (this.data.length !== 0) {
      await setStorageItem("gameTabs", this.data);
    } else {
      await removeStorageItem("gameTabs");
    }
  },
  async load_from_save() {
    this.data = await getStorageItem("gameTabs", []);
  },
};

async function gameTabClosed(tabId: number) {
  console.log(`Game tab "${tabId}" closed`);
  const gameTab = gameTabs.get(tabId);
  const gameId = gameTab.gameId;
  const jamEntry = queue.get(gameId);
  const url = `https://itch.io${jamEntry.data.url}`;
  console.log("gameTab", gameTab);
  await browser.tabs.create({
    url,
  });
  await gameTabs.remove(tabId);
  await queue.remove(gameId);
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
  front() {
    return this.data[0];
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
  await gameTabs.load_from_save();

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
    if (message.type === "canLaunchGame") {
      return canLaunchGame();
    }
  });

  browser.tabs.onRemoved.addListener(async (tabId) => {
    if (gameTabs.has(tabId)) {
      await gameTabClosed(tabId);
    }
  });

  browser.tabs.onUpdated.addListener(
    async (tabId, changeInfo) => {
      const gameTab = gameTabs.get(tabId);
      if (gameTab !== undefined && gameTab.url !== changeInfo.url) {
        await gameTabClosed(tabId);
      }
    },
    {
      properties: ["url"],
    }
  );

  console.log("Jam player background script initialized");
})();
