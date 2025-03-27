import browser from "webextension-polyfill";

export async function getLocalStorageItem(key: string, _default: any) {
  const data = await browser.storage.local.get(key);
  if (data === undefined || data[key] === undefined) {
    return _default;
  }
  const entry = data[key];
  return JSON.parse(entry);
}

export async function removeLocalStorageItem(key: string) {
  await browser.storage.local.remove(key);
}

export async function setLocalStorageItem(key: string, value: any) {
  await browser.storage.local.set({
    [key]: JSON.stringify(value),
  });
}

export async function getSessionStorageItem(key: string, _default: any) {
  const data = await browser.storage.session.get(key);
  if (data === undefined || data[key] === undefined) {
    return _default;
  }
  const entry = data[key];
  return JSON.parse(entry);
}

export async function removeSessionStorageItem(key: string) {
  await browser.storage.session.remove(key);
}

export async function setSessionStorageItem(key: string, value: any) {
  await browser.storage.session.set({
    [key]: JSON.stringify(value),
  });
}
