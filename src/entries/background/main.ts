import browser from 'webextension-polyfill'

browser.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
})

// 监听来自 popup 的消息，打开新 tab
browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'openNewTab') {
    browser.tabs.create({ url: browser.runtime.getURL('src/entries/newtab/index.html'), active: true })
  }
})
