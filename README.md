# neo-browser-home

A customizable browser newtab extension built with Vite + React 18 + TypeScript + Tailwind CSS v4, targeting Manifest V3.

> 📄 中文文档：See [README_zh.md](./README_zh.md)

## Preview

### Solid Color Mode
![Solid Color Mode](https://files.seeusercontent.com/2026/04/11/k3cG/2026-04-11-204138.png)

### Settings Panel
![Settings Panel](https://files.seeusercontent.com/2026/04/11/Xgv2/2026-04-11-204237.png)

### Image Background Mode
![截屏2026-04-12 19.49.35.png](https://files.seeusercontent.com/2026/04/12/x6Nz/2026-04-12-194935.png)

### Countdown
![截屏2026-04-12 20.55.23.png](https://files.seeusercontent.com/2026/04/12/Oj9r/2026-04-12-205523.png)

## Features

- 🖼️ **Full-screen background** — image or solid color
- 🔍 **Multi-engine search** — Google / Bing / Baidu / DuckDuckGo
- ⏱️ **Live clock** — iOS-style flip animation, seconds in subscript
- 📅 **Countdown** — multiple events with emoji, add/remove/reorder
- 💾 **Local storage** — all data persisted in localStorage
- 📤 **Import/Export** — backup and restore all settings in one click

## Tech Stack

| Layer | Tech |
|-------|------|
| Build | Vite 5 + @samrum/vite-plugin-web-extension |
| Framework | React 18 + TypeScript |
| Styles | Tailwind CSS v4 |
| Spec | Manifest V3 |
| Package Manager | pnpm (Node 22) |

## Quick Start

### Download & Install (Recommended)

Go to [Releases](../../releases) and download the latest `.zip` file, then:

1. Open `edge://extensions/` (or `chrome://extensions/`)
2. Enable **Developer mode** (top right)
3. Drag the `.zip` file into the page and drop it, or click **Load unpacked** after extracting the zip
4. Open a new tab — done

> The zip is automatically built and attached to each release via GitHub Actions.

### Build from Source

```bash
# Install dependencies
pnpm install

# Development (watch mode)
pnpm watch

# Production build
pnpm build
```

## Load Extension

### Edge / Chrome

1. Open `edge://extensions/` (or `chrome://extensions/`)
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the project's `dist/` directory
5. Open a new tab — done

### One-command debug (Edge)

```bash
pnpm serve:edge
```

### Keyboard Shortcut

Open new tab: **`Alt + Shift + H`**

Customize at `edge://extensions/shortcuts`.

## Project Structure

```
src/
├── components/
│   ├── Clock.tsx          # Live clock (flip animation)
│   ├── SearchBar.tsx       # Multi-engine search
│   ├── CountdownPanel.tsx  # Event countdown
│   └── SettingsPanel.tsx    # Settings panel
├── hooks/
│   └── use-app-data.ts     # localStorage data hook
├── entries/
│   ├── background/main.ts   # Service Worker (icon click → newtab)
│   └── newtab/             # New tab entry
│       ├── App.tsx
│       ├── main.tsx
│       └── index.html
├── manifest.ts            # MV3 manifest definition
├── types.ts               # TypeScript types
└── index.css             # Global styles + animation keyframes
```

## Dev Notes

- Install deps: `nvm use 22 && pnpm add ...`
- Build output in `dist/`, do not commit
- All animation keyframes declared in `src/index.css`
