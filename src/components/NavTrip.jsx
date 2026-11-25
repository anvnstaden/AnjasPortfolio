import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Underline } from './Doodles.jsx'

// The logo's letters (from public/favicon.svg), each with where it sits in the logo and when the pen gets to it
const LETTERS = [
  [
    'translate(6.6 241.6)',
    0,
    'M0 0C4.7-3.9 8.4-9.9 11.3-17.9C14.2-25.8 17-34.5 19.9-43.9C24.4-59.2 28.4-73.2 31.8-85.9C35.1-98.6 38.2-110.9 40.8-122.9C43.4-134.9 46-147.3 48.5-160.3C51-173.2 53.6-187.6 56.5-203.2C57.3-207.6 57.3-211.9 56.5-216.1C55.8-220.3 54.1-223.7 51.5-226.1L151.7-226.1C149.3-223.7 147.7-220.3 146.8-216.1C146-211.9 146-207.6 146.7-203.2C149.6-187.6 152.3-173.2 154.8-160.3C157.2-147.3 159.8-134.9 162.4-122.9C165.1-110.9 168.1-98.6 171.5-85.9C174.9-73.2 178.8-59.2 183.3-43.9C186.2-34.5 189.1-25.8 191.9-17.9C194.8-9.9 198.6-3.9 203.3 0L109.9 0C112.4-3 114.4-6.7 115.9-11.1C117.3-15.5 118-20 118-24.6C118-28.4 117.3-35.4 116-45.7C114.6-55.9 112.8-67.4 110.5-80.2L77.3-80.2C81.2-70.8 84.8-61.3 88.1-52C91.3-42.7 92.9-33.3 92.9-24C92.9-20.5 92.5-16.9 91.6-13.1C90.7-9.3 89-6.2 86.7-3.7C84.4-1.2 80.9 0 76.4 0ZM73-90.4L108.5-90.4C106.4-101.3 104.1-112.1 101.5-122.9C99-133.6 96.2-143.5 93.3-152.4C90.3-161.3 87.3-168.4 84.2-173.7C81.1-179.1 78-181.8 74.8-181.8C70.9-181.8 67.8-180.1 65.6-176.8C63.3-173.5 61.7-169.1 60.7-163.8C59.7-158.4 59.2-152.7 59.2-146.7C59.2-136.8 60.6-127.1 63.4-117.8C66.2-108.4 69.4-99.3 73-90.4Z',
  ],
  [
    'translate(169.6 90.4)',
    140,
    'M49.9 0L2.4 0L2.4-84.2C10.4-84.2 18.4-84.2 26.5-84.2C34.6-84.2 42.6-84.2 50.4-84.2L50.4-77L42.4-65.7L43.2-64.7L59.6-84.2L91.2-84.2L91.2-50.7Z',
  ],
  [
    'translate(200.1 353.8)',
    200,
    'M89.9 4.2C78 4.2 66.9 2.4 56.5-1.1C46.1-4.7 36.8-9.5 28.7-15.5C20.7-21.5 14.3-28.4 9.7-36.2C5.1-44 2.8-52.1 2.8-60.6C2.8-63.9 4.6-67.6 8.3-71.7C12-75.7 16.7-79.7 22.5-83.7C28.4-87.6 34.4-91.2 40.7-94.4C47-97.6 52.9-100.1 58.3-102.1C63.7-104.1 68-105 71-104.8C75.3-104.6 79-103.1 82-100.4C85-97.7 86.1-93.6 85.3-88.2C84.4-80.8 83.7-73.1 83.1-64.9C82.5-56.8 83.1-49.1 84.8-42C86.5-34.8 90.1-29 95.6-24.5C101.2-20 109.4-17.7 120.3-17.7C127.6-17.7 134.4-19.4 140.5-22.7C146.7-26 151.8-30.5 155.6-36.3C159.5-42.1 161.4-48.6 161.4-55.8C161.4-65.3 158.9-73.4 153.9-79.9C149-86.3 142.5-91.7 134.5-96C126.5-100.4 117.8-103.9 108.4-106.7C94.5-111.1 81.3-115.6 68.9-120.4C56.4-125.2 45.3-131 35.8-137.7C26.2-144.5 18.6-152.9 13.1-162.9C7.6-173 4.8-185.4 4.8-200.3C4.8-212.1 7.1-223.2 11.7-233.5C16.3-243.8 22.6-252.9 30.6-260.8C38.5-268.7 47.8-274.9 58.3-279.3C68.8-283.7 80-285.9 91.8-285.9C99.1-285.9 106.1-285 112.8-283.1C119.5-281.2 126.3-279.3 133.2-277.4C140.2-275.6 148-274.6 156.6-274.6C163.2-274.6 168.4-275.6 172.2-277.4C176.1-279.3 179.4-281.2 182.1-283.1C184.8-285 187.6-285.9 190.4-285.9C193.8-285.9 195.9-284 196.8-280.2C197.6-276.5 197.5-271.7 196.3-265.7C195.2-259.8 193.3-253.6 190.5-246.9C187.8-240.2 184.4-233.9 180.3-228C176.1-222.1 171.5-217.3 166.5-213.5C161.4-209.7 155.9-207.9 150.1-207.9C139.8-207.9 130.3-209.6 121.5-212.9C112.8-216.3 104.4-220.3 96.3-224.8C88.3-229.3 80-233.2 71.7-236.6C63.3-240 54.5-241.7 45.1-241.7C39.8-241.7 35.4-239.7 31.7-235.9C28-232 26.2-227.4 26.2-222C26.2-214.4 29.2-208.3 35.1-203.5C41-198.7 48.7-194.9 58.2-192.1C67.6-189.3 78-187.1 89.1-185.6C100.3-184.1 111.3-182.9 122-182C137.7-180.5 151.6-176.2 163.5-169.1C175.4-162.1 184.7-152.9 191.4-141.5C198.1-130.2 201.4-117.3 201.4-102.8C201.4-90.2 199.2-77.6 194.9-65.1C190.6-52.5 184-41 175-30.5C166.1-20.1 154.6-11.7 140.5-5.3C126.5 1 109.6 4.2 89.9 4.2Z',
  ],
]
const DOT = 'M4.1-23.9C4.1-28.8 5.3-33.3 7.7-37.3C10.1-41.4 13.4-44.6 17.5-47C21.6-49.4 26.1-50.6 31.1-50.6C36-50.6 40.5-49.4 44.5-47C48.6-44.6 51.8-41.4 54.2-37.3C56.6-33.3 57.8-28.8 57.8-23.9C57.8-18.9 56.6-14.4 54.2-10.3C51.8-6.2 48.6-2.9 44.5-0.5C40.5 1.9 36 3.1 31.1 3.1C26.1 3.1 21.6 1.9 17.5-0.5C13.4-2.9 10.1-6.2 7.7-10.3C5.3-14.4 4.1-18.9 4.1-23.9Z'

const HOLD = 380 // ms the sheet stays over the page once it's covered it, so the logo on it can finish drawing itself
const GIVE_UP = 3000 // ms: if the sheet's animations never report back (they can be switched off), it's taken away anyway

// The trip a nav link (or a hero button) takes you on: a sheet of notebook paper sweeps up over the page with the logo drawing itself on it
// and a note of where you're off to, the page jumps to the link's place underneath (onCovered), and once it's there
// the sheet carries on up and off the screen (onDone). So you get there without scrolling past everything in between.
export default function NavTrip({ to, note, onCovered, onDone }) {
  const location = useLocation()
  const [held, setHeld] = useState(false)
  const covered = useRef(false)
  // (a new page can take a moment to show, so it waits for the address to arrive at the link's)
  const leaving = held && location.pathname + location.hash === to

  const cover = () => {
    if (covered.current) return
    covered.current = true
    onCovered()
    setTimeout(() => setHeld(true), HOLD)
  }

  const giveUp = useEffectEvent(() => {
    if (!covered.current) onCovered()
    onDone()
  })
  useEffect(() => {
    const timer = setTimeout(giveUp, GIVE_UP)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`nav-trip${leaving ? ' leaving' : ''}`} aria-hidden="true">
      <div
        className="nav-trip-sheet"
        onAnimationEnd={(e) => {
          if (e.target !== e.currentTarget) return
          if (e.animationName === 'trip-in') cover()
          if (e.animationName === 'trip-out') onDone()
        }}
      >
        <svg className="nav-trip-logo" viewBox="0 0 408 364">
          {LETTERS.map(([at, delay, d]) => (
            <g key={at} transform={at}>
              <path pathLength="1" d={d} style={{ '--d': `${delay}ms` }} />
            </g>
          ))}
          <g transform="translate(83.9 318.2)">
            <path className="nav-trip-dot" d={DOT} />
          </g>
        </svg>
        <p className="nav-trip-note pen">
          {note}
          <Underline />
        </p>
      </div>
    </div>
  )
}
