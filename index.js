const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    autoHideMenuBar: true
  })

  win.loadFile('index.html')
}

function createPreviewWindow(address) {
  const win = new BrowserWindow({
    width: 600,
    height: 450,
    webPreferences: {
      nodeIntegration: true
    },
    autoHideMenuBar: true
  })

  win.loadFile('preview.html').then(_ => {
    win.webContents.send('address', address)
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('preview', (event, address) => {
  createPreviewWindow(address)
})

try {
  require('electron-reloader')(module, {});
} catch (_) { }