# 创建 Electron 会议应用 Skill

## ⚠️ 重要：API 文档规范

**本 Skill 所有 API 调用必须严格遵循官方指南示例代码。**

### 官方指南地址（必须参考）
```
初始化指南:  https://doc.yunxin.163.com/meeting/guide/TkyMjA0MDg?platform=electron
登录指南:    https://doc.yunxin.163.com/meeting/guide/DUxNjQzNDA?platform=electron
会议接口:    https://doc.yunxin.163.com/meeting/guide/TgwNzg5Njg?platform=electron
API TypeDoc:  https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/
```

### 核心 API 调用规则

**✅ 必须做：**
- 初始化必须使用：`NEMeetingKit.getInstance()` + `neMeetingKit.initialize(config)`
- 登录必须使用：`accountService.loginByToken(userUuid, token)`（两个单独参数）
- 所有调用必须参考官方指南中的示例代码
- 会议接口扩展必须参照会议接口指南中的示例

**❌ 禁止做：**
- 不要用 `NEMeetingKit.init(appKey)` （应该用 `getInstance() + initialize(config)`）
- 不要用 `accountService.loginByToken({ accountToken, accountId })` （应该用两个单独参数）
- 不要凭空猜测 API 参数或返回值
- 不要使用官方指南中没有的方法调用方式

### 当不确定 API 时的处理

如果在扩展功能时不知道要用什么 API：

1. **查看官方指南**
   - 在对应功能的官方指南中查找示例代码
   - 复制官方示例中的调用方式
   - 对照 API TypeDoc 验证参数类型

2. **向用户询问**
   ```
   如果官方指南中找不到该功能示例，请：
   1. 提供该功能的官方 SDK 示例代码
   2. 提供完整的类型定义或 API 文档链接
   3. 我将根据官方示例代码实现，不会凭空猜测
   ```

3. **添加文档链接**
   - 代码注释中必须包含官方指南链接
   - 说明参数的含义和官方文档的映射关系

## 概述

本 Skill 用于基于 **NEMeetingKit SDK** 快速创建 Electron 会议应用。包括 SDK 初始化、用户登录、会议管理等基础功能框架。

所有 API 调用均严格遵循 [官方文档](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html)，确保代码正确性和稳定性。

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
2. 主进程调用：
   - NEMeetingKit.getInstance() 获取单例
   - neMeetingKit.initialize(config) 初始化
   ↓
3. SDK 初始化成功
   ↓
4. 切换到登录界面
   ↓
5. 用户输入 UUID 和 Token 登录
   ↓
6. 主进程调用：
   - accountService.loginByToken(userUuid, token)（两个单独参数）
   ↓
7. 登录成功，进入主应用界面
```

**参考官方指南：**
- 初始化: https://doc.yunxin.163.com/meeting/guide/TkyMjA0MDg?platform=electron
- 登录: https://doc.yunxin.163.com/meeting/guide/DUxNjQzNDA?platform=electron

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

**关键 IPC 处理器（使用官方指南示例）：**

```javascript
// 初始化 SDK
// 官方指南: https://doc.yunxin.163.com/meeting/guide/TkyMjA0MDg?platform=electron
// 官方示例:
// const neMeetingKit = NEMeetingKit.getInstance();
// neMeetingKit.initialize(config).then((res) => {...})
ipcMain.handle('sdk-init', async (event, appKey) => {
  try {
    const NEMeetingKitModule = await import('nemeeting-electron-sdk');
    const NEMeetingKit = NEMeetingKitModule.default;
    
    // 获取 SDK 单例实例（官方推荐方式）
    const neMeetingKit = NEMeetingKit.getInstance();
    
    // 初始化 SDK
    const result = await neMeetingKit.initialize({
      appKey: appKey,
      enableLog: true,
      logLevel: 1
    });
    
    if (result && result.code === 0) {
      return { success: true };
    } else {
      return { success: false, error: result?.msg || 'SDK 初始化失败' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 用户登录
// 官方指南: https://doc.yunxin.163.com/meeting/guide/DUxNjQzNDA?platform=electron
// 官方使用 loginByToken 方式（参数为两个单独参数，不是对象）: 
// accountService.loginByToken(userUuid, token)
ipcMain.handle('sdk-login', async (event, userUuid, token) => {
  try {
    const NEMeetingKitModule = await import('nemeeting-electron-sdk');
    const NEMeetingKit = NEMeetingKitModule.default;
    
    const neMeetingKit = NEMeetingKit.getInstance();
    const accountService = neMeetingKit.getAccountService();
    if (!accountService) {
      return { success: false, error: 'SDK 尚未初始化' };
    }
    
    // ⚠️ 重要：使用两个单独的参数，不是对象
    // 正确方式：accountService.loginByToken(userUuid, token)
    // 错误方式：accountService.loginByToken({ userUuid, token })
    const result = await accountService.loginByToken(userUuid, token);
    
    if (result && result.code === 0) {
      return { success: true };
    } else {
      return { success: false, error: result?.msg || '登录失败' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 用户登出
// 官方指南: https://doc.yunxin.163.com/meeting/guide/DUxNjQzNDA?platform=electron
ipcMain.handle('sdk-logout', async (event) => {
  try {
    const NEMeetingKitModule = await import('nemeeting-electron-sdk');
    const NEMeetingKit = NEMeetingKitModule.default;
    
    const neMeetingKit = NEMeetingKit.getInstance();
    const accountService = neMeetingKit.getAccountService();
    if (!accountService) {
      return { success: false, error: 'SDK 尚未初始化' };
    }
    
    // 调用登出 API
    const result = await accountService.logout();
    
    if (result && result.code === 0) {
      return { success: true };
    } else {
      return { success: false, error: result?.msg || '登出失败' };
    }
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

## ES6 Module 配置（重要！）

NEMeetingKit SDK 是 CommonJS 模块，为了在 ES6 Module 项目中使用，**必须进行以下配置**：

### 1. 在 package.json 中启用 ES Module

```json
{
  "type": "module",
  "name": "my-meeting-app",
  ...
}
```

### 2. 在 main.js 中正确导入 NEMeetingKit

使用 `createRequire` 从 url 模块导入 CommonJS 包：

```javascript
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

// 创建 require 函数（ES Module 中不可用）
const require = createRequire(import.meta.url);

// 导入 NEMeetingKit（使用解构方式获取默认导出）
const { default: NEMeetingKit } = require('nemeeting-electron-sdk');

// 补垫 __dirname 和 __filename（ES Module 不提供）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

### 3. 为什么需要这些配置？

- **"type": "module"** - 告诉 Node.js 使用 ES Module 语法
- **createRequire** - 允许在 ES Module 中 require CommonJS 模块
- **fileURLToPath & __dirname** - ES Module 不自动提供文件路径，需要手动补垫

这样配置后，既能使用 ES6 import 语法，又能正确导入 CommonJS SDK。

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

### ⚠️ API 文档验证规则（必读）

在扩展期间添加任何新的 API 调用时，必须：

1. **总是使用 getInstance() 获取 SDK 实例**
   - 初始化: `const neMeetingKit = NEMeetingKit.getInstance();`
   - 然后初始化: `await neMeetingKit.initialize(config);`
   - 获取服务: `neMeetingKit.getAccountService()`, `neMeetingKit.getMeetingService()` 等
   - 官方指南: https://doc.yunxin.163.com/meeting/guide/TkyMjA0MDg?platform=electron

2. **使用官方指南中的 API，而不是 TypeDoc**
   - 优先参考官方指南: https://doc.yunxin.163.com/meeting/guide/
   - 然后查阅 TypeDoc: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/
   - 确认方法在文档中存在
   - 仔细核对参数类型和返回值

3. **如果不确定 API**
   - 不要猜测或假设 API 存在
   - 向使用者询问：
     ```
     我需要 NEMeetingKit 或相关服务的完整 API 文档。
     请提供您要使用的方法的：
     - 方法名称
     - 完整的参数类型定义
     - 返回值类型定义
     - 官方文档链接（优先官方指南，其次 TypeDoc）
     ```

4. **验证后再实现**
   - 确认官方文档中确实存在该方法
   - 复制完整的方法签名
   - 按照文档说明实现逻辑
   - 添加官方指南链接作为代码注释

### 添加新 IPC 通道

**1. 在主进程 (main.js) 添加处理器：**

```javascript
// ❌ 错误方式 1: 不存在的 API
ipcMain.handle('bad-example', async (event, args) => {
  const NEMeetingKit = await import('nemeeting-electron-sdk');
  await NEMeetingKit.someNonExistentMethod(); // 这个方法不存在！
});

// ❌ 错误方式 2: 缺少 getInstance() 步骤
ipcMain.handle('bad-example', async (event, args) => {
  const NEMeetingKit = await import('nemeeting-electron-sdk');
  const meetingService = NEMeetingKit.getMeetingService(); // 应该先 getInstance()
});

// ✅ 正确方式：使用 getInstance() 和官方文档中的 API
// 参考官方指南: https://doc.yunxin.163.com/meeting/guide/TgwNzg5Njg?platform=electron
ipcMain.handle('my-new-feature', async (event, ...args) => {
  try {
    const NEMeetingKitModule = await import('nemeeting-electron-sdk');
    const NEMeetingKit = NEMeetingKitModule.default;
    
    // 第一步：获取 SDK 单例实例（官方推荐）
    const neMeetingKit = NEMeetingKit.getInstance();
    
    // 第二步：从 SDK 获取服务实例
    // 例如：getMeetingService(), getAccountService() 等
    const meetingService = neMeetingKit.getMeetingService();
    if (!meetingService) {
      return { success: false, error: 'Meeting Service is not available' };
    }
    
    // 第三步：调用服务中的官方文档支持的方法
    // 确保这个方法在官方指南中有说明
    const result = await meetingService.someMethod(...args);
    
    if (result && result.code === 0) {
      return { success: true, data: result };
    } else {
      return { success: false, error: result?.msg || 'Operation failed' };
    }
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
    } else {
      console.error('功能失败:', result.error);
    }
  } catch (error) {
    console.error('调用失败:', error);
  }
}
```

### 会议功能扩展示例

**重要：以下示例只是演示框架，实际 API 调用必须根据官方文档实现！**

```javascript
// 获取会议服务
// 文档: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html#getMeetingService
const meetingService = NEMeetingKit.getMeetingService();

// 启动会议 - 详细实现请参照官方文档中 NEMeetingService 的 startMeeting 方法
ipcMain.handle('start-meeting', async (event, params) => {
  try {
    const result = await meetingService.startMeeting(params);
    return { success: result.code === 0, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 加入会议 - 详细实现请参照官方文档中 NEMeetingService 的 joinMeeting 方法
ipcMain.handle('join-meeting', async (event, params) => {
  try {
    const result = await meetingService.joinMeeting(params);
    return { success: result.code === 0, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 结束会议 - 详细实现请参照官方文档中 NEMeetingService 的 endMeeting 方法
ipcMain.handle('end-meeting', async (event) => {
  try {
    const result = await meetingService.endMeeting();
    return { success: result.code === 0, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

### 常见的 SDK 服务

| 服务 | 获取方法 | 用途 | 官方文档 |
|-----|--------|------|--------|
| 账户服务 | `getAccountService()` | 登录、登出、账户管理 | [文档](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html) |
| 会议服务 | `getMeetingService()` | 启动、加入、结束会议 | [文档](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingService.html) |
| 会前服务 | `getPreMeetingService()` | 会议预约和管理 | [文档](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEPreMeetingService.html) |
| 设置服务 | `getSettingsService()` | 应用设置 | [文档](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NESettingsService.html) |
| 通讯录服务 | `getContactsService()` | 联系人管理 | [文档](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEContactsService.html) |

**使用新服务时的步骤：**

1. 在官方文档找到对应的 `getXxxService()` 方法
2. 在主进程中调用 `NEMeetingKit.getXxxService()`
3. 查看该服务接口中的可用方法
4. 按照方法签名实现 IPC 处理器
5. 在预加载脚本中暴露 API
6. 在渲染进程中调用

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

## ⚠️ 常见 API 错误

这些 API 调用方式是**错误的**，不要使用！

### ❌ 错误用法

```javascript
// 错误 1: createClient() 不存在
const client = NEMeetingKit.createClient(); // ❌ 这个方法不存在

// 错误 2: 缺少 getInstance() 步骤（必须先获取单例实例）
const result = await NEMeetingKit.initialize({ appKey }); // ❌ 缺少 getInstance()

// 错误 3: 直接调用 initialize（应该先 getInstance）
await NEMeetingKit.initialize({ appKey }); // ❌ 错误的用法

// 错误 4: 使用错误的登录方法和参数
const accountService = NEMeetingKit.getAccountService();
await accountService.login({ uid, token }); // ❌ 应该用 loginByToken(userUuid, token)（两个参数）

// 错误 5: 不检查 code 返回值
const result = await neMeetingKit.initialize({ appKey });
if (result) { // ❌ 需要检查 result.code === 0

// 错误 6: startMeeting() 不是直接在 NEMeetingKit 上（应该通过 MeetingService）
await NEMeetingKit.startMeeting({ meetingId }); // ❌ 错误的用法
```

### ✅ 正确用法

```javascript
// 正确 1: 使用 getInstance() 获取单例实例（官方推荐）
// 官方指南: https://doc.yunxin.163.com/meeting/guide/TkyMjA0MDg?platform=electron
const neMeetingKit = NEMeetingKit.getInstance();
const result = await neMeetingKit.initialize({ appKey });
if (result && result.code === 0) {
  // 初始化成功
}

// 正确 2: 通过 AccountService 使用 loginByToken 登录（两个单独参数）
// 官方指南: https://doc.yunxin.163.com/meeting/guide/DUxNjQzNDA?platform=electron
const neMeetingKit = NEMeetingKit.getInstance();
const accountService = neMeetingKit.getAccountService();
// ⚠️ 重要：使用两个单独的参数，不是对象
const result = await accountService.loginByToken(userUuid, token);
if (result && result.code === 0) {
  // 登录成功
}

// 正确 3: 通过 AccountService 登出
const neMeetingKit = NEMeetingKit.getInstance();
const accountService = neMeetingKit.getAccountService();
const result = await accountService.logout();
if (result && result.code === 0) {
  // 登出成功
}

// 正确 4: 通过 MeetingService 启动会议
// 官方指南: https://doc.yunxin.163.com/meeting/guide/TgwNzg5Njg?platform=electron
const neMeetingKit = NEMeetingKit.getInstance();
const meetingService = neMeetingKit.getMeetingService();
const result = await meetingService.startMeeting({ 
  meetingId, 
  displayName 
});

// 正确 5: 通过 MeetingService 加入会议
const neMeetingKit = NEMeetingKit.getInstance();
const meetingService = neMeetingKit.getMeetingService();
const result = await meetingService.joinMeeting({ 
  meetingId, 
  displayName 
});
```

### API 检查清单

在实现任何新功能前，问自己：

- [ ] 我是否在所有操作前调用了 `NEMeetingKit.getInstance()`？（这是官方推荐的必须步骤）
- [ ] 这个方法在【官方指南】中存在吗？（而不仅仅在 TypeDoc 中）
- [ ] 我用的是正确的返回值检查方式吗？（应该检查 `result.code === 0`）
- [ ] 我是否通过正确的服务获取这个方法？（getInstance → getService → 调用方法）
- [ ] 参数名称和官方例子一致吗？（如：loginByToken 用 accountToken 和 accountId）
- [ ] 我是否添加了官方指南链接作为注释？

## 常见问题

**Q: 如何获取 App Key？**  
A: 需要在网易会议开发者平台注册应用并获取 App Key。

**Q: 应用无法启动或报"无法识别initialize"？**  
A: 确保调用了 `getInstance()` 步骤。完整流程: `getInstance()` → `initialize()` → `getXxxService()` → 调用 API

**Q: 应用无法启动？**  
A: 检查 Node 版本（需要 14+）和 npm 依赖是否正确安装。

**Q: SDK 初始化失败？**  
A: 确保 App Key 有效，检查网络连接。查看错误消息中的 `result.msg` 获取具体原因。

**Q: 如何打包应用？**  
A: 使用 `npm run pack:mac`、`npm run pack:win` 或 `npm run pack:linux` 命令，electron-builder 会自动根据平台打包。

**Q: 我想使用一个不存在的 API，怎么办？**  
A: 首先确认该方法在官方文档的 [NEMeetingKit 接口](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html) 或相关服务中确实存在。如果不存在，可能需要实现替代方案或查看是否有类似的官方 API。

## SDK 资源

- [NEMeetingKit 官方文档](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html)
- [NEMeetingKit TypeDoc 索引](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/modules.html)
- [Electron 官方文档](https://www.electronjs.org/docs)
- [IPC 通信指南](https://www.electronjs.org/docs/api/ipc-main)

## 许可证

MIT License - 可自由使用和修改
