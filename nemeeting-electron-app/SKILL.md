# NEMeetingKit Electron 应用生成 Skill

## 概述

此 Skill 用于快速生成基于 NEMeetingKit SDK 的 Electron 应用。**严格遵循官方 TypeDoc 文档接口规范**。

生成的项目包含：
- ✅ SDK 配置与导入（ES6 Module + CommonJS 兼容）
- ✅ SDK 初始化（使用官方文档的 `initialize` 方法）
- ✅ 用户登录（使用官方文档的 `loginByToken` 方法）
- ✅ 用户登出
- ✅ 可扩展的 IPC 通信框架

## 何时使用

- 用户说："根据 nemeeting-electron-app skill 创建我的应用"
- 用户说："生成 NEMeetingKit Electron 应用"
- 用户说："我需要一个 NEMeetingKit 应用，和你之前的一样"
- 用户需要创建标准化的 NEMeetingKit Electron 应用

## ⚠️ 核心规则（**必读且必须遵守**）

### 规则 1：API 接口来源文档

**所有 NEMeetingKit API 调用必须来源于官方 TypeDoc：**

```
官方 TypeDoc: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/
```

具体的接口文档：

#### NEMeetingKit 主接口
- 文档链接: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html
- 规定方法：
  - `getInstance()` - 获取单例实例
  - `initialize(config)` - 初始化 SDK
  - `getAccountService()` - 获取账户服务
  - `getMeetingService()` - 获取会议服务
  - 其他服务方法请参照此文档

#### 账户服务（NEAccountService）
- 文档链接: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html
- 规定方法：
  - `loginByToken(userUuid, token)` - 用户登录
  - `logout()` - 用户登出
  - 其他方法请参照此文档

#### 会议服务（NEMeetingService）
- 文档链接: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingService.html
- 包含方法：startMeeting、joinMeeting、endMeeting 等

#### 其他服务
- 会前服务: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEPreMeetingService.html
- 设置服务: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NESettingsService.html
- 通讯录服务: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEContactsService.html

### 规则 2：API 验证流程

在实现任何 API 扩展时，**必须按以下流程执行**：

#### 步骤 1：确认 API 存在
- 打开官方 TypeDoc: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/
- 找到对应的接口（NEMeetingKit、NEAccountService、NEMeetingService 等）
- 确认要使用的方法在该接口中存在
- 记录完整的方法签名

#### 步骤 2：如果 API 不在 TypeDoc 中
**则必须向用户询问 API 文档，按以下模板：**

```
我需要使用 [API 名称] 功能，但该方法在官方 NEMeetingKit TypeDoc 中找不到。
请提供以下信息：
1. 该 API 方法属于哪个服务？（如 NEMeetingKit、NEMeetingService 等）
2. 完整的方法签名和参数类型定义
3. 官方文档或示例代码链接
4. 返回值类型定义

官方 TypeDoc 地址：https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/

我会根据您提供的官方文档实现此特性，不会凭空猜测 API。
```

#### 步骤 3：确认参数类型
- 对照 TypeDoc 中的参数定义
- 确保参数名称、类型、顺序完全匹配
- 添加官方 TypeDoc 链接作为代码注释

#### 步骤 4：检查返回值
- 确认返回值的 `code` 字段（所有 NEMeetingKit API 返回值都有 `code` 和 `msg` 字段）
- 实现正确的错误处理（检查 `result.code === 0` 表示成功）

### 规则 3：代码注释要求

**所有 IPC 处理器必须包含官方文档链接：**

```javascript
// 获取账户服务并登录
// 官方文档: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html#loginByToken
ipcMain.handle('sdk-login', async (event, userUuid, token) => {
  // ... 实现代码 ...
});
```

### 规则 4：处理未知 API 的流程

如果用户要求实现一个在 TypeDoc 中找不到的 API：

1. **不要猜测或假设 API 存在**
2. **向用户询问 API 文档**：
   ```
   "此方法在官方 NEMeetingKit TypeDoc 中找不到。
   请提供该 API 的官方文档或类型定义。"
   ```
3. **用户提供文档后，再实现**
4. **添加文档链接作为代码注释**

### 规则 5：项目结构约定

生成的项目结构必须遵循以下模式：

```
MyMeetingApp/
├── src/
│   ├── main/
│   │   └── main.js              # IPC 处理器和 SDK 初始化
│   ├── preload/
│   │   └── preload.js           # IPC API 暴露
│   └── renderer/
│       ├── index.html           # UI 界面
│       ├── renderer.js          # UI 逻辑
│       └── styles.css           # 样式
├── .instructions.md             # 快速开始指南
├── copilot-instructions.md      # Copilot 工作指南
├── SKILL.md                     # 项目 Skill 文档
├── package.json                 # 依赖配置（必须有 "type": "module"）
└── README.md                    # 项目说明
```

## 核心实现（不可改变）

### SDK 导入方式（ES6 + CommonJS 兼容）

```javascript
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { default: NEMeetingKit } = require('nemeeting-electron-sdk');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

**为什么不能改变：**
- NEMeetingKit SDK 是 CommonJS 模块
- 需要使用 `createRequire` 在 ES Module 中导入
- 需要补垫 `__dirname` 和 `__filename` 供 Electron 使用

### SDK 初始化方式

必须使用官方文档的方式：

```javascript
// 官方文档: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html#initialize
ipcMain.handle('sdk-init', async (event, appKey) => {
  try {
    const neMeetingKit = NEMeetingKit.getInstance();
    const result = await neMeetingKit.initialize({
      appKey: appKey,
      enableLog: true,
      logLevel: 1
    });

    if (result && result.code === 0) {
      return { success: true, message: 'SDK 初始化成功' };
    } else {
      return { success: false, message: result?.msg || 'SDK 初始化失败' };
    }
  } catch (error) {
    console.error('SDK 初始化失败:', error);
    return { success: false, message: error.message };
  }
});
```

### 用户登录方式

必须使用官方文档的方式（**两个单独参数，不是对象**）：

```javascript
// 官方文档: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html#loginByToken
ipcMain.handle('sdk-login', async (event, userUuid, token) => {
  try {
    const neMeetingKit = NEMeetingKit.getInstance();
    const accountService = neMeetingKit.getAccountService();
    if (!accountService) {
      return { success: false, message: '获取账户服务失败，请先初始化 SDK' };
    }

    // ⚠️ 重要：使用两个单独参数
    const result = await accountService.loginByToken(userUuid, token);

    if (result && result.code === 0) {
      return { success: true, message: '登录成功' };
    } else {
      return { success: false, message: result?.msg || '登录失败' };
    }
  } catch (error) {
    console.error('SDK 登录失败:', error);
    return { success: false, message: error.message };
  }
});
```

### 用户登出方式

```javascript
// 官方文档: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html#logout
ipcMain.handle('sdk-logout', async () => {
  try {
    const neMeetingKit = NEMeetingKit.getInstance();
    const accountService = neMeetingKit.getAccountService();
    if (!accountService) {
      return { success: false, message: 'SDK 尚未初始化' };
    }

    const result = await accountService.logout();

    if (result && result.code === 0) {
      return { success: true, message: '登出成功' };
    } else {
      return { success: false, message: result?.msg || '登出失败' };
    }
  } catch (error) {
    console.error('SDK 登出失败:', error);
    return { success: false, message: error.message };
  }
});
```

## 扩展指南

### 添加新 API 接口的步骤

1. **查找 API 文档**
   - 打开 TypeDoc: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/
   - 找到对应的服务接口
   - 复制完整的方法签名

2. **验证参数**
   - 核实参数名称和类型
   - 检查是否需要先调用 `getInstance()`
   - 确认返回值结构

3. **在 main.js 中实现 IPC 处理器**
   ```javascript
   // 官方文档: [链接到 TypeDoc 的具体方法]
   ipcMain.handle('xxx', async (event, ...args) => {
     try {
       const neMeetingKit = NEMeetingKit.getInstance();
       const service = neMeetingKit.getXxxService();
       const result = await service.methodName(...args);
       
       if (result && result.code === 0) {
         return { success: true, data: result };
       } else {
         return { success: false, message: result?.msg || 'Operation failed' };
       }
     } catch (error) {
       return { success: false, message: error.message };
     }
   });
   ```

4. **在 preload.js 中暴露 API**
   ```javascript
   const electronAPI = {
     // ... 现有 API ...
     myNewFeature: (...args) => ipcRenderer.invoke('my-feature', ...args)
   };
   ```

5. **在 renderer.js 中调用**
   ```javascript
   const result = await window.electronAPI.myNewFeature(param1, param2);
   ```

### ⚠️ 如果 API 不在 TypeDoc 中

**必须询问用户，使用以下模板：**

```
我需要实现 [功能名称]，但在官方 NEMeetingKit TypeDoc 中找不到相应的 API。

官方 TypeDoc: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/

请提供以下信息：
1. 该 API 属于哪个服务类（NEMeetingKit、NEMeetingService、NEAccountService 等）？
2. 完整的方法签名（包括参数类型和返回值类型）
3. 官方文档或示例代码链接
4. 该方法是否是异步的？

这样我可以根据官方文档实现此功能，确保兼容性和稳定性。
```

## API 查询速查表

| 功能 | 所属服务 | 方法 | 文档链接 |
|-----|--------|------|--------|
| 获取单例 | NEMeetingKit | `getInstance()` | [查看](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html#getInstance) |
| 初始化 SDK | NEMeetingKit | `initialize(config)` | [查看](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html#initialize) |
| 获取账户服务 | NEMeetingKit | `getAccountService()` | [查看](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html#getAccountService) |
| 用户登录 | NEAccountService | `loginByToken(userUuid, token)` | [查看](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html#loginByToken) |
| 用户登出 | NEAccountService | `logout()` | [查看](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html#logout) |
| 获取会议服务 | NEMeetingKit | `getMeetingService()` | [查看](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html#getMeetingService) |
| 启动会议 | NEMeetingService | `startMeeting(param)` | [查看](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingService.html#startMeeting) |
| 加入会议 | NEMeetingService | `joinMeeting(param)` | [查看](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingService.html#joinMeeting) |
| 结束会议 | NEMeetingService | `endMeeting()` | [查看](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingService.html#endMeeting) |

## 调试技巧

### 检查 API 是否存在

1. 打开官方 TypeDoc：https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/
2. 使用浏览器查找功能（Ctrl+F 或 Cmd+F）搜索方法名
3. 如果找不到，说明该方法不在官方文档中

### 验证参数类型

1. 在 TypeDoc 中找到方法名
2. 查看方法签名下的参数表
3. 确认参数顺序和类型

### 常见问题

**Q: 如何找到某个功能的 API？**  
A: 打开 TypeDoc https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/ 使用 Ctrl+F 搜索功能关键词。

**Q: TypeDoc 中找不到的 API 怎么办？**  
A: 向用户询问该 API 的官方文档。按照规则 4 的模板进行询问。

**Q: 为什么一定要用 TypeDoc 中的 API？**  
A: 保证代码的兼容性和稳定性，防止使用非官方 API 导致应用崩溃。

## 许可证

MIT License
