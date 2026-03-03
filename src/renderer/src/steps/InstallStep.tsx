import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../components/Button'
import ClaudeLogo from '../components/ClaudeLogo'
import LogViewer from '../components/LogViewer'
import { useInstallLogs } from '../hooks/useIpc'

interface Props {
  needs: { needClaudeCode: boolean; needGit: boolean }
  onDone: () => void
}

type InstallState = 'idle' | 'installing' | 'success' | 'error'

export default function InstallStep({ needs, onDone }: Props): React.JSX.Element {
  const { t } = useTranslation('steps')
  const { logs, error, clearLogs } = useInstallLogs()
  const [state, setState] = useState<InstallState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const runInstall = useCallback(async () => {
    setState('installing')
    clearLogs()
    setErrorMsg(null)

    try {
      // Install Git first if needed (Windows)
      if (needs.needGit) {
        const gitResult = await window.electronAPI.install.git()
        if (!gitResult.success) {
          throw new Error(gitResult.error || 'Git installation failed')
        }
      }

      // Install Claude Code
      if (needs.needClaudeCode) {
        const result = await window.electronAPI.install.claudeCode()
        if (!result.success) {
          throw new Error(result.error || 'Claude Code installation failed')
        }
      }

      setState('success')
    } catch (e) {
      setState('error')
      setErrorMsg(e instanceof Error ? e.message : String(e))
    }
  }, [needs, clearLogs])

  useEffect(() => {
    runInstall()
  }, [runInstall])

  useEffect(() => {
    if (error) {
      setState('error')
      setErrorMsg(error)
    }
  }, [error])

  const logoState =
    state === 'installing'
      ? 'loading'
      : state === 'success'
        ? 'success'
        : state === 'error'
          ? 'error'
          : 'idle'

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-5">
      <ClaudeLogo state={logoState} size={60} />

      <div className="text-center">
        <h2 className="text-xl font-bold">{t('install.title')}</h2>
        <p className="mt-1 text-text-muted text-sm">
          {state === 'success'
            ? t('install.complete')
            : state === 'error'
              ? t('install.failed')
              : t('install.subtitle')}
        </p>
        {errorMsg && (
          <p className="mt-1 text-error text-xs">
            {t('install.failedDetail', { error: errorMsg })}
          </p>
        )}
      </div>

      <div className="w-full max-w-md">
        <LogViewer lines={logs} />
      </div>

      {state === 'success' && (
        <Button variant="primary" size="lg" onClick={onDone}>
          {t('install.complete')}
        </Button>
      )}

      {state === 'error' && (
        <Button variant="primary" size="lg" onClick={runInstall}>
          {t('install.failed')}
        </Button>
      )}
    </div>
  )
}
