# 创建 Electron 会议应用 Skill

## 概述

本 Skill 用于基于 **NEMeetingKit SDK** 快速创建 Electron 会议应用。包括 SDK 初始化、用户登录、会议管理等基础功能框架。

## 何时使用

- 用户说："创建 Electron 会议应用"
- 用户说："我需要一个基于网易会议 SDK 的桌面应用"
- 用户说："创建会议应用"、"集成会议 SDK"
- 用户描述想要构建一个基于 NEMeetingKit 的 Electron 应用

## 项目特性

✅ **Electron 架构** - 主进程、预加载脚本、渲染进程的完整分离  
✅ **NEMeetingKit SDK 集成** - 包含初始化和登录流程  
✅ **IPC 通信** - 安全的进程间通信机制  
✅ **UI 框架** - 现代化的登录和配置界面  
✅ **状态管理** - 应用状态跟踪（初始化、登录状态等）  
✅ **可扩展架构** - 便于添加会议功能扩展  

## 项目结构

```
MyMeetingApp/
├── src/
│   ├── main/
│   │   └── main.js              # Electron 主进程 - SDK 初始化、IPC 处理
│   ├── preload/
│   │   └── preload.js           # 预加载脚本 - 暴露安全 API
│   └── renderer/
│       ├── index.html           # 主 UI 界面
│       ├── renderer.js          # 前端逻辑 - 状态管理、事件处理
│       └── styles.css           # 样式文件
├── resources/                   # 应用资源（图标等）
├── build/                       # 构建输出目录
├── package.json                 # 项目依赖和脚本
└── README.md                    # 项目说明
```

## 核心概念

### 1. Electron 进程分离

```
┌─────────────────────────────────┐
│      主进程 (Main Process)      │
│  - SDK 初始化                   │
│  - IPC 消息处理                 │
│  - 文件系统访问                 │
└──────────────┬──────────────────┘
               │ IPC 通信
┌──────────────▼──────────────────┐
│   渲染进程 (Renderer Process)    │
│  - UI 界面                       │
│  - 用户交互                      │
│  - 环境受限（安全）              │
└─────────────────────────────────┘
```

### 2. SDK 初始化流程

```
1. 用户输入 App Key
   ↓
2. 主进程调用 NEMeetingKit.init(appKey)
   ↓
3. SDK 初始化成功
   ↓
4. 切换到登录界面
   ↓
5. 用户输入 UUID 和 Token 登录
   ↓
6. 主进程调用 NEMeetingKit.login()
   ↓
7. 登录成功，进入主应用界面
```

### 3. IPC 通信机制

**预加载脚本 (preload.js) 暴露的 API：**
```javascript
electronAPI = {
  // 对话框
  showErrorDialog(title, message),
  showInfoDialog(title, message),
  
  // SDK 管理
  sdkInit(appKey),           // 初始化 SDK
  sdkLogin(userUuid, token), // 用户登录
  sdkLogout()                // 用户登出
}
```

**渲染进程调用示例：**
```javascript
const result = await window.electronAPI.sdkInit(appKey);
if (result.success) {
  // 初始化成功
}
```

## 关键实现细节

### 主进程 (main.js)

主进程负责：
- **SDK 生命周期管理** - 初始化、登录、登出
- **IPC 通道** - 处理来自渲染进程的请求
- **窗口管理** - 创建和管理应用窗口
- **权限控制** - 通过 preload 脚本进行安全隔离

**关键 IPC 处理器：**

```javascript
// 初始化 SDK
ipcMain.handle('sdk-init', async (event, appKey) => {
  try {
    const NEMeetingKit = (await import('nemeeting-electron-sdk')).default;
    await NEMeetingKit.init({ appKey });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 用户登录
ipcMain.handle('sdk-login', async (event, userUuid, token) => {
  try {
    const NEMeetingKit = (await import('nemeeting-electron-sdk')).default;
    await NEMeetingKit.login({ userUuid, token });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

### 预加载脚本 (preload.js)

预加载脚本提供**安全的沙箱隔离**：

```javascript
const electronAPI = {
  sdkInit: (appKey) => ipcRenderer.invoke('sdk-init', appKey),
  sdkLogin: (userUuid, token) => ipcRenderer.invoke('sdk-login', userUuid, token),
  sdkLogout: () => ipcRenderer.invoke('sdk-logout')
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
```

### 渲染进程 (renderer.js)

渲染进程管理：
- **应用状态** - 跟踪初始化、登录、用户信息
- **UI 更新** - 根据状态切换界面面板
- **事件处理** - 按钮点击、输入处理
- **错误提示** - 显示成功/错误信息

**状态管理结构：**

```javascript
const appState = {
  initialized: false,  // SDK 是否初始化
  loggedIn: false,     // 用户是否登录
  userInfo: null,      // 用户信息
  loading: false       // 是否正在加载
};
```

## 环境要求

| 依赖 | 版本 | 用途 |
|-----|-----|------|
| node | 14+ | 开发环境 |
| npm | 6+ | 包管理 |
| electron | 31.4.0+ | 桌面应用框架 |
| nemeeting-electron-sdk | 4.19.3+ | 会议 SDK |
| electron-store | 8.1.0+ | 本地存储 |
| electron-builder | 24.0.0+ | 应用打包 |

## 安装和启动

### 1. 初始化项目

```bash
npm install
```

### 2. 启动开发环境

```bash
npm start
```

### 3. 生成安装包

```bash
# macOS
npm run pack:mac

# Windows
npm run pack:win

# Linux
npm run pack:linux
```

## 功能流程

### 初始化流程

1. **输入 App Key**
   - 用户在配置面板输入网易会议的 App Key
   - 点击"初始化 SDK"按钮

2. **SDK 初始化**
   - 渲染进程调用 `window.electronAPI.sdkInit(appKey)`
   - 主进程接收请求，调用 NEMeetingKit SDK
   - 返回初始化结果

3. **UI 切换**
   - 成功：显示登录面板
   - 失败：显示错误提示

### 登录流程

1. **输入凭证**
   - User UUID（用户唯一标识）
   - Token（访问令牌）

2. **发起登录**
   - 点击登录按钮
   - 调用 `window.electronAPI.sdkLogin(userUuid, token)`

3. **登录处理**
   - 主进程调用 SDK 的登录方法
   - 返回登录结果

4. **登录成功**
   - 显示主应用面板
   - 展示用户信息
   - 提供退出登录选项

## 扩展指南

### 添加新 IPC 通道

**1. 在主进程 (main.js) 添加处理器：**

```javascript
ipcMain.handle('my-new-feature', async (event, ...args) => {
  try {
    // 实现功能逻辑
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

**2. 在预加载脚本 (preload.js) 暴露 API：**

```javascript
const electronAPI = {
  // ... 现有 API ...
  myNewFeature: (...args) => ipcRenderer.invoke('my-new-feature', ...args)
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
```

**3. 在渲染进程 (renderer.js) 调用：**

```javascript
async function myNewFunction() {
  try {
    const result = await window.electronAPI.myNewFeature(param1, param2);
    if (result.success) {
      console.log('功能执行成功:', result.data);
    }
  } catch (error) {
    console.error('功能执行失败:', error);
  }
}
```

### 会议功能扩展示例

基于现有框架，可以添加以下会议功能：

```javascript
// 启动会议
ipcMain.handle('start-meeting', async (event, meetingId, displayName) => {
  const NEMeetingKit = (await import('nemeeting-electron-sdk')).default;
  return NEMeetingKit.startMeeting({ meetingId, displayName });
});

// 加入会议
ipcMain.handle('join-meeting', async (event, meetingId, displayName) => {
  const NEMeetingKit = (await import('nemeeting-electron-sdk')).default;
  return NEMeetingKit.joinMeeting({ meetingId, displayName });
});

// 结束会议
ipcMain.handle('end-meeting', async (event) => {
  const NEMeetingKit = (await import('nemeeting-electron-sdk')).default;
  return NEMeetingKit.endMeeting();
});
```

## 调试技巧

### 1. 查看主进程日志

```bash
npm start
# 在启动窗口查看日志输出
```

### 2. 打开开发者工具

在应用运行时，可以在主进程代码中添加：

```javascript
if (isDev) {
  mainWindow.webContents.openDevTools();
}
```

### 3. IPC 调试

在预加载脚本添加日志：

```javascript
const electronAPI = {
  sdkInit: (appKey) => {
    console.log('调用 sdkInit，appKey:', appKey);
    return ipcRenderer.invoke('sdk-init', appKey);
  }
};
```

## 常见问题

**Q: 如何获取 App Key？**  
A: 需要在网易会议开发者平台注册应用并获取 App Key。

**Q: 应用无法启动？**  
A: 检查 Node 版本（需要 14+）和 npm 依赖是否正确安装。

**Q: SDK 初始化失败？**  
A: 确保 App Key 有效，检查网络连接和 SDK 版本兼容性。

**Q: 如何打包应用？**  
A: 使用 `npm run build` 命令，electron-builder 会自动根据平台打包。

## SDK 资源

- [NEMeetingKit SDK 文档](https://nemeeting.netease.com/)
- [Electron 官方文档](https://www.electronjs.org/docs)
- [IPC 通信指南](https://www.electronjs.org/docs/api/ipc-main)

## 许可证

MIT License - 可自由使用和修改
