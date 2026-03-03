import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../components/Button'
import ClaudeLogo from '../components/ClaudeLogo'

const LANGUAGES = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' }
]

export default function WelcomeStep({ onNext }: { onNext: () => void }): React.JSX.Element {
  const { t, i18n } = useTranslation('steps')
  const [currentLang, setCurrentLang] = useState(i18n.language)

  const changeLanguage = async (lng: string): Promise<void> => {
    setCurrentLang(lng)
    await i18n.changeLanguage(lng)
    window.electronAPI.i18n.setLanguage(lng)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
      <ClaudeLogo size={90} />

      <div className="text-center">
        <h1 className="text-3xl font-extrabold leading-tight">
          {t('welcome.title')}
          <br />
          <span className="text-primary">{t('welcome.titleHighlight')}</span>
        </h1>
        <p className="mt-3 text-text-muted text-sm">{t('welcome.subtitle')}</p>
      </div>

      <Button variant="primary" size="lg" onClick={onNext}>
        {t('welcome.button')}
      </Button>

      {/* Language selector */}
      <div className="flex gap-2 mt-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`text-xs px-3 py-1 rounded-lg transition-all ${
              currentLang === lang.code
                ? 'text-primary bg-primary/10 font-semibold'
                : 'text-text-muted/60 hover:text-text-muted'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}
