const {
    app,
    BrowserWindow,
    Tray,
    Menu,
    ipcMain,
    nativeImage,
    screen,
    dialog
} = require('electron');
const fs = require('fs');

let tray = null;
let mainWindow = null;

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
}

function createWindow() {
    mainWindow = new BrowserWindow({
        alwaysOnTop: true,
        frame: false,
        resizable: true,
        show: false,
        skipTaskbar: true,
        minHeight: 600,
        height: 600,
        minWidth: 400,
        width: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');

    // Hide window when it loses focus
    mainWindow.on('blur', function () {
        if (mainWindow && !mainWindow.webContents.isDevToolsOpened()) {
            mainWindow.hide();
        }
    });

    // Prevent window from being destroyed, just hide it
    mainWindow.on('close', function (event) {
        if (!app.isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });
}

function createTray() {
    // Use empty image and rely on title text
    const icon = nativeImage.createEmpty();
    tray = new Tray(icon);
    tray.setTitle('⚡');
    tray.setToolTip('Prompt Amplifier');

    // Left-click toggles window
    tray.on('click', function () {
        toggleWindow();
    });

    // Right-click shows quit menu
    tray.on('right-click', function () {
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Quit',
                click: function () {
                    app.isQuitting = true;
                    app.quit();
                }
            }
        ]);
        tray.popUpContextMenu(contextMenu);
    });
}

function toggleWindow() {
    if (mainWindow.isVisible()) {
        mainWindow.hide();
    } else {
        positionWindowNearTray();
        mainWindow.show();
        mainWindow.focus();
    }
}

function positionWindowNearTray() {
    const trayBounds = tray.getBounds();
    const windowBounds = mainWindow.getBounds();
    const screenBounds = screen.getPrimaryDisplay().workAreaSize;

    // macOS: tray is at top, position window below it
    let x = Math.round(
        trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    );
    let y = Math.round(trayBounds.y + trayBounds.height + 4);

    // Keep window on screen
    x = Math.max(0, Math.min(x, screenBounds.width - windowBounds.width));
    y = Math.max(0, Math.min(y, screenBounds.height - windowBounds.height));

    mainWindow.setPosition(x, y, false);
}

// App ready
app.whenReady().then(function () {
    // Hide dock icon (tray-only app)
    app.dock.hide();

    createWindow();
    createTray();
});

// Handle second instance - show existing window
app.on('second-instance', function () {
    if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
    }
});

app.on('window-all-closed', function () {
    // Do nothing - keep app running in tray
});

app.on('before-quit', function () {
    app.isQuitting = true;
});

// IPC handlers for renderer process
ipcMain.on('hide-window', function () {
    if (mainWindow) {
        mainWindow.hide();
    }
});

ipcMain.on('quit-app', function () {
    app.isQuitting = true;
    app.quit();
});

// Save prompt to file handler
ipcMain.handle('save-prompt', async function (event, content) {
    const result = await dialog.showSaveDialog(mainWindow, {
        title: 'Save Amplified Prompt',
        defaultPath: 'amplified-prompt.md',
        filters: [
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'Markdown', extensions: ['md'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    if (result.canceled || !result.filePath) {
        return { success: false, canceled: true };
    }

    try {
        fs.writeFileSync(result.filePath, content, 'utf8');
        return { success: true, filePath: result.filePath };
    } catch (err) {
        return { success: false, error: err.message };
    }
});
