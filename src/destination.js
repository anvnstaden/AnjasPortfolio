import { cities, countries, everywhere, plans } from './data/destinations.js'

// Where the site is pointed (see data/destinations.js): the ?to= in the link, else the one this tab was opened
// with, so it stays put while the visitor clicks around or reloads. It's worked out once, when the page loads.
const KEY = 'to'

function chosenKey() {
  const known = (key) => (key && (cities[key] || countries[key]) ? key : null)
  const fromLink = known(new URLSearchParams(window.location.search).get('to')?.trim().toLowerCase())
  try {
    if (fromLink) sessionStorage.setItem(KEY, fromLink)
    return fromLink ?? known(sessionStorage.getItem(KEY))
  } catch {
    return fromLink // storage unavailable (private mode); only the link itself counts
  }
}

// The wording for a city or country, in each language, in the shape of `everywhere`
function wordingFor(key) {
  const city = cities[key]
  const code = city?.country ?? key
  const country = countries[code]
  const wording = (lang) => {
    const own = country[lang]
    if (!city) return { ...own, place: own.label, badge: own.label, plan: plans[country.plan][lang] }
    const name = (lang === 'de' && city.de) || city.name
    return {
      label: name,
      to: lang === 'de' ? `nach ${name}` : name,
      in: `in ${name}`,
      plan: plans[country.plan][lang],
      place: `${name}, ${own.label}`,
      badge: `${name}, ${code.toUpperCase()}`,
    }
  }
  return {
    country: code,
    code: city?.code ?? code.toUpperCase(),
    gate: code.toUpperCase(),
    flag: code,
    hello: city?.hello ?? country.hello,
    postcard: city?.postcard ?? country.postcard,
    en: wording('en'),
    de: wording('de'),
  }
}

const key = chosenKey()

export const destination = key
  ? wordingFor(key)
  : {
      ...everywhere,
      en: { ...everywhere.en, place: everywhere.en.label, badge: everywhere.en.label },
      de: { ...everywhere.de, place: everywhere.de.label, badge: everywhere.de.label },
    }
