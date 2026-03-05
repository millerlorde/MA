const path = require('path');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const Store = require('electron-store');

// 创建应用配置存储
const store = new Store();
let mainWindow;

// SDK 实例引用
let NEMeetingKit = null;

/**
 * 创建应用窗口
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // 开发环境下打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * 应用启动
 */
app.on('ready', createWindow);

/**
 * 在所有窗口关闭时退出应用（除了 macOS）
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * macOS 重新激活应用时创建窗口
 */
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * ==================== IPC 处理器 ====================
 */

/**
 * 初始化 NEMeetingKit SDK
 * 官方指南: https://doc.yunxin.163.com/meeting/guide/TkyMjA0MDg?platform=electron
 * 
 * 官方示例:
 * import NEMeetingKit from 'nemeeting-electron-sdk';
 * const neMeetingKit = NEMeetingKit.getInstance();
 * neMeetingKit.initialize(config).then((res) => {
 *   // 初始化成功
 * }).catch((error) => {
 *   // 初始化失败
 * });
 */
ipcMain.handle('sdk-init', async (event, appKey) => {
  try {
    if (!appKey || appKey.trim() === '') {
      throw new Error('App Key 不能为空');
    }

    // 动态导入 SDK
    const sdk = await import('nemeeting-electron-sdk');
    const NEMeetingKit = sdk.default;

    // 获取 SDK 单例实例（官方推荐方式）
    const neMeetingKit = NEMeetingKit.getInstance();

    // 初始化 SDK
    const result = await neMeetingKit.initialize({
      appKey: appKey.trim(),
      enableLog: true,
      logLevel: 1
    });

    // 检查初始化结果
    if (result && result.code === 0) {
      // 保存配置
      store.set('appKey', appKey.trim());
      return {
        success: true,
        message: 'SDK 初始化成功'
      };
    } else {
      throw new Error(result?.msg || 'SDK 初始化失败');
    }
  } catch (error) {
    console.error('SDK 初始化失败:', error);
    return {
      success: false,
      error: error.message || '初始化失败，请检查 App Key'
    };
  }
});

/**
 * 用户登录
 * 官方指南: https://doc.yunxin.163.com/meeting/guide/DUxNjQzNDA?platform=electron
 * 
 * 官方示例使用 loginByToken:
 * accountService.loginByToken({
 *   accountToken: token,
 *   accountId: userId
 * })
 */
ipcMain.handle('sdk-login', async (event, userUuid, token) => {
  try {
    if (!NEMeetingKit) {
      throw new Error('SDK 尚未初始化，请先初始化 SDK');
    }

    if (!userUuid || !token) {
      throw new Error('User UUID 和 Token 不能为空');
    }

    // 获取 SDK 单例实例
    const neMeetingKit = NEMeetingKit.getInstance();
    
    // 获取账户服务
    const accountService = neMeetingKit.getAccountService();
    if (!accountService) {
      throw new Error('获取账户服务失败，SDK 可能未正确初始化');
    }

    // 使用官方推荐的 loginByToken 方式登录
    const loginResult = await accountService.loginByToken({
      accountToken: token.trim(),
      accountId: userUuid.trim()
    });

    // 检查登录结果
    if (loginResult && loginResult.code === 0) {
      // 保存用户信息
      store.set('userInfo', {
        userUuid: userUuid.trim(),
        loginTime: new Date().toISOString()
      });

      return {
        success: true,
        message: '登录成功',
        userUuid: userUuid.trim()
      };
    } else {
      throw new Error(loginResult?.msg || '登录失败');
    }
  } catch (error) {
    console.error('登录失败:', error);
    return {
      success: false,
      error: error.message || '登录失败，请检查凭证'
    };
  }
});

/**
 * 用户登出
 * 官方指南: https://doc.yunxin.163.com/meeting/guide/DUxNjQzNDA?platform=electron
 */
ipcMain.handle('sdk-logout', async (event) => {
  try {
    if (!NEMeetingKit) {
      throw new Error('SDK 尚未初始化');
    }

    // 获取 SDK 单例实例
    const neMeetingKit = NEMeetingKit.getInstance();
    const accountService = neMeetingKit.getAccountService();
    if (!accountService) {
      throw new Error('获取账户服务失败');
    }

    // 使用官方 API: accountService.logout()
    const logoutResult = await accountService.logout();

    // 检查登出结果
    if (logoutResult && logoutResult.code === 0) {
      // 清除用户信息
      store.delete('userInfo');

      return {
        success: true,
        message: '已登出'
      };
    } else {
      throw new Error(logoutResult?.msg || '登出失败');
    }
  } catch (error) {
    console.error('登出失败:', error);
    return {
      success: false,
      error: error.message || '登出失败'
    };
  }
});

/**
 * 显示错误对话框
 */
ipcMain.handle('show-error-dialog', async (event, title, message) => {
  return dialog.showMessageBox(mainWindow, {
    type: 'error',
    title: title || '错误',
    message: message || '发生了一个错误'
  });
});

/**
 * 显示信息对话框
 */
ipcMain.handle('show-info-dialog', async (event, title, message) => {
  return dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: title || '提示',
    message: message || '操作完成'
  });
});

/**
 * 获取应用配置
 */
ipcMain.handle('get-config', async (event) => {
  return {
    appKey: store.get('appKey'),
    userInfo: store.get('userInfo')
  };
});

/**
 * 清除所有配置
 */
ipcMain.handle('clear-config', async (event) => {
  store.clear();
  return { success: true };
});

