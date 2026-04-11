import pkg from "../package.json";

const manifest = {
  action: {
    default_popup: "src/entries/popup/index.html",
  },
  background: {
    service_worker: "src/entries/background/main.ts",
  },
  chrome_url_overrides: {
    newtab: "src/entries/newtab/index.html",
  },
  commands: {
    _execute_action: {
      suggested_key: {
        default: "Alt+Shift+H",
        mac: "Alt+Shift+H",
      },
      description: "打开首页",
    },
  },
  host_permissions: ["*://*/*"],
  icons: {
    16: "icons/16.png",
    19: "icons/19.png",
    32: "icons/32.png",
    38: "icons/38.png",
    48: "icons/48.png",
    64: "icons/64.png",
    96: "icons/96.png",
    128: "icons/128.png",
    256: "icons/256.png",
    512: "icons/512.png",
  },

};

export function getManifest(): chrome.runtime.ManifestV3 {
  return {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName ?? pkg.name,
    version: pkg.version,
    manifest_version: 3,
    ...manifest,
  };
}
