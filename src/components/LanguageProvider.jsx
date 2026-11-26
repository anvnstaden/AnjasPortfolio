import { useEffect, useState } from 'react'
import { LanguageContext, LANGUAGES } from '../i18n.js'
import { strings } from '../data/strings.js'

// A link can choose the language with ?lang=de (handy for tailored links, see destinations.js); otherwise it's
// the one chosen last time.
function savedLanguage() {
  const known = (code) => LANGUAGES.some((l) => l.code === code)
  const fromLink = new URLSearchParams(window.location.search).get('lang')
  if (known(fromLink)) return fromLink
  try {
    const saved = localStorage.getItem('lang')
    return known(saved) ? saved : 'en'
  } catch {
    return 'en'
  }
}

// Holds the chosen language, remembers it for the next visit and keeps the page's own language tag in step.
export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState(savedLanguage)

  useEffect(() => {
    document.documentElement.lang = lang
    document.querySelector('meta[name="description"]')?.setAttribute('content', strings[lang].description)
    try {
      localStorage.setItem('lang', lang)
    } catch {
      // Storage unavailable (private mode); the choice just won't be remembered.
    }
  }, [lang])

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
}
