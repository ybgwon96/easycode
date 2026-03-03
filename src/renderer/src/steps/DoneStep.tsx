import { useTranslation } from 'react-i18next'
import ClaudeLogo from '../components/ClaudeLogo'

export default function DoneStep(): React.JSX.Element {
  const { t } = useTranslation('steps')

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
      <ClaudeLogo state="success" size={70} />

      <div className="text-center">
        <h2 className="text-2xl font-extrabold">{t('done.title')}</h2>
        <p className="mt-2 text-text-muted text-sm">{t('done.subtitle')}</p>
      </div>

      {/* Terminal card */}
      <div className="glass-card !rounded-xl p-4 w-full max-w-sm">
        <p className="text-xs text-text-muted mb-2 font-semibold">{t('done.howToUse')}</p>
        <p className="text-xs text-text-muted/70 mb-3">{t('done.terminalHint')}</p>
        <div className="bg-black/30 rounded-lg px-4 py-3 font-mono text-sm text-primary flex items-center gap-2">
          <span className="text-text-muted/40">$</span>
          <span>claude</span>
        </div>
      </div>

      {/* Open terminal button */}
      <button
        onClick={() => window.electronAPI.shell.openTerminal()}
        className="text-sm text-primary hover:text-primary-light transition-colors font-semibold cursor-pointer"
      >
        {t('done.openTerminal')} →
      </button>
    </div>
  )
}
