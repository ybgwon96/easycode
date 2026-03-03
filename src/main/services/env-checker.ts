import { execFile } from 'child_process'
import { platform } from 'os'

export interface EnvCheckResult {
  os: 'macos' | 'windows'
  claudeCodeInstalled: boolean
  claudeCodeVersion: string | null
  gitInstalled: boolean // Windows only
}

const execPromise = (cmd: string, args: string[]): Promise<string> =>
  new Promise((resolve) => {
    execFile(cmd, args, { timeout: 10000 }, (err, stdout) => {
      if (err) resolve('')
      else resolve(stdout.trim())
    })
  })

export const checkEnvironment = async (): Promise<EnvCheckResult> => {
  const os = platform() === 'win32' ? 'windows' : 'macos'

  // Check Claude Code
  let claudeCodeInstalled = false
  let claudeCodeVersion: string | null = null
  try {
    const raw = await execPromise('claude', ['--version'])
    if (raw) {
      claudeCodeInstalled = true
      claudeCodeVersion = raw.split('\n')[0].trim()
    }
  } catch {
    // not installed
  }

  // Check Git (Windows only)
  let gitInstalled = true
  if (os === 'windows') {
    try {
      const raw = await execPromise('git', ['--version'])
      gitInstalled = raw.length > 0
    } catch {
      gitInstalled = false
    }
  }

  return { os, claudeCodeInstalled, claudeCodeVersion, gitInstalled }
}
