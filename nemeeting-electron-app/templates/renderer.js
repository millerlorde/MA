// 状态管理
const state = {
  initialized: false,
  loggedin: false,
  appKey: '',
  uuid: ''
};

// DOM 元素引用
const elements = {
  statusDot: document.getElementById('statusDot'),
  statusText: document.getElementById('statusText'),
  configPanel: document.getElementById('configPanel'),
  loginPanel: document.getElementById('loginPanel'),
  appPanel: document.getElementById('appPanel'),
  appKeyInput: document.getElementById('appKeyInput'),
  uuidInput: document.getElementById('uuidInput'),
  tokenInput: document.getElementById('tokenInput'),
  displayUuid: document.getElementById('displayUuid'),
  initBtn: document.getElementById('initBtn'),
  loginBtn: document.getElementById('loginBtn'),
  logoutBtn: document.getElementById('logoutBtn')
};

// 更新状态显示
function updateStatus(status, message) {
  elements.statusText.textContent = message;
  elements.statusDot.className = 'status-dot ' + status;
}

// 切换面板显示
function showPanel(panelName) {
  elements.configPanel.style.display = 'none';
  elements.loginPanel.style.display = 'none';
  elements.appPanel.style.display = 'none';

  switch (panelName) {
    case 'config':
      elements.configPanel.style.display = 'block';
      break;
    case 'login':
      elements.loginPanel.style.display = 'block';
      break;
    case 'app':
      elements.appPanel.style.display = 'block';
      break;
  }
}

// 初始化 SDK
async function handleInit() {
  const appKey = elements.appKeyInput.value.trim();
  if (!appKey) {
    await window.electronAPI.showErrorDialog('请输入 App Key');
    return;
  }

  try {
    const result = await window.electronAPI.sdkInit(appKey);
    if (result.success) {
      state.initialized = true;
      state.appKey = appKey;
      updateStatus('initialized', '已初始化');
      showPanel('login');
      await window.electronAPI.showInfoDialog(result.message);
    } else {
      await window.electronAPI.showErrorDialog(result.message);
    }
  } catch (error) {
    await window.electronAPI.showErrorDialog('初始化失败：' + error.message);
  }
}

// 登录
async function handleLogin() {
  const uuid = elements.uuidInput.value.trim();
  const token = elements.tokenInput.value.trim();

  if (!uuid) {
    await window.electronAPI.showErrorDialog('请输入 UUID');
    return;
  }

  if (!token) {
    await window.electronAPI.showErrorDialog('请输入 Token');
    return;
  }

  try {
    const result = await window.electronAPI.sdkLogin(uuid, token);
    if (result.success) {
      state.loggedin = true;
      state.uuid = uuid;
      elements.displayUuid.textContent = uuid;
      updateStatus('loggedin', '已登录');
      showPanel('app');
      await window.electronAPI.showInfoDialog(result.message);
    } else {
      await window.electronAPI.showErrorDialog(result.message);
    }
  } catch (error) {
    await window.electronAPI.showErrorDialog('登录失败：' + error.message);
  }
}

// 登出
async function handleLogout() {
  try {
    const result = await window.electronAPI.sdkLogout();
    if (result.success) {
      state.loggedin = false;
      state.uuid = '';
      updateStatus('initialized', '已登出');
      showPanel('login');
      elements.tokenInput.value = '';
      await window.electronAPI.showInfoDialog(result.message);
    } else {
      await window.electronAPI.showErrorDialog(result.message);
    }
  } catch (error) {
    await window.electronAPI.showErrorDialog('登出失败：' + error.message);
  }
}

// 事件绑定
elements.initBtn.addEventListener('click', handleInit);
elements.loginBtn.addEventListener('click', handleLogin);
elements.logoutBtn.addEventListener('click', handleLogout);

// 初始化 UI
showPanel('config');
updateStatus('idle', '未初始化');
