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
 * 官方文档: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html#initialize
 */
ipcMain.handle('sdk-init', async (event, appKey) => {
  try {
    if (!appKey || appKey.trim() === '') {
      throw new Error('App Key 不能为空');
    }

    // 动态导入 SDK - 使用官方导出方式
    const sdk = await import('nemeeting-electron-sdk');
    NEMeetingKit = sdk.NEMeetingKit;

    // 使用官方 API: initialize(config)
    // 配置参数类型: NEMeetingKitConfig
    const result = await NEMeetingKit.initialize({
      appKey: appKey.trim(),
      enableLog: true,
      logLevel: 1
    });

    // 检查初始化结果 (返回类型: NEResult<undefined | NEMeetingCorpInfo>)
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
 * 官方文档: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html#login
 */
ipcMain.handle('sdk-login', async (event, userUuid, token) => {
  try {
    if (!NEMeetingKit || !NEMeetingKit.isInitialized) {
      throw new Error('SDK 尚未初始化，请先初始化 SDK');
    }

    if (!userUuid || !token) {
      throw new Error('User UUID 和 Token 不能为空');
    }

    // 获取账户服务
    // 官方文档: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html#getAccountService
    const accountService = NEMeetingKit.getAccountService();
    if (!accountService) {
      throw new Error('获取账户服务失败，SDK 可能未正确初始化');
    }

    // 使用官方 API: accountService.login(params)
    const loginResult = await accountService.login({
      uid: userUuid.trim(),
      token: token.trim()
    });

    // 检查登录结果 (返回类型: NEResult<void>)
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
 * 官方文档: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html#logout
 */
ipcMain.handle('sdk-logout', async (event) => {
  try {
    if (!NEMeetingKit || !NEMeetingKit.isInitialized) {
      throw new Error('SDK 尚未初始化');
    }

    // 获取账户服务
    const accountService = NEMeetingKit.getAccountService();
    if (!accountService) {
      throw new Error('获取账户服务失败');
    }

    // 使用官方 API: accountService.logout()
    const logoutResult = await accountService.logout();

    // 检查登出结果 (返回类型: NEResult<void>)
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

