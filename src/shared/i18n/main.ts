import i18next from 'i18next'

import koCommon from './locales/ko/common.json'
import koMain from './locales/ko/main.json'

import enCommon from './locales/en/common.json'
import enMain from './locales/en/main.json'

import jaCommon from './locales/ja/common.json'
import jaMain from './locales/ja/main.json'

import zhCommon from './locales/zh/common.json'
import zhMain from './locales/zh/main.json'

const i18nMain = i18next.createInstance()

i18nMain.init({
  resources: {
    ko: { common: koCommon, main: koMain },
    en: { common: enCommon, main: enMain },
    ja: { common: jaCommon, main: jaMain },
    zh: { common: zhCommon, main: zhMain }
  },
  lng: 'ko',
  fallbackLng: 'en',
  defaultNS: 'main',
  ns: ['common', 'main'],
  interpolation: { escapeValue: false }
})

export const t = i18nMain.t.bind(i18nMain)

export const initI18nMain = async (lng: string): Promise<void> => {
  await i18nMain.changeLanguage(lng)
}

export default i18nMain
