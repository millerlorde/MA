# NEMeetingKit Electron 应用 Skill - 文档索引

## 快速导航

👤 **新用户？** 从这里开始：
1. 阅读 [USAGE.md](USAGE.md) - 了解如何使用 Skill
2. 查看 [README.md](README.md) - 项目特性和快速概览
3. 参考 [SKILL.md](SKILL.md) - 详细规则和 API 文档

👨‍💻 **开发者？** 参考这些文档：
1. [SKILL.md](SKILL.md) - 核心规则和 API 验证流程
2. [templates/README.md](templates/README.md) - 模板文件结构说明
3. [CHANGELOG.md](CHANGELOG.md) - 版本历史和更新说明

## 文件说明

| 文件 | 说明 | 用途 |
|------|------|------|
| [README.md](README.md) | Skill 简介 | 快速了解 Skill 功能 |
| [SKILL.md](SKILL.md) | 核心规范（**必读**） | 了解 API 规则和扩展流程 |
| [USAGE.md](USAGE.md) | 详细使用指南 | 学习如何使用 Skill |
| [CHANGELOG.md](CHANGELOG.md) | 版本历史 | 查看更新和版本信息 |
| [templates/](templates/) | 项目模板目录 | 查看模板文件 |
| 本文件 | 快速导航 | 找到你需要的文档 |

## 关键概念

### 官方 TypeDoc（最重要）

所有 API 都必须来源于：
```
https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/
```

如果 API 找不到，**必须向用户询问官方文档**。

### 核心规则（摘录）

1. **API 必须在 TypeDoc 中存在**
2. **如果不存在，询问用户提供文档**
3. **参数类型必须与 TypeDoc 匹配**
4. **代码注释必须包含 TypeDoc 链接**
5. **SDK 初始化、登录、登出代码不可改变**

详见 [SKILL.md](SKILL.md#核心规则必读)

## 常用 API 参考

### NEMeetingKit 主接口
- 文档：https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingKit.html
- 核心方法：
  - `getInstance()` - 获取 SDK 单例
  - `initialize(config)` - 初始化 SDK

### NEAccountService 账户服务
- 文档：https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEAccountService.html
- 核心方法：
  - `loginByToken(userUuid, token)` - 用户登录（两个参数）
  - `logout()` - 用户登出

### NEMeetingService 会议服务  
- 文档：https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/interfaces/NEMeetingService.html
- 核心方法：
  - `startMeeting(param)` - 启动会议
  - `joinMeeting(param)` - 加入会议
  - `endMeeting()` - 结束会议

完整参考见 [SKILL.md 中的"API 查询速查表"](SKILL.md#api-查询速查表)

## 常见问题

**Q: Skill 的访问路径是什么？**  
A: `/Users/mashiqing01/.agents/skills/nemeeting-electron-app/`

**Q: 我想为这个 Skill 添加新功能，怎么做？**  
A: 按照 [SKILL.md 中的"规则"](SKILL.md#核心规则必读) 部分执行，确保所有 API 都来源于官方 TypeDoc。

**Q: 生成的项目如何运行？**  
A: 参考 [USAGE.md 中的"快速开始"](USAGE.md#如何使用此-skill)

**Q: loginByToken 为什么使用两个参数？**  
A: 这是官方 TypeDoc 中定义的方法签名，[详见 SKILL.md](SKILL.md#核心实现不可改变)

**Q: 能修改 SDK 初始化或登录的代码吗？**  
A: 不可以，这些是核心接口，必须保持不变以确保兼容性和稳定性。

## 快速链接

- 🚀 [开始使用](USAGE.md#如何使用此-skill)
- 📖 [完整规范](SKILL.md)
- 📋 [模板文件](templates/)
- 💬 [常见问题](SKILL.md#常见问题)
- 📝 [更新历史](CHANGELOG.md)

## 官方资源

| 资源 | 链接 |
|------|------|
| NEMeetingKit 主页 | https://doc.yunxin.163.com/meetingkit/ |
| TypeDoc 首页 | https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/ |
| Electron 官方文档 | https://www.electronjs.org/docs |

---

**版本**: v1.0.0  
**最后更新**: 2026-03-05  
**维护者**: NEMeetingKit Skill Team  
**许可证**: MIT
