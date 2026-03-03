import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import StepIndicator from './components/StepIndicator'
import { useWizard } from './hooks/useWizard'
import WelcomeStep from './steps/WelcomeStep'
import EnvCheckStep from './steps/EnvCheckStep'
import InstallStep from './steps/InstallStep'
import DoneStep from './steps/DoneStep'

const BUBBLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  size: 6 + Math.random() * 18,
  left: Math.random() * 100,
  delay: Math.random() * 10,
  duration: 14 + Math.random() * 12
}))

const Bubbles = (): React.JSX.Element => (
  <>
    {BUBBLES.map((b) => (
      <div
        key={b.id}
        className="bubble"
        style={{
          width: b.size,
          height: b.size,
          left: `${b.left}%`,
          animationDelay: `${b.delay}s`,
          animationDuration: `${b.duration}s`
        }}
      />
    ))}
  </>
)

interface InstallNeeds {
  needClaudeCode: boolean
  needGit: boolean
}

function App(): React.JSX.Element {
  const { t } = useTranslation('common')
  const { currentStep, next, prev, canGoBack, goTo } = useWizard()
  const [installNeeds, setInstallNeeds] = useState<InstallNeeds>({
    needClaudeCode: false,
    needGit: false
  })
  const [version, setVersion] = useState('')

  useEffect(() => {
    window.electronAPI.version().then(setVersion)
  }, [])

  const handleEnvCheckDone = (env: {
    claudeCodeInstalled: boolean
    gitInstalled: boolean
    os: string
  }): void => {
    const needClaudeCode = !env.claudeCodeInstalled
    const needGit = env.os === 'windows' && !env.gitInstalled
    setInstallNeeds({ needClaudeCode, needGit })
    goTo('install')
  }

  return (
    <>
      <div className="aurora-bg" />
      <div className="grain-overlay" />
      <Bubbles />

      <div className="flex flex-col h-full relative z-10">
        {currentStep !== 'welcome' && <StepIndicator currentStep={currentStep} />}

        <div className="flex-1 flex flex-col min-h-0 pb-10 step-enter" key={currentStep}>
          {currentStep === 'welcome' && <WelcomeStep onNext={next} />}
          {currentStep === 'envCheck' && (
            <EnvCheckStep onNext={() => goTo('done')} onNeedInstall={handleEnvCheckDone} />
          )}
          {currentStep === 'install' && (
            <InstallStep needs={installNeeds} onDone={() => goTo('done')} />
          )}
          {currentStep === 'done' && <DoneStep />}
        </div>

        <div className="absolute bottom-3 right-4 flex items-center gap-2">
          {import.meta.env.DEV && currentStep !== 'done' && (
            <button
              onClick={() => goTo('done')}
              className="text-[10px] text-text-muted/40 hover:text-primary/60 font-mono transition-colors"
            >
              [skip]
            </button>
          )}
          {version && (
            <span className="text-[10px] text-text-muted/30 font-medium select-none">
              v{version}
            </span>
          )}
        </div>

        {canGoBack && (
          <button
            onClick={prev}
            className="absolute bottom-14 left-6 z-20 flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-text-muted hover:text-text bg-white/5 hover:bg-white/10 rounded-xl border border-glass-border transition-all duration-200"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {t('button.back')}
          </button>
        )}
      </div>
    </>
  )
}

export default App
