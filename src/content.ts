import { injectHook, isInQueue, toggleAddQueue } from "./api2";
import type { DevToolsHook } from "react-devtools-inline";

const reactState = {
  root: null,
  hook: null,
  async setupHook() {
    const result = await injectHook();

    console.log(`Result: ${result}`);
    // @ts-ignore
    this.hook = window.wrappedJSObject
      .__REACT_DEVTOOLS_GLOBAL_HOOK__ as DevToolsHook;
    console.log("hookaaa", this.hook);
  },
  hasHook() {
    return this.hook !== undefined && this.hook !== null;
  },
  hasRoot() {
    return this.root !== undefined && this.root !== null;
  },
  setupRoot() {
    const rendererId = [...this.hook.renderers.keys()][0];
    const fiberRoots = this.hook.getFiberRoots(rendererId);
    console.log(fiberRoots);
    this.root = [...fiberRoots].filter(
      (root) =>
        root.containerInfo?.id ===
        "view_jam_entries_186919_Jam-BrowseEntries_11301"
    )[0];
    console.log("root", this.root);
  },
  getEntries() {
    const entries = this.root.current.child.memoizedState;
    return entries;
  },
  async scan() {
    console.log("scann");
    if (!this.hasHook()) {
      await this.setupHook();
    }
    if (this.hasHook() && !this.hasRoot()) {
      this.setupRoot();
    }
  },
};

function hasButton(element: Element) {
  return element.querySelector(".jambutton") !== null;
}

function canAddButton(element: Element) {
  return element.querySelector(".fading_data.cell_tools") !== null;
}

function gameIdFromHref(href: string) {
  const arr = href.split("/");
  return arr[arr.length - 1];
}

function queueTypeIcon(isInQueue: boolean) {
  if (isInQueue) {
    return browser.runtime.getURL("assets/RemoveFromQueue.svg");
  } else {
    return browser.runtime.getURL("assets/AddToQueue.svg");
  }
}

async function addButton(element: Element) {
  const container = element.querySelector(".fading_data.cell_tools");
  const gameThumb = element.querySelector(".game_thumb") as HTMLAnchorElement;
  const gameId = gameIdFromHref(gameThumb.href);
  const newElement = document.createElement("div");

  const image = document.createElement("img");
  newElement.classList.add("jambutton");
  newElement.appendChild(image);
  container.appendChild(newElement);

  // Must appear after creating elements because otherwise you can have multiple button creations in process
  let _isInQueue = await isInQueue(gameId);

  newElement.classList.add("add_to_collection_btn");
  newElement.style.paddingLeft = "2px";
  newElement.style.paddingRight = "2px";
  const url = queueTypeIcon(_isInQueue);
  image.setAttribute("src", url);
  image.style.display = "block";
  image.style.position = "relative";
  image.style.opacity = "100%";
  image.style.width = "24px";
  image.style.height = "24px";
  newElement.onclick = async () => {
    _isInQueue = await toggleAddQueue(gameId);
    const url = queueTypeIcon(_isInQueue);
    image.setAttribute("src", url);
  };
}

async function scanAddElements() {
  const elements = document.querySelectorAll(
    ".index_game_cell_widget.game_cell"
  );

  for (const element of elements) {
    // TODO: concurrency
    if (canAddButton(element) && !hasButton(element)) {
      await addButton(element);
    }
  }
}

function setupObserver(query: string, observerCallback: MutationCallback) {
  const mainContainer = document.querySelector(query);
  if (mainContainer === null) {
    return;
  }
  const observer = new MutationObserver(observerCallback);
  const config = { childList: true, subtree: true };
  observer.observe(mainContainer, config);
}

const nextInQueueButton = {
  canAdd() {
    return document.querySelector(".visit_game") !== null;
  },
  hasAdded() {
    return document.querySelector(".jamnextqueue") !== null;
  },
  add() {
    const container = document.querySelector(".visit_game");
    const spacer = document.createElement("div");
    spacer.style.height = "12px";
    container.appendChild(spacer);
    const button = document.createElement("a");
    button.innerHTML = `
<a class="jamnextqueue button fat play_btn">Play next game in queue<svg class="svgicon icon_arrow_up_right" fill="none" role="img" viewBox="0 0 24 24" aria-hidden="" version="1.1" stroke-width="2" width="24" stroke-linecap="round" height="24" stroke-linejoin="round" stroke="currentColor"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></a>`;
    button.onclick = async () => {
      await browser.runtime.sendMessage({
        type: "nextGame",
      });
    };
    container.appendChild(button);
  },
  scan() {
    if (this.canAdd() && !this.hasAdded()) {
      this.add();
    }
  },
};

setupObserver(".primary_column", async () => {
  await scanAddElements();
  await reactState.scan();
});
setupObserver(".main_column", () => nextInQueueButton.scan);

(async () => {
  scanAddElements();
  nextInQueueButton.scan();
  await reactState.scan();
})();
