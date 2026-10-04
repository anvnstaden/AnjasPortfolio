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

export const projects = [
  {
    title: 'Hackathon Hosting Platform',
    slug: 'hackathon-hosting-platform',
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
    featured: true,
    images: [],
    kind: 'React · Frontend · UI design',
    meta: '2026',
    description:
      'A single-page app that makes university lab logistics painless. It centres on an interactive 7 × 10 seat map with live occupancy, plus login, editable profiles, Q&A, an announcement feed, tag filtering and per-user themes, all persisted in the browser.',
    tags: ['React', 'JavaScript', 'localStorage', 'UI design'],
  },
  {
    title: 'Peer-to-Peer File Sharing',
    slug: 'peer-to-peer-file-sharing',
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
    images: [],
    kind: 'Java · Networking · Experiments',
    meta: '2026',
    description:
      'An implementation of the Reliable Blast UDP file-transfer protocol: sequence-numbered datagram blasts with TCP signalling to retransmit lost packets. Includes sender and receiver GUIs with progress tracking, plus experiments comparing throughput against TCP across packet sizes, send rates and loss rates.',
    tags: ['Java', 'UDP', 'TCP', 'Performance analysis'],
  },
  {
    title: 'Client-Server Chat',
    slug: 'client-server-chat',
    images: [],
    kind: 'Java · JavaFX · Multithreading',
    meta: '2026',
    description:
      'A multithreaded chat server with a JavaFX client. It enforces unique usernames, keeps a live online-users list, broadcasts joins and leaves, and lets users whisper privately in separate chat tabs, all running over Tailscale.',
    tags: ['Java', 'JavaFX', 'Sockets', 'Concurrency'],
  },
  {
    title: 'WISTL Compiler',
    slug: 'wistl-compiler',
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
