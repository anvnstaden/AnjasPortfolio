// Where I'd like to work. Without a ?to= in the link the site is about the whole EU, but a link like
// anjavanstaden.co.za/?to=amsterdam points it at one place, so each application can get its own link: the hero,
// the badge, the boarding pass, the About Me text and the last journey stop all say Amsterdam, the postcard gets
// a Dutch stamp and greeting, and the letter is signed off in Dutch. Add &lang=de to open it in German as well,
// e.g. /?to=munich&lang=de. The key is the country code or the city's name as listed below; a key that isn't
// listed is ignored. The visitor's choice lasts until they close the tab (see destination.js).
//
// The wording, in English and German:
//   label  stands on its own: the badge, the boarding pass and the journey stop's title ("Germany", "Deutschland")
//   to     follows "to" and the German "geht es" ("the Netherlands", "in die Niederlande")
//   in     says where the roles are ("anywhere in Germany", "in ganz Deutschland")
//   plan   the last sentence of the journey stop
// and in the local language:
//   hello     "see you soon", for the handwritten note on the journey stop and the letter's sign-off
//   postcard  the greeting written on the journey stop's postcard
// `flag` picks the postcard's stamp (see Flags.jsx).

// When I can start, wherever it is. Change it here and the whole site follows.
export const start = {
  en: { long: 'January 2027', short: 'Jan 2027' },
  de: { long: 'Januar 2027', short: 'Jan. 2027' },
}

// The site without a ?to=: open to the whole EU, with Germany and the Netherlands first. Its postcard has no one
// local language, so like the first one on the journey it's greeted in the site's.
export const everywhere = {
  code: 'EU',
  gate: 'EU',
  flag: 'eu',
  hello: 'bis bald',
  en: {
    label: 'Europe',
    to: 'Europe',
    in: 'anywhere in the EU',
    plan: `I'm looking at Germany and the Netherlands first, and I'm learning German so I'm ready to start in ${start.en.long}.`,
    postcard: 'Greetings from Europe!',
  },
  de: {
    label: 'Europa',
    to: 'nach Europa',
    in: 'in der ganzen EU',
    plan: `Am liebsten fange ich in Deutschland oder den Niederlanden an, und ich lerne Deutsch, damit ich ab ${start.de.long} loslegen kann.`,
    postcard: 'Grüße aus Europa!',
  },
}

// What I'd say about starting in a country where I already speak (or am learning) the language
export const plans = {
  german: {
    en: `I'm learning German so I'm ready to start there in ${start.en.long}.`,
    de: `Ich lerne Deutsch, damit ich ab ${start.de.long} dort loslegen kann.`,
  },
  dutch: {
    en: `I already understand Dutch, and I'm ready to start there in ${start.en.long}.`,
    de: `Niederländisch verstehe ich schon, und ab ${start.de.long} kann ich dort loslegen.`,
  },
  english: {
    en: `I'm fluent in English, and I'm ready to start there in ${start.en.long}.`,
    de: `Englisch spreche ich fließend, und ab ${start.de.long} kann ich dort loslegen.`,
  },
  // everywhere else
  ready: {
    en: `I'm ready to start there in ${start.en.long}.`,
    de: `Ab ${start.de.long} kann ich dort loslegen.`,
  },
}

export const countries = {
  de: {
    plan: 'german',
    hello: 'bis bald',
    postcard: 'Grüße aus Deutschland!',
    en: { label: 'Germany', to: 'Germany', in: 'anywhere in Germany' },
    de: { label: 'Deutschland', to: 'nach Deutschland', in: 'in ganz Deutschland' },
  },
  at: {
    plan: 'german',
    hello: 'bis bald',
    postcard: 'Grüße aus Österreich!',
    en: { label: 'Austria', to: 'Austria', in: 'anywhere in Austria' },
    de: { label: 'Österreich', to: 'nach Österreich', in: 'in ganz Österreich' },
  },
  nl: {
    plan: 'dutch',
    hello: 'tot snel',
    postcard: 'Groeten uit Nederland!',
    en: { label: 'Netherlands', to: 'the Netherlands', in: 'anywhere in the Netherlands' },
    de: { label: 'Niederlande', to: 'in die Niederlande', in: 'überall in den Niederlanden' },
  },
  be: {
    plan: 'dutch',
    hello: 'tot snel',
    postcard: 'Groeten uit België!',
    en: { label: 'Belgium', to: 'Belgium', in: 'anywhere in Belgium' },
    de: { label: 'Belgien', to: 'nach Belgien', in: 'in ganz Belgien' },
  },
  ie: {
    plan: 'english',
    hello: 'slán go fóill',
    postcard: 'Greetings from Ireland!',
    en: { label: 'Ireland', to: 'Ireland', in: 'anywhere in Ireland' },
    de: { label: 'Irland', to: 'nach Irland', in: 'in ganz Irland' },
  },
  fr: {
    plan: 'ready',
    hello: 'à bientôt',
    postcard: 'Bonjour de France !',
    en: { label: 'France', to: 'France', in: 'anywhere in France' },
    de: { label: 'Frankreich', to: 'nach Frankreich', in: 'in ganz Frankreich' },
  },
  es: {
    plan: 'ready',
    hello: 'hasta pronto',
    postcard: '¡Saludos desde España!',
    en: { label: 'Spain', to: 'Spain', in: 'anywhere in Spain' },
    de: { label: 'Spanien', to: 'nach Spanien', in: 'in ganz Spanien' },
  },
  pt: {
    plan: 'ready',
    hello: 'até breve',
    postcard: 'Saudações de Portugal!',
    en: { label: 'Portugal', to: 'Portugal', in: 'anywhere in Portugal' },
    de: { label: 'Portugal', to: 'nach Portugal', in: 'in ganz Portugal' },
  },
  it: {
    plan: 'ready',
    hello: 'a presto',
    postcard: "Saluti dall'Italia!",
    en: { label: 'Italy', to: 'Italy', in: 'anywhere in Italy' },
    de: { label: 'Italien', to: 'nach Italien', in: 'in ganz Italien' },
  },
  dk: {
    plan: 'ready',
    hello: 'vi ses snart',
    postcard: 'Hilsen fra Danmark!',
    en: { label: 'Denmark', to: 'Denmark', in: 'anywhere in Denmark' },
    de: { label: 'Dänemark', to: 'nach Dänemark', in: 'in ganz Dänemark' },
  },
  se: {
    plan: 'ready',
    hello: 'vi ses snart',
    postcard: 'Hälsningar från Sverige!',
    en: { label: 'Sweden', to: 'Sweden', in: 'anywhere in Sweden' },
    de: { label: 'Schweden', to: 'nach Schweden', in: 'in ganz Schweden' },
  },
  fi: {
    plan: 'ready',
    hello: 'nähdään pian',
    postcard: 'Terveisiä Suomesta!',
    en: { label: 'Finland', to: 'Finland', in: 'anywhere in Finland' },
    de: { label: 'Finnland', to: 'nach Finnland', in: 'in ganz Finnland' },
  },
  pl: {
    plan: 'ready',
    hello: 'do zobaczenia',
    postcard: 'Pozdrowienia z Polski!',
    en: { label: 'Poland', to: 'Poland', in: 'anywhere in Poland' },
    de: { label: 'Polen', to: 'nach Polen', in: 'in ganz Polen' },
  },
  cz: {
    plan: 'ready',
    hello: 'brzy na viděnou',
    postcard: 'Pozdrav z Česka!',
    en: { label: 'Czechia', to: 'Czechia', in: 'anywhere in Czechia' },
    de: { label: 'Tschechien', to: 'nach Tschechien', in: 'in ganz Tschechien' },
  },
  ee: {
    plan: 'ready',
    hello: 'nägemiseni',
    postcard: 'Tervitused Eestist!',
    en: { label: 'Estonia', to: 'Estonia', in: 'anywhere in Estonia' },
    de: { label: 'Estland', to: 'nach Estland', in: 'in ganz Estland' },
  },
}

// Cities, with their country, the airport code for the boarding pass, their name (and its German name, where that
// differs) and the greeting for the postcard. Everything else comes from the country.
export const cities = {
  berlin: { country: 'de', code: 'BER', name: 'Berlin', postcard: 'Grüße aus Berlin!' },
  munich: { country: 'de', code: 'MUC', name: 'Munich', de: 'München', postcard: 'Grüße aus München!' },
  hamburg: { country: 'de', code: 'HAM', name: 'Hamburg', postcard: 'Grüße aus Hamburg!' },
  frankfurt: { country: 'de', code: 'FRA', name: 'Frankfurt', postcard: 'Grüße aus Frankfurt!' },
  cologne: { country: 'de', code: 'CGN', name: 'Cologne', de: 'Köln', postcard: 'Grüße aus Köln!' },
  dusseldorf: { country: 'de', code: 'DUS', name: 'Düsseldorf', postcard: 'Grüße aus Düsseldorf!' },
  stuttgart: { country: 'de', code: 'STR', name: 'Stuttgart', postcard: 'Grüße aus Stuttgart!' },
  vienna: { country: 'at', code: 'VIE', name: 'Vienna', de: 'Wien', postcard: 'Grüße aus Wien!' },
  amsterdam: { country: 'nl', code: 'AMS', name: 'Amsterdam', postcard: 'Groeten uit Amsterdam!' },
  rotterdam: { country: 'nl', code: 'RTM', name: 'Rotterdam', postcard: 'Groeten uit Rotterdam!' },
  utrecht: { country: 'nl', code: 'AMS', name: 'Utrecht', postcard: 'Groeten uit Utrecht!' },
  'the-hague': { country: 'nl', code: 'AMS', name: 'The Hague', de: 'Den Haag', postcard: 'Groeten uit Den Haag!' },
  eindhoven: { country: 'nl', code: 'EIN', name: 'Eindhoven', postcard: 'Groeten uit Eindhoven!' },
  brussels: { country: 'be', code: 'BRU', name: 'Brussels', de: 'Brüssel', postcard: 'Bonjour de Bruxelles !', hello: 'à bientôt' },
  antwerp: { country: 'be', code: 'ANR', name: 'Antwerp', de: 'Antwerpen', postcard: 'Groeten uit Antwerpen!' },
  dublin: { country: 'ie', code: 'DUB', name: 'Dublin', postcard: 'Greetings from Dublin!' },
  paris: { country: 'fr', code: 'CDG', name: 'Paris', postcard: 'Bonjour de Paris !' },
  barcelona: { country: 'es', code: 'BCN', name: 'Barcelona', postcard: '¡Saludos desde Barcelona!' },
  madrid: { country: 'es', code: 'MAD', name: 'Madrid', postcard: '¡Saludos desde Madrid!' },
  lisbon: { country: 'pt', code: 'LIS', name: 'Lisbon', de: 'Lissabon', postcard: 'Saudações de Lisboa!' },
  porto: { country: 'pt', code: 'OPO', name: 'Porto', postcard: 'Saudações do Porto!' },
  milan: { country: 'it', code: 'MXP', name: 'Milan', de: 'Mailand', postcard: 'Saluti da Milano!' },
  copenhagen: { country: 'dk', code: 'CPH', name: 'Copenhagen', de: 'Kopenhagen', postcard: 'Hilsen fra København!' },
  stockholm: { country: 'se', code: 'ARN', name: 'Stockholm', postcard: 'Hälsningar från Stockholm!' },
  helsinki: { country: 'fi', code: 'HEL', name: 'Helsinki', postcard: 'Terveisiä Helsingistä!' },
  warsaw: { country: 'pl', code: 'WAW', name: 'Warsaw', de: 'Warschau', postcard: 'Pozdrowienia z Warszawy!' },
  krakow: { country: 'pl', code: 'KRK', name: 'Kraków', de: 'Krakau', postcard: 'Pozdrowienia z Krakowa!' },
  prague: { country: 'cz', code: 'PRG', name: 'Prague', de: 'Prag', postcard: 'Pozdrav z Prahy!' },
  tallinn: { country: 'ee', code: 'TLL', name: 'Tallinn', postcard: 'Tervitused Tallinnast!' },
}
