/**
 * ==================== 应用状态管理 ====================
 */

const appState = {
  initialized: false,  // SDK 是否初始化
  loggedIn: false,     // 用户是否登录
  userInfo: null,      // 用户信息
  loading: false       // 是否正在加载
};

/**
 * ==================== DOM 元素引用 ====================
 */

const elements = {
  // 面板
  configPanel: document.getElementById('config-panel'),
  loginPanel: document.getElementById('login-panel'),
  mainPanel: document.getElementById('main-panel'),

  // 输入框
  appKeyInput: document.getElementById('appKey'),
  userUuidInput: document.getElementById('userUuid'),
  tokenInput: document.getElementById('token'),

  // 按钮
  saveConfigBtn: document.getElementById('save-config'),
  loginBtn: document.getElementById('login'),
  logoutBtn: document.getElementById('logout'),
  backToConfigBtn: document.getElementById('back-to-config'),

  // 显示元素
  userInfo: document.getElementById('user-info'),
  statusText: document.getElementById('status-text'),
  loadingIndicator: document.getElementById('loading')
};

/**
 * ==================== 初始化 ====================
 */

/**
 * 应用初始化
 */
async function initApp() {
  console.log('应用初始化中...');
  elements.appKeyInput.value = '';
  updateUI();

  // 加载保存的配置
  try {
    const config = await window.electronAPI.getConfig();
    if (config.appKey) {
      elements.appKeyInput.value = config.appKey;
      appState.initialized = true;
      showLoginPanel();
    }
  } catch (error) {
    console.warn('加载配置失败:', error);
  }
}

/**
 * 当 DOM 加载完成时初始化应用
 */
document.addEventListener('DOMContentLoaded', initApp);

/**
 * ==================== SDK 管理 ====================
 */

/**
 * 初始化 SDK
 */
async function initSDK(appKey) {
  if (!appKey) {
    showError('初始化失败', '请先输入 AppKey');
    return;
  }

  showLoading('正在初始化 SDK...');

  try {
    const result = await window.electronAPI.sdkInit(appKey);

    if (!result.success) {
      throw new Error(result.error || 'SDK 初始化失败');
    }

    appState.initialized = true;
    showSuccess('SDK 初始化成功');
    updateStatusBar('已初始化，等待登录');
    showLoginPanel();
  } catch (error) {
    showError('初始化失败', error.message || '未知错误');
  } finally {
    hideLoading();
  }
}

/**
 * 用户登录
 */
async function login() {
  const userUuid = elements.userUuidInput.value.trim();
  const token = elements.tokenInput.value.trim();

  if (!userUuid) {
    showError('登录失败', '请输入 User UUID');
    return;
  }

  if (!token) {
    showError('登录失败', '请输入 Token');
    return;
  }

  showLoading('正在登录...');

  try {
    const result = await window.electronAPI.sdkLogin(userUuid, token);

    if (!result.success) {
      throw new Error(result.error || '登录失败');
    }

    appState.loggedIn = true;
    appState.userInfo = { userUuid };
    showSuccess('登录成功');
    updateStatusBar('已登录: ' + userUuid);
    showMainPanel();
  } catch (error) {
    showError('登录失败', error.message || '未知错误');
  } finally {
    hideLoading();
  }
}

/**
 * 用户登出
 */
async function logout() {
  showLoading('正在退出登录...');

  try {
    const result = await window.electronAPI.sdkLogout();

    if (!result.success) {
      throw new Error(result.error || '退出登录失败');
    }

    appState.initialized = false;
    appState.loggedIn = false;
    appState.userInfo = null;
    elements.appKeyInput.value = '';
    elements.userUuidInput.value = '';
    elements.tokenInput.value = '';

    showSuccess('已退出登录');
    updateStatusBar('未初始化');
    showConfigPanel();
  } catch (error) {
    showError('退出登录失败', error.message || '未知错误');
  } finally {
    hideLoading();
  }
}

/**
 * ==================== 事件处理 ====================
 */

/**
 * 保存配置按钮点击
 */
elements.saveConfigBtn.addEventListener('click', () => {
  const appKey = elements.appKeyInput.value.trim();
  initSDK(appKey);
});

/**
 * 登录按钮点击
 */
elements.loginBtn.addEventListener('click', login);

/**
 * 登出按钮点击
 */
elements.logoutBtn.addEventListener('click', logout);

/**
 * 返回按钮点击
 */
elements.backToConfigBtn.addEventListener('click', () => {
  elements.userUuidInput.value = '';
  elements.tokenInput.value = '';
  showConfigPanel();
});

/**
 * App Key 输入框回车键
 */
elements.appKeyInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const appKey = elements.appKeyInput.value.trim();
    initSDK(appKey);
  }
});

/**
 * User UUID 输入框回车键
 */
elements.userUuidInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !elements.loginBtn.disabled) {
    elements.tokenInput.focus();
  }
});

/**
 * Token 输入框回车键
 */
elements.tokenInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !elements.loginBtn.disabled) {
    login();
  }
});

/**
 * 监听输入框变化，更新按钮状态
 */
elements.userUuidInput.addEventListener('input', updateLoginButtonState);
elements.tokenInput.addEventListener('input', updateLoginButtonState);

function updateLoginButtonState() {
  const hasUuid = elements.userUuidInput.value.trim().length > 0;
  const hasToken = elements.tokenInput.value.trim().length > 0;
  elements.loginBtn.disabled = !(hasUuid && hasToken);
}

/**
 * ==================== UI 更新 ====================
 */

/**
 * 显示配置面板
 */
function showConfigPanel() {
  elements.configPanel.classList.add('active');
  elements.loginPanel.classList.remove('active');
  elements.mainPanel.classList.remove('active');
}

/**
 * 显示登录面板
 */
function showLoginPanel() {
  elements.configPanel.classList.remove('active');
  elements.loginPanel.classList.add('active');
  elements.mainPanel.classList.remove('active');
  elements.userUuidInput.value = '';
  elements.tokenInput.value = '';
  updateLoginButtonState();
}

/**
 * 显示主应用面板
 */
function showMainPanel() {
  elements.configPanel.classList.remove('active');
  elements.loginPanel.classList.remove('active');
  elements.mainPanel.classList.add('active');

  if (appState.userInfo) {
    elements.userInfo.textContent = appState.userInfo.userUuid;
  }
}

/**
 * 更新整体 UI
 */
function updateUI() {
  if (!appState.initialized) {
    showConfigPanel();
  } else if (!appState.loggedIn) {
    showLoginPanel();
  } else {
    showMainPanel();
  }
}

/**
 * 更新状态栏
 */
function updateStatusBar(text) {
  elements.statusText.textContent = text;
}

/**
 * ==================== 加载和消息提示 ====================
 */

/**
 * 显示加载指示器
 */
function showLoading(message = '加载中...') {
  appState.loading = true;
  elements.loadingIndicator.classList.add('active');
  if (message) {
    elements.loadingIndicator.textContent = message;
  }
}

/**
 * 隐藏加载指示器
 */
function hideLoading() {
  appState.loading = false;
  elements.loadingIndicator.classList.remove('active');
  elements.loadingIndicator.textContent = '';
}

/**
 * 显示成功消息
 */
function showSuccess(message) {
  console.log('✓ ' + message);
  // 可以扩展为显示 toast 提示
}

/**
 * 显示错误消息
 */
function showError(title, message) {
  console.error('✗ ' + title + ': ' + message);
  // 使用 Electron 对话框显示错误
  if (window.electronAPI && window.electronAPI.showErrorDialog) {
    window.electronAPI.showErrorDialog(title, message);
  }
}

/**
 * ==================== 工具函数 ====================
 */

/**
 * 防止表单在加载时被修改
 */
function disableInputs() {
  elements.appKeyInput.disabled = appState.loading;
  elements.saveConfigBtn.disabled = appState.loading;
  elements.userUuidInput.disabled = appState.loading;
  elements.tokenInput.disabled = appState.loading;
  elements.logoutBtn.disabled = appState.loading;
}

/**
 * 监听应用状态变化
 */
const originalState = { ...appState };
Object.defineProperty(appState, 'loading', {
  set(value) {
    originalState.loading = value;
    disableInputs();
  },
  get() {
    return originalState.loading;
  }
});
