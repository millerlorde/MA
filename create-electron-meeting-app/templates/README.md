# MyMeetingApp

基于 Electron 和 NEMeetingKit SDK 的网易会议桌面客户端。

## ⚠️ API 文档规范

**所有 NEMeetingKit API 调用必须遵循官方指南！**

### 官方指南（必须参考）
- SDK 初始化: https://doc.yunxin.163.com/meeting/guide/TkyMjA0MDg?platform=electron
- 用户登录: https://doc.yunxin.163.com/meeting/guide/DUxNjQzNDA?platform=electron
- 会议接口: https://doc.yunxin.163.com/meeting/guide/TgwNzg5Njg?platform=electron

### TypeDoc（其次参考）
- API 完整参考: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/

### 禁止使用这些不存在的 API

```javascript
// ❌ 这些都是错的！

NEMeetingKit.createClient()          // 不存在！
NEMeetingKit.init()                  // 应该用 initialize()
NEMeetingKit.login()                 // 应该用 getAccountService().loginByToken()
NEMeetingKit.logout()                // 应该用 getAccountService().logout()
NEMeetingKit.startMeeting()          // 应该用 getMeetingService().startMeeting()
accountService.login({ uid, token }) // 已废弃，用 loginByToken()
```

### 正确的 API 用法

```javascript
// ✅ 官方推荐的正确用法！

// 1️⃣ 第一步：获取 SDK 单例实例（必须！）
// 官方指南: https://doc.yunxin.163.com/meeting/guide/TkyMjA0MDg?platform=electron
const NEMeetingKitModule = await import('nemeeting-electron-sdk');
const NEMeetingKit = NEMeetingKitModule.default;
const neMeetingKit = NEMeetingKit.getInstance();  // ← 这一步绝对不能省！

// 2️⃣ 初始化 SDK
const result = await neMeetingKit.initialize({ appKey });
if (result && result.code === 0) {
  console.log('初始化成功');
}

// 3️⃣ 用户登录（使用 loginByToken）
// 官方指南: https://doc.yunxin.163.com/meeting/guide/DUxNjQzNDA?platform=electron
const accountService = neMeetingKit.getAccountService();
const loginResult = await accountService.loginByToken({
  accountToken: userToken,    // 用户 Token
  accountId: userUuid         // 用户 ID
});
if (loginResult && loginResult.code === 0) {
  console.log('登录成功');
}

// 4️⃣ 启动会议
// 官方指南: https://doc.yunxin.163.com/meeting/guide/TgwNzg5Njg?platform=electron
const meetingService = neMeetingKit.getMeetingService();
const meetingResult = await meetingService.startMeeting({
  meetingId: 'xxx',
  displayName: '用户名'
});
```

## 📋 项目特性

✅ **Electron 跨平台** - Windows、macOS、Linux 支持  
✅ **NEMeetingKit 集成** - 完整的 SDK 初始化和登录流程  
✅ **安全架构** - 主进程、预加载脚本、渲染进程分离  
✅ **IPC 通信** - 安全的进程间通信机制  
✅ **现代化 UI** - 响应式设计，美观易用  
✅ **可扩展** - 便于添加会议功能  
✅ **API 规范** - 所有 API 遵循官方文档  

## 🚀 快速开始

### 环境要求

- Node.js 14.0 或更高版本
- npm 6.0 或更高版本

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm start
```

### 打包应用

```bash
# macOS
npm run pack:mac

# Windows
npm run pack:win

# Linux
npm run pack:linux
```

## 📁 项目结构

```
MyMeetingApp/
├── src/
│   ├── main/
│   │   └── main.js              # Electron 主进程
│   │                             # - SDK 初始化和管理
│   │                             # - IPC 请求处理
│   │                             # - 窗口生命周期
│   │
│   ├── preload/
│   │   └── preload.js           # 预加载脚本
│   │                             # - 安全 API 暴露
│   │                             # - contextBridge 配置
│   │
│   └── renderer/
│       ├── index.html           # 主界面 HTML
│       ├── renderer.js          # 前端逻辑
│       │                         # - 状态管理
│       │                         # - 事件处理
│       │                         # - UI 更新
│       │
│       └── styles.css           # 应用样式
│
├── resources/                   # 应用资源（图标等）
├── build/                       # 构建输出目录
├── package.json                 # 项目配置和依赖
├── README.md                    # 本文件
└── .gitignore                   # Git 忽略配置
```

## 🔧 功能说明

### 1. SDK 初始化

启动应用后，需要输入网易会议的 App Key 来初始化 SDK：

1. 在"App Key"输入框输入获取的 App Key
2. 点击"初始化 SDK"按钮
3. 等待初始化完成后，进入登录界面

### 2. 用户登录

初始化成功后，登录用户账户：

1. 输入 User UUID（用户唯一标识）
2. 输入 Token（访问令牌）
3. 点击"登录"按钮
4. 登录成功后进入主应用界面

### 3. 用户登出

在主应用界面点击"退出登录"按钮可以退出当前账户。

## 💻 开发指南

### ⚠️ 添加新功能前的检查清单

在添加任何新功能前，必须确认：

- [ ] 该方法在官方 API 文档中存在吗？
- [ ] 文档链接是否是 https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/ 下的？
- [ ] 参数类型和返回值与文档一致吗？
- [ ] 是否通过正确的服务获取该方法？

### 添加新的功能

#### 1. 在主进程 (main.js) 添加 IPC 处理器

```javascript
// ❌ 错误的做法
ipcMain.handle('my-feature', async (event, params) => {
  const result = await NEMeetingKit.someMethod(params); // ❌ 这个方法可能不存在
});

// ✅ 正确的做法（参照官方文档实现）
ipcMain.handle('my-feature', async (event, params) => {
  try {
    // 从官方文档获取服务
    // 文档: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html#getMeetingService
    const service = NEMeetingKit.getMeetingService();
    if (!service) {
      return { success: false, error: 'Service not available' };
    }
    
    // 调用官方文档中的方法
    const result = await service.someMethod(params);
    
    // 检查返回值 (根据官方文档，返回 NEResult<T>)
    if (result.code === 0) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.msg };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

#### 2. 在预加载脚本 (preload.js) 暴露 API

```javascript
const electronAPI = {
  myFeature: (params) => ipcRenderer.invoke('my-feature', params)
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
```

#### 3. 在渲染进程 (renderer.js) 调用

```javascript
async function useMyFeature() {
  try {
    const result = await window.electronAPI.myFeature(params);
    if (result.success) {
      console.log('成功:', result.data);
    } else {
      console.error('失败:', result.error);
    }
  } catch (error) {
    console.error('调用失败:', error);
  }
}
```

### 常见服务速查表

| 服务 | 获取方法 | 官方文档 |
|-----|--------|--------|
| 账户服务 | `NEMeetingKit.getAccountService()` | [NEAccountService](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html) |
| 会议服务 | `NEMeetingKit.getMeetingService()` | [NEMeetingService](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingService.html) |
| 会前服务 | `NEMeetingKit.getPreMeetingService()` | [NEPreMeetingService](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEPreMeetingService.html) |
| 设置服务 | `NEMeetingKit.getSettingsService()` | [NESettingsService](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NESettingsService.html) |

**查看服务文档后，再根据文档中的方法实现功能。**

### 会议功能扩展示例

基于现有框架，可以添加以下会议功能。

**关键：所有的 API 调用都必须根据官方文档实现！**

```javascript
// 获取会议服务
const meetingService = NEMeetingKit.getMeetingService();

if (!meetingService) {
  console.error('会议服务不可用');
}

// 启动会议
// 查看官方文档中 NEMeetingService.startMeeting() 的签名
const startMeetingResult = await meetingService.startMeeting({
  meetingId: 'your-meeting-id',
  displayName: 'Your Display Name'
});

// 加入会议
// 查看官方文档中 NEMeetingService.joinMeeting() 的签名
const joinMeetingResult = await meetingService.joinMeeting({
  meetingId: 'meeting-id',
  displayName: 'Display Name'
});

// 结束会议
// 查看官方文档中 NEMeetingService.endMeeting() 的签名
const endMeetingResult = await meetingService.endMeeting();
```

## 🐛 调试

### 1. 启用开发者工具

在 `src/main/main.js` 中：

```javascript
// 开发环境下打开开发者工具
if (process.env.NODE_ENV === 'development') {
  mainWindow.webContents.openDevTools();
}
```

### 2. 查看主进程日志

应用启动时，控制台会输出详细的日志信息。

### 3. 使用开发者工具 (F12)

- 查看渲染进程的 console 日志
- 检查网络请求
- 调试 JavaScript 代码
- 检查 DOM 元素

## 📚 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Electron | ^31.4.0 | 跨平台桌面应用框架 |
| NEMeetingKit SDK | ^4.19.3 | 会议功能 SDK |
| electron-store | ^8.1.0 | 本地数据持久化 |
| electron-builder | ^24.0.0 | 应用打包工具 |

## ⚙️ 配置说明

### package.json 配置

修改以下信息以符合你的项目：

```json
{
  "name": "your-app-name",
  "version": "1.0.0",
  "description": "your-app-description",
  "author": "Your Name",
  "build": {
    "appId": "com.your-company.your-app",
    "productName": "YourApp"
  }
}
```

### electron-builder 配置

在 `package.json` 的 `build` 字段配置打包选项：

- **mac**: macOS 打包配置
- **win**: Windows 打包配置
- **linux**: Linux 打包配置

## 🔐 安全建议

1. **不要在渲染进程直接访问 Node API**
   - 通过 preload 脚本和 contextBridge 暴露 API

2. **敏感凭证管理**
   - 不要在前端代码中硬编码 API 密钥
   - 使用 electron-store 存储用户配置

3. **输入验证**
   - 对所有用户输入进行验证和清理

4. **错误处理**
   - 不要向用户暴露敏感的技术细节

## 🆘 故障排除

### SDK 初始化失败

**原因**: App Key 无效或网络问题

**解决**:
1. 确认 App Key 从网易会议平台正确获取
2. 检查网络连接
3. 查看浏览器控制台的错误信息

### 登录失败

**原因**: 凭证错误或已过期

**解决**:
1. 确认 User UUID 和 Token 正确
2. 检查 Token 是否过期
3. 确认用户有权限使用应用

### 应用无法启动

**原因**: 依赖未安装或版本不兼容

**解决**:
```bash
# 清除并重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 检查 Electron 版本
npm list electron
```

### 热更新不工作

**原因**: 文件监听问题

**解决**:
- 增加文件监听限制：`ulimit -n 10000`
- 重启应用

## 📖 相关文档

- [Electron 官方文档](https://www.electronjs.org/docs)
- [NEMeetingKit SDK 文档](https://nemeeting.netease.com/)
- [IPC 通信指南](https://www.electronjs.org/docs/latest/api/ipc-main)
- [Electron 安全性最佳实践](https://www.electronjs.org/docs/latest/tutorial/security)

## 📄 许可证

MIT License - 可自由使用、修改和分发

## 💡 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -m 'Add feature xxx'`)
4. 推送到分支 (`git push origin feature/xxx`)
5. 创建 Pull Request

## 📞 获取支持

- 查看文档中的常见问题部分
- 检查 GitHub Issues
- 联系开发团队

---

**版本**: 1.0.0  
**最后更新**: 2026 年 3 月  
**维护者**: 您的团队
