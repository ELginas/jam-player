console.log("This is loaded! index_game_cell_widget game_cell");
console.log(document.readyState);

function hasButton(element) {
  return element.querySelector(".jambutton") !== null;
}

function canAddButton(element) {
  return element.querySelector(".fading_data.cell_tools") !== null;
}

function addButton(element) {
  const container = element.querySelector(".fading_data.cell_tools");
  const newElement = document.createElement("div");
  newElement.onclick = () => {
    console.log("Helloo");
  };
  newElement.classList.add("add_to_collection_btn");
  newElement.classList.add("jambutton");
  newElement.style.paddingLeft = "2px";
  newElement.style.paddingRight = "2px";
  const image = document.createElement("img");
  const url = browser.runtime.getURL("assets/AddToQueue.svg");
  image.setAttribute("src", url);
  image.style.display = "block";
  image.style.position = "relative";
  image.style.opacity = "100%";
  image.style.width = "24px";
  image.style.height = "24px";
  newElement.appendChild(image);
  container.appendChild(newElement);
}

function scanAddElements() {
  const elements = document.querySelectorAll(
    ".index_game_cell_widget.game_cell"
  );

  for (const element of elements) {
    if (canAddButton(element) && !hasButton(element)) {
      addButton(element);
    }
  }
}

const mainContainer = document.querySelector(".primary_column");
const observer = new MutationObserver((mutationsList, observer) => {
  scanAddElements();
});
const config = { childList: true, subtree: true };
observer.observe(mainContainer, config);

scanAddElements();
