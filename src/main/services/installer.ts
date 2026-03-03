import { spawn } from 'child_process'
import { BrowserWindow } from 'electron'
import { platform } from 'os'

const send = (win: BrowserWindow, channel: string, msg: string): void => {
  try {
    if (!win.isDestroyed()) win.webContents.send(channel, msg)
  } catch {
    /* window destroyed */
  }
}

const progress = (win: BrowserWindow, msg: string): void => send(win, 'install:progress', msg)

const runShell = (
  win: BrowserWindow,
  command: string,
  args: string[],
  opts?: { shell?: boolean | string }
): Promise<void> =>
  new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      shell: opts?.shell ?? true,
      stdio: ['ignore', 'pipe', 'pipe']
    })

    proc.stdout?.on('data', (data: Buffer) => {
      const lines = data.toString().split('\n').filter(Boolean)
      for (const line of lines) progress(win, line)
    })

    proc.stderr?.on('data', (data: Buffer) => {
      const lines = data.toString().split('\n').filter(Boolean)
      for (const line of lines) progress(win, line)
    })

    proc.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`Process exited with code ${code}`))
    })

    proc.on('error', reject)
  })

export const installClaudeCode = async (win: BrowserWindow): Promise<void> => {
  const os = platform()

  if (os === 'darwin') {
    progress(win, 'Installing Claude Code via native installer...')
    await runShell(win, 'bash', ['-c', 'curl -fsSL https://claude.ai/install.sh | bash'])
    progress(win, 'Claude Code installation complete!')
  } else {
    // Windows: PowerShell native installer
    progress(win, 'Installing Claude Code via native installer...')
    await runShell(win, 'powershell', [
      '-NoProfile',
      '-ExecutionPolicy',
      'Bypass',
      '-Command',
      'irm https://claude.ai/install.ps1 | iex'
    ])
    progress(win, 'Claude Code installation complete!')
  }
}

export const installGitWindows = async (win: BrowserWindow): Promise<void> => {
  progress(win, 'Installing Git for Windows via winget...')
  await runShell(win, 'winget', [
    'install',
    '--id',
    'Git.Git',
    '-e',
    '--accept-source-agreements',
    '--accept-package-agreements'
  ])
  progress(win, 'Git for Windows installation complete!')
}
