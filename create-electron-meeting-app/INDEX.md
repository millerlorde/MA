# Electron 会议应用 Skill

## ⚠️ 最重要的规则

**所有使用或扩展的 NEMeetingKit API 都必须来自官方文档！**

```
官方文档: https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/
```

**禁止使用的错误 API：**
- ❌ `NEMeetingKit.createClient()` - 不存在！
- ❌ `NEMeetingKit.init()` - 应该用 `initialize()`
- ❌ `NEMeetingKit.login()` - 应该用 `getAccountService().login()`
- ❌ `NEMeetingKit.logout()` - 应该用 `getAccountService().logout()`

## 📌 所有文件汇总

本 Skill 包含以下文件和目录：

### 📄 文档文件

| 文件 | 用途 |
|-----|------|
| **SKILL.md** | Skill 详细文档 - 包含架构、实现、扩展指南、API 规范 |
| **README.md** | 使用指南 - 教用户如何使用该 Skill |
| **USAGE.md** | Copilot 使用指南 - 如何分发和使用该 Skill |
| **INDEX.md** | 本文件 - 快速导航 |

### 📦 项目模板 (templates/)

```
templates/
├── package.json                    # NPM 项目配置
├── README.md                       # 项目说明
├── .gitignore                      # Git 忽略配置
├── src/
│   ├── main/
│   │   └── main.js                # Electron 主进程（使用官方 API）
│   ├── preload/
│   │   └── preload.js             # 预加载脚本
│   └── renderer/
│       ├── index.html             # UI 界面
│       ├── renderer.js            # 前端逻辑
│       └── styles.css             # 样式文件
└── resources/                      # 应用资源目录
```

## 🎯 快速导航

### 我是想使用这个 Skill 创建应用

👉 **阅读**: [README.md](./README.md)

- 快速开始步骤
- 项目结构说明
- 常见任务示例

### 我是想了解 Skill 的详细内容

👉 **阅读**: [SKILL.md](./SKILL.md)

- 完整的项目架构
- 核心概念说明
- 功能流程和扩展指南

### 我是想分发这个 Skill 给其他用户

👉 **阅读**: [USAGE.md](./USAGE.md)

- 打包方法
- 分发步骤
- 用户安装指南

## 🚀 对于用户

### 方式 1: VS Code 中使用 Copilot

打开 VS Code Copilot，说：

```
根据 create-electron-meeting-app skill 创建我的会议应用
```

### 方式 2: 手动从模板创建

1. 复制 `templates/` 目录内容
2. 运行 `npm install`
3. 运行 `npm start`

## 📋 Skill 要点

| 方面 | 说明 |
|-----|------|
| **名称** | create-electron-meeting-app |
| **功能** | 创建基于 Electron + NEMeetingKit SDK 的会议应用 |
| **目标用户** | 需要快速构建会议客户端的开发者 |
| **核心特性** | SDK 初始化、用户登录、安全架构、可扩展设计 |
| **环境** | Node.js 14+, npm 6+ |
| **依赖** | Electron 31.4.0, NEMeetingKit SDK 4.19.3 |

## 📚 文件详解

### SKILL.md (完整文档)

这是 Skill 的核心文档，包含：

1. **概述** - Skill 用途和特性
2. **何时使用** - 触发关键词
3. **项目特性** - 核心功能列表
4. **项目结构** - 目录和文件说明
5. **核心概念** - 架构设计说明
6. **关键实现细节** - 每个模块的详细実装
7. **环境要求** - 依赖版本表
8. **安装和启动** - 初始化步骤
9. **功能流程** - 初始化和登录流程
10. **扩展指南** - 如何添加新功能
11. **调试技巧** - 开发和调试方法
12. **常见问题** - FAQ

**建议**: 想深入了解项目架构？读 SKILL.md

### README.md (使用指南)

用户友好的指南，包含：

- 快速安装步骤
- 项目结构图解
- 常见任务示例
- 打包应用指南
- 故障排除

**建议**: 想快速上手？读 README.md

### USAGE.md (分发指南)

为了分发 Skill 给其他用户，包含：

- Skill 基本信息
- Copilot 中的使用方式
- 打包和分发步骤
- 用户安装和使用指南
- 版本管理建议

**建议**: 想分发 Skill？读 USAGE.md

## 🎓 学习路径

### 初学者路径

1. 阅读 README.md 的"快速开始"部分
2. 根据 templates/ 创建项目
3. 运行 `npm install` 和 `npm start`
4. 尝试修改 UI（编辑 styles.css）

### 进阶开发者路径

1. 阅读 SKILL.md 的"核心概念"部分
2. 理解 Electron 三层进程模型
3. 学习 IPC 通信机制
4. 根据"扩展指南"添加新功能

### 架构设计者路径

1. 深入阅读 SKILL.md 的"关键实现细节"
2. 理解主进程、预加载脚本、渲染进程的职责
3. 分析安全隔离机制
4. 规划功能扩展架构

## 🔄 使用流程

```
┌─────────────────────────────────────────┐
│  用户说："创建会议应用"                   │
└──────────────────┬──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Copilot 识别 Skill  │
        │  自动读取 SKILL.md   │
        └──────────────┬───────┘
                       │
                       ▼
          ┌────────────────────────┐
          │  使用 templates/ 创建  │
          │  完整的项目结构        │
          └──────────────┬─────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  生成项目文件        │
              │  修改配置和样式      │
              └──────────────┬───────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │  项目创建完成    │
                   │  ready to use    │
                   └──────────────────┘
```

## 💼 企业应用场景

该 Skill 适用于以下场景：

✅ **快速原型开发** - 快速验证想法  
✅ **MVP 开发** - 用最少时间实现最小化产品  
✅ **内部工具** - 构建企业内部通讯工具  
✅ **教学示范** - Electron + SDK 集成示例  
✅ **二次开发** - 基础框架用于个性化开发  

## 🛠️ 技术支持

### 问题排查

1. **Copilot 识别不了 Skill?**
   - 检查文件位置：`~/.agents/skills/create-electron-meeting-app/`
   - 确保 SKILL.md 存在

2. **项目创建失败?**
   - 检查 Node.js 版本 >= 14
   - 检查 npm >= 6

3. **应用无法启动?**
   - 清空 node_modules：`rm -rf node_modules`
   - 重新安装：`npm install`

### 获取帮助

1. 查看 **SKILL.md** 的"常见问题"部分
2. 查看 **README.md** 的"故障排除"部分
3. 查看 **USAGE.md** 的常见问题

## 🎁 Skill 优势

✨ **完整性** - 包含从配置到打包的完整流程  
✨ **安全性** - 遵循 Electron 安全最佳实践  
✨ **扩展性** - 清晰的架构便于添加功能  
✨ **文档** - 详尽的文档和示例  
✨ **实战** - 基于真实项目经验  

## 📦 分发清单

在分发 Skill 前，请检查：

- [ ] 所有 4 个 markdown 文件完整
- [ ] templates/ 目录包含所有源代码
- [ ] 没有敏感信息（API 密钥等）
- [ ] 所有链接和路径正确
- [ ] 代码示例可以运行

## 📖 相关链接

内部文档：
- [Skill 详细文档](./SKILL.md)
- [使用指南](./README.md)
- [分发指南](./USAGE.md)

外部资源：
- [Electron 文档](https://www.electronjs.org/docs)
- [NEMeetingKit 文档](https://nemeeting.netease.com/)

## 🎉 总结

这个 Skill 提供了：

1. **完整的项目模板** - ready-to-use 的项目结构
2. **详细的文档** - 适合不同水平的开发者
3. **最佳实践** - Electron 安全和性能建议
4. **扩展支持** - 清晰的扩展指南

**现在就开始使用吧！**

---

**版本**: 1.0.0  
**创建日期**: 2026 年 3 月  
**维护者**: 您的团队
