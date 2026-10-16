import { useEffect, useRef, useState } from 'react'
import Girl from './Girl.jsx'

// Languages for the phone: how each one says hello, and how well I speak it.
const languages = [
  { name: 'English', hello: 'Hello!', level: 'fluent' },
  { name: 'Afrikaans', hello: 'Hallo!', level: 'fluent' },
  { name: 'Deutsch', hello: 'Guten Tag!', level: 'learning', typing: true },
  { name: 'Nederlands', hello: 'Hoi!', level: 'understand' },
]

// The wallet scene only runs on wide screens with motion allowed; otherwise the items are a plain row.
const WIDE = '(min-width: 900px) and (prefers-reduced-motion: no-preference)'

function useWide() {
  const [wide, setWide] = useState(() => matchMedia(WIDE).matches)
  useEffect(() => {
    const mq = matchMedia(WIDE)
    const onChange = () => setWide(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return wide
}

const clamp01 = (n) => Math.min(1, Math.max(0, n))
const lerp = (a, b, t) => a + (b - a) * t
const easeOut = (t) => 1 - (1 - t) ** 3
const easeOutBounce = (t) => {
  const n = 7.5625
  const d = 2.75
  if (t < 1 / d) return n * t * t
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375
  return n * (t -= 2.625 / d) * t + 0.984375
}
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

// How far each item tumbles on the way out (degrees), and how far it drifts sideways while falling.
const TUMBLE = [-30, 24, -18, 32, -26]
const DRIFT = [-30, 20, -12, 26, -20]
const IN_CASE = 150 // card size in the briefcase: units of the 900 x 840 box per --cw (the card width unit)
// Where each card lies in the open briefcase, thrown in any old how: centre (in the 520 x 600 box) and angle
const THROWN = [
  { x: 176, y: 512, r: -22 },
  { x: 310, y: 572, r: 15 },
  { x: 486, y: 506, r: 9 },
  { x: 650, y: 612, r: -8 },
  { x: 742, y: 548, r: 14 },
]
// Where each card ends up, scattered over the screen (centre as a share of the screen's width and height),
// how far it is turned, and which side of it the pen writes its note on (chosen so that no note or arrow crosses
// another card)
const SCATTER = [
  { x: 0.09, y: 0.72, r: -7, note: 'above' },
  { x: 0.23, y: 0.72, r: 6, note: 'below' },
  { x: 0.39, y: 0.58, r: 0, note: 'above' },
  { x: 0.72, y: 0.316, r: 0, note: 'below' },
  { x: 0.88, y: 0.79, r: -6, note: 'left' },
]
// Scroll progress (0 → 1) at which each stage of the scene happens
const WALK_END = 0.36 // the girl walks across the screen, left to right
const DROP = 0.19 // ...and drops the wallet part-way across
const DROP_TIME = 0.05 // the wallet falls and bounces
const ZOOM_START = 0.26 // the camera zooms in on the wallet where it landed
const ZOOM_END = 0.46
const FIRST_ITEM = 0.62 // the briefcase spits out the cards one after another
const ITEM_STEP = 0.04
const ITEM_TIME = 0.22
// After the briefcase has gone, the last part of the scroll is a pen writing a note beside each card
const MAIN_END = 0.8 // share of the scroll taken up by the walk, the briefcase and the cards falling out
const NOTES = [
  'proudly South African',
  '...and Dutch!',
  'EU work rights, no visa needed',
  "I'm looking for jobs in Germany in 2027",
  '4 languages & counting',
]
const WALLET_SCALE = 0.136 // size of the wallet in the world, before the zoom (1 = full size)
const CARRY_TILT = 0 // degrees the briefcase hangs at in her hand
const TILT_START = 0.34 // as the camera zooms in, the case tilts to lie flat, seen from above...
const TILT_TIME = 0.14
const LID_START = 0.46 // ...then pops open
const LID_TIME = 0.16
const LANDED_TILT = -12 // degrees it lies at where it lands

// Where the cartoon clouds hang in the sky (top as a share of the screen height, left of its width)
const CLOUDS = [
  { top: 24, left: 22, scale: 0.7, o: 0.6 },
  { top: 30, left: 46, scale: 0.8, o: 0.75 },
  { top: 16, left: 58, scale: 0.9 },
  { top: 27, left: 70, scale: 1.1, o: 0.85 },
  { top: 8, left: 82, scale: 0.75, o: 0.5 },
  { top: 36, left: 8, scale: 0.6, o: 0.55 },
  { top: 38, left: 86, scale: 0.85 },
  { top: 54, left: 20, scale: 0.55, o: 0.85 },
  { top: 58, left: 62, scale: 0.5, o: 0.75 },
]

function EuRing() {
  return (
    <svg className="eu-ring" viewBox="0 0 40 40" aria-hidden="true">
      {Array.from({ length: 12 }, (_, k) => (
        <circle key={k} cx={20 + 14 * Math.sin((k * Math.PI) / 6)} cy={20 - 14 * Math.cos((k * Math.PI) / 6)} r="2.6" />
      ))}
    </svg>
  )
}

function Plane() {
  return (
    <svg className="bp-plane" viewBox="0 0 40 30" aria-hidden="true">
      <path d="M2 15 38 2 26 28 18 18Z" />
      <path d="M38 2 18 18 16 27 22 21" />
    </svg>
  )
}

// The briefcase is drawn twice in the same 900 x 840 box, and the scene cross-fades between the two while
// tilting them (--tilt), as if the camera rose above a case lying on the ground:
//  - closed, seen from the front (how she carries it), filling the bottom of the box;
//  - open, seen from above, like a real open briefcase: the lid standing up at the top with its lining,
//    envelope pocket and slots, and the deep body below with its suede floor, with odds and ends thrown in.
//    Framed on screen it is mostly the body you see; the lid runs off behind the navbar.
// Both are the same dark brown leather with silver fittings. Each drawing has a back layer (behind the cards)
// and a front layer (in front of them). In the open one, the closed lid (--lid-cover) folds up about the hinge
// at y = 300 and the inside of the lid (--lid-inner) grows up behind it, so the case pops open. The logo
// burned into the leather is added in the markup.
const BODY_PATH = 'M10 138Q10 130 20 130H420Q430 130 430 138V288Q430 310 408 310H32Q10 310 10 288Z'
const LID_PATH = 'M10 130V52Q10 30 32 30H408Q430 30 430 52V130Z'
const INK = 'var(--ink)'
const SILVER = '#cfd4db'
const SILVER_DARK = '#7d838c'
const LEATHER = 'url(#leather)'

// The closed briefcase, from the front (drawn in its own 440 x 330 space, scaled up into the bottom of the box)
function ClosedCase() {
  return (
    <svg className="wallet-svg" viewBox="0 0 900 840" aria-hidden="true">
      <defs>
        <linearGradient id="leather" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b57250" />
          <stop offset="0.55" stopColor="#8f5638" />
          <stop offset="1" stopColor="#74442b" />
        </linearGradient>
        <clipPath id="case-body-clip"><path d={BODY_PATH} /></clipPath>
        <clipPath id="case-lid-clip"><path d={LID_PATH} /></clipPath>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 -0.28" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g transform="translate(98 300) scale(1.6)">
        <path d={BODY_PATH} transform="translate(0 9)" fill="#3a2115" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <path d={BODY_PATH} fill={LEATHER} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <g clipPath="url(#case-body-clip)">
          <path d={BODY_PATH} fill="#000" filter="url(#grain)" opacity="0.55" />
          <ellipse cx="130" cy="170" rx="170" ry="30" fill="#fff" opacity="0.1" transform="rotate(-6 130 170)" />
        </g>
        <path d="M26 148H414V284Q414 296 402 296H38Q26 296 26 284Z" fill="none" stroke="#f3dcc0" strokeOpacity="0.7" strokeWidth="2.4" strokeDasharray="7 6" strokeLinecap="round" />
        {[92, 312].map((x) => (
          <g key={x} stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
            <rect x={x} y="132" width="36" height="34" rx="6" fill={SILVER} />
            <circle cx={x + 18} cy="150" r="5" fill={SILVER_DARK} />
          </g>
        ))}
        <path d={LID_PATH} fill={LEATHER} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <g clipPath="url(#case-lid-clip)">
          <path d={LID_PATH} fill="#000" filter="url(#grain)" opacity="0.55" />
          <ellipse cx="150" cy="60" rx="170" ry="20" fill="#fff" opacity="0.12" transform="rotate(-4 150 60)" />
        </g>
        <path d="M26 112V54Q26 44 36 44H404Q414 44 414 54V112" fill="none" stroke="#f3dcc0" strokeOpacity="0.7" strokeWidth="2.4" strokeDasharray="7 6" strokeLinecap="round" />
        {[92, 312].map((x) => (
          <g key={x} stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
            <rect x={x + 4} y="96" width="28" height="36" rx="5" fill={SILVER} />
            <rect x={x + 12} y="104" width="12" height="9" rx="3" fill={SILVER_DARK} />
          </g>
        ))}
        <path d="M168 30C168 -4 272 -4 272 30" fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" />
        <path d="M168 30C168 -4 272 -4 272 30" fill="none" stroke="#7a4a34" strokeWidth="9" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function Paperclip({ x, y, r }) {
  return (
    <path
      transform={`translate(${x} ${y}) rotate(${r})`}
      d="M0 8V-14A6 6 0 0 1 12 -14V12A9 9 0 0 1 -6 12V-8"
      fill="none" stroke="#7d8692" strokeWidth="2.6" strokeLinecap="round"
    />
  )
}

// A set of keys on a ring, with a little leather fob
function Keys({ x, y, r }) {
  const key = (angle, fill) => (
    <g transform={`rotate(${angle})`}>
      <path d="M-12 24A14 14 0 1 1 12 24L6 32V88L12 94L6 100V108L0 114L-6 108V32Z" fill={fill} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="0" cy="14" r="5" fill="#e3cfab" stroke={INK} strokeWidth="2" />
      <path d="M0 40V100" stroke={INK} strokeOpacity="0.35" strokeWidth="2" />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      {key(-28, '#d6dbe1')}
      {key(18, '#e0b556')}
      {key(64, '#c2c8cf')}
      <circle r="22" fill="none" stroke={INK} strokeWidth="8" />
      <circle r="22" fill="none" stroke="#d6dbe1" strokeWidth="4" />
      <g transform="rotate(200)">
        <rect x="-14" y="18" width="28" height="70" rx="12" fill="#5d3624" stroke={INK} strokeWidth="2.4" />
        <rect x="-8" y="26" width="16" height="54" rx="7" fill="none" stroke="#f3dcc0" strokeOpacity="0.6" strokeWidth="1.6" strokeDasharray="4 3" />
      </g>
    </g>
  )
}

// Reading glasses, folded and lying at an angle: both arms are folded in behind the lenses, so they show as two
// lines along the top of the frame, each ending in the little bend that goes over the ear
function Glasses({ x, y, r, size = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${size})`} stroke={INK} strokeLinejoin="round" strokeLinecap="round" fill="none">
      <path d="M-58 -8Q-62 -26 -42 -27H30Q40 -27 42 -18" strokeWidth="4" />
      <path d="M58 -8Q62 -32 42 -33H-30Q-40 -33 -42 -24" strokeWidth="4" />
      <rect x="-56" y="-20" width="48" height="36" rx="16" fill="#cfe6f6" fillOpacity="0.45" strokeWidth="4" />
      <rect x="8" y="-20" width="48" height="36" rx="16" fill="#cfe6f6" fillOpacity="0.45" strokeWidth="4" />
      <path d="M-8 -6Q0 -14 8 -6" strokeWidth="4" />
      <rect x="-62" y="-14" width="8" height="10" rx="2" fill="#2a2d33" strokeWidth="2" />
      <rect x="54" y="-14" width="8" height="10" rx="2" fill="#2a2d33" strokeWidth="2" />
      <path d="M-46 -12L-30 4M18 -12L34 4" stroke="#fff" strokeOpacity="0.7" strokeWidth="3" />
    </g>
  )
}

// The open case is not a box: its body has big rounded corners and sides that bow out a little, like a real
// leather briefcase seen from above. Body outline, the suede inside, and the lid (all in the 900 x 840 box).
const CASE_BODY = 'M96 300H804Q870 300 876 366Q886 550 876 734Q870 800 800 800H100Q30 800 24 734Q14 550 24 366Q30 300 96 300Z'
const CASE_INSIDE = 'M116 328H784Q836 328 842 380Q850 548 842 700Q836 752 784 752H116Q64 752 58 700Q50 548 58 380Q64 328 116 328Z'
const CASE_LID = 'M104 12H796Q858 12 864 72Q870 190 872 300H28Q30 190 36 72Q42 12 104 12Z'

// Open briefcase, back layer: the lid standing open (pops up, and runs off behind the navbar), the body with
// its suede floor, and the things lying at the bottom under the cards (a pile of papers, a pen, a lipstick)
function OpenCaseBack() {
  return (
    <svg className="wallet-svg" viewBox="0 0 900 840" aria-hidden="true">
      <defs>
        <linearGradient id="suede" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9a17a" />
          <stop offset="0.14" stopColor="#d9c39c" />
          <stop offset="1" stopColor="#e3cfab" />
        </linearGradient>
        <radialGradient id="suede-floor" cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#ecdcbd" />
          <stop offset="1" stopColor="#e3cfab" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* the lid, standing open: leather shell, suede lining, an envelope pocket with a snap and a slot pocket */}
      <g className="open-lid-inner">
        <path d={CASE_LID} fill={LEATHER} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M110 36H790Q838 36 842 84Q846 190 848 286H52Q54 190 58 84Q62 36 110 36Z" fill="#e2cda6" stroke={INK} strokeWidth="2.5" />
        <rect x="90" y="56" width="720" height="122" rx="14" fill="#7f4b30" stroke={INK} strokeWidth="2.5" />
        <path d="M90 70Q90 56 104 56H796Q810 56 810 70V126L456 172Q450 174 444 172L90 126Z" fill="#9a5c3c" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M102 66H798V118L450 162L102 118Z" fill="none" stroke="#f3dcc0" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="6 5" />
        <circle cx="450" cy="154" r="9" fill={SILVER} stroke={INK} strokeWidth="2.2" />
        <rect x="90" y="192" width="720" height="80" rx="14" fill="#85502f" stroke={INK} strokeWidth="2.5" />
        <rect x="170" y="232" width="560" height="24" rx="6" fill="none" stroke="#f3dcc0" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="5 4" />
        {[60, 804].map((x) => (
          <rect key={x} x={x} y="2" width="36" height="24" rx="6" fill={SILVER} stroke={INK} strokeWidth="2.5" />
        ))}
      </g>

      {/* the body, open: its thickness, the leather rim with piping stitched round it, and the suede inside */}
      <path d={CASE_BODY} transform="translate(0 10)" fill="#3a2115" stroke={INK} strokeWidth="3.5" />
      <path d={CASE_BODY} fill={LEATHER} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M100 312H800Q858 312 864 370Q872 550 864 730Q858 788 798 788H102Q42 788 36 730Q28 550 36 370Q42 312 100 312Z" fill="none" stroke="#f3dcc0" strokeOpacity="0.5" strokeWidth="2.2" strokeDasharray="7 6" />
      <path d={CASE_INSIDE} fill="url(#suede)" stroke={INK} strokeWidth="2.5" />
      <path d={CASE_INSIDE} fill="url(#suede-floor)" />

      {/* a pile of papers, one sheet on top of the next, peeking out from under the passports */}
      <g stroke={INK} strokeWidth="2" strokeLinejoin="round" transform="translate(-196 -12)">
        <g transform="rotate(8 470 500)">
          <rect x="370" y="372" width="200" height="256" rx="3" fill="#ece7dc" />
          <path d="M390 404H550M390 424H546M390 444H552M390 464H512" stroke="#b9c3d2" strokeWidth="2" />
        </g>
        <g transform="rotate(-4 430 494)">
          <rect x="330" y="366" width="200" height="256" rx="3" fill="#f4f0e7" />
          <path d="M350 398H510M350 418H506M350 438H512M350 458H470" stroke="#b9c3d2" strokeWidth="2" />
          <path d="M490 590L508 606M486 600L504 616" stroke="#c2416b" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g transform="rotate(-12 392 488)">
          <rect x="292" y="360" width="200" height="256" rx="3" fill="#fbf8f1" />
          <path d="M312 392H470M312 412H472M312 432H456M312 452H470M312 472H436M312 492H464M312 512H450" stroke="#b9c3d2" strokeWidth="2" />
          <path d="M300 372L316 364" stroke="#7d8692" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>

      {/* a pen lying near the front */}
      <g transform="rotate(-6 700 724)" stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <rect x="620" y="718" width="150" height="13" rx="6.5" fill="#0e4798" />
        <path d="M770 718L794 724.5L770 731Z" fill="#f3dcc0" />
        <rect x="620" y="718" width="26" height="13" rx="6.5" fill="#dfa4b8" />
      </g>

      {/* a lipstick, uncapped, with its cap beside it */}
      <g transform="rotate(38 110 690)" stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <rect x="98" y="676" width="26" height="44" rx="3" fill="#1a1a1a" />
        <rect x="100" y="665" width="22" height="13" rx="2" fill="#e0b556" />
        <path d="M102 665V647L120 638V665Z" fill="#c2253f" />
      </g>
      <rect x="150" y="700" width="24" height="42" rx="4" transform="rotate(-24 162 721)" fill="#1a1a1a" stroke={INK} strokeWidth="2.2" />


    </svg>
  )
}

// Open briefcase, front layer: things thrown in on top of the cards (keys, paperclips, reading glasses), the
// clasps and handle on the front of the case, and the closed lid, which folds up out of the way as it opens
function OpenCaseFront() {
  return (
    <svg className="wallet-svg" viewBox="0 0 900 840" aria-hidden="true">
      <defs>
        <clipPath id="cover-clip"><path d={CASE_BODY} /></clipPath>
      </defs>
      <g className="open-extras">
        <Paperclip x={724} y={398} r={28} />
        <Paperclip x={272} y={372} r={-62} />
        <Keys x={268} y={690} r={-118} />
        <Glasses x={520} y={690} r={-8} size={1.8} />
      </g>

      {/* clasps and handle on the front of the case */}
      {[96, 768].map((x) => (
        <g key={x} stroke={INK} strokeWidth="2.5">
          <rect x={x} y="762" width="36" height="28" rx="6" fill={SILVER} />
          <circle cx={x + 18} cy="776" r="4.5" fill={SILVER_DARK} />
        </g>
      ))}
      <path d="M392 804V818Q392 830 404 830H496Q508 830 508 818V804" fill="none" stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <path d="M392 804V818Q392 830 404 830H496Q508 830 508 818V804" fill="none" stroke="#7a4a34" strokeWidth="10" strokeLinecap="round" />

      {/* the closed lid, lying over the body until it flips up */}
      <g className="open-lid-cover">
        <path d={CASE_BODY} fill={LEATHER} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <g clipPath="url(#cover-clip)">
          <rect x="10" y="300" width="880" height="500" fill="#000" filter="url(#grain)" opacity="0.5" />
          <ellipse cx="300" cy="380" rx="340" ry="52" fill="#fff" opacity="0.1" transform="rotate(-4 300 380)" />
        </g>
        <path d="M100 312H800Q858 312 864 370Q872 550 864 730Q858 788 798 788H102Q42 788 36 730Q28 550 36 370Q42 312 100 312Z" fill="none" stroke="#f3dcc0" strokeOpacity="0.6" strokeWidth="2.4" strokeDasharray="7 6" />
      </g>
    </svg>
  )
}

// Quick facts as things you'd find in a wallet: two passports, a work permit card, a boarding pass and a
// phone. On wide screens a girl walks across the screen and drops a wallet as you scroll; the camera zooms
// into it and it spits the items out.
export default function FactsWallet() {
  const wide = useWide()
  const scroller = useRef(null)
  const stage = useRef(null)
  const wallet = useRef(null)

  // Pins the scene while you scroll. A cartoon girl walks across the screen carrying the wallet and drops
  // it. The camera then zooms in on the wallet, which spits out its items one after another; they grow
  // to full size and slide across until they sit in a row.
  useEffect(() => {
    if (!wide) return
    const wrap = scroller.current
    const view = stage.current
    const bag = wallet.current
    const parts = [...view.querySelectorAll('.wallet-part')]
    const items = [...view.querySelectorAll('.item')]
    const world = view.querySelector('.world')
    const notes = [...view.querySelectorAll('.note')]
    const lines = [...view.querySelectorAll('.note-line')]
    const heads = [...view.querySelectorAll('.note-head')]
    const pen = view.querySelector('.note-pen')
    const girl = view.querySelector('.girl')
    let frame = 0

    const update = () => {
      frame = 0
      const vw = view.clientWidth
      const vh = view.clientHeight
      const range = wrap.offsetHeight - vh
      const raw = range > 0 ? clamp01(-wrap.getBoundingClientRect().top / range) : 0
      const p = clamp01(raw / MAIN_END) // the walk, the briefcase and the cards
      const a = clamp01((raw - MAIN_END) / (1 - MAIN_END)) // then the pen writing its notes
      const bw = bag.offsetWidth
      const bh = bag.offsetHeight
      // The wallet's full-size frame: where it ends up, in the middle of the screen
      const bx = (vw - bw) / 2
      const by = vh - bh - 24 // open, the case sits a little above the bottom and the lid runs off the top, behind the navbar
      const anchor = { x: bx + bw / 2, y: by + bh } // bottom middle of the wallet
      const sizes = items.map((item) => [item.offsetWidth, item.offsetHeight])

      // --- the girl: walks left to right, her legs swinging (the picture is 1365 x 2048, feet at y = 1990) ---
      const ph = Math.min(420, Math.max(260, vh * 0.46)) // her height on screen
      const gs = ph / 2048
      const groundY = vh * 0.8
      const girlX = (walk) => lerp(-ph * 0.3, vw + ph * 0.4, walk) // where the middle of her stride is
      const swingAt = (x) => Math.sin(x / (ph * 0.17)) * 26
      // Where her back hand (picture coordinates 295, 1035) is, for a given walking position: it swings with
      // the back arm, about the shoulder at (470, 780)
      const handAt = (x) => {
        const a = (swingAt(x) * -0.16 * Math.PI) / 180
        const dx = 295 - 470
        const dy = 1035 - 780
        return {
          x: x + (470 + dx * Math.cos(a) - dy * Math.sin(a) - 682) * gs,
          y: groundY + (780 + dx * Math.sin(a) + dy * Math.cos(a) - 1990) * gs,
        }
      }
      const gx = girlX(clamp01(p / WALK_END))
      const swing = swingAt(gx)
      girl.style.width = `${1365 * gs}px`
      girl.style.translate = `${(gx - 682 * gs).toFixed(1)}px ${(groundY - 1990 * gs - Math.abs(Math.sin(gx / (ph * 0.17))) * 5).toFixed(1)}px`
      girl.style.setProperty('--sw', swing.toFixed(2))
      girl.style.setProperty('--hs', (Math.sin(gx / (ph * 0.17) - 1.1) * 7 + Math.sin(gx / (ph * 0.06)) * 3).toFixed(2))
      view.style.setProperty('--ground', `${groundY}px`)

      // --- the wallet: in her hand, then falling and bouncing, then lying where it landed ---
      const half = bh * WALLET_SCALE * 0.65 // the briefcase hangs from her hand by its handle (the closed case's handle is 65% of the way up its box)
      const dropAt = handAt(girlX(DROP / WALK_END))
      const land = { x: dropAt.x, y: groundY }
      const dropT = clamp01((p - DROP) / DROP_TIME)
      let at
      let wrot
      if (p < DROP) {
        const hand = handAt(gx)
        at = { x: hand.x, y: hand.y + half }
        wrot = CARRY_TILT - swing * 0.15
      } else {
        at = { x: land.x, y: lerp(dropAt.y + half, land.y, easeOutBounce(dropT)) }
        wrot = lerp(CARRY_TILT, LANDED_TILT, easeOut(clamp01(dropT * 1.6)))
      }

      // --- the camera zooms in on the wallet and carries it to the middle of the screen ---
      const zoom = easeInOut(clamp01((p - ZOOM_START) / (ZOOM_END - ZOOM_START)))
      const S = lerp(1, 1 / WALLET_SCALE, zoom)
      const focus = { x: lerp(land.x, anchor.x, zoom), y: lerp(land.y, anchor.y, zoom) }
      if (zoom > 0) at = focus
      if (zoom > 0) wrot = lerp(LANDED_TILT, 0, zoom)
      world.style.transform = `translate(${(focus.x - land.x * S).toFixed(1)}px, ${(focus.y - land.y * S).toFixed(1)}px) scale(${S.toFixed(4)})`
      world.style.opacity = (1 - clamp01((zoom - 0.15) / 0.7)).toFixed(3) // gone completely by the end of the zoom

      // Once the last item is out, the wallet lifts away off the top of the screen
      const away = easeInOut(clamp01((p - 0.9) / 0.09))
      const ws = WALLET_SCALE * S
      // The case tilts until it lies flat, seen from above (the closed front view fades into the open one)...
      const tilt = easeInOut(clamp01((p - TILT_START) / TILT_TIME))
      // ...then the lid flips open like a page turning: the closed lid folds up to nothing about the hinge, then
      // the inside of the lid grows up from it
      const lt = clamp01((p - LID_START) / LID_TIME)
      const flip = easeInOut(lt) * (1 + 0.05 * Math.sin(lt * Math.PI)) // slow start and finish, a touch of overshoot
      const lidCover = flip < 0.5 ? Math.cos(flip * Math.PI) : 0
      const lidInner = flip < 0.5 ? 0 : flip <= 1 ? -Math.cos(flip * Math.PI) : 1 + (flip - 1) * 0.3
      for (const part of parts) {
        part.style.left = `${bx}px`
        part.style.top = `${by}px`
        part.style.translate = `${(at.x - anchor.x).toFixed(1)}px ${(at.y - anchor.y - away * (by + bh + 120)).toFixed(1)}px`
        part.style.rotate = `${wrot.toFixed(2)}deg`
        part.style.scale = ws.toFixed(4)
        part.style.setProperty('--tilt', tilt.toFixed(3))
        part.style.setProperty('--lid-cover', lidCover.toFixed(3))
        part.style.setProperty('--lid-inner', lidInner.toFixed(3))
      }
      const rad = (wrot * Math.PI) / 180

      const finals = []
      // In the briefcase each card keeps the same size relative to the case, whatever the screen size
      const peek = (IN_CASE * (bw / 900)) / (sizes[0][0] / 0.84)
      // Scattered over the screen the cards are shrunk a little if need be, so the tallest is under half the screen
      const fin = Math.min(1, (vh * 0.44) / Math.max(...sizes.map(([, h]) => h)))
      items.forEach((item, i) => {
        const [w, h] = sizes[i]
        const t = clamp01((p - FIRST_ITEM - i * ITEM_STEP) / ITEM_TIME)
        const u = clamp01(t / 0.38) // 0 → 1 while it is spat out of the wallet and falls
        const v = easeInOut(clamp01((t - 0.38) / 0.62)) // 0 → 1 while it slides across
        // Lying in the open briefcase where it was thrown, carried along with the case: the card's centre is
        // put on its spot (THROWN, in the 900 x 840 box), allowing for the card turning about its top left corner
        const spot = THROWN[i]
        const k = bw / 900
        const r0 = (spot.r * Math.PI) / 180
        const hw = (w * peek) / 2
        const hh = (h * peek) / 2
        const lx = (spot.x - 450) * k - (hw * Math.cos(r0) - hh * Math.sin(r0))
        const ly = (spot.y - 840) * k - (hw * Math.sin(r0) + hh * Math.cos(r0))
        const x0 = at.x + (lx * Math.cos(rad) - ly * Math.sin(rad)) * ws
        const y0 = at.y - away * (by + bh + 120) + (lx * Math.sin(rad) + ly * Math.cos(rad)) * ws
        const fallX = x0 + DRIFT[i]
        const fallY = Math.min(vh * 0.85, by + bh + 40)
        const rest = SCATTER[i]
        const endX = rest.x * vw - (w * fin) / 2
        const endY = Math.max(84, rest.y * vh - (h * fin) / 2)
        finals[i] = { x: endX, y: endY, w: w * fin, h: h * fin }
        // Spat out: up in an arc first, then down
        const x = lerp(lerp(x0, fallX, u), endX, v)
        const y = lerp(y0 + (fallY - y0) * u * u - 420 * u * (1 - u), endY, v)
        const rot = lerp(TUMBLE[i] * Math.sin(u * Math.PI * 0.5) + (1 - u) * (spot.r + wrot), rest.r, v)
        const scale = lerp(peek * ws, fin, easeInOut(clamp01(t / 0.7)))
        item.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`
        item.style.rotate = `${rot.toFixed(2)}deg`
        item.style.scale = scale.toFixed(3)
        // Lying in the case from the moment it tilts flat (hidden under the closed lid until it opens; out of
        // sight before that, while she carries it), under the keys, glasses and paperclips while in it, and in front of
        // everything once it is out
        item.style.zIndex = u > 0.3 ? 5 : 2
        item.style.opacity = tilt > 0.03 ? 1 : 0
        if (t > 0.85) item.classList.add('in')
      })

      // --- the pen writes a note beside each card, then draws an arrow to it ---
      const n = notes.length
      const geo = notes.map((el, i) => {
        const f = finals[i]
        const tw = el.offsetWidth
        const th = el.offsetHeight
        const side = SCATTER[i].note
        const bend = i % 2 ? 1 : -1 // which way the arrow curves
        let left
        let top
        let start
        let end
        let ctrl
        if (side === 'below' || side === 'above') {
          const below = side === 'below'
          const cx = Math.min(vw - tw / 2 - 16, Math.max(tw / 2 + 16, f.x + f.w / 2))
          left = cx - tw / 2
          top = below ? Math.min(vh - th - 24, f.y + f.h + 72) : Math.max(84, f.y - 72 - th)
          start = { x: cx + bend * Math.min(40, tw * 0.15), y: below ? top - 6 : top + th + 6 }
          end = { x: f.x + f.w * (0.5 + bend * 0.14), y: below ? f.y + f.h + 8 : f.y - 8 }
          ctrl = { x: (start.x + end.x) / 2 + bend * 46, y: (start.y + end.y) / 2 }
        } else {
          const right = side === 'right'
          left = right ? f.x + f.w + 56 : f.x - 56 - tw
          top = f.y + f.h * 0.5 - th / 2
          start = { x: right ? left - 6 : left + tw + 6, y: top + th * 0.4 }
          end = { x: right ? f.x + f.w + 8 : f.x - 8, y: f.y + f.h * 0.38 }
          ctrl = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 - 40 }
        }
        const ang = Math.atan2(end.y - ctrl.y, end.x - ctrl.x)
        const tip = (d) => `${(end.x - 15 * Math.cos(ang + d)).toFixed(1)} ${(end.y - 15 * Math.sin(ang + d)).toFixed(1)}`
        el.style.translate = `${left.toFixed(1)}px ${top.toFixed(1)}px`
        lines[i].setAttribute('d', `M${start.x.toFixed(1)} ${start.y.toFixed(1)}Q${ctrl.x.toFixed(1)} ${ctrl.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`)
        heads[i].setAttribute('d', `M${tip(-0.5)}L${end.x.toFixed(1)} ${end.y.toFixed(1)}L${tip(0.5)}`)
        return { left, top, th, tw, end }
      })
      // each note gets an equal share of the scroll: write the words, draw the arrow, then move on
      const prog = notes.map((el, i) => {
        const u = clamp01(a * n - i)
        const written = easeInOut(clamp01(u / 0.5))
        const drawn = clamp01((u - 0.5) / 0.35)
        el.style.setProperty('--w', `${(written * 100).toFixed(1)}%`)
        lines[i].style.strokeDashoffset = (1 - drawn).toFixed(3)
        heads[i].style.strokeDashoffset = (1 - clamp01((drawn - 0.85) / 0.15)).toFixed(3)
        return { u, written, drawn }
      })
      const cur = Math.min(n - 1, Math.floor(a * n))
      const { u, written, drawn } = prog[cur]
      const g = geo[cur]
      let px
      let py
      if (u < 0.5) {
        px = g.left + g.tw * written + 3
        py = g.top + g.th * 0.8
      } else if (u < 0.85 || cur === n - 1) {
        const path = lines[cur]
        const pt = path.getPointAtLength(path.getTotalLength() * drawn)
        px = pt.x
        py = pt.y
      } else {
        const next = geo[cur + 1]
        const k = easeInOut((u - 0.85) / 0.15)
        px = lerp(g.end.x, next.left, k)
        py = lerp(g.end.y, next.top + next.th * 0.8, k) - Math.sin(k * Math.PI) * 36
      }
      pen.style.translate = `${px.toFixed(1)}px ${py.toFixed(1)}px`
      pen.style.opacity = a > 0 ? 1 : 0
    }

    const onScroll = () => {
      frame ||= requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      for (const part of parts) {
        part.style.translate = ''
        part.style.rotate = ''
        part.style.scale = ''
      }
      for (const item of items) {
        item.style.zIndex = ''
        item.style.opacity = ''
        item.style.translate = ''
        item.style.rotate = ''
        item.style.scale = ''
      }
    }
  }, [wide])

  // In the wallet scene the scroll drives each item; otherwise they tilt and reveal like other cards.
  const item = (kind, delay) =>
    wide
      ? { className: `item ${kind}` }
      : { className: `item ${kind} tilt reveal`, style: { '--d': `${delay}ms` } }

  return (
    <section id="facts" className={`section wallet-section${wide ? ' pinned' : ''}`} aria-label="Quick facts">
      <div className="wallet-scroller" ref={scroller}>
        <div className="wallet-stage" ref={stage}>
          {wide && (
            <>
              {/* The world the girl walks through: sky, sun, clouds and grass. The camera zooms into it. */}
              <div className="world" aria-hidden="true">
                <span className="sky" />
                <span className="cloud-bank" />
                {["l5", "l4", "l3", "l2", "l1"].map((layer) => (
                  <span key={layer} className={`cloud-bank ${layer}`} />
                ))}
                <span className="sun" />
                {CLOUDS.map((c, i) => (
                  <span key={i} className="cloud" style={{ top: `${c.top}vh`, left: `${c.left}vw`, scale: c.scale, opacity: c.o ?? 1, '--delay': `${-i * 2.3}s` }} />
                ))}
                <span className="ground" />
                <Girl />
                <span className="grass-front" />
              </div>
              {/* The briefcase: closed (front view) and open (from above), each with a back layer behind the cards
                  and a front layer in front of them */}
              <span className="wallet-part wallet-back" ref={wallet} aria-hidden="true">
                <span className="case-open"><OpenCaseBack /></span>
              </span>
              <span className="wallet-part wallet-front" aria-hidden="true">
                <span className="case-open">
                  <OpenCaseFront />
                  <span className="wallet-brand top"><i className="shine" /><i className="scorch" /><i className="burn" /></span>
                </span>
                <span className="case-closed">
                  <ClosedCase />
                  {/* my logo, burned into the leather: a dark brown stamp with a scorched halo and a lit lower edge */}
                  <span className="wallet-brand closed"><i className="shine" /><i className="scorch" /><i className="burn" /></span>
                </span>
              </span>
            </>
          )}

          <ul className="facts">
            <li {...item('passport za', 0)}>
              <img src="/passports/SA.jpeg" alt="South African passport" draggable="false" />
            </li>

            <li {...item('passport nl', 80)}>
              <img src="/passports/NETHERLANDS.jpeg" alt="Dutch passport" draggable="false" />
            </li>

            {/* Work rights: an EU work authorisation card, like the ID cards kept in a wallet */}
            <li {...item('permit', 160)}>
              {/* the lanyard it hangs from: a striped strap looping up from a metal clip */}
              {/* the long lanyard it hangs from, lying in a loose loop around the badge, clipped on at the top */}
              <svg className="permit-lanyard" aria-hidden="true">
                {['var(--ink)', '#f7de93', '#fbf8f1'].map((stroke, k) => (
                  <path
                    key={stroke}
                    d="M-4 -4C10 -54 84 -56 114 -12C142 30 128 170 132 262C136 344 92 424 20 432C-52 440 -112 402 -120 330C-128 250 -100 122 -96 62C-92 12 -40 -22 -4 -4"
                    fill="none"
                    stroke={stroke}
                    strokeWidth={k ? 7.5 : 13}
                    strokeLinecap="round"
                    strokeDasharray={k === 2 ? '3 7' : undefined}
                    opacity={k === 2 ? 0.7 : 1}
                  />
                ))}
                <rect x="-9" y="-10" width="18" height="22" rx="5" fill="#c9ced6" stroke="var(--ink)" strokeWidth="2.5" />
                <rect x="-4" y="-4" width="8" height="5" rx="2" fill="var(--ink)" />
              </svg>
              <span className="permit-card">
                <span className="permit-slot" aria-hidden="true" />
                <span className="permit-head">
                  <EuRing />
                  <span>
                    <strong>EU work authorisation</strong>
                    <small>Right to work · Recht auf Arbeit</small>
                  </span>
                </span>
                <span className="permit-body">
                  <img className="permit-photo" src="/profile.jpeg" alt="" />
                  <span className="permit-fields">
                    <span><small>Name</small>Anja van Staden</span>
                    <span><small>Nationality</small>Dutch · NLD</span>
                    <span><small>Valid</small>Unlimited</span>
                  </span>
                </span>
                <span className="permit-stamp" aria-hidden="true">
                  <span>✓ No visa</span>
                  <small>needed</small>
                </span>
                <span className="permit-note">EU authorisation, no visa or sponsorship needed</span>
                <span className="permit-mrz" aria-hidden="true">P&lt;NLDVAN&lt;STADEN&lt;&lt;ANJA&lt;&lt;&lt;&lt;&lt;&lt;</span>
              </span>
            </li>

            {/* Looking for: a boarding pass from Stellenbosch to Germany */}
            <li {...item('ticket', 240)}>
              <span className="bp-main">
                <span className="bp-head">
                  <strong>Boarding pass</strong>
                  <span>Economy</span>
                </span>
                <span className="bp-route" aria-hidden="true">
                  <span className="bp-stop">
                    <strong>ZA</strong>
                    <small>Stellenbosch</small>
                  </span>
                  <Plane />
                  <span className="bp-stop">
                    <strong>DE</strong>
                    <small>Germany</small>
                  </span>
                </span>
                <span className="bp-grid" aria-hidden="true">
                  <span><small>Passenger</small>A. VAN STADEN</span>
                  <span><small>Flight</small>AVS 2027</span>
                  <span><small>Gate</small>DE</span>
                  <span><small>Seat</small>1A</span>
                </span>
                <span className="bp-note">Looking for roles anywhere in Germany from 2027</span>
              </span>
              {/* the tear-off stub, along a perforated line with a notch at each end */}
              <span className="bp-stub" aria-hidden="true">
                <span className="bp-notch top" />
                <span className="bp-notch bottom" />
                <strong>ZA → DE</strong>
                <span>Departs 2027</span>
                <span>Seat 1A</span>
                <span className="bp-barcode" />
              </span>
            </li>

            {/* Languages: a phone showing a chat in each language */}
            <li {...item('phone', 320)}>
              <span className="phone-screen">
                <span className="phone-status" aria-hidden="true">
                  <span>9:41</span>
                  <i className="phone-island" />
                  <span>5G ▮▮▮</span>
                </span>
                <span className="phone-bar">
                  <span className="phone-avatar" aria-hidden="true">Aa</span>
                  <strong>Languages</strong>
                </span>
                <ul className="bubbles">
                  {languages.map((l, i) => (
                    <li key={l.name} className={`bubble${i % 2 ? ' me' : ''}`} style={{ '--b': i }}>
                      <span className="bubble-hello">
                        {l.hello}
                        {l.typing && <span className="typing"><i /><i /><i /></span>}
                      </span>
                      <span className="bubble-lang">{l.name} · {l.level}</span>
                    </li>
                  ))}
                </ul>
              </span>
              <span className="phone-home" aria-hidden="true" />
            </li>
          </ul>

          {/* After the briefcase has gone, a pen writes a note beside each card and draws an arrow to it */}
          {wide && (
            <div className="notes" aria-hidden="true">
              <svg className="notes-svg">
                {NOTES.map((text) => (
                  <g key={text}>
                    <path className="note-line" pathLength="1" />
                    <path className="note-head" pathLength="1" />
                  </g>
                ))}
              </svg>
              {NOTES.map((text) => (
                <span key={text} className="note">{text}</span>
              ))}
              <svg className="note-pen" viewBox="0 0 10 10">
                <g transform="rotate(35)" stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round">
                  <path d="M-6 -16L6 -16L0 0Z" fill="#f3dcc0" />
                  <rect x="-7" y="-78" width="14" height="62" rx="6" fill="#0e4798" />
                  <rect x="-7" y="-78" width="14" height="12" rx="6" fill="#dfa4b8" />
                  <path d="M-1.6 -3L1.6 -3L0 0Z" fill="var(--ink)" stroke="none" />
                  <rect x="-2" y="-62" width="4" height="40" rx="2" fill="#fff" fillOpacity="0.45" stroke="none" />
                </g>
              </svg>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
