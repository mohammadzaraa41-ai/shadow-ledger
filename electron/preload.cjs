const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('steamAPI', {
  unlockAchievement: (id) => ipcRenderer.invoke('steam:unlockAchievement', id),
  getStats: () => ipcRenderer.invoke('steam:getStats'),
  isDesktop: true,
});
