# Skill 更新记录

## v1.2.0 - 修复关键初始化 Bug & 更新官方指南引用

### 🔴 重大 Bug 修复

**问题**: SDK 初始化缺少必须的 `getInstance()` 步骤，导致"无法识别initialize"错误。

### 关键修复

1. **SDK 初始化流程修复**
   - ❌ 旧方式: `await NEMeetingKit.initialize(config)` 
   - ✅ 新方式: `const neMeetingKit = NEMeetingKit.getInstance(); await neMeetingKit.initialize(config);`
   - 原因: 官方 SDK 要求必须先获取单例实例

2. **登录方法更新**
   - ❌ 旧方式: `accountService.login({ uid, token })`
   - ✅ 新方式: `accountService.loginByToken({ accountToken, accountId })`
   - 原因: `login()` 方法已废弃，官方推荐使用 `loginByToken()`

3. **官方指南优先**
   - 添加三个关键官方指南链接到所有代码示例
   - SDK 初始化: https://doc.yunxin.163.com/meeting/guide/TkyMjA0MDg?platform=electron
   - 登录认证: https://doc.yunxin.163.com/meeting/guide/DUxNjQzNDA?platform=electron
   - 会议接口: https://doc.yunxin.163.com/meeting/guide/TgwNzg5Njg?platform=electron

### 📝 文档更新

**SKILL.md**
- ✅ 更新"API 文档规范"部分，强调 getInstance() 必须步骤
- ✅ 更新"SDK 初始化流程"显示正确的 getInstance() 步骤
- ✅ 修复"关键实现细节"中的所有代码示例
  - SDK 初始化: 添加 getInstance()
  - 用户登录: 改用 loginByToken()
  - 用户登出: 添加 getInstance()
- ✅ 更新"常见 API 错误"的错误用法示例
  - 显示缺少 getInstance() 的错误
  - 显示使用 login() 而非 loginByToken() 的错误
- ✅ 更新"API 检查清单"，添加 getInstance() 检查项
- ✅ 更新"常见问题"，添加关于无法识别 initialize 错误的回答
- ✅ 更新"扩展指南"的规则和代码示例

**README.md**
- ✅ 更新"添加会议功能"示例，展示正确的 getInstance() + getMeetingService() 调用

**templates/src/main/main.js**
- ✅ 初始化处理器: 使用 getInstance() 模式
- ✅ 登录处理器: 使用 loginByToken({ accountToken, accountId })
- ✅ 登出处理器: 使用 getInstance() 模式

### ✨ 新增特性

- 所有代码示例都添加了官方指南链接作为注释
- 文档中明确强调官方指南优先于 TypeDoc
- 添加了 getInstance() 必须性说明

### 🎯 影响范围

- **严重**: 所有现有项目必须 update getInstance() 初始化方式
- **重要**: 所有登录逻辑必须改用 loginByToken()
- **信息**: 所有后续功能扩展必须参考官方指南示例

---

## v1.1.0 - API 文档规范强制实施

### 🔴 重大变更

本次更新强制要求所有 NEMeetingKit API 调用**必须来自官方文档**。

### 问题修复

**修复的错误 API：**

| 错误方法 | 正确方式 | 说明 |
|--------|-------|------|
| `NEMeetingKit.createClient()` | 不需要，直接使用 `NEMeetingKit` | 该方法不存在于官方 SDK |
| `NEMeetingKit.init(appKey)` | `NEMeetingKit.initialize(config)` | 方法名错误、参数类型错误 |
| `NEMeetingKit.login()` | `getAccountService().login()` | 应通过服务调用 |
| `NEMeetingKit.logout()` | `getAccountService().logout()` | 应通过服务调用 |
| `await NEMeetingKit.startMeeting()` | `getMeetingService().startMeeting()` | 应通过服务调用 |

### 📝 文档更新

**1. SKILL.md**
- ✅ 在开头添加"API 文档规范"强制要求部分
- ✅ 更新"关键实现细节"中的代码示例，使用官方 API
- ✅ 添加"扩展指南"中的 API 验证规则
- ✅ 添加新的"常见 API 错误"部分，列出错误用法和正确用法对比
- ✅ 补充"常见服务速查表"

**2. README.md (templates)**
- ✅ 添加 API 文档规范部分
- ✅ 更新开发指南中的代码示例
- ✅ 添加"添加新功能前的检查清单"

**3. INDEX.md**
- ✅ 在最开头突出显示 API 文档规范要求
- ✅ 列出禁止使用的错误 API

**4. USAGE.md**
- ✅ 添加 API 文档规范说明
- ✅ 补充 Q5、Q6 关于 API 验证的常见问题

### 🔧 模板代码更新

**templates/src/main/main.js**
- ✅ 更新 SDK 初始化为使用 `NEMeetingKit.initialize(config)`
- ✅ 修复登录逻辑使用 `getAccountService().login()`
- ✅ 修复登出逻辑使用 `getAccountService().logout()`
- ✅ 添加官方文档链接作为代码注释
- ✅ 添加正确的返回值检查方式 (`result.code === 0`)

### ✨ 新增功能

**API 验证规则：**
- 新增明确的 API 来源要求（必须来自官方文档）
- 新增 API 不确定时的询问模板
- 新增常见 API 错误列表和对比表

**文档增强：**
- 新增 API 检查清单
- 新增常见服务速查表
- 新增错误 API 示例和正确实现对比

### 🎯 关键要求

1. **所有 API 必须来自官方文档**
   ```
   https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/
   ```

2. **当不确定 API 时**
   - 向用户询问官方文档
   - 不要凭空猜测方法签名
   - 不要使用未在文档中列出的方法

3. **代码中必须包含文档链接**
   ```javascript
   // 官方文档: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html#initialize
   await NEMeetingKit.initialize(config);
   ```

### 📚 官方资源

| 资源 | 链接 |
|-----|------|
| NEMeetingKit 接口文档 | https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html |
| NEMeetingKit TypeDoc 索引 | https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/modules.html |
| NEAccountService | https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html |
| NEMeetingService | https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingService.html |

### ✅ 验证清单

使用本 Skill 时，确保：

- [ ] 阅读了 SKILL.md 开头的"API 文档规范"部分
- [ ] 理解了官方文档的位置和结构
- [ ] 了解了哪些 API 是错误的（常见 API 错误部分）
- [ ] 在添加新功能前查看了官方文档
- [ ] 在代码中添加了官方文档链接

### 🚀 使用建议

**对于新用户：**
1. 首先读 INDEX.md 了解 API 规范
2. 再读 README.md 快速上手
3. 最后参考 SKILL.md 深入学习

**对于扩展功能：**
1. 在官方文档中查找要使用的方法
2. 确认参数和返回值类型
3. 参照 SKILL.md 中的"扩展指南"实现
4. 添加官方文档链接作为注释

---

**发布日期**: 2026 年 3 月  
**版本**: 1.1.0  
**状态**: ✅ 稳定版本
