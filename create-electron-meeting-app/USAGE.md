# Copilot Skill 使用指南

## ⚠️ 重要更新：API 文档规范

**本 Skill 现在强制要求所有 API 调用必须来自官方文档！**

### API 验证规则
- ✅ 所有调用的方法**必须**在官方文档中存在
- ✅ 参数和返回值**必须**按照文档实现
- ❌ 不要使用不存在的 API（如 `createClient()`, `init()`）
- ❌ 不要凭空猜测 API 签名

如果不确定 API，应该：
```
向用户询问 NEMeetingKit 下对应方法的完整官方文档
不要凭空猜测或使用文档中不存在的方法
```

## Skill 基本信息

| 项目 | 说明 |
|-----|------|
| **Skill 名称** | create-electron-meeting-app |
| **功能** | 创建基于 Electron + NEMeetingKit SDK 的会议应用 |
| **位置** | `~/.agents/skills/create-electron-meeting-app/` |
| **文档** | 见本目录下的 `SKILL.md` |
| **API 文档** | https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/ |

## 文件结构

```
~/.agents/skills/create-electron-meeting-app/
├── SKILL.md              # Skill 详细文档
├── README.md             # 使用指南
├── USAGE.md              # 本文件
└── templates/            # 项目模板
    ├── .gitignore
    ├── package.json
    └── src/
        ├── main/main.js
        ├── preload/preload.js
        └── renderer/
            ├── index.html
            ├── renderer.js
            └── styles.css
```

## GitHub Copilot 中的使用

### 触发关键词

Copilot 会在以下情况自动识别并使用这个 Skill：

- "创建 Electron 会议应用"
- "创建网易会议应该"
- "基于 NEMeetingKit 创建桌面应用"
- "集成会议 SDK 的应用"
- "创建会议客户端"
- "Electron 会议应用"

### 使用方式

#### 方式 1: 直接要求创建应用

```
请创建一个基于 NEMeetingKit SDK 的 Electron 会议应用
```

Copilot 会：
1. 自动识别 `create-electron-meeting-app` skill
2. 读取 SKILL.md 了解项目架构
3. 使用 templates 中的模板创建项目
4. 生成完整的项目文件

#### 方式 2: 要求基于 Skill 创建

```
根据 create-electron-meeting-app skill 创建我的项目
```

#### 方式 3: 询问功能何时使用

```
什么时候应该使用 create-electron-meeting-app skill?
```

Copilot 会根据 SKILL.md 中的"何时使用"部分给出回答。

## Skill 文档说明

### SKILL.md 内容

SKILL.md 是 Skill 的完整文档，包括：

**1. 概述**
- Skill 的用途和特性
- 适用场景

**2. 何时使用**
- 关键触发词
- 使用场景描述

**3. 项目特性**
- 功能列表
- 技术栈

**4. 项目结构**
- 目录树
- 文件说明

**5. 核心概念**
- Electron 进程模型
- SDK 初始化流程
- IPC 通信机制

**6. 关键实现细节**
- 主进程说明
- 预加载脚本说明
- 渲染进程说明

**7. 环境要求**
- 依赖版本

**8. 安装和启动**
- 项目初始化步骤

**9. 功能流程**
- 初始化流程图
- 登录流程图

**10. 扩展指南**
- 添加 IPC 通道
- 会议功能扩展示例

**11. 调试技巧**
- 日志查看
- 开发者工具使用

**12. 常见问题**
- FAQ 列表

## 分发给其他用户

### 第一步：整理 Skill 文件

确保以下文件完整：

```bash
ls -la ~/.agents/skills/create-electron-meeting-app/
```

应该包含：
- ✓ SKILL.md
- ✓ README.md
- ✓ USAGE.md
- ✓ templates/

### 第二步：打包 Skill

将整个目录打包为 zip 或 tar.gz：

```bash
# 方式 1: 创建 zip 文件
cd ~/.agents/skills
zip -r create-electron-meeting-app.zip create-electron-meeting-app/

# 方式 2: 创建 tar.gz 文件
tar -czf create-electron-meeting-app.tar.gz create-electron-meeting-app/
```

### 第三步：分发给用户

#### 通过邮件分发

```
请将打包的文件（如 create-electron-meeting-app.zip）发送给用户
```

#### 用户安装步骤

用户收到文件后：

1. **解压文件**

```bash
# 使用 zip 的情况
unzip create-electron-meeting-app.zip

# 使用 tar.gz 的情况
tar -xzf create-electron-meeting-app.tar.gz
```

2. **复制到 skills 目录**

```bash
# 获取 skills 目录位置
echo ~/.agents/skills

# 复制 skill
cp -r create-electron-meeting-app ~/.agents/skills/
```

3. **验证安装**

```bash
ls ~/.agents/skills/create-electron-meeting-app/SKILL.md
```

4. **在 Copilot 中使用**

在 VS Code 中打开 Copilot，输入相关关键词即可使用。

## Skill 的自定义

用户可以根据需要自定义 Skill：

### 修改项目模板

编辑 `templates/` 目录中的文件来修改默认模板。

### 更新文档

编辑 `SKILL.md` 来说明自定义的内容。

### 添加自定义模板

可以在 templates 目录中添加额外的示例或配置：

```
templates/
├── basic/              # 基础模板
├── advanced/           # 高级模板（包含更多功能）
└── with-database/      # 带数据库的模板
```

## 分发清单

分发 Skill 前，请检查：

- [ ] SKILL.md 完整且清晰
- [ ] README.md 提供了使用说明
- [ ] templates/ 目录中的所有模板文件完整
- [ ] 所有 require/import 路径正确
- [ ] package.json 依赖版本正确
- [ ] 文档中的示例代码可运行
- [ ] 没有包含敏感信息（API 密钥等）

## 常见问题

### 常见问题

### Q1: 如何更新已发布的 Skill?

A: 
1. 修改本地的 Skill 文件
2. 重新打包
3. 通知用户更新

用户可以直接替换 `~/.agents/skills/create-electron-meeting-app/` 目录。

### Q2: 用户说 Skill 没有被识别？

A:
1. 检查是否复制到了正确的目录：`~/.agents/skills/`
2. 确认 SKILL.md 文件存在且格式正确
3. 让用户重启 VS Code

### Q3: 如何修改 Skill 的触发词？

A:
编辑 SKILL.md 中的"何时使用"部分，列出所有触发词。

### Q4: 能否在网络上分享 Skill？

A:
可以，建议：
1. 上传到 GitHub
2. 提供清晰的安装说明
3. 在 README 中明确说明 API 文档要求

### Q5: API 验证失败怎么办？

A:
如果用户要求使用官方文档中不存在的 API，应该：
1. 要求用户提供完整的 API 文档
2. 确认该方法确实在官方文档的 NEMeetingKit 或相关服务中
3. 确认参数和返回值完全一致
4. 才能在代码中使用

### Q6: 如何处理用户提供的自定义 API？

A:
如果用户说"我有一个自定义 SDK 版本，有额外的方法"，应该：
1. 要求用户提供该 SDK 版本的完整 API 文档或 TypeScript 类型定义
2. 根据文档实现，不要凭空猜测
3. 在注释中添加文档链接

## 技术支持

### 用户遇到问题时的排查步骤

1. **检查 Skill 文件完整性**
   ```bash
   ls -R ~/.agents/skills/create-electron-meeting-app/
   ```

2. **检查 VS Code 插件版本**
   - 打开 Extensions，搜索 "GitHub Copilot"
   - 确保已启用

3. **重启 VS Code**
   - 关闭并重新打开 VS Code

4. **查看 Copilot 日志**
   - 在 Copilot 聊天窗口查看是否有错误提示

5. **测试 Skill 触发**
   - 尝试输入明确的关键词
   - 观察 Copilot 的响应

## 版本管理

建议在 Skill 中维护版本信息：

```markdown
# 版本历史

## v1.1.0 (最新)
- 加入国际化支持
- 优化会议功能

## v1.0.0 
- 初始版本
- 基础 SDK 集成和登录
```

## 相关资源

- [GitHub Copilot 文档](https://github.com/features/copilot)
- [NEMeetingKit 文档](https://nemeeting.netease.com/)
- [Electron 官方文档](https://www.electronjs.org/docs)
- [Skill 最佳实践指南](./SKILL.md)

---

**最后更新**: 2026 年 3 月  
**版本**: 1.0.0  
**维护者**: 您的团队
