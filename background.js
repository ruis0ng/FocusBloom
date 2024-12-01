'use strict'

import { app, protocol, BrowserWindow, ipcMain, Tray, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import fs from 'fs'
import path from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'
const activeWin = require('active-win')

const programmingKeywords = [
  'python', 'programming', 'coding', 
  'syntax', 'algorithm', 'tutorial', 'data structures',
];

const workRelatedTerms = ['colab', 'chatgpt', 'openai', 'gpt', 'focus-bloom'];

const ideApplications = ['visual studio code', 'pycharm', 'jupyter notebook'];

const allowedActivities = ['microsoft forms', 'google drive'];

const phaseKeywords = [];
for (let phase = 1; phase <= 2; phase++) {
  for (let task = 1; task <= 5; task++) {
    phaseKeywords.push(`p${phase}_t${task}`);
    phaseKeywords.push(`p${phase}_t${task}.py`);
  }
}

const phaseTitles = ['phase 1', 'phase 2'];

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
  const allKeywords = [
    ...programmingKeywords,
    ...workRelatedTerms,
    ...ideApplications,
    ...allowedActivities,
    ...phaseKeywords,
    ...phaseTitles, 
  ];

  if (lowerApp.includes('chrome') && (normalizedTitle === '' || normalizedTitle.includes('new tab'))) {
    return true; 
  }

  return allKeywords.some(keyword =>
    normalizedTitle.includes(keyword) || lowerApp.includes(keyword)
  );
}

let mainWindow;
let trackingInterval;
let tray = null; 
const logFilePath = path.join(app.getPath('userData'), 'focus-log.txt')

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 350,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    mainWindow.loadURL('app://./index.html')
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
  fs.appendFileSync(logFilePath, logEntry, 'utf8');
}

ipcMain.on('log-transition', (event, record) => {
  logToFile(record);
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
  return setInterval(async () => {
    const activeWindow = await activeWin();

    if (activeWindow) {
      const { title, owner: { name: appName } } = activeWindow;
      const focusedOnWork = isWorkRelated(title, appName);
      mainWindow.webContents.send('focus-status', { title, appName, focusedOnWork });
    }
  }, 2000);
}

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
