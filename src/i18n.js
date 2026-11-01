import { createContext, useContext } from 'react'
import { journey, personalProjects, projects } from './data/content.js'
import { journeyDe, projectsDe, skillGroupsDe, skillsDe, stackDe } from './data/content.de.js'
import { strings } from './data/strings.js'

// The site's language: English unless the visitor has chosen German (see LanguageProvider.jsx).
// useLang() gives a component the current language, `t` (the wording in strings.js) and `content` (content.js
// in that language). Slugs and skill names stay in English everywhere, because links are built from them.
export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
]

const fileName = (src) => src.split('/').pop()

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
    return { ...stop, ...text, ...(stop.link && { link: { ...stop.link, label: linkLabel } }) }
  }),
  skillName: (skill) => skillsDe[skill] ?? skill,
  groupName: (group) => skillGroupsDe[group] ?? group,
  // 85.4% → 85,4 %
  mark: (mark) => mark.replace('.', ',').replace('%', ' %'),
}

const english = {
  projects,
  personalProjects,
  journey,
  skillName: (skill) => skill,
  groupName: (group) => group,
  mark: (mark) => mark,
}

const content = { en: english, de: german }

export const LanguageContext = createContext({ lang: 'en', setLang: () => {} })

export function useLang() {
  const { lang, setLang } = useContext(LanguageContext)
  return { lang, setLang, t: strings[lang], content: content[lang] }
}
