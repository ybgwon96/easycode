import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import koCommon from './locales/ko/common.json'
import koSteps from './locales/ko/steps.json'

import enCommon from './locales/en/common.json'
import enSteps from './locales/en/steps.json'

import jaCommon from './locales/ja/common.json'
import jaSteps from './locales/ja/steps.json'

import zhCommon from './locales/zh/common.json'
import zhSteps from './locales/zh/steps.json'

const i18n = i18next.createInstance()

i18n.use(initReactI18next).init({
  resources: {
    ko: { common: koCommon, steps: koSteps },
    en: { common: enCommon, steps: enSteps },
    ja: { common: jaCommon, steps: jaSteps },
    zh: { common: zhCommon, steps: zhSteps }
  },
  lng: 'ko',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'steps'],
  interpolation: { escapeValue: false }
})

export default i18n
