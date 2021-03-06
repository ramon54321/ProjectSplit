const { app, BrowserWindow } = require('electron')

app.on('ready', () => {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  })
  window.loadFile('index.html')
  window.webContents.openDevTools()
  window.setSize(1400, 1000)
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
