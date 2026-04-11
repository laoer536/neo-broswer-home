# neo-browser-home

自定义浏览器首页插件，基于 Vite + React 18 + TypeScript + Tailwind CSS v4，Manifest V3。

> 📄 English documentation: See [README.md](./README.md)

## 预览

### 纯色模式
![纯色模式](https://files.seeusercontent.com/2026/04/11/k3cG/2026-04-11-204138.png)

### 设置面板
![设置面板](https://files.seeusercontent.com/2026/04/11/Xgv2/2026-04-11-204237.png)

### 图片背景模式
![图片背景模式](https://files.seeusercontent.com/2026/04/11/gzY9/2026-04-11-204302.png)

## 功能特性

- 🖼️ **全屏背景** — 支持图片和纯色自由切换
- 🔍 **多引擎搜索** — Google / Bing / 百度 / DuckDuckGo 一键切换
- ⏱️ **实时时钟** — iOS 翻页数字动画，秒数下标配角标
- 📅 **倒计时** — 多个关键日期倒计时，支持增删和 emoji 标识
- 💾 **数据托管** — 全量数据存储于 localStorage
- 📤 **导入导出** — 一键备份和恢复所有配置

## 技术栈

| 层面 | 技术 |
|------|------|
| 构建 | Vite 5 + @samrum/vite-plugin-web-extension |
| 框架 | React 18 + TypeScript |
| 样式 | Tailwind CSS v4 |
| 规范 | Manifest V3 |
| 包管理 | pnpm（Node 22） |

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发构建（watch 模式）
pnpm watch

# 生产构建
pnpm build
```

## 加载扩展

### Edge / Chrome

1. 打开 `edge://extensions/`（Chrome 用 `chrome://extensions/`）
2. 开启右上角「**开发人员模式**」
3. 点击「**加载解压缩的扩展**」
4. 选择项目 `dist/` 目录
5. 打开新标签页即可看到效果

### 一键调试（Edge）

```bash
pnpm serve:edge
```

### 快捷键

打开新标签页：**`Alt + Shift + H`**

可在 `edge://extensions/shortcuts` 自定义。

## 项目结构

```
src/
├── components/
│   ├── Clock.tsx          # 实时时钟（翻页动画）
│   ├── SearchBar.tsx       # 多引擎搜索框
│   ├── CountdownPanel.tsx  # 倒计时管理
│   └── SettingsPanel.tsx    # 设置面板
├── hooks/
│   └── use-app-data.ts     # 数据读写 hook
├── entries/
│   ├── background/main.ts   # Service Worker（点击图标跳转）
│   └── newtab/             # 新标签页主入口
│       ├── App.tsx
│       ├── main.tsx
│       └── index.html
├── manifest.ts            # MV3 manifest 定义
├── types.ts               # 类型定义
└── index.css              # 全局样式 + 动画声明
```

## 开发规范

- 下载依赖：`nvm use 22 && pnpm add ...`
- 构建产物在 `dist/`，无需提交
- 所有动画声明统一放在 `src/index.css`
