import { spawn } from 'child_process'
import { readFile, writeFile } from 'fs/promises'
import { homedir, platform } from 'os'
import { join } from 'path'
import { BrowserWindow } from 'electron'

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

const runPowerShell = (win: BrowserWindow, command: string): Promise<void> =>
  runShell(
    win,
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; ${command}`],
    { shell: false }
  )

const ensureZshPath = async (win: BrowserWindow): Promise<void> => {
  const claudeBinDir = join(homedir(), '.local', 'bin')
  const zshrcPath = join(homedir(), '.zshrc')
  const pathLine = `export PATH="$HOME/.local/bin:$PATH"`

  try {
    const content = await readFile(zshrcPath, 'utf-8').catch(() => '')
    if (content.includes('.local/bin')) {
      progress(win, 'PATH already configured in .zshrc')
      return
    }
    await writeFile(zshrcPath, content + (content.endsWith('\n') ? '' : '\n') + pathLine + '\n')
    progress(win, 'Added ~/.local/bin to PATH in .zshrc')
  } catch {
    progress(win, `Add ${claudeBinDir} to your PATH manually if needed`)
  }
}

export const installClaudeCode = async (win: BrowserWindow): Promise<void> => {
  const os = platform()

  if (os === 'darwin') {
    progress(win, 'Installing Claude Code via native installer...')
    await runShell(win, 'bash', ['-c', 'curl -fsSL https://claude.ai/install.sh | bash'])
    await ensureZshPath(win)
    progress(win, 'Claude Code installation complete!')
  } else {
    progress(win, 'Installing Claude Code via native installer...')
    await runPowerShell(win, 'irm https://claude.ai/install.ps1 | iex')
    progress(win, 'Claude Code installation complete!')
  }
}

export const installGitWindows = async (win: BrowserWindow): Promise<void> => {
  progress(win, 'Installing Git for Windows via winget...')
  await runPowerShell(win, 'winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements')
  progress(win, 'Git for Windows installation complete!')
}
