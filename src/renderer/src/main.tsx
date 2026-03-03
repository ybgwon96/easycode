import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const initApp = async (): Promise<void> => {
  const { default: i18n } = await import('@shared/i18n')
  try {
    const locale = await window.electronAPI.i18n.getLocale()
    await i18n.changeLanguage(locale)
  } catch {
    /* fallback to default */
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

initApp()
