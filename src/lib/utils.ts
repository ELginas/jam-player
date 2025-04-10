import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isFirefox() {
  // return window.browser !== undefined && window.chrome === undefined;
  return navigator.userAgent.indexOf("Firefox") !== -1;
}

export function isChrome() {
  // return window.browser === undefined && window.chrome !== undefined;
  return navigator.userAgent.indexOf("Chrome") !== -1;
}
