import { canLaunchGame, isInQueue, nextGame, toggleAddQueue } from "./api";
import browser from "webextension-polyfill";

function getJamEntry(gameId) {
  return window.wrappedJSObject.getJamEntry(gameId);
}

function hasButton(element: Element) {
  return element.querySelector(".jambutton") !== null;
}

function canAddButton(element: Element) {
  return element.querySelector(".fading_data.cell_tools") !== null;
}

function gameIdFromHref(href: string) {
  const arr = href.split("/");
  return Number(arr[arr.length - 1]);
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
    const entry = getJamEntry(gameId);
    console.log("entry", entry);
    _isInQueue = await toggleAddQueue(gameId, entry);
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
    return document.querySelector(".jamspacer") !== null;
  },
  async add() {
    const container = document.querySelector(".visit_game");
    const spacer = document.createElement("div");
    spacer.classList.add("jamspacer");
    spacer.style.height = "12px";
    container.appendChild(spacer);

    const hasNextGame = await canLaunchGame();
    const button = document.createElement("a");
    button.innerHTML = `
<a class="jamnextqueue button fat play_btn">Play next game in queue<svg class="svgicon icon_arrow_up_right" fill="none" role="img" viewBox="0 0 24 24" aria-hidden="" version="1.1" stroke-width="2" width="24" stroke-linecap="round" height="24" stroke-linejoin="round" stroke="currentColor"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></a>`;
    if (hasNextGame) {
      button.onclick = async () => {
        await nextGame();
      };
    } else {
      button.style =
        "--itchio_button_color:#C94935;--itchio_button_shadow_color:#C94935;--itchio_button_fg_color:#E9B6AE";
    }
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
});
setupObserver(".main_column", () => nextInQueueButton.scan);

(async () => {
  scanAddElements();
  nextInQueueButton.scan();
})();
