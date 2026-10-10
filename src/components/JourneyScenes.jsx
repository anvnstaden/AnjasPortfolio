// Illustrated postcards for the "My Journey" timeline, one per place. They use fixed colours (like the
// flags) so they look the same in light and dark mode. Every `.sprout` group pops up out of the
// ground, staggered by --d, once its postcard scrolls into view; the other classes are idle animations.
const ink = '#000a1a'
const ivory = '#fbf8f1'
const blue = '#0e4798'
const pink = '#dfa4b8'
const butter = '#f7de93'
const grass = '#9dbb7a'
const leaf = '#4f7a4a'

function Sprout({ d, children }) {
  return (
    <g className="sprout" style={{ '--d': `${d}ms` }}>
      {children}
    </g>
  )
}

function Cloud({ x, y, s = 1, className = 'drift' }) {
  return (
    <g className={className}>
      <path
        transform={`translate(${x} ${y}) scale(${s})`}
        d="M0 20Q0 8 12 8Q16-4 30 0Q40-6 48 6Q60 6 60 20Z"
        fill={ivory}
      />
    </g>
  )
}

function Birds({ x, y }) {
  return (
    <g className="birds" transform={`translate(${x} ${y})`} fill="none" strokeWidth="2">
      <path className="flap" d="M0 0q5-5 10 0q5-5 10 0" />
      <path className="flap late" d="M24 10q4-4 8 0q4-4 8 0" />
    </g>
  )
}

// A small house: walls, a pitched roof, a door and a window. `base` is the ground line.
function House({ x, base, w, h, roof = pink, wall = ivory }) {
  return (
    <>
      <rect x={x} y={base - h} width={w} height={h} fill={wall} />
      <path d={`M${x - 4} ${base - h}L${x + w / 2} ${base - h - w * 0.45}L${x + w + 4} ${base - h}Z`} fill={roof} />
      <rect x={x + w * 0.15} y={base - h * 0.55} width={w * 0.25} height={h * 0.55} fill={blue} />
      <rect x={x + w * 0.55} y={base - h * 0.75} width={w * 0.3} height={h * 0.3} fill={butter} />
    </>
  )
}

function Tree({ x, base, r = 18, trunk = 26 }) {
  return (
    <g className="sway">
      <path d={`M${x - 3} ${base}L${x - 2} ${base - trunk}L${x + 2} ${base - trunk}L${x + 3} ${base}Z`} fill="#7a5236" />
      <circle cx={x - r * 0.55} cy={base - trunk - r * 0.2} r={r * 0.7} fill={leaf} />
      <circle cx={x + r * 0.55} cy={base - trunk - r * 0.2} r={r * 0.7} fill={leaf} />
      <circle cx={x} cy={base - trunk - r * 0.7} r={r} fill={leaf} />
    </g>
  )
}

// Two rows of waves that roll sideways (the path is longer than the scene so it can loop).
function Waves({ y }) {
  const row = (yy) => `M-40 ${yy}` + ' q10 -6 20 0 t20 0'.repeat(14)
  return (
    <g fill="none" stroke={ivory} strokeWidth="2" opacity="0.7">
      <path className="roll" d={row(y)} />
      <path className="roll slow" d={row(y + 16)} />
    </g>
  )
}

function Sparkle({ x, y, s = 1 }) {
  return (
    <path
      className="twinkle"
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0-8C1-3 3-1 8 0C3 1 1 3 0 8C-1 3-3 1-8 0C-3-1-1-3 0-8Z"
      fill={butter}
      strokeWidth="1"
    />
  )
}

/* ---------- Mossel Bay: the bay, Cape St Blaize lighthouse, Dias's caravel, dolphins and Point High ---------- */
export function MosselBay() {
  return (
    <svg className="scene" viewBox="0 0 480 300" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" aria-hidden="true">
      <defs>
        <linearGradient id="sky-mb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9c6ee" />
          <stop offset="1" stopColor="#fbe7b0" />
        </linearGradient>
        <clipPath id="above-water-mb">
          <rect width="480" height="204" />
        </clipPath>
      </defs>
      <rect width="480" height="300" fill="url(#sky-mb)" stroke="none" />
      <circle className="glow" cx="110" cy="70" r="26" fill={butter} />
      <Cloud x={250} y={40} />
      <Cloud x={30} y={110} s={0.7} className="drift slow" />
      <Birds x={230} y={92} />

      {/* Headland with the lighthouse and its sweeping beam */}
      <path d="M286 200C306 168 326 134 362 124L480 112V200Z" fill="#c9b48a" />
      <path d="M330 140C340 130 350 126 362 124L480 112V122L364 132C352 134 342 138 334 146Z" fill={grass} />
      <Sprout d={500}>
        <path className="beam" d="M431 48L320 26V70Z" fill={butter} stroke="none" opacity="0.6" />
        <path d="M420 116L424 60H438L442 116Z" fill={ivory} />
        <path d="M422.7 90L423.3 80H438.7L439.3 90Z" fill={pink} strokeWidth="2" />
        <rect x="423" y="42" width="16" height="14" fill={butter} />
        <rect x="418" y="55" width="26" height="6" fill={ink} />
        <path d="M420 42L431 30L442 42Z" fill={pink} />
      </Sprout>

      {/* The bay */}
      <rect y="182" width="480" height="70" fill={blue} stroke="none" />
      <line x1="0" y1="182" x2="480" y2="182" />
      <Waves y={198} />

      {/* A dolphin leaping out of the water */}
      <g clipPath="url(#above-water-mb)">
        <g className="leap">
          <path d="M320 206C326 186 346 178 362 188L370 182L368 194C362 192 354 188 346 190C338 192 332 198 330 206Z" fill="#6f8fc7" />
        </g>
      </g>

      {/* Replica of Bartolomeu Dias's caravel, bobbing in the bay */}
      <Sprout d={700}>
        <g className="bob">
          <line x1="175" y1="190" x2="175" y2="126" />
          <line x1="207" y1="190" x2="207" y2="138" />
          <path d="M175 126L190 130L175 135Z" fill={pink} strokeWidth="2" />
          <path d="M162 134Q175 140 188 134V170Q175 176 162 170Z" fill={ivory} />
          <path d="M175 142V164M167 152H183" stroke="#c0392b" strokeWidth="3.5" />
          <path d="M196 146Q207 151 218 146V176Q207 181 196 176Z" fill={ivory} />
          <path d="M207 152V170M200 160H214" stroke="#c0392b" strokeWidth="3" />
          <path d="M146 184H236L224 200H160Z" fill="#8a5a3c" />
        </g>
      </Sprout>

      {/* The town on the shore */}
      <path d="M0 236Q120 224 240 234T480 230V300H0Z" fill="#e9d6a6" />
      <path d="M0 250Q140 240 260 250T480 246V300H0Z" fill={grass} />

      {/* Point High School */}
      <Sprout d={900}>
        <rect x="24" y="204" width="152" height="44" fill={ivory} />
        <rect x="20" y="198" width="160" height="7" fill={ink} />
        <rect x="74" y="176" width="52" height="72" fill={butter} />
        <rect x="70" y="171" width="60" height="6" fill={ink} />
        <text x="100" y="192" textAnchor="middle" className="scene-label" stroke="none" fill={ink}>POINT HIGH</text>
        {[34, 50, 136, 152].map((x) => (
          <g key={x}>
            <rect x={x} y="212" width="10" height="11" fill={blue} strokeWidth="2" />
            <rect x={x} y="230" width="10" height="11" fill={blue} strokeWidth="2" />
          </g>
        ))}
        <rect x="90" y="222" width="20" height="26" fill={blue} />
        <line x1="194" y1="248" x2="194" y2="160" />
        <path className="wave-flag" d="M194 162L216 166L194 172Z" fill={pink} strokeWidth="2" />
      </Sprout>
      <Sprout d={1100}>
        <House x={238} base={248} w={34} h={28} />
        <House x={284} base={246} w={28} h={24} roof={butter} />
      </Sprout>
      <Sprout d={1250}>
        <Tree x={345} base={246} r={20} />
      </Sprout>
      <Sprout d={1400}>
        <House x={380} base={244} w={40} h={30} roof="#8fb0e6" />
        <House x={432} base={243} w={30} h={24} />
      </Sprout>
    </svg>
  )
}

/* ---------- Stellenbosch: mountains, vineyards, oaks, the Moederkerk, a Cape Dutch gable and the Ou Hoofgebou ---------- */
export function Stellenbosch() {
  return (
    <svg className="scene" viewBox="0 0 480 300" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" aria-hidden="true">
      <defs>
        <linearGradient id="sky-st" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4c3cf" />
          <stop offset="1" stopColor="#fbe7b0" />
        </linearGradient>
      </defs>
      <rect width="480" height="300" fill="url(#sky-st)" stroke="none" />
      <circle className="glow" cx="396" cy="78" r="30" fill={butter} />
      <Cloud x={60} y={36} s={0.9} />
      <Birds x={300} y={44} />

      {/* Mountains, then hills covered in vineyard rows */}
      <path d="M-4 170L40 118L70 134L112 76L142 100L172 66L212 114L252 92L300 138L340 98L382 58L420 98L452 86L484 116V210H-4Z" fill="#8e9cc9" />
      <path d="M100 86L112 76L124 90M162 76L172 66L184 80M372 68L382 58L394 72" fill="none" stroke={ivory} strokeWidth="3" />
      <path d="M-4 196Q80 158 170 182T330 172T484 178V250H-4Z" fill="#a9c48a" />
      <g fill="none" stroke="#5f8a4c" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="1 9">
        <path d="M10 200Q90 170 170 190T330 182T470 186" />
        <path d="M0 212Q90 184 170 202T330 194T480 198" />
        <path d="M0 224Q90 198 170 214T330 206T480 210" />
      </g>
      <path d="M-4 238Q240 226 484 238V300H-4Z" fill={grass} />

      {/* The Moederkerk's spire */}
      <Sprout d={500}>
        <rect x="58" y="184" width="62" height="58" fill={ivory} />
        <path d="M54 184L89 160L124 184Z" fill={pink} />
        <rect x="79" y="124" width="20" height="60" fill={ivory} />
        <path d="M77 124L89 70L101 124Z" fill="#46557a" />
        <line x1="89" y1="70" x2="89" y2="56" />
        <line x1="83" y1="61" x2="95" y2="61" />
        <path d="M84 156V146Q89 138 94 146V156Z" fill={blue} strokeWidth="2" />
        <path d="M66 236V214Q72 204 78 214V236Z" fill={blue} strokeWidth="2" />
        <path d="M100 236V214Q106 204 112 214V236Z" fill={blue} strokeWidth="2" />
      </Sprout>

      {/* A Cape Dutch house with a thatched roof and a curly gable */}
      <Sprout d={750}>
        <rect x="146" y="204" width="150" height="40" fill={ivory} />
        <path d="M140 206L162 180H280L302 206Z" fill="#d8b56a" />
        <path d="M201 206V180C201 172 208 170 210 164C212 156 218 154 221 146C224 154 230 156 232 164C234 170 241 172 241 180V206Z" fill={ivory} />
        <circle cx="221" cy="174" r="4.5" fill={blue} strokeWidth="2" />
        <rect x="213" y="216" width="16" height="28" fill="#2f6b43" />
        {[164, 254].map((x) => (
          <g key={x}>
            <rect x={x - 7} y="214" width="6" height="18" fill="#2f6b43" strokeWidth="2" />
            <rect x={x} y="214" width="14" height="18" fill={blue} strokeWidth="2" />
            <rect x={x + 15} y="214" width="6" height="18" fill="#2f6b43" strokeWidth="2" />
          </g>
        ))}
      </Sprout>

      {/* The Ou Hoofgebou (Old Main Building), with columns and a pediment */}
      <Sprout d={1000}>
        <rect x="322" y="196" width="116" height="38" fill={butter} />
        <path d="M316 188L380 160L444 188Z" fill={ivory} />
        <rect x="316" y="188" width="128" height="9" fill={ivory} />
        <circle cx="380" cy="177" r="5" fill={pink} strokeWidth="2" />
        {[328, 348, 368, 386, 406, 426].map((x) => (
          <rect key={x} x={x} y="197" width="7" height="37" fill={ivory} strokeWidth="2" />
        ))}
        <rect x="312" y="234" width="136" height="9" fill="#f2ede2" />
      </Sprout>

      {/* Oak trees: Stellenbosch is the "Eikestad", the city of oaks */}
      <Sprout d={1200}>
        <Tree x={24} base={246} r={22} trunk={30} />
      </Sprout>
      <Sprout d={1300}>
        <Tree x={312} base={246} r={16} trunk={22} />
      </Sprout>
      <Sprout d={1400}>
        <Tree x={466} base={246} r={20} trunk={28} />
      </Sprout>

      {/* A graduation cap thrown in the air */}
      <g className="toss">
        <path d="M262 110L280 103L298 110L280 117Z" fill={ink} />
        <path d="M270 113V121Q280 126 290 121V113" fill={ink} />
        <path d="M280 110L292 118V128" fill="none" stroke={butter} strokeWidth="2" />
      </g>
    </svg>
  )
}

/* ---------- Europe: half-timbered houses, the Brandenburg Gate, cathedral spires, the TV tower and a windmill ---------- */
export function Europe() {
  return (
    <svg className="scene" viewBox="0 0 480 300" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" aria-hidden="true">
      <defs>
        <linearGradient id="sky-eu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e4798" />
          <stop offset="0.65" stopColor="#8fb0e6" />
          <stop offset="1" stopColor="#f4c3cf" />
        </linearGradient>
      </defs>
      <rect width="480" height="300" fill="url(#sky-eu)" stroke="none" />
      <path d="M58 30A22 22 0 1 0 84 66A18 18 0 1 1 58 30Z" fill={butter} />
      <Sparkle x={140} y={30} />
      <Sparkle x={250} y={22} s={0.7} />
      <Sparkle x={330} y={56} s={0.9} />
      <Sparkle x={440} y={26} s={0.6} />
      <Sparkle x={196} y={74} s={0.5} />

      {/* A plane flying in, towing a banner */}
      <g className="fly">
        <line x1="150" y1="96" x2="186" y2="92" strokeWidth="1.5" />
        <rect x="50" y="86" width="100" height="20" rx="3" fill={ivory} strokeWidth="2" />
        <text x="100" y="101" textAnchor="middle" className="scene-pen" stroke="none" fill={blue}>hallo Deutschland!</text>
        <path d="M186 84H222Q234 84 236 90Q234 96 222 96H192Z" fill={ivory} strokeWidth="2" />
        <path d="M188 84L184 72H192L198 84Z" fill={pink} strokeWidth="2" />
        <path d="M206 91H218L210 106H202Z" fill={pink} strokeWidth="2" />
        <circle cx="226" cy="89" r="2" fill={blue} strokeWidth="1" />
      </g>

      <path d="M-4 242Q240 232 484 242V300H-4Z" fill="#7f9e6a" />

      {/* Half-timbered (Fachwerk) houses */}
      <Sprout d={500}>
        {[{ x: 12, h: 62, roof: '#c75b5b' }, { x: 62, h: 76, roof: pink }].map(({ x, h, roof }) => (
          <g key={x}>
            <rect x={x} y={244 - h} width="46" height={h} fill={ivory} />
            <path d={`M${x - 4} ${244 - h}L${x + 23} ${244 - h - 34}L${x + 50} ${244 - h}Z`} fill={roof} />
            <path d={`M${x} ${244 - h / 2}H${x + 46}M${x + 23} ${244 - h}V${244}M${x} ${244 - h}L${x + 23} ${244 - h / 2}L${x + 46} ${244 - h}M${x} ${244 - h / 2}L${x + 23} ${244}`} fill="none" strokeWidth="3" />
            <rect x={x + 29} y={244 - h + 8} width="11" height="12" fill={butter} strokeWidth="2" />
            <rect x={x + 6} y={244 - h / 2 + 8} width="11" height="12" fill={butter} strokeWidth="2" />
          </g>
        ))}
      </Sprout>

      {/* Brandenburg Gate with the quadriga on top */}
      <Sprout d={750}>
        <rect x="118" y="176" width="116" height="14" fill="#e9d6a6" />
        <rect x="114" y="190" width="124" height="8" fill="#e9d6a6" />
        <path d="M156 176V166H196V176Z" fill="#e9d6a6" />
        <path d="M164 166V158L170 152L176 158L182 152L188 158V166Z" fill="#4f8a7a" strokeWidth="2" />
        {[120, 140, 160, 186, 206, 226].map((x) => (
          <rect key={x} x={x} y="198" width="7" height="44" fill="#e9d6a6" strokeWidth="2" />
        ))}
        <rect x="112" y="240" width="128" height="6" fill="#d9c79e" />
      </Sprout>

      {/* Twin cathedral spires */}
      <Sprout d={1000}>
        <rect x="246" y="150" width="66" height="94" fill="#b9c3dd" />
        <rect x="246" y="110" width="20" height="40" fill="#b9c3dd" />
        <rect x="292" y="110" width="20" height="40" fill="#b9c3dd" />
        <path d="M244 110L256 64L268 110Z" fill="#b9c3dd" />
        <path d="M290 110L302 64L314 110Z" fill="#b9c3dd" />
        <path d="M268 244V196Q279 176 290 196V244Z" fill={butter} />
        <circle cx="279" cy="166" r="9" fill={butter} strokeWidth="2" />
        <path d="M252 140V126Q256 120 260 126V140ZM298 140V126Q302 120 306 126V140Z" fill={butter} strokeWidth="2" />
      </Sprout>

      {/* An empty plot, still waiting for the right team */}
      <Sprout d={1200}>
        <path d="M324 244V196L346 178L368 196V244" fill="none" strokeDasharray="6 5" stroke={ivory} />
        <line x1="346" y1="246" x2="346" y2="222" />
        <rect x="318" y="200" width="56" height="26" rx="4" fill={butter} />
        <text x="346" y="211" textAnchor="middle" className="scene-pen small" stroke="none" fill={ink}>your team</text>
        <text x="346" y="222" textAnchor="middle" className="scene-pen small" stroke="none" fill={ink}>here?</text>
      </Sprout>

      {/* Berlin's TV tower */}
      <Sprout d={1400}>
        <path d="M396 244L399 96H405L408 244Z" fill={ivory} />
        <circle cx="402" cy="104" r="13" fill="#c9d3e6" />
        <rect x="397" y="116" width="10" height="5" fill={ivory} strokeWidth="2" />
        <line x1="402" y1="91" x2="402" y2="52" />
        <circle cx="402" cy="52" r="3" fill="#c75b5b" strokeWidth="1.5" />
      </Sprout>

      {/* A Dutch windmill (half of me is Dutch!) */}
      <Sprout d={1600}>
        <path d="M434 244L440 190H462L468 244Z" fill="#c9b48a" />
        <path d="M436 190L451 172L466 190Z" fill={pink} />
        <rect x="446" y="224" width="10" height="20" fill={blue} strokeWidth="2" />
        <g className="spin">
          <path d="M451 182L451 142M451 182L491 182M451 182L451 222M451 182L411 182" strokeWidth="3" />
          <path d="M451 146H459V180H451ZM455 182V190H489V182ZM443 184H451V218H443ZM413 178V186H447V178Z" fill={ivory} strokeWidth="1.5" />
          <circle cx="451" cy="182" r="3.5" fill={ink} />
        </g>
      </Sprout>
    </svg>
  )
}
