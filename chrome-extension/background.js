'use strict'

console.log('background started')
chrome.windows.create(
  {
    url: 'http://localhost:4000',
    type: 'panel',
  },
  window => {
    // window.alwaysOnTop = true
    console.log('opened', window)
    chrome.windows.update(window.id, { drawAttention: true })
  }
)
