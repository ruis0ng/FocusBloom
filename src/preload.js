const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send(channel, data) {
      const validChannels = ['log-transition', 'start-focus-tracking', 'stop-focus-tracking'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on(channel, func) {
      const validChannels = ['focus-status'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
      }
    },
    removeListener(channel, func) {
      const validChannels = ['focus-status'];
      if (validChannels.includes(channel)) {
        ipcRenderer.removeListener(channel, func);
      }
    }
  },
});
