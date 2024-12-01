'use strict';

import { app, protocol, BrowserWindow, ipcMain, Tray, Menu, dialog } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import fs from 'fs';
import path from 'path';
const isDevelopment = process.env.NODE_ENV !== 'production';
const activeWin = require('active-win');

const programmingKeywords = ['python', 'programming', 'coding', 'syntax', 'algorithm', 'tutorial', 'data structures'];
const workRelatedTerms = ['colab', 'focus-bloom']; 
const ideApplications = ['visual studio code', 'pycharm', 'jupyter notebook'];
const allowedActivities = ['microsoft forms', 'google drive'];
const taskFileRegex = /\.py$/;

function normalizeTitle(title = '', app = '') {
  const lowerTitle = title.toLowerCase();
  const lowerApp = app.toLowerCase();
  if (lowerTitle.includes(` - ${lowerApp}`)) {
    return lowerTitle.replace(` - ${lowerApp}`, '').trim();
  }
  if (lowerTitle.includes(`${lowerApp} - `)) {
    return lowerTitle.replace(`${lowerApp} - `, '').trim();
  }
  return lowerTitle;
}

export function isWorkRelated(title = '', app = '') {
  const normalizedTitle = normalizeTitle(title, app).toLowerCase();
  const lowerApp = app.toLowerCase();

  const allKeywords = [...programmingKeywords, ...workRelatedTerms, ...ideApplications, ...allowedActivities];

  if (lowerApp.includes('safari')) {
    if (normalizedTitle === 'google' || normalizedTitle === '') {
      return true;
    }
  }
  
  if (lowerApp.includes('chrome') && (normalizedTitle === '' || normalizedTitle.includes('new tab'))) {
    return true; 
  }

  if (taskFileRegex.test(normalizedTitle)) {
    return true;
  }

  return allKeywords.some(keyword => normalizedTitle.includes(keyword) || lowerApp.includes(keyword));
}


let mainWindow;
let trackingInterval;
let tray = null;
const logFilePath = path.join(app.getPath('userData'), 'focus-log.txt');

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 350,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
  } else {
    createProtocol('app');
    mainWindow.loadURL('app://./index.html');
  }

  createTray();
}

function createTray() {
  const trayIconPath = path.join(__dirname, '../public/tray-icon.png');
  tray = new Tray(trayIconPath);
  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        }
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip('Focus Bloom');
  tray.setContextMenu(trayMenu);
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });
}

function logToFile(entry) {
  const logEntry = `${entry.timestamp} - Transition from "${entry.from.title}" (${entry.from.app}) to "${entry.to.title}" (${entry.to.app}) - ${entry.transitionType} - Duration: ${entry.timeSinceLastTransition} seconds\n`;
  try {
    fs.appendFileSync(logFilePath, logEntry, 'utf8');
  } catch (error) {
    const fallbackPath = path.join(app.getPath('documents'), 'focus-log.txt');
    try {
      fs.appendFileSync(fallbackPath, logEntry, 'utf8');
    } catch (fallbackError) {
      console.error('Failed to write log to fallback path:', fallbackError);
    }
  }
}

ipcMain.on('export-log', async event => {
  const saveDialogOptions = {
    title: 'Export Log File',
    defaultPath: path.join(app.getPath('documents'), 'focus-log.txt'),
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
  };
  const { filePath, canceled } = await dialog.showSaveDialog(saveDialogOptions);
  if (!canceled && filePath) {
    try {
      fs.copyFileSync(logFilePath, filePath);
      event.sender.send('export-log-success', 'Log file exported successfully!');
    } catch (error) {
      event.sender.send('export-log-failure', 'Failed to export log file.');
    }
  } else {
    event.sender.send('export-log-cancel', 'Log export canceled.');
  }
});

ipcMain.on('start-focus-tracking', () => {
  if (!trackingInterval) {
    trackingInterval = startFocusTracking();
  }
});

ipcMain.on('stop-focus-tracking', () => {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
});

function startFocusTracking() {
  let previousActiveWindow = null;
  return setInterval(async () => {
    const activeWindow = await activeWin();
    if (activeWindow) {
      const { title, owner: { name: appName } } = activeWindow;
      const focusedOnWork = isWorkRelated(title, appName);

      if (previousActiveWindow && previousActiveWindow.title === title && previousActiveWindow.appName === appName) {
        return;
      }

      const now = Date.now();
      const duration = previousActiveWindow && previousActiveWindow.timestamp
        ? Math.round((now - previousActiveWindow.timestamp) / 1000)
        : 0;

      const record = {
        from: previousActiveWindow
          ? { title: previousActiveWindow.title, app: previousActiveWindow.appName }
          : { title: '', app: '' },
        to: { title, app: appName },
        transitionType: previousActiveWindow
          ? previousActiveWindow.focusedOnWork
            ? focusedOnWork
              ? 'work-to-work'
              : 'work-to-nonwork'
            : focusedOnWork
            ? 'nonwork-to-work'
            : 'nonwork-to-nonwork'
          : 'nonwork-to-work',
        timeSinceLastTransition: duration,
        timestamp: new Date().toLocaleString(),
      };

      logToFile(record);

      previousActiveWindow = { title, appName, focusedOnWork, timestamp: now };
      mainWindow.webContents.send('focus-status', { title, appName, focusedOnWork, duration });
    }
  }, 500);
}

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

if (isDevelopment) {
  process.on(process.platform === 'win32' ? 'message' : 'SIGTERM', () => app.quit());
}
