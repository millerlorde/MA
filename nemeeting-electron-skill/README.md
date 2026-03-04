# 网易会议 Electron 项目生成器 Skill

这是一个 Claude Code / LobsterAI 的 skill，用于快速生成集成网易会议 NEMeetingKit SDK 的 Electron 项目模板。

## 功能特性

- 🚀 **一键生成**：快速创建完整的 Electron 项目
- 🔧 **SDK 集成**：自动集成 NEMeetingKit SDK 和配置管理
- 🎨 **现代化界面**：美观的响应式 UI，包含完整的会议功能
- 📦 **依赖自动安装**：自动安装所有必要的 npm 依赖
- 📚 **完整文档**：包含详细的 README 和 API 使用示例

## 生成的项目包含

1. **完整的 Electron 应用结构**（主进程、渲染进程、预加载脚本）
2. **NEMeetingKit SDK 集成**（初始化、登录、会议功能）
3. **配置管理系统**（使用 electron-store 持久化存储）
4. **现代化用户界面**（响应式设计，支持明暗主题）
5. **构建配置**（支持 electron-builder 打包）
6. **完整的错误处理和状态管理**
7. **详细的文档和示例代码**

## 使用方式

### 在 Claude Code / LobsterAI 中使用

1. 加载此 skill 到你的 Claude Code / LobsterAI 环境
2. 告诉 Claude：使用 `nemeeting-electron-starter` skill
3. 输入项目名称（如：`MyMeetingApp`）
4. 选择输出目录
5. Skill 将自动创建项目并安装依赖

### 命令行使用

```bash
# 进入 skill 目录
cd /path/to/skill

# 运行生成脚本
python3 scripts/create_nemeeting_project.py <project_name> [output_dir]

# 示例
python3 scripts/create_nemeeting_project.py MyMeetingApp ./projects
```

## 项目生成示例

```bash
$ python3 scripts/create_nemeeting_project.py MyMeetingApp

🎉 网易会议 Electron 项目生成器
==================================================
👉 创建项目目录: ./MyMeetingApp
👉 创建 package.json
👉 创建主进程文件 (main.js)
👉 创建预加载脚本 (preload.js)
👉 创建渲染进程脚本 (renderer.js)
👉 创建主界面 (index.html)
👉 创建样式文件 (styles.css)
👉 创建 .gitignore 文件
👉 创建 README.md 文档
👉 开始安装依赖...
👉 运行 npm install...
✅ 依赖安装成功
==================================================
✅ 项目创建成功: ./MyMeetingApp

📋 下一步操作:
1. 进入项目目录: cd MyMeetingApp
2. 启动应用: npm start
3. 配置你的网易会议 App Key

💡 提示: 如果依赖安装失败，请手动运行 'npm install'
==================================================
```

## 技能文件结构

```
nemeeting-electron-skill/
├── SKILL.md                    # Skill 描述文件（Claude 使用）
├── README.md                   # 本文件
├── LICENSE                     # MIT 许可证
├── .gitignore                  # Git 忽略文件
└── scripts/
    └── create_nemeeting_project.py  # 项目生成脚本
```

## 依赖要求

- Python 3.6+
- Node.js 16+
- npm 或 yarn
- 网络连接（用于下载依赖）

## 故障排除

### 常见问题

1. **Python 脚本执行失败**
   - 检查 Python 版本：`python3 --version`
   - 确保脚本有执行权限：`chmod +x scripts/create_nemeeting_project.py`

2. **npm 安装失败**
   - 检查网络连接
   - 尝试使用国内镜像：`npm config set registry https://registry.npmmirror.com`
   - 手动安装：进入项目目录运行 `npm install`

3. **Electron 下载失败**
   - Electron 可能需要科学上网或使用镜像
   - 尝试设置 Electron 镜像：`npm config set electron_mirror https://npmmirror.com/mirrors/electron/`

### 调试模式

在脚本执行时添加 `--verbose` 标志（如果支持），或直接查看脚本输出。

## 开发指南

### 扩展技能功能

1. 修改 `scripts/create_nemeeting_project.py` 中的模板函数
2. 更新 `SKILL.md` 中的技能描述
3. 测试修改：`python3 scripts/create_nemeeting_project.py TestProject --test`

### 添加新模板文件

1. 在脚本中添加新的文件生成函数
2. 在 `main()` 函数中调用新函数
3. 更新 README 文档

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 支持

如有问题或建议，请：
1. 查看 [NEMeetingKit SDK 文档](https://doc.yunxin.163.com/meetingkit/references/web/typedoc/Latest/zh/electron/modules.html)
2. 检查脚本错误输出
3. 提交 Issue 到项目仓库

---

**提示**：生成的项目的 App Key 和 Token 等敏感信息，请不要提交到版本控制系统！