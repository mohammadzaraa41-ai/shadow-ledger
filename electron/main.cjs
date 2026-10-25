const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 520,
    height: 940,
    minWidth: 440,
    minHeight: 700,
    backgroundColor: '#000000',
    title: 'Shadow Ledger — Death Note Deduction',
    icon: path.join(__dirname, '../public/detective_avatar.jpg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    autoHideMenuBar: true,
    show: false,
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  const devUrl = 'http://localhost:5174';

  if (isDev) {
    mainWindow.loadURL(devUrl).catch(() => {
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Steamworks IPC Bridge (stubbed for development, plugs directly into steamworks.js)
ipcMain.handle('steam:unlockAchievement', async (_event, achievementId) => {
  console.log(`[Steamworks] Unlocking achievement: ${achievementId}`);
  // When running inside real Steam runtime:
  // const steamworks = require('steamworks.js');
  // const client = steamworks.init(APP_ID);
  // client.achievement.activate(achievementId);
  return { success: true, achievementId };
});

ipcMain.handle('steam:getStats', async () => {
  return { isSteamRunning: false, currentAppId: '2987110' };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
