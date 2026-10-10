// Site content. Edit text here; the pages pick it up automatically.
// Projects are listed newest first, and the projects page shows them in this order.
//
// Screenshots: put image files in public/projects/<slug>/ and list them in that
// project's `images`, e.g.
//   images: [
//     { src: '/projects/hackathon-hosting-platform/editor.png', caption: 'Shared code editor' },
//   ],
// Add as many as you like (3 or more works best); visitors can click through them and
// open each one full size. The first image is also the project's thumbnail on the home page.
//
// Projects without a user interface set `gui: false` and list `highlights` instead;
// they get a terminal-style panel rather than a screenshot gallery.
// Projects marked `featured` appear on the home page. Add `link` to show a "View project" link.
// `note` is an optional handwritten aside next to the title.
// `theme` is an optional paragraph explaining the project's visual theme.
// `mark` is the final mark; use 'TBA' while a project is still in progress.

export const projects = [
  {
    title: 'Hackathon Hosting Platform',
    slug: 'hackathon-hosting-platform',
    mark: 'TBA',
    featured: true,
    images: [],
    kind: 'React · Express · WebSockets',
    meta: '2026',
    description:
      'A group-built web platform for running student hackathons. Admins set up problems and hidden test cases. Teams code together in a real-time shared editor with a nested file tree, and Python submissions are graded automatically onto live leaderboards. It also has token-based sessions and team invites.',
    tags: ['React', 'Express.js', 'WebSockets', 'JWT', 'Real-time sync'],
  },
  {
    title: 'Community Event & Volunteer Platform',
    slug: 'community-event-volunteer-platform',
    mark: 'TBA',
    featured: true,
    note: 'team of six!',
    images: [],
    kind: 'Entelect industry project · Full-stack',
    meta: '2026',
    description:
      'Built with a six-person team for community organisations: create and manage events, recruit and coordinate volunteers, and track attendance and volunteer hours. I contributed to both the engineering and the overall usability of the platform.',
    tags: ['Full-stack', 'Teamwork', 'Usability'],
  },
  {
    title: 'Honours Lab Management App',
    slug: 'honours-lab-management-app',
    mark: '100%',
    featured: true,
    images: [
      { src: '/project_screenshots/honours_lab/login_screen.png', caption: 'Log in on a parchment scroll: the whole app is dressed as a medieval fantasy realm, and students are greeted as "Scholars".' },
      { src: '/project_screenshots/honours_lab/login_screen_funny_error_msgs.png', caption: 'Funny log-in errors keep failures friendly. An unknown username gets "Guards, seize them! No account exists with that username."' },
      { src: '/project_screenshots/honours_lab/my_seat.png', caption: 'Pick a seat from the interactive 7 × 10 map. Your own seat is highlighted, and you can give it up with "Relinquish Throne".' },
      { src: '/project_screenshots/honours_lab/other_students_seats.png', caption: "View other students' seats: a taken seat shows who is sitting there, with their profile picture and name." },
      { src: '/project_screenshots/honours_lab/announcements_page.png', caption: 'Announcements can be tagged (Decree, Warning, Gossip, Feast, Study Session) and filtered by tag. This page has its own raven-and-bell background.' },
      { src: '/project_screenshots/honours_lab/profile_page_w_customisable_colours.png', caption: "Every page has its own illustrated background to match its purpose. On the profile page you can customise the app's primary and accent colours." },
      { src: '/project_screenshots/honours_lab/profile_photo_change.png', caption: 'Choose a new profile photo from a set of medieval "sigils": archer, hooded rogue, crown, dragon, wizard, griffin, jester, king, knight, queen, shield and spellbook.' },
      { src: '/project_screenshots/honours_lab/qa_section.png', caption: 'The Q&A section, "Spill Your Secrets, Scholar": answer questions about yourself with a quick text box, and delete your answers again whenever you like.' },
    ],
    kind: 'React · Frontend · UI design',
    meta: '2026',
    description:
      'A single-page app that makes university lab logistics painless. It centres on an interactive 7 × 10 seat map with live occupancy, plus login, editable profiles, Q&A, an announcement feed, tag filtering and per-user themes, all persisted in the browser.',
    theme:
      'The whole app is dressed as a medieval fantasy realm. Students are "Scholars" who log in on a parchment scroll, seats are thrones, announcements are decrees carried by ravens, and profile pictures are metal "sigils". Every screen has its own illustrated tapestry background to suit its purpose, and the copy stays playful throughout.',
    tags: ['React', 'JavaScript', 'localStorage', 'UI design'],
  },
  {
    title: 'Peer-to-Peer File Sharing',
    slug: 'peer-to-peer-file-sharing',
    mark: '94%',
    images: [],
    kind: 'Java · JavaFX · Networking',
    meta: '2026',
    description:
      'An anonymous P2P file-sharing app with a lightweight coordination server. Searches run through the server and return exact and close matches. Peers are introduced with encrypted message keys and then transfer directly over Tailscale, with pause/resume and animated progress in a JavaFX interface.',
    tags: ['Java', 'JavaFX', 'Encryption', 'Tailscale'],
  },
  {
    title: 'Parallel Othello AI',
    slug: 'parallel-othello-ai',
    mark: '85%',
    gui: false,
    kind: 'C · MPI · Parallel computing',
    meta: '2026',
    description:
      'A high-performance Othello player that picks moves with Monte Carlo Tree Search, parallelised with MPI across multiple cores to play stronger within a fixed time limit.',
    highlights: [
      'Monte Carlo Tree Search for move selection',
      'Parallelised with MPI across multiple cores',
      'Plays stronger within a fixed time limit',
    ],
    tags: ['C', 'MPI', 'MCTS', 'Optimisation'],
  },
  {
    title: 'VoIP Chat',
    slug: 'voip-chat',
    mark: '88%',
    images: [],
    kind: 'Java · UDP · Real-time audio',
    meta: '2026',
    description:
      'A voice-over-IP app where a server acts as directory and mediator while calls stream directly between clients over UDP. It supports one-on-one and conference calls, group channels, texting during calls, and pre-recorded voice notes played back in the GUI.',
    tags: ['Java', 'UDP', 'Audio streaming', 'GUI'],
  },
  {
    title: 'Multicore Process Scheduler',
    slug: 'multicore-process-scheduler',
    mark: '100%',
    gui: false,
    kind: 'C · Operating systems',
    meta: '2026',
    description:
      'A process management system in C that simulates an operating system scheduler for single-core and multi-core execution. It covers the complete process lifecycle: initialisation with process control blocks (PCBs) and memory management, scheduling and execution, through to termination, plus deadlock detection and handling.',
    highlights: [
      'Single-core and multi-core scheduling',
      'Process control blocks and memory management',
      'Full lifecycle from initialisation to termination',
      'Deadlock detection and handling',
    ],
    tags: ['C', 'Operating systems', 'Scheduling', 'Concurrency'],
  },
  {
    title: 'RBUDP & TCP File Transfer',
    slug: 'rbudp-tcp-file-transfer',
    mark: '100%',
    images: [],
    kind: 'Java · Networking · Experiments',
    meta: '2026',
    description:
      'An implementation of the Reliable Blast UDP file-transfer protocol: sequence-numbered datagram blasts with TCP signalling to retransmit lost packets. Includes sender and receiver GUIs with progress tracking, plus experiments comparing throughput against TCP across packet sizes, send rates and loss rates.',
    tags: ['Java', 'UDP', 'TCP', 'Performance analysis'],
  },
  {
    title: 'WISTL Compiler',
    slug: 'wistl-compiler',
    mark: '85.12%',
    gui: false,
    kind: 'C · Compiler design',
    meta: '2025',
    description:
      'A fully functional compiler in C for WISTL, an imperative educational language. It implements the complete compiler pipeline (lexical, syntactic and semantic analysis, then code generation), translating programs into JVM bytecode using Jasmin.',
    highlights: [
      'Lexical analysis (scanner)',
      'Syntactic analysis (parser)',
      'Semantic analysis and type checking',
      'Code generation to JVM bytecode via Jasmin',
    ],
    tags: ['C', 'Compilers', 'JVM', 'Jasmin'],
  },
  {
    title: 'Quasi-Palindromes in DNA',
    slug: 'quasi-palindromes-in-dna',
    mark: '74%',
    gui: false,
    kind: 'Java · Algorithms · Bio-informatics',
    meta: '2025',
    description:
      'A semester-long, performance-graded project that detects quasi-palindromes (near-palindromic DNA sequences linked to genomic instability) under adjacent and long-distance swaps, and generates strings with a specified number of them.',
    highlights: [
      'Detects quasi-palindromes under adjacent swaps',
      'Handles multiple swaps of any distance',
      'Generates strings with a set number of quasi-palindromes',
      'Graded on speed as well as correctness',
    ],
    tags: ['Java', 'String algorithms', 'Performance'],
  },
]

export const skills = {
  'Design & Prototyping': ['UI/UX design', 'Product design', 'User-centred design', 'Responsive design', 'Prototyping', 'Figma', 'Canva'],
  'Frontend & Web': ['JavaScript', 'HTML', 'CSS', 'React', 'Express.js'],
  Programming: ['Java', 'JavaFX', 'C', 'Python', 'MATLAB', 'R', 'x86 Assembly'],
  'Data & Optimisation': ['SQL', 'MySQL', 'LINGO', 'AnyLogic', 'Business analytics'],
  'Tools & Collaboration': ['Git', 'GitHub', 'GitLab', 'Docker', 'CI/CD', 'Scrum', 'Jira', 'Confluence'],
}

export const contact = {
  email: 'anvnstaden@gmail.com',
  github: 'https://github.com/anvnstaden',
  linkedin: 'https://www.linkedin.com/in/anja-van-staden',
}

// Shown on the back of the ID badge on the home page when it flips over.
export const funFacts = [
  'My favourite book is Throne of Glass by Sarah J. Maas',
  'I got into programming after watching CSI: Cyber',
  "I'm a makeup artist in my free time",
]
