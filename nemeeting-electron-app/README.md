# NEMeetingKit Electron 应用快速生成

基于官方 TypeDoc 规范的 NEMeetingKit Electron 应用生成 Skill。

## 快速开始

### 方式 1：通过 Copilot 使用

在 VS Code Copilot 中输入：

```
根据 nemeeting-electron-app skill 创建一个 NEMeetingKit Electron 应用
```

Copilot 会自动生成完整项目。

### 方式 2：查看 Skill 文档

打开 [SKILL.md](SKILL.md) 了解：
- 项目结构要求
- 核心实现细节
- API 规则和验证流程

## 项目特性

✅ **标准化项目结构** - 基于最佳实践的 Electron + IPC 架构  
✅ **SDK 完整集成** - ES6 Module + CommonJS 兼容导入  
✅ **官方文档驱动** - 所有 API 基于 NEMeetingKit TypeDoc  
✅ **API 严格验证** - 扩展功能必须在官方文档中找到  
✅ **可扩展框架** - 便于添加新功能和接口  

## 项目结构

```
生成的项目包含：
├── src/main/main.js         - SDK 初始化和 IPC 处理
├── src/preload/preload.js   - 安全的 IPC API 暴露
├── src/renderer/            - UI 界面和逻辑
├── package.json             - 依赖配置（"type": "module"）
├── SKILL.md                 - 项目 Skill 文档
└── .instructions.md         - 快速开始指南
```

## 核心功能

- ✅ SDK 初始化 - 使用官方 `initialize` 方法
- ✅ 用户登录 - 使用官方 `loginByToken(userUuid, token)` 方法
- ✅ 用户登出 - 使用官方 `logout` 方法
- ✅ IPC 通信框架 - 安全的进程间通信

## 扩展新功能

### 规则

所有新功能必须：
1. 从官方 TypeDoc 中找到 API：https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/
2. 验证 API 存在和参数类型
3. 如果找不到，向用户询问官方文档

### 步骤

1. **查找 API** - 在 TypeDoc 中搜索功能
2. **验证参数** - 确认参数名和类型
3. **实现 IPC 处理器** - 在 main.js 中添加
4. **暴露 API** - 在 preload.js 中添加
5. **调用方法** - 在 renderer.js 中使用

详见 [SKILL.md](SKILL.md) 的"扩展指南"部分。

## 重要规则

⚠️ **必读：[SKILL.md](SKILL.md) 中的"核心规则"部分**

- 所有 API 必须来源于官方 TypeDoc
- 如果 API 找不到，必须询问用户
- 必须添加文档链接作为代码注释
- loginByToken 使用两个参数，不是对象

## 官方文档

| 资源 | 链接 |
|-----|------|
| **NEMeetingKit TypeDoc** | https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html |
| **NEAccountService** | https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html |
| **NEMeetingService** | https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingService.html |
| **TypeDoc 首页** | https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/ |

## 使用示例

```javascript
// 初始化 SDK
const result = await window.electronAPI.sdkInit(appKey);

// 用户登录
const loginResult = await window.electronAPI.sdkLogin(userUuid, token);

// 用户登出
const logoutResult = await window.electronAPI.sdkLogout();
```

## 开发流程

```
用户请求 → 查找 API → API 存在？
                ↓ 是
              实现功能
                ↓
              添加文档链接
                
                ↓ 否
              询问用户
            提供文档或 API 类型
```

## 常见问题

**Q: 为什么一定要用 TypeDoc 中的 API？**  
A: 确保代码兼容性和稳定性，防止使用非官方 API。

**Q: 如何在 TypeDoc 中搜索 API？**  
A: 打开 https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/ 并使用 Ctrl+F 搜索。

**Q: 如果 API 在 TypeDoc 中找不到？**  
A: 询问用户提供该 API 的官方文档或类型定义。

## 许可证

MIT License

---

**更新时间**: 2026-03-05  
**维护者**: NEMeetingKit Skill Team
