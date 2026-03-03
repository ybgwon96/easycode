import { autoUpdater } from 'electron-updater'
import { BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'

export const setupAutoUpdater = (getWin: () => BrowserWindow | null): void => {
  if (is.dev) return

  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('update-available', (info) => {
    const win = getWin()
    if (win && !win.isDestroyed()) {
      win.webContents.send('update:available', { version: info.version })
    }
  })

  autoUpdater.on('download-progress', (p) => {
    const win = getWin()
    if (win && !win.isDestroyed()) {
      win.webContents.send('update:progress', Math.round(p.percent))
    }
  })

  autoUpdater.on('update-downloaded', () => {
    const win = getWin()
    if (win && !win.isDestroyed()) {
      win.webContents.send('update:downloaded')
    }
  })

  autoUpdater.on('error', (e) => {
    const win = getWin()
    if (win && !win.isDestroyed()) {
      win.webContents.send('update:error', e.message)
    }
  })
}

export const checkForUpdates = (): void => {
  if (is.dev) return
  autoUpdater.checkForUpdates().catch(() => {
    // network errors etc.
  })
}

export const downloadUpdate = (): void => {
  autoUpdater.downloadUpdate().catch(() => {})
}

export const installUpdate = (): void => {
  autoUpdater.quitAndInstall()
}
