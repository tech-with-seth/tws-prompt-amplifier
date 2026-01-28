# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Prompt Amplifier is a system tray-based Electron application that enhances user prompts using OpenAI's GPT-4. The app lives in the system tray for quick access, provides a frameless popup window for interaction, and uses vanilla JavaScript with inline styles.

## Development Commands

- `npm install` - Install dependencies (requires Node.js 18+)
- `npm start` - Run the Electron app in development mode
- `npm run build` - Build distributable packages using electron-builder (outputs to `dist/`)

## Architecture

### Two-Process Model

This is a standard Electron app with two distinct processes:

1. **Main Process** (`main.js`): Manages app lifecycle, system tray, window positioning, and IPC communication
2. **Renderer Process** (`index.html`): Contains all UI, styling (inline CSS), and client-side logic including OpenAI API calls

### Key Design Patterns

- **Tray-First Design**: The app uses `skipTaskbar: true` and lives exclusively in the system tray. On macOS, the dock is hidden via `app.dock.hide()`
- **Single Instance Lock**: Uses `app.requestSingleInstanceLock()` to ensure only one instance runs at a time
- **Frameless Window**: The popup window is frameless (`frame: false`) with custom title bar and positioning logic
- **Auto-Hide Behavior**: Window hides on blur and prevents quit on close (unless `app.isQuitting` flag is set)
- **Window Positioning**: `positionWindowNearTray()` contains platform-specific logic to position the popup near the tray icon

### Data Storage

- **API Key**: Stored in renderer's `localStorage` as `openai_api_key`
- **System Prompt**: Stored in renderer's `localStorage` as `system_prompt`
- **Security Note**: The renderer has `nodeIntegration: true` and `contextIsolation: false` to enable direct Node.js API access and localStorage persistence

### OpenAI Integration

- Uses `openai` npm package v4.24.0
- API calls happen entirely in the renderer process with `dangerouslyAllowBrowser: true`
- Default model: `gpt-5.2`
- Temperature: 0.7, Max completion tokens: 1500
- System prompt is fully customizable via settings panel

## File Structure

```
main.js                    - Main process (app lifecycle, tray, window)
index.html                 - Renderer process (UI, CSS, logic)
create-icon.js            - Utility to generate tray icons
create-template-icon.js   - Utility for macOS template icons
icon.png                  - Main tray icon
iconTemplate.png          - macOS template icon
package.json              - Dependencies and build config
```

## IPC Communication

The renderer sends two IPC messages to the main process:

- `hide-window` - Hides the window (triggered by ESC key or close button)
- `quit-app` - Quits the application entirely

## Keyboard Shortcuts

Implemented in renderer's `keydown` event listener:

- `Cmd/Ctrl + Enter` - Trigger prompt amplification
- `Escape` - Hide window

## Styling Conventions

- Uses Google Fonts: "Rajdhani" (body) and "Share Tech Mono" (headers/mono text)
- Color scheme: Neon amber/orange (`#f59e0b`) on black backgrounds
- Extensive use of CSS custom properties (`:root` variables)
- Animations: pulse, flicker, spin, slideDown, processing
- Custom scrollbar styling for webkit browsers

## Testing

No automated tests exist. Manual testing checklist:

1. Tray icon appears in system tray
2. Click tray to open/close window
3. Window positions correctly near tray
4. Settings panel opens/closes
5. API key persists across sessions
6. Prompt amplification works with valid API key
7. Copy button copies output to clipboard
8. Keyboard shortcuts work (Cmd+Enter, Escape)
9. Window auto-hides on blur

## Build Configuration

The `package.json` includes electron-builder configuration for three platforms:

- **macOS**: Category set to "productivity"
- **Windows**: Targets NSIS installer
- **Linux**: Targets AppImage

## Commit Style

Follow Conventional Commits format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
