// Small flags: South Africa, and the EU and the countries the site can be pointed at (see destinations.js). Black and
// white are swapped for the site's ink and ivory.
const INK = '#000a1a'
const IVORY = '#fbf8f1'

export function FlagZA() {
  return (
    <svg className="flag" viewBox="0 0 900 600" role="img" aria-label="South African flag">
      <rect width="900" height="300" fill="#de3831" />
      <rect y="300" width="900" height="300" fill="#002395" />
      <path d="M0 0 450 300 0 600M450 300H900" fill="none" stroke={IVORY} strokeWidth="200" />
      <path d="M0 0 450 300 0 600M450 300H900" fill="none" stroke="#007a4d" strokeWidth="120" />
      <path d="M0 72 342 300 0 528Z" fill="#ffb612" />
      <path d="M0 120 270 300 0 480Z" fill={INK} />
    </svg>
  )
}

export function FlagNL() {
  return (
    <svg className="flag" viewBox="0 0 9 6" role="img" aria-label="Dutch flag">
      <rect width="9" height="2" fill="#ae1c28" />
      <rect y="2" width="9" height="2" fill={IVORY} />
      <rect y="4" width="9" height="2" fill="#21468b" />
    </svg>
  )
}

export function FlagDE() {
  return (
    <svg className="flag" viewBox="0 0 5 3" role="img" aria-label="German flag">
      <rect width="5" height="1" fill={INK} />
      <rect y="1" width="5" height="1" fill="#dd0000" />
      <rect y="2" width="5" height="1" fill="#ffce00" />
    </svg>
  )
}

// Three (or two) stripes, across or, with `down`, from left to right
function Stripes({ colours, down = false, label }) {
  const n = colours.length
  return (
    <svg className="flag" viewBox="0 0 9 6" role="img" aria-label={label}>
      {colours.map((fill, i) =>
        down ? (
          <rect key={i} x={(9 / n) * i} width={9 / n} height="6" fill={fill} />
        ) : (
          <rect key={i} y={(6 / n) * i} width="9" height={6 / n} fill={fill} />
        ),
      )}
    </svg>
  )
}

// A Nordic cross on a `width` x `height` flag: its upright starts `x` from the left, and both bars are `bar` thick
function NordicCross({ width, height, x, bar, field, cross, label }) {
  return (
    <svg className="flag" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <rect width={width} height={height} fill={field} />
      <path d={`M${x} 0h${bar}v${height}h-${bar}zM0 ${(height - bar) / 2}h${width}v${bar}H0z`} fill={cross} />
    </svg>
  )
}

// The EU's twelve gold stars in a circle, as one path
const euStars = Array.from({ length: 12 }, (_, i) => {
  const cx = 15 + 6.6 * Math.sin((i * Math.PI) / 6)
  const cy = 10 - 6.6 * Math.cos((i * Math.PI) / 6)
  const points = Array.from({ length: 10 }, (_, j) => {
    const r = j % 2 ? 0.45 : 1.1
    const a = (j * Math.PI) / 5
    return `${(cx + r * Math.sin(a)).toFixed(2)} ${(cy - r * Math.cos(a)).toFixed(2)}`
  })
  return `M${points.join('L')}Z`
}).join('')

const flags = {
  za: FlagZA,
  nl: FlagNL,
  de: FlagDE,
  eu: () => (
    <svg className="flag" viewBox="0 0 30 20" role="img" aria-label="EU flag">
      <rect width="30" height="20" fill="#003399" />
      <path d={euStars} fill="#ffcc00" />
    </svg>
  ),
  at: () => <Stripes colours={['#c8102e', IVORY, '#c8102e']} label="Austrian flag" />,
  be: () => <Stripes down colours={[INK, '#fdda24', '#ef3340']} label="Belgian flag" />,
  ie: () => <Stripes down colours={['#169b62', IVORY, '#ff883e']} label="Irish flag" />,
  fr: () => <Stripes down colours={['#0055a4', IVORY, '#ef4135']} label="French flag" />,
  it: () => <Stripes down colours={['#009246', IVORY, '#ce2b37']} label="Italian flag" />,
  ee: () => <Stripes colours={['#0072ce', INK, IVORY]} label="Estonian flag" />,
  pl: () => <Stripes colours={[IVORY, '#dc143c']} label="Polish flag" />,
  dk: () => <NordicCross width={37} height={28} x={12} bar={4} field="#c8102e" cross={IVORY} label="Danish flag" />,
  se: () => <NordicCross width={16} height={10} x={5} bar={2} field="#006aa7" cross="#fecc02" label="Swedish flag" />,
  fi: () => <NordicCross width={18} height={11} x={5} bar={3} field={IVORY} cross="#002f6c" label="Finnish flag" />,
  // Spain's civil flag, without the coat of arms
  es: () => (
    <svg className="flag" viewBox="0 0 6 4" role="img" aria-label="Spanish flag">
      <rect width="6" height="4" fill="#aa151b" />
      <rect y="1" width="6" height="2" fill="#f1bf00" />
    </svg>
  ),
  // Portugal's green and red, with its gold armillary sphere and shield simplified to a ring and a small shield
  pt: () => (
    <svg className="flag" viewBox="0 0 15 10" role="img" aria-label="Portuguese flag">
      <rect width="15" height="10" fill="#da291c" />
      <rect width="6" height="10" fill="#046a38" />
      <circle cx="6" cy="5" r="2.1" fill="none" stroke="#ffe900" strokeWidth="0.7" />
      <path d="M5 3.9h2v1.5a1 1 0 0 1-2 0z" fill="#da291c" stroke={IVORY} strokeWidth="0.35" />
    </svg>
  ),
  cz: () => (
    <svg className="flag" viewBox="0 0 6 4" role="img" aria-label="Czech flag">
      <rect width="6" height="2" fill={IVORY} />
      <rect y="2" width="6" height="2" fill="#d7141a" />
      <path d="M0 0 3 2 0 4z" fill="#11457e" />
    </svg>
  ),
}

// The flag for a country code (or 'eu'), e.g. <Flag code="fr" />
export function Flag({ code }) {
  const Drawn = flags[code] ?? flags.eu
  return <Drawn />
}
