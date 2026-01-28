const {
    app,
    BrowserWindow,
    Tray,
    Menu,
    ipcMain,
    nativeImage,
    screen
} = require('electron');
const path = require('path');

let tray = null;
let mainWindow = null;

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 600,
        show: false,
        frame: false,
        resizable: false,
        skipTaskbar: true,
        alwaysOnTop: true,
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
