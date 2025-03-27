import { isFirefox } from "./utils";
import browser from "webextension-polyfill";

async function findContainer(id, name) {
  const containers = await browser.contextualIdentities.query({});
  let container = containers.filter(
    (container, i) => container.name === name && i === id
  )[0];
  return container;
}

async function openPlainTab(url) {
  return await browser.tabs.create({
    url,
  });
}

export async function openContainerTab(url, settings, notification) {
  if (isFirefox()) {
    const containerSettings = settings.get("ratingContainer");
    if (containerSettings === undefined) {
      await openPlainTab(url);
      return true;
    }

    const { id, name } = containerSettings;
    let container = await findContainer(id, name);
    if (container === undefined) {
      let result = await notification.open({
        type: "missingContainer",
        data: containerSettings,
      });

      if (result === "cancel") {
        return false;
      }
      if (result === "change") {
        const containerSettings = settings.get("ratingContainer") ?? {};
        const { id, name } = containerSettings;
        container = await findContainer(id, name);
      }
    }

    if (container !== undefined) {
      await browser.tabs.create({
        cookieStoreId: container.cookieStoreId,
        url,
      });
      return true;
    } else {
      await openPlainTab(url);
      return true;
    }
  } else {
    await openPlainTab(url);
    return true;
  }
}
