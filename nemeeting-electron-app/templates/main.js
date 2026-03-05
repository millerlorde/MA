import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import Store from 'electron-store';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { default: NEMeetingKit } = require('nemeeting-electron-sdk');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const store = new Store();
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// SDK 初始化
// 官方 TypeDoc: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html#initialize
ipcMain.handle('sdkInit', async (event, appKey) => {
  try {
    // 获取 SDK 单例实例（官方推荐方式）
    const neMeetingKit = NEMeetingKit.getInstance();

    // 初始化 SDK
    const result = await neMeetingKit.initialize({
      appKey: appKey,
      enableLog: true,
      logLevel: 1
    });

    if (result && result.code === 0) {
      store.set('appKey', appKey);
      return { success: true, message: 'SDK 初始化成功' };
    } else {
      return { success: false, message: result?.msg || 'SDK 初始化失败' };
    }
  } catch (error) {
    console.error('SDK 初始化失败:', error);
    return { success: false, message: error.message || 'SDK 初始化失败' };
  }
});

// SDK 登录
// 官方 TypeDoc: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html#loginByToken
// 注意：loginByToken 接收两个单独的参数：userUuid 和 token
ipcMain.handle('sdkLogin', async (event, uuid, token) => {
  try {
    const neMeetingKit = NEMeetingKit.getInstance();
    const accountService = neMeetingKit.getAccountService();
    if (!accountService) {
      return { success: false, message: '获取账户服务失败，请先初始化 SDK' };
    }

    // 使用 loginByToken 方式登录（两个单独参数）
    const result = await accountService.loginByToken(uuid, token);

    if (result && result.code === 0) {
      store.set('userInfo', {
        userUuid: uuid,
        loginTime: new Date().toISOString()
      });
      return { success: true, message: '登录成功' };
    } else {
      return { success: false, message: result?.msg || '登录失败' };
    }
  } catch (error) {
    console.error('SDK 登录失败:', error);
    return { success: false, message: error.message || '登录失败' };
  }
});

// SDK 登出
// 官方 TypeDoc: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html#logout
ipcMain.handle('sdkLogout', async () => {
  try {
    const neMeetingKit = NEMeetingKit.getInstance();
    const accountService = neMeetingKit.getAccountService();
    if (!accountService) {
      return { success: false, message: 'SDK 尚未初始化' };
    }

    // 调用登出 API
    const result = await accountService.logout();

    if (result && result.code === 0) {
      return { success: true, message: '登出成功' };
    } else {
      return { success: false, message: result?.msg || '登出失败' };
    }
  } catch (error) {
    console.error('SDK 登出失败:', error);
    return { success: false, message: error.message || '登出失败' };
  }
});

// 显示错误对话框
ipcMain.handle('showErrorDialog', async (event, message) => {
  dialog.showErrorBox('错误', message);
});

// 显示信息对话框
ipcMain.handle('showInfoDialog', async (event, message) => {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: '信息',
    message: message
  });
});
