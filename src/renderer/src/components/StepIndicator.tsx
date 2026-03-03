import { useTranslation } from 'react-i18next'

const steps = ['welcome', 'envCheck', 'install', 'done']

export default function StepIndicator({ currentStep }: { currentStep: string }): React.JSX.Element {
  const { t } = useTranslation('steps')
  const labels = t('indicator.default', { returnObjects: true }) as string[]
  const total = labels.length
  const current = Math.max(0, steps.indexOf(currentStep))

  return (
    <div className="px-8 pt-12 pb-3">
      {/* Dot indicators with connecting line */}
      <div className="relative flex justify-between items-center">
        {/* Background line */}
        <div className="absolute top-1/2 left-2 right-2 h-[2px] -translate-y-1/2 bg-white/8 rounded-full" />
        {/* Active line */}
        <div
          className="absolute top-1/2 left-2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-primary to-primary-hover rounded-full transition-all duration-700 ease-out"
          style={{ width: `${(current / (total - 1)) * 100}%` }}
        />

        {labels.map((label, i) => {
          const isActive = i <= current
          const isCurrent = i === current

          return (
            <div key={i} className="relative flex flex-col items-center z-10">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  isCurrent
                    ? 'bg-primary scale-125 shadow-[0_0_10px_var(--color-primary-glow)]'
                    : isActive
                      ? 'bg-primary/80'
                      : 'bg-white/15'
                }`}
                style={
                  isCurrent
                    ? {
                        animation: 'glow-pulse 2s ease-in-out infinite',
                        color: 'var(--color-primary)'
                      }
                    : {}
                }
              />
              <span
                className={`mt-2 text-[10px] font-semibold tracking-wide transition-all duration-500 ${
                  isCurrent ? 'text-primary' : isActive ? 'text-text/70' : 'text-text-muted/50'
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
