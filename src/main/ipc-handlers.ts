import { ipcMain, BrowserWindow, app } from 'electron'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import i18nMain, { initI18nMain } from '../shared/i18n/main'
import { checkEnvironment } from './services/env-checker'
import { installClaudeCode, installGitWindows } from './services/installer'
import { checkForUpdates, downloadUpdate, installUpdate } from './services/updater'

const getSettingsPath = (): string => join(app.getPath('userData'), 'settings.json')

const readSettings = (): Record<string, unknown> => {
  try {
    const p = getSettingsPath()
    if (existsSync(p)) return JSON.parse(readFileSync(p, 'utf-8'))
  } catch {
    /* ignore */
  }
  return {}
}

const writeSettings = (patch: Record<string, unknown>): void => {
  const settings = { ...readSettings(), ...patch }
  writeFileSync(getSettingsPath(), JSON.stringify(settings, null, 2))
}

export const getSavedLocale = (): string => {
  const settings = readSettings()
  if (typeof settings.language === 'string') return settings.language
  const sys = app.getLocale()
  if (sys.startsWith('ko')) return 'ko'
  if (sys.startsWith('ja')) return 'ja'
  if (sys.startsWith('zh')) return 'zh'
  return 'en'
}

export const registerIpcHandlers = (getWin: () => BrowserWindow | null): void => {
  const win = (): BrowserWindow => {
    const w = getWin()
    if (!w || w.isDestroyed()) throw new Error('No active window')
    return w
  }

  ipcMain.handle('app:version', () => app.getVersion())

  ipcMain.handle('env:check', () => checkEnvironment())

  ipcMain.handle('install:claude-code', async () => {
    try {
      await installClaudeCode(win())
      return { success: true }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      try {
        win().webContents.send('install:error', msg)
      } catch {
        /* window destroyed */
      }
      return { success: false, error: msg }
    }
  })

  ipcMain.handle('install:git', async () => {
    try {
      await installGitWindows(win())
      return { success: true }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      try {
        win().webContents.send('install:error', msg)
      } catch {
        /* window destroyed */
      }
      return { success: false, error: msg }
    }
  })

  // Auto update IPC
  ipcMain.handle('update:check', () => {
    checkForUpdates()
    return { success: true }
  })

  ipcMain.handle('update:download', () => {
    downloadUpdate()
    return { success: true }
  })

  ipcMain.handle('update:install', () => {
    installUpdate()
    return { success: true }
  })

  // i18n
  ipcMain.handle('i18n:get-locale', () => i18nMain.language || getSavedLocale())

  const SUPPORTED_LANGS = ['ko', 'en', 'ja', 'zh']

  ipcMain.handle('i18n:set-language', async (_e, lng: string) => {
    if (!SUPPORTED_LANGS.includes(lng)) {
      return { success: false, error: 'Unsupported language' }
    }
    writeSettings({ language: lng })
    await initI18nMain(lng)
    return { success: true }
  })
}
