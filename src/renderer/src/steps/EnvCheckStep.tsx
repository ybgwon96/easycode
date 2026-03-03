import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../components/Button'
import ClaudeLogo from '../components/ClaudeLogo'

interface EnvCheckResult {
  os: 'macos' | 'windows'
  claudeCodeInstalled: boolean
  claudeCodeVersion: string | null
  gitInstalled: boolean
}

interface Props {
  onNext: () => void
  onNeedInstall: (env: EnvCheckResult) => void
}

const CheckRow = ({
  label,
  ok,
  detail
}: {
  label: string
  ok: boolean | null
  detail?: string
}): React.JSX.Element => (
  <div className="flex items-center justify-between py-2.5 px-4 glass-card !rounded-xl mb-2">
    <span className="text-sm font-medium">{label}</span>
    <div className="flex items-center gap-2">
      {detail && <span className="text-xs text-text-muted">{detail}</span>}
      {ok === null ? (
        <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
      ) : ok ? (
        <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#34d399"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-error/20 flex items-center justify-center">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fb7185"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      )}
    </div>
  </div>
)

export default function EnvCheckStep({ onNext, onNeedInstall }: Props): React.JSX.Element {
  const { t } = useTranslation('steps')
  const [checking, setChecking] = useState(true)
  const [env, setEnv] = useState<EnvCheckResult | null>(null)

  useEffect(() => {
    window.electronAPI.env.check().then((result) => {
      setEnv(result)
      setChecking(false)
    })
  }, [])

  const allGood = env?.claudeCodeInstalled && (env.os !== 'windows' || env.gitInstalled)
  const needInstall = env && !env.claudeCodeInstalled

  const handleNext = (): void => {
    if (!env) return
    if (allGood) {
      onNext()
    } else {
      onNeedInstall(env)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
      <ClaudeLogo state={checking ? 'loading' : allGood ? 'success' : 'idle'} size={60} />

      <div className="text-center">
        <h2 className="text-xl font-bold">{t('envCheck.title')}</h2>
        <p className="mt-1 text-text-muted text-sm">{t('envCheck.subtitle')}</p>
      </div>

      <div className="w-full max-w-sm">
        <CheckRow
          label={t('envCheck.os')}
          ok={env ? true : null}
          detail={env?.os === 'macos' ? 'macOS' : env?.os === 'windows' ? 'Windows' : undefined}
        />
        <CheckRow
          label={t('envCheck.claudeCode')}
          ok={env ? env.claudeCodeInstalled : null}
          detail={env?.claudeCodeVersion ?? undefined}
        />
        {env?.os === 'windows' && <CheckRow label={t('envCheck.git')} ok={env.gitInstalled} />}
      </div>

      {!checking && allGood && (
        <p className="text-success text-sm font-semibold">{t('envCheck.alreadyInstalled')}</p>
      )}

      {!checking && needInstall && (
        <p className="text-primary text-sm font-semibold">{t('envCheck.ready')}</p>
      )}

      <Button
        variant="primary"
        size="lg"
        onClick={handleNext}
        disabled={checking}
        loading={checking}
      >
        {allGood ? t('envCheck.alreadyInstalled') : t('envCheck.needInstall')}
      </Button>
    </div>
  )
}
