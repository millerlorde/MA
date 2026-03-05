const { contextBridge, ipcRenderer } = require('electron');

/**
 * 暴露安全的 API 到渲染进程
 * 通过 contextBridge 确保安全隔离
 */
const electronAPI = {
  /**
   * ==================== SDK 管理 API ====================
   */

  /**
   * 初始化 NEMeetingKit SDK
   * @param {string} appKey - 应用的 App Key
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  sdkInit: (appKey) => ipcRenderer.invoke('sdk-init', appKey),

  /**
   * 用户登录
   * @param {string} userUuid - 用户唯一标识
   * @param {string} token - 用户访问令牌
   * @returns {Promise<{success: boolean, message?: string, error?: string, userUuid?: string}>}
   */
  sdkLogin: (userUuid, token) => ipcRenderer.invoke('sdk-login', userUuid, token),

  /**
   * 用户登出
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  sdkLogout: () => ipcRenderer.invoke('sdk-logout'),

  /**
   * ==================== 对话框 API ====================
   */

  /**
   * 显示错误对话框
   * @param {string} title - 对话框标题
   * @param {string} message - 错误消息
   */
  showErrorDialog: (title, message) => ipcRenderer.invoke('show-error-dialog', title, message),

  /**
   * 显示信息对话框
   * @param {string} title - 对话框标题
   * @param {string} message - 提示信息
   */
  showInfoDialog: (title, message) => ipcRenderer.invoke('show-info-dialog', title, message),

  /**
   * ==================== 配置 API ====================
   */

  /**
   * 获取应用配置
   * @returns {Promise<{appKey?: string, userInfo?: object}>}
   */
  getConfig: () => ipcRenderer.invoke('get-config'),

  /**
   * 清除所有配置
   * @returns {Promise<{success: boolean}>}
   */
  clearConfig: () => ipcRenderer.invoke('clear-config')
};

// 将 API 暴露到全局 window 对象
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

console.log('[预加载脚本] electronAPI 已暴露');
