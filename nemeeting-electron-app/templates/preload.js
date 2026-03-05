const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 对话框
  showErrorDialog: (message) => ipcRenderer.invoke('showErrorDialog', message),
  showInfoDialog: (message) => ipcRenderer.invoke('showInfoDialog', message),

  // SDK 方法
  sdkInit: (appKey) => ipcRenderer.invoke('sdkInit', appKey),
  sdkLogin: (uuid, token) => ipcRenderer.invoke('sdkLogin', uuid, token),
  sdkLogout: () => ipcRenderer.invoke('sdkLogout')
});
