import { createContext, useContext } from 'react'
import { journey, personalProjects, projects } from './data/content.js'
import { journeyDe, projectsDe, skillGroupsDe, skillsDe, stackDe } from './data/content.de.js'
import { strings } from './data/strings.js'
import { destination } from './destination.js'

// The site's language: English unless the visitor has chosen German (see LanguageProvider.jsx).
// useLang() gives a component the current language, `t` (the wording in strings.js), `content` (content.js
// in that language), `dest` (where the site is pointed, see destination.js, in that language) and `germanGrades`
// (whether marks show their German grade). Slugs and skill names stay in English everywhere, because links are
// built from them.
export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
]

const fileName = (src) => src.split('/').pop()

const { en: destEn, de: destDe, ...everyLanguage } = destination
const dests = { en: { ...everyLanguage, ...destEn }, de: { ...everyLanguage, ...destDe } }

// German grades show in German, and in English when the site is pointed at Germany
const germanGrades = { en: destination.country === 'de', de: true }

// A journey stop in one language: the wording that depends on where the site is pointed filled in (those are
// the functions in content.js), and the German grades and their footnote left out where they don't show
function stopIn(lang, stop) {
  const filled = Object.fromEntries(
    Object.entries(stop).map(([field, value]) => [field, typeof value === 'function' ? value(dests[lang]) : value]),
  )
  if (germanGrades[lang]) return filled
  return { ...filled, stats: filled.stats?.filter((s) => !s.german), footnote: undefined }
}

function projectToGerman(project) {
  const de = projectsDe[project.slug] ?? {}
  const { captions = {}, ...text } = de
  return {
    ...project,
    ...text,
    images: project.images?.map((img) => ({ ...img, caption: captions[fileName(img.src)] ?? img.caption })),
    stack: project.stack.map((tech) => stackDe[tech] ?? tech),
  }
}

const german = {
  projects: projects.map(projectToGerman),
  personalProjects: personalProjects.map(projectToGerman),
  journey: journey.map((stop, i) => {
    const { linkLabel, ...text } = journeyDe[i]
    return stopIn('de', { ...stop, ...text, ...(stop.link && { link: { ...stop.link, label: linkLabel } }) })
  }),
  skillName: (skill) => skillsDe[skill] ?? skill,
  groupName: (group) => skillGroupsDe[group] ?? group,
  // 85.4% → 85,4 %
  mark: (mark) => mark.replace('.', ',').replace('%', ' %'),
}

const english = {
  projects,
  personalProjects,
  journey: journey.map((stop) => stopIn('en', stop)),
  skillName: (skill) => skill,
  groupName: (group) => group,
  mark: (mark) => mark,
}

const content = { en: english, de: german }

export const LanguageContext = createContext({ lang: 'en', setLang: () => {} })

export function useLang() {
  const { lang, setLang } = useContext(LanguageContext)
  return { lang, setLang, t: strings[lang], content: content[lang], dest: dests[lang], germanGrades: germanGrades[lang] }
}
