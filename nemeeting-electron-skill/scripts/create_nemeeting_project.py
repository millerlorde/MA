#!/usr/bin/env python3
"""
网易会议 Electron 项目生成器
用法: python create_nemeeting_project.py <project_name> [output_dir]
"""

import os
import sys
import json
import subprocess

def print_step(message):
    """打印步骤信息"""
    print(f"👉 {message}")

def print_success(message):
    """打印成功信息"""
    print(f"✅ {message}")

def print_warning(message):
    """打印警告信息"""
    print(f"⚠️ {message}")

def print_error(message):
    """打印错误信息"""
    print(f"❌ {message}")

def create_project_structure(project_name, output_dir="."):
    """创建完整的 Electron 项目结构"""
    project_root = os.path.join(output_dir, project_name)

    directories = [
        project_root,
        os.path.join(project_root, "src"),
        os.path.join(project_root, "src", "main"),
        os.path.join(project_root, "src", "preload"),
        os.path.join(project_root, "src", "renderer"),
        os.path.join(project_root, "resources"),
        os.path.join(project_root, "build"),
    ]

    for directory in directories:
        os.makedirs(directory, exist_ok=True)

    print_step(f"创建项目目录: {project_root}")
    return project_root

def create_package_json(project_root, project_name):
    """创建 package.json 文件"""
    package_json = {
        "name": project_name.lower().replace(" ", "-"),
        "version": "1.0.0",
        "description": "网易会议 Electron 客户端 - 基于 NEMeetingKit SDK",
        "main": "src/main/main.js",
        "scripts": {
            "start": "electron .",
            "build": "electron-builder",
            "pack": "electron-builder --dir",
            "pack:mac": "electron-builder --mac",
            "pack:win": "electron-builder --win",
            "pack:linux": "electron-builder --linux"
        },
        "keywords": ["netease", "meeting", "electron", "nemeeting", "sdk"],
        "author": "Your Name",
        "license": "MIT",
        "dependencies": {
            "electron-store": "^8.1.0",
            "nemeeting-electron-sdk": "^3.0.0"
        },
        "devDependencies": {
            "electron": "^25.0.0",
            "electron-builder": "^24.0.0"
        },
        "build": {
            "appId": f"com.example.{project_name.lower().replace(' ', '')}",
            "productName": project_name,
            "directories": {
                "output": "dist"
            },
            "files": [
                "src/**/*",
                "resources/**/*",
                "package.json",
                "README.md"
            ],
            "mac": {
                "category": "public.app-category.business"
            },
            "win": {
                "target": "nsis"
            },
            "linux": {
                "target": "AppImage"
            }
        }
    }

    with open(os.path.join(project_root, "package.json"), "w", encoding="utf-8") as f:
        json.dump(package_json, f, indent=2, ensure_ascii=False)

    print_step("创建 package.json")
    return package_json

def create_main_js(project_root):
    """创建主进程文件"""
    content = """const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
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

ipcMain.handle('get-config', () => {
  return {
    appKey: store.get('appKey', ''),
    rememberMe: store.get('rememberMe', true)
  };
});

ipcMain.handle('save-config', (event, config) => {
  store.set('appKey', config.appKey);
  store.set('rememberMe', config.rememberMe);
  return { success: true };
});

ipcMain.handle('clear-config', () => {
  store.clear();
  return { success: true };
});

ipcMain.handle('show-error-dialog', (event, title, message) => {
  dialog.showErrorBox(title, message);
});

ipcMain.handle('show-info-dialog', (event, title, message) => {
  dialog.showMessageBox({
    type: 'info',
    title: title,
    message: message
  });
});"""

    with open(os.path.join(project_root, "src", "main", "main.js"), "w", encoding="utf-8") as f:
        f.write(content)

    print_step("创建主进程文件 (main.js)")
    return True

def create_preload_js(project_root):
    """创建预加载脚本"""
    content = """const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  clearConfig: () => ipcRenderer.invoke('clear-config'),
  showErrorDialog: (title, message) => ipcRenderer.invoke('show-error-dialog', title, message),
  showInfoDialog: (title, message) => ipcRenderer.invoke('show-info-dialog', title, message)
});"""

    with open(os.path.join(project_root, "src", "preload", "preload.js"), "w", encoding="utf-8") as f:
        f.write(content)

    print_step("创建预加载脚本 (preload.js)")
    return True

def create_renderer_js(project_root):
    """创建渲染进程脚本"""
    content = """let neMeetingKit = null;
let accountService = null;
let meetingService = null;

const appState = {
  initialized: false,
  loggedIn: false,
  userInfo: null,
  loading: false
};

const elements = {
  configPanel: document.getElementById('config-panel'),
  loginPanel: document.getElementById('login-panel'),
  mainPanel: document.getElementById('main-panel'),
  appKeyInput: document.getElementById('appKey'),
  rememberMeCheckbox: document.getElementById('rememberMe'),
  saveConfigBtn: document.getElementById('save-config'),
  clearConfigBtn: document.getElementById('clear-config'),
  userUuidInput: document.getElementById('userUuid'),
  tokenInput: document.getElementById('token'),
  loginBtn: document.getElementById('login'),
  logoutBtn: document.getElementById('logout'),
  createMeetingBtn: document.getElementById('create-meeting'),
  joinMeetingBtn: document.getElementById('join-meeting'),
  scheduleMeetingBtn: document.getElementById('schedule-meeting'),
  statusText: document.getElementById('status-text'),
  loadingIndicator: document.getElementById('loading')
};

async function initApp() {
  try {
    const config = await window.electronAPI.getConfig();
    if (config.appKey && config.rememberMe) {
      elements.appKeyInput.value = config.appKey;
      elements.rememberMeCheckbox.checked = config.rememberMe;
      await initSDK(config.appKey);
    }
    updateUI();
  } catch (error) {
    console.error('初始化失败:', error);
    showError('初始化失败', error.message);
  }
}

async function initSDK(appKey) {
  if (!appKey) throw new Error('请先输入 AppKey');

  showLoading('正在初始化 SDK...');
  try {
    const NEMeetingKit = (await import('nemeeting-electron-sdk')).default;
    neMeetingKit = NEMeetingKit.getInstance();

    const config = { appKey: appKey, debug: true };
    await neMeetingKit.initialize(config);

    accountService = neMeetingKit.getAccountService();
    meetingService = neMeetingKit.getMeetingService();

    appState.initialized = true;
    showSuccess('SDK 初始化成功');

    elements.configPanel.style.display = 'none';
    elements.loginPanel.style.display = 'block';
  } catch (error) {
    throw new Error(`SDK 初始化失败: ${error.message || '未知错误'}`);
  } finally {
    hideLoading();
  }
}

async function login() {
  const userUuid = elements.userUuidInput.value.trim();
  const token = elements.tokenInput.value.trim();

  if (!userUuid || !token) {
    showError('登录失败', '请输入 User UUID 和 Token');
    return;
  }

  showLoading('正在登录...');
  try {
    await accountService.loginByToken(userUuid, token);
    appState.loggedIn = true;
    appState.userInfo = { userUuid };
    showSuccess('登录成功');
    updateUI();
  } catch (error) {
    showError('登录失败', error.message || '未知错误');
  } finally {
    hideLoading();
  }
}

async function logout() {
  showLoading('正在退出登录...');
  try {
    await accountService.logout();
    appState.loggedIn = false;
    appState.userInfo = null;
    showInfo('已退出登录');
    updateUI();
  } catch (error) {
    showError('退出登录失败', error.message || '未知错误');
  } finally {
    hideLoading();
  }
}

async function createMeeting() {
  if (!appState.loggedIn) {
    showError('操作失败', '请先登录');
    return;
  }

  showLoading('正在创建会议...');
  try {
    const meetingOptions = {
      subject: '快速会议',
      duration: 60,
      enableChat: true,
      enableVideo: true,
      enableAudio: true
    };
    const meetingInfo = await meetingService.createMeeting(meetingOptions);
    showInfo('会议创建成功', `会议号: ${meetingInfo.meetingId}`);
  } catch (error) {
    showError('创建会议失败', error.message || '未知错误');
  } finally {
    hideLoading();
  }
}

async function joinMeeting() {
  const meetingId = prompt('请输入会议号:');
  if (!meetingId) return;

  showLoading('正在加入会议...');
  try {
    const joinOptions = {
      meetingId: meetingId,
      displayName: appState.userInfo?.userUuid || '用户',
      enableVideo: true,
      enableAudio: true
    };
    await meetingService.joinMeeting(joinOptions);
    showSuccess('已加入会议');
  } catch (error) {
    showError('加入会议失败', error.message || '未知错误');
  } finally {
    hideLoading();
  }
}

async function scheduleMeeting() {
  if (!appState.loggedIn) {
    showError('操作失败', '请先登录');
    return;
  }

  const subject = prompt('请输入会议主题:', '预约会议');
  if (!subject) return;

  const startTime = prompt('请输入开始时间 (YYYY-MM-DD HH:mm):',
    new Date(Date.now() + 3600000).toISOString().slice(0, 16).replace('T', ' '));

  showLoading('正在预约会议...');
  try {
    const scheduleOptions = {
      subject: subject,
      startTime: new Date(startTime).getTime(),
      duration: 60,
      enableChat: true,
      enableVideo: true,
      enableAudio: true
    };
    const meetingInfo = await meetingService.scheduleMeeting(scheduleOptions);
    showInfo('会议预约成功', `会议号: ${meetingInfo.meetingId}\\n开始时间: ${new Date(meetingInfo.startTime).toLocaleString()}`);
  } catch (error) {
    showError('预约会议失败', error.message || '未知错误');
  } finally {
    hideLoading();
  }
}

async function saveConfig() {
  const appKey = elements.appKeyInput.value.trim();
  const rememberMe = elements.rememberMeCheckbox.checked;

  if (!appKey) {
    showError('保存失败', '请输入 AppKey');
    return;
  }

  try {
    await window.electronAPI.saveConfig({ appKey, rememberMe });
    showSuccess('配置已保存');
    await initSDK(appKey);
  } catch (error) {
    showError('保存配置失败', error.message || '未知错误');
  }
}

async function clearConfig() {
  try {
    await window.electronAPI.clearConfig();
    elements.appKeyInput.value = '';
    elements.rememberMeCheckbox.checked = true;
    appState.initialized = false;
    appState.loggedIn = false;
    appState.userInfo = null;
    showInfo('配置已清除');
    updateUI();
  } catch (error) {
    showError('清除配置失败', error.message || '未知错误');
  }
}

function updateUI() {
  if (!appState.initialized) {
    elements.configPanel.style.display = 'block';
    elements.loginPanel.style.display = 'none';
    elements.mainPanel.style.display = 'none';
  } else if (!appState.loggedIn) {
    elements.configPanel.style.display = 'none';
    elements.loginPanel.style.display = 'block';
    elements.mainPanel.style.display = 'none';
  } else {
    elements.configPanel.style.display = 'none';
    elements.loginPanel.style.display = 'none';
    elements.mainPanel.style.display = 'block';
  }

  let status = '';
  if (appState.initialized) status += '✓ SDK 已初始化 ';
  if (appState.loggedIn) status += `✓ 已登录 (${appState.userInfo?.userUuid || '未知用户'})`;
  elements.statusText.textContent = status || '未初始化';

  elements.loginBtn.disabled = !appState.initialized;
  elements.createMeetingBtn.disabled = !appState.loggedIn;
  elements.joinMeetingBtn.disabled = !appState.loggedIn;
  elements.scheduleMeetingBtn.disabled = !appState.loggedIn;
  elements.logoutBtn.disabled = !appState.loggedIn;
}

function showLoading(message) {
  appState.loading = true;
  elements.loadingIndicator.textContent = message;
  elements.loadingIndicator.style.display = 'block';
  document.querySelectorAll('button').forEach(btn => { btn.disabled = true; });
}

function hideLoading() {
  appState.loading = false;
  elements.loadingIndicator.style.display = 'none';
  updateUI();
}

function showSuccess(message) {
  window.electronAPI.showInfoDialog('成功', message);
}

function showInfo(title, message) {
  window.electronAPI.showInfoDialog(title, message);
}

function showError(title, message) {
  window.electronAPI.showErrorDialog(title, message);
}

function setupEventListeners() {
  elements.saveConfigBtn.addEventListener('click', saveConfig);
  elements.clearConfigBtn.addEventListener('click', clearConfig);
  elements.loginBtn.addEventListener('click', login);
  elements.createMeetingBtn.addEventListener('click', createMeeting);
  elements.joinMeetingBtn.addEventListener('click', joinMeeting);
  elements.scheduleMeetingBtn.addEventListener('click', scheduleMeeting);
  elements.logoutBtn.addEventListener('click', logout);

  elements.appKeyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveConfig();
  });

  elements.userUuidInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && elements.tokenInput.value) {
      elements.tokenInput.focus();
    }
  });

  elements.tokenInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  initApp();
});"""

    with open(os.path.join(project_root, "src", "renderer", "renderer.js"), "w", encoding="utf-8") as f:
        f.write(content)

    print_step("创建渲染进程脚本 (renderer.js)")
    return True

def create_index_html(project_root):
    """创建 HTML 主界面"""
    content = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>网易会议 Electron 客户端</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; }
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; }
        .app-container { background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); width: 100%; max-width: 500px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { font-size: 24px; font-weight: 600; margin-bottom: 10px; }
        .header p { opacity: 0.9; font-size: 14px; }
        .content { padding: 30px; }
        .panel { display: none; }
        .form-group { margin-bottom: 20px; }
        label { display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px; }
        input[type="text"], input[type="password"] { width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 14px; transition: all 0.3s; }
        input[type="text"]:focus, input[type="password"]:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
        .checkbox-group { display: flex; align-items: center; margin-top: 10px; }
        .checkbox-group input { margin-right: 10px; }
        .button-group { display: flex; gap: 10px; margin-top: 30px; }
        button { flex: 1; padding: 14px; border: none; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-primary { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(79,70,229,0.2); }
        .btn-secondary { background: #f3f4f6; color: #374151; }
        .btn-secondary:hover:not(:disabled) { background: #e5e7eb; }
        .btn-danger { background: #ef4444; color: white; }
        .btn-danger:hover:not(:disabled) { background: #dc2626; }
        .btn-success { background: #10b981; color: white; }
        .btn-success:hover:not(:disabled) { background: #059669; }
        .meeting-buttons { display: grid; grid-template-columns: 1fr; gap: 15px; margin-top: 20px; }
        .status-bar { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 15px 30px; text-align: center; font-size: 13px; color: #6b7280; }
        .loading { display: none; text-align: center; padding: 20px; color: #4f46e5; font-size: 14px; }
        .loading::after { content: ''; display: inline-block; width: 20px; height: 20px; margin-left: 10px; border: 2px solid #e5e7eb; border-top-color: #4f46e5; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="app-container">
        <div class="header">
            <h1>网易会议 Electron 客户端</h1>
            <p>基于 NEMeetingKit SDK</p>
        </div>
        <div class="content">
            <div id="config-panel" class="panel">
                <div class="form-group">
                    <label for="appKey">App Key</label>
                    <input type="text" id="appKey" placeholder="请输入网易会议 App Key">
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="rememberMe" checked>
                    <label for="rememberMe">记住配置</label>
                </div>
                <div class="button-group">
                    <button id="save-config" class="btn-primary">保存并初始化</button>
                    <button id="clear-config" class="btn-secondary">清除配置</button>
                </div>
            </div>
            <div id="login-panel" class="panel" style="display: none;">
                <div class="form-group">
                    <label for="userUuid">User UUID</label>
                    <input type="text" id="userUuid" placeholder="请输入用户 UUID">
                </div>
                <div class="form-group">
                    <label for="token">Token</label>
                    <input type="password" id="token" placeholder="请输入访问令牌">
                </div>
                <div class="button-group">
                    <button id="login" class="btn-primary" disabled>登录</button>
                </div>
            </div>
            <div id="main-panel" class="panel" style="display: none;">
                <div class="meeting-buttons">
                    <button id="create-meeting" class="btn-success" disabled>创建即刻会议</button>
                    <button id="join-meeting" class="btn-primary" disabled>加入会议</button>
                    <button id="schedule-meeting" class="btn-secondary" disabled>预约会议</button>
                    <button id="logout" class="btn-danger" disabled>退出登录</button>
                </div>
            </div>
            <div id="loading" class="loading"></div>
        </div>
        <div class="status-bar">
            <span id="status-text">未初始化</span>
        </div>
    </div>
    <script src="renderer.js"></script>
</body>
</html>"""

    with open(os.path.join(project_root, "src", "renderer", "index.html"), "w", encoding="utf-8") as f:
        f.write(content)

    print_step("创建主界面 (index.html)")
    return True

def create_styles_css(project_root):
    """创建样式文件"""
    content = "/* 主样式文件 - 已内联到 index.html */\n/* 此文件作为备用样式扩展 */"

    with open(os.path.join(project_root, "src", "renderer", "styles.css"), "w", encoding="utf-8") as f:
        f.write(content)

    print_step("创建样式文件 (styles.css)")
    return True

def create_gitignore(project_root):
    """创建 .gitignore 文件"""
    content = """# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
out/
release/

# Runtime data
.DS_Store
Thumbs.db

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
logs/
*.log"""

    with open(os.path.join(project_root, ".gitignore"), "w", encoding="utf-8") as f:
        f.write(content)

    print_step("创建 .gitignore 文件")
    return True

def create_readme(project_root, project_name):
    """创建 README.md 文件"""
    content = f"""# {project_name}

基于 Electron 的网易会议客户端，集成 NEMeetingKit SDK。

## 🚀 快速开始

### 安装依赖
```bash
cd {project_name}
npm install
```

### 启动应用
```bash
npm start
```

### 配置步骤
1. 输入网易会议 App Key
2. 点击"保存并初始化"
3. 输入 User UUID 和 Token 登录
4. 使用会议功能

## 📁 项目结构

```
{project_name}/
├── src/
│   ├── main/main.js          # Electron 主进程
│   ├── preload/preload.js    # 预加载脚本
│   └── renderer/
│       ├── index.html        # 主界面
│       ├── renderer.js       # 前端逻辑
│       └── styles.css        # 样式文件
├── package.json              # 项目配置
├── README.md                 # 说明文档
└── .gitignore               # Git 忽略文件
```

## 🔧 开发指南

### 扩展功能
1. 在主进程 (`src/main/main.js`) 中添加新的 IPC 处理器
2. 在预加载脚本 (`src/preload/preload.js`) 中暴露 API
3. 在渲染进程 (`src/renderer/renderer.js`) 中调用新功能

### 使用 NEMeetingKit SDK
```javascript
// 获取 SDK 实例
const NEMeetingKit = (await import('nemeeting-electron-sdk')).default;
const neMeetingKit = NEMeetingKit.getInstance();

// 初始化
await neMeetingKit.initialize({{ appKey: 'your_app_key' }});

// 使用服务
const accountService = neMeetingKit.getAccountService();
const meetingService = neMeetingKit.getMeetingService();
```

## 📦 构建应用

```bash
# 开发模式
npm start

# 打包 macOS
npm run pack:mac

# 打包 Windows
npm run pack:win

# 打包 Linux
npm run pack:linux
```

## 📚 参考文档

- [NEMeetingKit SDK 文档](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/modules.html)
- [Electron 文档](https://www.electronjs.org/docs)
- [electron-store 文档](https://github.com/sindresorhus/electron-store)

## ⚠️ 注意事项

1. **不要提交敏感信息**：App Key 和 Token 不要提交到版本控制系统
2. **网络要求**：需要能够访问网易会议服务器
3. **环境要求**：Node.js 16+, Electron 25+

## 🐛 故障排除

### 常见问题
- **依赖安装失败**：检查网络，或使用国内镜像 `npm config set registry https://registry.npmmirror.com`
- **SDK 初始化失败**：确认 App Key 正确，检查网络连接
- **登录失败**：确认 User UUID 和 Token 正确，检查 Token 是否过期

### 调试模式
启动应用时添加 `--debug` 参数，或在代码中设置 `debug: true`。

## 📄 许可证

MIT License

---

**提示**：请妥善保管您的 App Key 和 Token，避免泄露。"""

    with open(os.path.join(project_root, "README.md"), "w", encoding="utf-8") as f:
        f.write(content)

    print_step("创建 README.md 文档")
    return True

def install_dependencies(project_root):
    """安装项目依赖"""
    print_step("开始安装依赖...")

    try:
        # 检查 npm 是否可用
        subprocess.run(["npm", "--version"], check=True, capture_output=True)

        # 安装依赖
        print_step("运行 npm install...")
        result = subprocess.run(
            ["npm", "install"],
            cwd=project_root,
            capture_output=True,
            text=True,
            timeout=300
        )

        if result.returncode == 0:
            print_success("依赖安装成功")
            return True
        else:
            print_warning(f"npm install 失败: {result.stderr[:200]}")
            print_warning("请手动运行: npm install")
            return False

    except subprocess.TimeoutExpired:
        print_warning("依赖安装超时，请稍后手动运行: npm install")
        return False
    except Exception as e:
        print_warning(f"依赖安装失败: {str(e)}")
        print_warning("请手动运行: npm install")
        return False

def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法: python create_nemeeting_project.py <project_name> [output_dir]")
        print("示例: python create_nemeeting_project.py MyMeetingApp")
        sys.exit(1)

    project_name = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "."

    print("=" * 50)
    print("🎉 网易会议 Electron 项目生成器")
    print("=" * 50)

    try:
        # 1. 创建项目结构
        project_root = create_project_structure(project_name, output_dir)

        # 2. 创建项目文件
        create_package_json(project_root, project_name)
        create_main_js(project_root)
        create_preload_js(project_root)
        create_renderer_js(project_root)
        create_index_html(project_root)
        create_styles_css(project_root)
        create_gitignore(project_root)
        create_readme(project_root, project_name)

        # 3. 安装依赖
        install_dependencies(project_root)

        print("=" * 50)
        print_success(f"项目创建成功: {project_root}")
        print("\n📋 下一步操作:")
        print(f"1. 进入项目目录: cd {project_name}")
        print("2. 启动应用: npm start")
        print("3. 配置你的网易会议 App Key")
        print("\n💡 提示: 如果依赖安装失败，请手动运行 'npm install'")
        print("=" * 50)

    except Exception as e:
        print_error(f"项目创建失败: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
