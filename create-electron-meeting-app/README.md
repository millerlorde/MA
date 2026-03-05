# 使用 Skill 创建 Electron 会议应用

本指南说明如何使用本 Skill 快速创建基于 NEMeetingKit SDK 的 Electron 会议应用。

## 目录结构

```
create-electron-meeting-app/
├── SKILL.md                          # Skill 详细文档
├── templates/                        # 项目模板
│   ├── package.json                 # NPM 依赖配置
│   ├── src/
│   │   ├── main/
│   │   │   └── main.js             # Electron 主进程
│   │   ├── preload/
│   │   │   └── preload.js          # 预加载脚本
│   │   └── renderer/
│   │       ├── index.html          # 主 UI 文件
│   │       ├── renderer.js         # 前端逻辑
│   │       └── styles.css          # 样式文件
│   └── resources/                  # 应用资源目录
└── README.md                        # 本文件

```

## 快速使用

### 方法 1：使用 Copilot Skill

在 VS Code 中，使用 Copilot 对话框：

```
请根据 create-electron-meeting-app skill 创建我的网易会议应用
```

Copilot 会自动根据 Skill 中的模板生成完整项目。

### 方法 2：手动复制模板

1. **复制 templates 目录内容到新项目**

```bash
mkdir MyMeetingApp
cp -r templates/* MyMeetingApp/
cd MyMeetingApp
```

2. **安装依赖**

```bash
npm install
```

3. **启动开发环境**

```bash
npm start
```

## 项目配置

修改以下文件中的项目信息：

### package.json

```json
{
  "name": "your-app-name",           // 应用名称
  "description": "您的应用描述",      // 应用描述
  "author": "您的名字"               // 作者名
}
```

## 环境要求

- **Node.js**: 14.0 及以上
- **npm**: 6.0 及以上
- **Electron**: 31.4.0（自动安装）
- **NEMeetingKit SDK**: 4.19.3（自动安装）

## 获取 App Key

要运行应用，需要获取网易会议的 App Key：

1. 访问 [网易会议开发者平台](https://app.yunxin.163.com/)
2. 创建开发者账号
3. 创建应用，获取 App Key
4. 在应用首次启动时输入 App Key

## 项目架构

### 三层进程模型

```
┌─────────────────┐
│  主进程 Main    │ - SDK 初始化和管理
│   process       │ - IPC 消息处理
└────────┬────────┘
         │ IPC
┌────────▼────────┐
│  预加载 Preload │ - 安全 API 暴露
│   process       │ - 进程间通信桥接
└────────┬────────┘
         │
┌────────▼────────┐
│  渲染进程       │ - UI 界面
│  Renderer       │ - 用户交互
│  process        │ - 调用 API
└─────────────────┘
```

### 关键文件功能

| 文件 | 功能 |
|-----|------|
| `main.js` | SDK 初始化、IPC 处理、窗口管理 |
| `preload.js` | 安全 API 暴露、进程隔离 |
| `index.html` | 用户界面 HTML 结构 |
| `renderer.js` | 前端逻辑、状态管理、事件处理 |
| `styles.css` | 应用样式、响应式设计 |

## 常见任务

### 1. 添加新的 IPC 通道

**在 main.js 中添加：**

```javascript
ipcMain.handle('my-feature', async (event, param) => {
  try {
    // 实现功能
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

**在 preload.js 中暴露：**

```javascript
const electronAPI = {
  myFeature: (param) => ipcRenderer.invoke('my-feature', param)
};
```

**在 renderer.js 中使用：**

```javascript
const result = await window.electronAPI.myFeature(param);
```

### 2. 修改 UI 主题

编辑 `styles.css` 中的颜色变量：

```css
/* 主题色 - 修改这里 */
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}
```

### 3. 启用开发者工具

在 `main.js` 中启用：

```javascript
if (process.env.NODE_ENV === 'development') {
  mainWindow.webContents.openDevTools();
}
```

### 4. 添加会议功能

示例：启动会议

```javascript
// 在 main.js 的 IPC 处理器中
ipcMain.handle('start-meeting', async (event, meetingId, displayName) => {
  try {
    const result = await NEMeetingKit.startMeeting({
      meetingId,
      displayName
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

## 打包应用

### macOS 打包

```bash
npm run pack:mac
```

输出：`dist/MyMeetingApp-*.dmg`

### Windows 打包

```bash
npm run pack:win
```

输出：`dist/MyMeetingApp Setup *.exe`

### Linux 打包

```bash
npm run pack:linux
```

输出：`dist/MyMeetingApp-*.AppImage`

## 故障排除

### 问题 1: SDK 初始化失败

**检查项：**
- ✓ App Key 是否正确
- ✓ 网络连接是否正常
- ✓ SDK 版本是否最新

```bash
npm list nemeeting-electron-sdk
```

### 问题 2: 登录失败

**检查项：**
- ✓ User UUID 格式是否正确
- ✓ Token 是否过期
- ✓ 用户是否有权限使用应用

### 问题 3: 应用无法启动

**尝试：**

```bash
# 清除 node_modules 并重新安装
rm -rf node_modules
npm install

# 检查 Electron 是否正确安装
npm list electron
```

### 问题 4: IPC 通信错误

**检查：**
- ✓ preload.js 中是否正确暴露了 API
- ✓ main.js 中是否注册了对应的处理器
- ✓ renderer.js 中调用时是否使用了 `window.electronAPI`

## 开发建议

1. **使用开发者工具** - F12 打开开发者工具进行调试
2. **查看控制台日志** - 检查 main.js 的控制台输出
3. **逐步测试** - 先测试 SDK 初始化，再测试登录
4. **模块化代码** - 将功能模块化便于维护和扩展
5. **错误处理** - 添加完善的错误处理和用户提示

## 提交反馈

如遇到问题或有改进建议，请：

1. 检查本 README 中的故障排除部分
2. 查看 SKILL.md 中的完整文档
3. 检查网易会议 SDK 文档

## 许可证

MIT License - 可自由使用、修改和分发

---

**版本**: 1.0.0  
**最后更新**: 2026 年 3 月  
**维护者**: 您的团队
