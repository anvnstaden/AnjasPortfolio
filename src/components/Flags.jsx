// Small flags for South Africa, the Netherlands and Germany. Black is swapped for the site's plum.
export function FlagZA() {
  return (
    <svg className="flag" viewBox="0 0 900 600" role="img" aria-label="South African flag">
      <rect width="900" height="300" fill="#de3831" />
      <rect y="300" width="900" height="300" fill="#002395" />
      <path d="M0 0 450 300 0 600M450 300H900" fill="none" stroke="#f1e7d3" strokeWidth="200" />
      <path d="M0 0 450 300 0 600M450 300H900" fill="none" stroke="#007a4d" strokeWidth="120" />
      <path d="M0 72 342 300 0 528Z" fill="#ffb612" />
      <path d="M0 120 270 300 0 480Z" fill="#2d1e38" />
    </svg>
  )
}

export function FlagNL() {
  return (
    <svg className="flag" viewBox="0 0 9 6" role="img" aria-label="Dutch flag">
      <rect width="9" height="2" fill="#ae1c28" />
      <rect y="2" width="9" height="2" fill="#f1e7d3" />
      <rect y="4" width="9" height="2" fill="#21468b" />
    </svg>
  )
}

export function FlagDE() {
  return (
    <svg className="flag" viewBox="0 0 5 3" role="img" aria-label="German flag">
      <rect width="5" height="1" fill="#2d1e38" />
      <rect y="1" width="5" height="1" fill="#dd0000" />
      <rect y="2" width="5" height="1" fill="#ffce00" />
    </svg>
  )
}
