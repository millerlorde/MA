# 项目模板文件说明

此目录包含 NEMeetingKit Electron 应用的项目模板文件。

## 文件结构

生成项目时，这些模板文件应该按以下目录结构组织：

```
YourProjectName/
├── src/
│   ├── main/
│   │   └── main.js              # main.js
│   ├── preload/
│   │   └── preload.js           # preload.js
│   └── renderer/
│       ├── index.html           # index.html（放在 src/renderer/ 下）
│       ├── renderer.js          # renderer.js（放在 src/renderer/ 下）
│       └── styles.css           # styles.css（放在 src/renderer/ 下）
├── package.json                 # package.json（放在根目录）
├── .instructions.md             # 快速开始指南
├── copilot-instructions.md      # Copilot 工作指南
└── SKILL.md                     # 项目 Skill 文档
```

## 模板文件说明

| 文件 | 位置 | 说明 |
|-----|------|------|
| `main.js` | `src/main/` | Electron 主进程，包含 SDK 初始化、IPC 处理 |
| `preload.js` | `src/preload/` | 预加载脚本，暴露安全的 IPC API |
| `index.html` | `src/renderer/` | UI 主页面 |
| `renderer.js` | `src/renderer/` | 前端逻辑和事件处理 |
| `styles.css` | `src/renderer/` | 样式文件 |
| `package.json` | `根目录` | npm 依赖配置（必须包含 `"type": "module"`） |

## 注意事项

1. **package.json 必须有 `"type": "module"`** - 这是使用 ES Module 的必要配置
2. **main.js 中的文件路径使用相对路径** - 确保文件位置正确
3. **所有 IPC 处理的注释都包含 TypeDoc 链接** - 用于快速查询官方文档

## 使用步骤

1. 创建新项目目录
2. 复制这些模板文件到相应位置
3. 运行 `npm install` 安装依赖
4. 运行 `npm start` 启动开发环境
5. 输入 App Key、UUID 和 Token 进行测试

## 扩展指南

添加新功能时，请参考 SKILL.md 中的"规则"和"扩展指南"部分，确保：
- 所有 API 来源于官方 TypeDoc
- 代码注释包含文档链接
- 遵循 IPC 通信规范
