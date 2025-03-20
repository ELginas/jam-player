console.log("Jam player content script initialized");

function hasButton(element) {
  return element.querySelector(".jambutton") !== null;
}

function canAddButton(element) {
  return element.querySelector(".fading_data.cell_tools") !== null;
}

function gameIdFromHref(href) {
  const arr = href.split("/");
  return arr[arr.length - 1];
}

function queueTypeIcon(isInQueue) {
  if (isInQueue) {
    return browser.runtime.getURL("assets/RemoveFromQueue.svg");
  } else {
    return browser.runtime.getURL("assets/AddToQueue.svg");
  }
}

async function addButton(element) {
  const container = element.querySelector(".fading_data.cell_tools");
  const gameThumb = element.querySelector(".game_thumb");
  const gameId = gameIdFromHref(gameThumb.href);
  const newElement = document.createElement("div");

  const image = document.createElement("img");
  newElement.classList.add("jambutton");
  newElement.appendChild(image);
  container.appendChild(newElement);

  // Must appear after creating elements because otherwise you can have multiple button creations in process
  let isInQueue = await browser.runtime.sendMessage({
    type: "isInQueue",
    item: gameId,
  });

  newElement.classList.add("add_to_collection_btn");
  newElement.style.paddingLeft = "2px";
  newElement.style.paddingRight = "2px";
  const url = queueTypeIcon(isInQueue);
  image.setAttribute("src", url);
  image.style.display = "block";
  image.style.position = "relative";
  image.style.opacity = "100%";
  image.style.width = "24px";
  image.style.height = "24px";
  newElement.onclick = async () => {
    isInQueue = await browser.runtime.sendMessage({
      type: "toggleAddQueue",
      item: gameId,
    });
    const url = queueTypeIcon(isInQueue);
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

const mainContainer = document.querySelector(".primary_column");
const observer = new MutationObserver(async (mutationsList, observer) => {
  await scanAddElements();
});
const config = { childList: true, subtree: true };
observer.observe(mainContainer, config);

(async () => {
  scanAddElements();
})();
