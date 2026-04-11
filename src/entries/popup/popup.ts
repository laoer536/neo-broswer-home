import browser from "webextension-polyfill";

// 通知 background 打开新 tab，然后关闭 popup
browser.runtime.sendMessage({ type: "openNewTab" });
window.close();
