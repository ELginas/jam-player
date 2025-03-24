export function isFirefox() {
  // return window.browser !== undefined && window.chrome === undefined;
  return navigator.userAgent.indexOf("Firefox") !== -1;
}

export function isChrome() {
  // return window.browser === undefined && window.chrome !== undefined;
  return navigator.userAgent.indexOf("Chrome") !== -1;
}
