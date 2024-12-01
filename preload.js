const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send(channel, data) {
      const validChannels = [
        'log-transition',
        'start-focus-tracking',
        'stop-focus-tracking',
        'export-log'
      ];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on(channel, func) {
      const validChannels = [
        'focus-status',
        'export-log-success',
        'export-log-failure',
        'export-log-cancel'
      ];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
      }
    },
    once(channel, func) {
      const validChannels = [
        'export-log-success',
        'export-log-failure',
        'export-log-cancel'
      ];
      if (validChannels.includes(channel)) {
        ipcRenderer.once(channel, (event, ...args) => func(event, ...args));
      }
    },
    removeListener(channel, func) {
      const validChannels = ['focus-status'];
      if (validChannels.includes(channel)) {
        ipcRenderer.removeListener(channel, func);
      }
    },
    removeAllListeners(channel) {
      const validChannels = ['focus-status'];
      if (validChannels.includes(channel)) {
        ipcRenderer.removeAllListeners(channel);
      }
    },
  },
});
