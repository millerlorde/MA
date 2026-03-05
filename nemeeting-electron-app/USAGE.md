# 使用 nemeeting-electron-app Skill

## 如何使用此 Skill？

### 方式 1：通过 Copilot（推荐）

在 VS Code 的 Copilot Chat 中输入：

```
根据 nemeeting-electron-app skill 为我创建一个 NEMeetingKit Electron 应用，项目名称为 MyMeetingApp
```

或者：

```
基于 nemeeting-electron-app skill 生成标准的 NEMeetingKit Electron 应用项目
```

Copilot 会自动：
1. 创建项目目录结构
2. 复制所有模板文件到正确位置
3. 根据你的需求调整项目配置
4. 生成相应的文档

### 方式 2：手动复制模板

1. **创建项目目录**
   ```bash
   mkdir MyMeetingApp
   cd MyMeetingApp
   ```

2. **复制模板文件**
   ```bash
   # 复制 package.json 到项目根目录
   cp skill/templates/package.json .
   
   # 创建目录结构
   mkdir -p src/main src/preload src/renderer
   
   # 复制文件
   cp skill/templates/main.js src/main/
   cp skill/templates/preload.js src/preload/
   cp skill/templates/index.html src/renderer/
   cp skill/templates/renderer.js src/renderer/
   cp skill/templates/styles.css src/renderer/
   ```

3. **初始化项目**
   ```bash
   npm install
   ```

4. **启动开发**
   ```bash
   npm start
   ```

## Skill 的关键规则

此 Skill 强制执行以下规则，**任何新功能扩展都必须遵守**：

### 规则 1：API 必须来源于官方 TypeDoc

所有 NEMeetingKit API 调用必须在此文档中找到：
- **官方 TypeDoc**: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/

**不允许**使用未在官方 TypeDoc 中的 API 方法。

### 规则 2：如果 API 不存在，必须询问用户

如果需要的 API 在 TypeDoc 中找不到，Copilot 应该询问：

```
我需要使用 [API 名称] 功能，但该方法在官方 NEMeetingKit TypeDoc 中找不到。

官方 TypeDoc: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/

请提供以下信息：
1. 该 API 属于哪个服务？（如 NEMeetingKit、NEMeetingService 等）
2. 完整的方法签名和参数类型定义
3. 官方文档或示例代码链接

我将根据您提供的文档实现此特性。
```

### 规则 3：核心接口不能改变

生成的项目必须包含以下**不可改变的接口**：

| IPC 处理器 | 功能 | 参数 |
|-----------|------|------|
| `sdkInit` | SDK 初始化 | `appKey` |
| `sdkLogin` | 用户登录 | `uuid, token` |
| `sdkLogout` | 用户登出 | 无 |

这些接口的实现必须**严格遵循模板中的代码**。

### 规则 4：代码注释必须包含 TypeDoc 链接

所有 IPC 处理器必须有官方 TypeDoc 链接：

```javascript
// ✅ 正确
// 官方 TypeDoc: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html#initialize
ipcMain.handle('sdkInit', async (event, appKey) => {
  // ...
});

// ❌ 错误（没有文档链接）
ipcMain.handle('sdkInit', async (event, appKey) => {
  // ...
});
```

### 规则 5：参数类型必须匹配 TypeDoc

在扩展 API 时，参数名和类型必须与 TypeDoc 完全匹配：

```javascript
// ✅ 正确（与 TypeDoc 中的 loginByToken 签名一致）
const result = await accountService.loginByToken(userUuid, token);

// ❌ 错误（参数格式不符合 TypeDoc）
const result = await accountService.loginByToken({ userUuid, token });
```

## 项目结构

生成的项目结构如下：

```
MyMeetingApp/
├── src/
│   ├── main/
│   │   └── main.js              # Electron 主进程
│   ├── preload/
│   │   └── preload.js           # IPC 预加载脚本
│   └── renderer/
│       ├── index.html           # UI 页面
│       ├── renderer.js          # UI 逻辑
│       └── styles.css           # 样式
├── package.json                 # npm 配置（"type": "module"）
├── .instructions.md             # 快速开始指南
├── copilot-instructions.md      # Copilot 工作指南
├── SKILL.md                     # 项目 Skill 文档
└── README.md                    # 项目说明
```

## 核心功能

生成的项目包含：

✅ **SDK 初始化** - 使用 `NEMeetingKit.getInstance()` + `initialize()`  
✅ **用户登录** - 使用 `accountService.loginByToken(uuid, token)`（两个参数）  
✅ **用户登出** - 使用 `accountService.logout()`  
✅ **IPC 通信** - 安全的 Electron IPC 框架  
✅ **配置管理** - 使用 electron-store 保存配置  

## 扩展新功能的流程

### 步骤 1：查找 API
打开官方 TypeDoc：https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/

搜索需要的方法（如 startMeeting、joinMeeting 等）

### 步骤 2：验证 API 存在
- 找到对应的接口（如 NEMeetingService）
- 确认方法名和参数类型

### 步骤 3：如果找不到
向 Copilot 提供：
- 方法的完整签名
- 参数和返回值的类型定义
- 官方文档链接

### 步骤 4：实现功能
1. 在 `src/main/main.js` 中添加 IPC 处理器
2. 在 `src/preload/preload.js` 中暴露 API
3. 在 `src/renderer/renderer.js` 中调用功能

### 步骤 5：添加注释
```javascript
// 官方 TypeDoc: [具体链接]
ipcMain.handle('your-handler', async (event, ...args) => {
  // 实现代码
});
```

## 常见问题

**Q: 为什么 loginByToken 使用两个参数而不是对象？**  
A: 这是由官方 TypeDoc 规定的方法签名，必须严格遵守。

**Q: 我想使用一个不在 TypeDoc 中的 API，怎么办？**  
A: 提供该 API 的官方文档或类型定义，Copilot 会根据文档实现（不会凭空猜测）。

**Q: 可以修改核心的 SDK 初始化代码吗？**  
A: 不可以，SDK 初始化、登录、登出的实现必须严格遵循模板，以确保稳定性。

**Q: Skill 地址是什么？**  
A: `/Users/mashiqing01/.agents/skills/nemeeting-electron-app/`

## 官方资源

| 资源 | 链接 |
|-----|------|
| NEMeetingKit TypeDoc | https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/ |
| NEMeetingKit 接口 | https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html |
| NEAccountService | https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html |
| NEMeetingService | https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingService.html |

## 许可证

MIT License

---

**Skill 路径**: `/Users/mashiqing01/.agents/skills/nemeeting-electron-app/`  
**最后更新**: 2026-03-05
