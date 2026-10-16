// The walking girl (public/walking-girl-cartoon.svg, 1365 x 2048, one side-view pose). To make her move,
// the same picture is drawn several times, each copy clipped to one part of her:
//   hair (the flowing part, left of her head)   sways, drawn over a still copy of itself in the body, so
//                                               nothing can open up behind it
//   back leg, front leg                         swing out of the hip (each a chain of slices, see Slice)
//   back arm, front arm                         swing very slightly about the shoulder
//   body (everything else)                      stays put
// A solid piece of trouser (`girl-hip`) covers the hip, so nothing shows through where the legs meet the body.
// The scroll scene sets `--sw` (the swing) and `--hs` (the hair sway) in degrees. The clip shapes are in
// picture coordinates below; the pivots and the soft blend where the legs meet the body are in App.css.
const SRC = '/walking-girl-cartoon.svg'
const W = 1365
const H = 2048

// Outlines (x, y in picture coordinates) of the parts that are cut out of the body
const FRONT_ARM = [[792, 545], [1020, 845], [1200, 845], [1200, 1100], [990, 1100], [990, 985], [911, 960], [787, 808]]
const BACK_ARM = [[330, 800], [500, 800], [450, 890], [395, 960], [400, 1200], [200, 1200], [200, 900], [290, 880]]
const HAIR = [[60, 140], [540, 140], [540, 470], [496, 480], [366, 748], [60, 760]]

// A clip path in 0-1 units of the picture, from outlines (several outlines are combined with the even-odd
// rule, so the ones after the first are holes)
const outline = (points) =>
  points.map(([x, y], i) => `${i ? 'L' : 'M'}${(x / W).toFixed(4)} ${(y / H).toFixed(4)}`).join('') + 'Z'
// The arms are cut out of the body along their exact outline, and the swinging copy of each arm is cut a
// little bigger than that, so it overlaps the body by a few units. Then nothing static is left along the
// edge of an arm (it would show as a thin gap once the arm moves) and no hairline opens up beside it.
const grow = (points, f = 1.025) => {
  const cx = points.reduce((sum, [x]) => sum + x, 0) / points.length
  const cy = points.reduce((sum, [, y]) => sum + y, 0) / points.length
  return points.map(([x, y]) => [cx + (x - cx) * f, cy + (y - cy) * f])
}
// The front arm's hole starts a little further out than the arm copy does (at the edge of the jacket), so the
// body keeps its whole shoulder and the arm copy overlaps it
const FRONT_ARM_HOLE = FRONT_ARM.map(([x, y], i) => (i === 0 || i === FRONT_ARM.length - 1 ? [x + 16, y] : [x, y]))
const BODY = outline([[0, 0], [W, 0], [W, 1100], [0, 1100]]) + outline(FRONT_ARM_HOLE) + outline(BACK_ARM)

// Each leg is a chain of horizontal slices of the picture, nested one inside the next. Down the top of the leg
// every slice turns a little more than the one above it (about its own top edge), so the leg bends smoothly
// out of the hip instead of turning stiffly about one point, which left a stepped edge at the hip. The slices
// overlap by a few units so no gap opens between them, and the tail of the leg, from the knee down, stays rigid.
const SLICES = 12 // slices that bend
const SLICE = 31 // their height
const TOP = 1060 // where the leg starts, under the end of the body (picture coordinates)
const OVERLAP = 8
const pct = (x, y) => `${((x / W) * 100).toFixed(2)}% ${((y / H) * 100).toFixed(2)}%`

function Slice({ side, k }) {
  const back = side === 'back'
  const yTop = TOP + k * SLICE - (k ? OVERLAP : 0)
  const yBottom = k < SLICES ? TOP + (k + 1) * SLICE + OVERLAP : H
  // Each leg stays on its own side of the crotch and keeps clear of the hands
  const xLeft = back ? (k < 4 ? 490 : 0) : 681
  const xRight = back ? 681 : k < 2 ? 900 : W
  const joint = back ? 620 - 0.37 * (k * SLICE) : 745 + 0.37 * (k * SLICE)
  return (
    <div className={`leg-seg${k ? ' bend' : ''}${k > SLICES - 1 ? ' tail' : ''}`} style={{ transformOrigin: pct(joint, TOP + k * SLICE) }}>
      <img
        src={SRC}
        alt=""
        draggable="false"
        style={{ clipPath: `polygon(${pct(xLeft, yTop)}, ${pct(xRight, yTop)}, ${pct(xRight, yBottom)}, ${pct(xLeft, yBottom)})` }}
      />
      {k < SLICES && <Slice side={side} k={k + 1} />}
    </div>
  )
}

export default function Girl({ ref }) {
  return (
    <div ref={ref} className="girl" aria-hidden="true">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="girl-clip-body" clipPathUnits="objectBoundingBox"><path d={BODY} clipRule="evenodd" /></clipPath>
          <clipPath id="girl-clip-front-arm" clipPathUnits="objectBoundingBox"><path d={outline(grow(FRONT_ARM))} /></clipPath>
          <clipPath id="girl-clip-back-arm" clipPathUnits="objectBoundingBox"><path d={outline(grow(BACK_ARM))} /></clipPath>
          <clipPath id="girl-clip-hair" clipPathUnits="objectBoundingBox"><path d={outline(HAIR)} /></clipPath>
        </defs>
      </svg>
      <div className="girl-leg back"><Slice side="back" k={0} /></div>
      <div className="girl-leg front"><Slice side="front" k={0} /></div>
      <svg className="girl-hip" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <polygon points="600,1060 785,1060 800,1235 690,1178 605,1235" fill="#0e0e0e" />
      </svg>
      <img className="girl-arm back" src={SRC} alt="" draggable="false" />
      <img className="girl-body" src={SRC} alt="" draggable="false" />
      <img className="girl-hair" src={SRC} alt="" draggable="false" />
      <img className="girl-arm front" src={SRC} alt="" draggable="false" />
    </div>
  )
}
