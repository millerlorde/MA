---
name: nemeeting-electron-starter
description: 生成一个完整的 Electron 项目模板，用于快速接入网易会议 NEMeetingKit SDK。包含配置管理、用户登录、会议功能界面等完整实现。
license: MIT
official: false
---

# 网易会议 Electron 项目生成器

此 skill 用于生成一个完整的 Electron 项目模板，帮助开发者快速集成网易会议 NEMeetingKit SDK。

## 功能特性

- ✅ 自动创建完整的 Electron 项目结构
- ✅ 集成 NEMeetingKit SDK 并自动安装依赖
- ✅ 提供配置管理界面，支持 AppKey 持久化存储
- ✅ 实现用户登录（Token 登录）流程
- ✅ 提供会议功能界面框架（创建会议、加入会议、预约会议）
- ✅ 完整的错误处理和状态管理
- ✅ 详细的 README 文档和 API 使用示例

## 生成的项目包含

1. **Electron 主进程** (`src/main/main.js`) - 应用入口和窗口管理
2. **预加载脚本** (`src/preload/preload.js`) - 安全地暴露 API 给渲染进程
3. **渲染进程** (`src/renderer/renderer.js`) - 前端逻辑和 UI 交互
4. **主界面** (`src/renderer/index.html`) - 用户界面
5. **配置管理** - 使用 `electron-store` 持久化存储 AppKey 和用户配置
6. **NEMeetingKit SDK 集成** - 完整的初始化、登录、会议功能示例
7. **构建配置** - 支持 `electron-builder` 打包

## 使用说明

### 通过 Claude 使用

1. 告诉 Claude：使用 `nemeeting-electron-starter` skill
2. 输入项目名称（如：`MyMeetingApp`）
3. 选择输出目录（默认为当前目录）
4. Skill 将自动创建项目并安装依赖

### 命令行使用

```bash
# 进入 skill 目录
cd /path/to/skill

# 运行生成脚本
python3 scripts/create_nemeeting_project.py <project_name> [output_dir]
```

## 生成的项目结构

```
<project_name>/
├── package.json              # 项目配置和依赖
├── .gitignore               # Git 忽略文件
├── README.md                # 详细使用说明
├── src/
│   ├── main/
│   │   └── main.js          # Electron 主进程
│   ├── preload/
│   │   └── preload.js       # 预加载脚本
│   └── renderer/
│       ├── index.html       # 主界面
│       ├── renderer.js      # 前端逻辑
│       └── styles.css       # 样式文件
├── resources/               # 静态资源（图标等）
└── build/                   # 构建配置文件
```

## 生成后的操作

1. **安装依赖**（如果自动安装失败）：
   ```bash
   cd <project_name> && npm install
   ```

2. **启动应用**：
   ```bash
   npm start
   ```

3. **配置 AppKey**：
   - 在应用界面输入你的网易会议 AppKey
   - 应用会自动保存配置（支持"记住我"功能）

4. **登录测试**：
   - 输入 User UUID 和 Token 进行登录
   - 登录成功后可使用会议功能

## 注意事项

1. **环境要求**：
   - Node.js 16+
   - npm 或 yarn
   - Electron 25+

2. **网络要求**：
   - 需要能够访问 npm 仓库下载依赖
   - 需要能够连接网易会议服务器

3. **安全建议**：
   - 不要将 AppKey 和 Token 提交到版本控制系统
   - 使用环境变量或配置文件管理敏感信息

## API 文档参考

- [NEMeetingKit SDK 文档](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/modules.html)
- [Electron 文档](https://www.electronjs.org/docs)
- [electron-store 文档](https://github.com/sindresorhus/electron-store)

## 故障排除

1. **依赖安装失败**：
   - 检查网络连接
   - 尝试使用国内镜像：`npm config set registry https://registry.npmmirror.com`

2. **SDK 初始化失败**：
   - 确认 AppKey 是否正确
   - 检查网络是否能够访问网易会议服务器

3. **应用启动失败**：
   - 检查 Node.js 版本是否符合要求
   - 确认所有依赖已正确安装

## 许可证

MIT License - 详见 LICENSE 文件（如果提供）