// Site content. Edit text here; the pages pick it up automatically.
// Projects are listed newest first, and the projects page shows them in this order.
//
// Screenshots: put image files in public/project_screenshots/<folder>/ and list them in that
// project's `images`, e.g.
//   images: [
//     { src: '/project_screenshots/hackathon/editor.png', caption: 'Shared code editor' },
//   ],
// Add as many as you like (3 or more works best); visitors can click through them and
// open each one full size. Screen recordings (.webm or .mp4) work too: they play silently on a loop. The first image is also the project's thumbnail on the home page.
// Set `portrait: true` when the screenshots are taller than they are wide (e.g. a narrow app window),
// or `ratio: 'width / height'` when they have different proportions from the default 1915 x 962.
// Slides always fill their frame, so a screenshot that's a slightly different size gets trimmed a little.
//
// Projects without a user interface set `gui: false` and list `highlights` instead;
// they get a terminal-style panel rather than a screenshot gallery.
// Projects marked `featured` appear on the home page. Add `link` to show a "View project" link.
// `note` is an optional handwritten aside next to the title.
// `theme` is an optional paragraph explaining the project's visual theme.
// `module` is the university module the project was for.
// `mark` is the final mark; use 'TBA' while a project is still in progress.

export const projects = [
  {
    title: 'Hackathon Hosting Platform',
    slug: 'hackathon-hosting-platform',
    module: 'Web Development & Databases',
    mark: 'TBA',
    featured: true,
    images: [
      { src: '/project_screenshots/hackathon/parallax_effect.webm', caption: 'The chrome hands and figures move with a parallax effect, which makes the landing, log-in and sign-up pages feel a bit 3D.' },
      { src: '/project_screenshots/hackathon/landing.png', caption: 'The landing page, with two chrome hands reaching for the "Ready to build?" box.' },
      { src: '/project_screenshots/hackathon/sign_up.png', caption: 'Signing up to join a hackathon.' },
      { src: '/project_screenshots/hackathon/log_in.png', caption: 'Logging in. The chrome guy points you to the form.' },
      { src: '/project_screenshots/hackathon/home.png', caption: 'Your home page shows your group invitations, a button to start your own hackathon, and all your groups.' },
      { src: '/project_screenshots/hackathon/pending_invitations.png', caption: 'All your group invitations in one pop-up, where you can accept or decline them.' },
      { src: '/project_screenshots/hackathon/create_group.png', caption: 'Creating your own group: you pick a name and an icon, set up the hackathon and invite people. Whoever creates the group is its admin.' },
      { src: '/project_screenshots/hackathon/your_groups.png', caption: 'Your groups, split into the ones you joined and the ones you run. You can search them and filter by forming teams, in progress or ended.' },
      { src: '/project_screenshots/hackathon/group_overview.png', caption: "Each group's overview shows the main numbers and a short explanation of how the scoring works." },
      { src: '/project_screenshots/hackathon/group_members.png', caption: 'Everyone in the group and their teams. Team leaders are marked, your team is highlighted, and people without a team are listed at the bottom.' },
      { src: '/project_screenshots/hackathon/team_tab.webm', caption: 'The Teams tab, where you can accept invites from other teams, see your own team and look through every team in the group. Teams get locked once the hackathon starts.' },
      { src: '/project_screenshots/hackathon/problems.png', caption: 'The problems page: each problem with its input and output format, examples, and how many test cases are hidden.' },
      { src: '/project_screenshots/hackathon/full_screen_editor.png', caption: 'The shared editor in full screen. Everyone on the team can code at the same time, with the files on the left and the problem on the right. Only the team leader can submit.' },
      { src: '/project_screenshots/hackathon/submissions.png', caption: 'Every submission your team made, with how many tests passed, the runtime and when it was submitted.' },
      { src: '/project_screenshots/hackathon/submission_details.png', caption: 'Clicking a submission shows how it did on each test case, like a wrong answer, a time limit or a runtime error.' },
      { src: '/project_screenshots/hackathon/leaderboard.png', caption: "The live leaderboard. Each team's best three problems count, and the lowest score wins." },
      { src: '/project_screenshots/hackathon/admin_overview.png', caption: "The same group from the admin's side. It turns pink and gets an extra Admin tab." },
      { src: '/project_screenshots/hackathon/admin_panel.png', caption: 'The Admin tab, for inviting members, checking pending invites and changing the hackathon settings before it starts.' },
      { src: '/project_screenshots/hackathon/manage_problems.png', caption: 'Admins add the problems before the hackathon starts, can edit or delete them, and start the hackathon when everyone is ready.' },
      { src: '/project_screenshots/hackathon/edit_problems.png', caption: 'Editing a problem: the title, description, input and output format, and the test cases, which can be hidden from the teams.' },
      { src: '/project_screenshots/hackathon/admin_group_members.png', caption: "Admins can see everyone in the group and which team they're on, including who still needs a team." },
      { src: '/project_screenshots/hackathon/admin_teams.png', caption: "The teams page from the admin's side, with every team and its leader." },
    ],
    ratio: '1927 / 962',
    kind: 'React · Express · WebSockets',
    meta: '2026',
    description:
      'A website for running student hackathons, built in a group of four. Admins create groups, add problems with hidden test cases and start the hackathon. Teams write code together in a shared editor that updates live, and their Python submissions get marked automatically and show up on a live leaderboard. We called it HALT after the four of us (Hannah, Anja, Leo and Tiana), and because HALT is also an assembly instruction. We were not allowed to use any external libraries, so the entire frontend is built with plain React.',
    theme:
      'We went for a retro synthwave look: a neon pink and cyan grid, a starry sky, glitchy fonts and shiny chrome hands and figures. On the landing, log-in and sign-up pages they move with a parallax effect.',
    tags: ['React', 'Express.js', 'WebSockets', 'JWT', 'Real-time sync'],
  },
  {
    title: 'Community Event & Volunteer Platform',
    slug: 'community-event-volunteer-platform',
    mark: 'TBA',
    featured: true,
    note: 'team of six!',
    images: [
      { src: '/project_screenshots/volunteer_platform/walkthrough.mp4', caption: 'A quick walkthrough as a volunteer: the landing page, browsing events, My Attendance, My Statistics, the achievements road and the profile page.' },
      { src: '/project_screenshots/volunteer_platform/landing_page.png', caption: 'The landing page for Neighbourly, with a hand-drawn neighbourhood and the headline "The future of volunteering is here".' },
      { src: '/project_screenshots/volunteer_platform/animated_logo_intro.png', caption: "The first time you visit, there's an animated logo intro with sound, which you can skip." },
      { src: '/project_screenshots/volunteer_platform/landing_page_info.png', caption: 'The landing page explains what Neighbourly is, how it works and why it matters, each in its own colour.' },
      { src: '/project_screenshots/volunteer_platform/browse_events.png', caption: 'Browsing events: you can search by event or organisation, filter by cause, and see how many spots are left.' },
      { src: '/project_screenshots/volunteer_platform/event_signup.png', caption: 'Signing up for an event takes one click. You get a confirmation email and a reminder 24 hours before.' },
      { src: '/project_screenshots/volunteer_platform/successful_event_signup.png', caption: 'After signing up you get confetti and a QR code to show the organiser at the event, plus a button to add it to Google Calendar.' },
      { src: '/project_screenshots/volunteer_platform/volunteer_attendance.png', caption: 'My Attendance shows the events you went to and your volunteer hours. You can filter by attended, awaiting confirmation, upcoming or absent.' },
      { src: '/project_screenshots/volunteer_platform/notifications.png', caption: 'Notifications for sign-up confirmations, reminders and event changes, all in one place.' },
      { src: '/project_screenshots/volunteer_platform/volunteer_stats.png', caption: 'My Statistics shows your total hours, events, badges and organisations helped, plus your hours per month and per cause.' },
      { src: '/project_screenshots/volunteer_platform/volunteer_achievements.png', caption: 'My Achievements: you grow your own little neighbourhood by volunteering, with 30 buildings to unlock.' },
      { src: '/project_screenshots/volunteer_platform/volunteer_achievement_road.png', caption: 'Each cause grows its own building along the road, like a tent that turns into a cabin, a park bench or a braai stand.' },
      { src: '/project_screenshots/volunteer_platform/volunteer_profile.png', caption: 'The volunteer profile with your hours, events and badges, and shortcuts to your statistics and QR check-ins.' },
      { src: '/project_screenshots/volunteer_platform/faq.png', caption: 'An FAQ for both volunteers and organisations.' },
      { src: '/project_screenshots/volunteer_platform/organisation_dashboard.png', caption: 'The organisation dashboard: events hosted, volunteers, attendance rate, upcoming events and a table of all their events.' },
      { src: '/project_screenshots/volunteer_platform/organisation_create_event.png', caption: 'Creating an event shows a live preview of the card volunteers will see.' },
      { src: '/project_screenshots/volunteer_platform/organisation_qr_code_scanner.png', caption: "At the event, organisers scan volunteers' QR codes (with the camera, an uploaded image or by typing the code in) and the attendance updates straight away." },
    ],
    kind: 'Entelect industry project · Full-stack',
    meta: '2026',
    description:
      "Our industry project with Entelect, built in a team of six. It's a website for community organisations to create events, find volunteers and keep track of attendance and volunteer hours. I worked on both the code and the usability of the site.",
    tags: ['Full-stack', 'Teamwork', 'Usability'],
  },
  {
    title: 'Honours Lab Management App',
    slug: 'honours-lab-management-app',
    module: 'Web Development & Databases',
    mark: '100%',
    featured: true,
    images: [
      { src: '/project_screenshots/honours_lab/login_screen.png', caption: 'Logging in on a parchment scroll. Students are called "Scholars".' },
      { src: '/project_screenshots/honours_lab/login_screen_funny_error_msgs.png', caption: "I made the error messages funny. If the username doesn't exist you get \"Guards, seize them! No account exists with that username.\"" },
      { src: '/project_screenshots/honours_lab/my_seat.png', caption: 'Picking a seat on the 7 × 10 map. Your seat is highlighted, and you can give it up with "Relinquish Throne".' },
      { src: '/project_screenshots/honours_lab/other_students_seats.png', caption: 'Clicking a taken seat shows who is sitting there, with their profile picture and name.' },
      { src: '/project_screenshots/honours_lab/announcements_page.png', caption: 'Announcements can be tagged as Decree, Warning, Gossip, Feast or Study Session, and filtered by tag.' },
      { src: '/project_screenshots/honours_lab/profile_page_w_customisable_colours.png', caption: "On the profile page you can change the app's main and accent colours. Every page has its own background." },
      { src: '/project_screenshots/honours_lab/profile_photo_change.png', caption: 'You pick a profile picture from a set of medieval "sigils", like a dragon, a wizard, a knight or a jester.' },
      { src: '/project_screenshots/honours_lab/qa_section.png', caption: 'The Q&A section, "Spill Your Secrets, Scholar", where you answer questions about yourself and can delete your answers again.' },
    ],
    kind: 'React · Frontend · UI design',
    meta: '2026',
    description:
      "A single-page app for managing the honours computer lab. The main part is a 7 × 10 seat map that shows who is sitting where. It also has logging in, profiles you can edit, a Q&A section, announcements you can filter by tag, and your own colour theme, all saved in the browser. We weren't allowed to use any external libraries, so it's all plain React.",
    theme:
      'I gave it a medieval fantasy theme. Students are called "Scholars" and log in on a parchment scroll, seats are thrones, announcements are decrees, and profile pictures are "sigils". Every page has its own illustrated background, and all the text is written in the same medieval style.',
    tags: ['React', 'JavaScript', 'localStorage', 'UI design'],
  },
  {
    title: 'Peer-to-Peer File Sharing',
    slug: 'peer-to-peer-file-sharing',
    module: 'Computer Networks',
    mark: '94%',
    images: [
      { src: '/project_screenshots/p2p/swaying_login.webm', caption: 'The log-in screen sways like a ship, with the Pirates of the Caribbean soundtrack playing in the background.' },
      { src: '/project_screenshots/p2p/log_in.png', caption: '"Name yerself or the plank awaits". Every key you type makes a coin sound, and every click makes a water drop sound.' },
      { src: '/project_screenshots/p2p/client_gui.png', caption: "The client, where you search for files, sort and filter the results, pause or cancel downloads and share your own files. The banner at the top switches between pirate and file-transfer quotes, like \"The code is more what you'd call guidelines than actual rules.\"" },
      { src: '/project_screenshots/p2p/server_gui.png', caption: 'The server log, with octopuses around the edges. Connects, disconnects, searches and downloads each get their own colour.' },
    ],
    portrait: true,
    ratio: '1 / 1',
    kind: 'Java · JavaFX · Networking',
    meta: '2026',
    description:
      'An anonymous file-sharing app where people download files straight from each other. A small server handles searches and returns exact and close matches. It introduces two people using encrypted keys, and then the file goes directly between them over Tailscale, with pause, resume and an animated progress bar. I built the entire frontend using only JavaFX.',
    theme:
      'We gave it a pirate theme: old treasure maps, wooden signs, skulls and ships, and all the text is in pirate speak. Files are treasure, and sharing them is "distributing plunder among yer crew". Typing sounds like coins, clicking sounds like water drops, and the log-in screen sways like a ship while the Pirates of the Caribbean soundtrack plays.',
    tags: ['Java', 'JavaFX', 'Encryption', 'Tailscale'],
  },
  {
    title: 'Parallel Othello AI',
    slug: 'parallel-othello-ai',
    module: 'Concurrency',
    mark: '85%',
    gui: false,
    kind: 'C · MPI · Parallel computing',
    meta: '2026',
    description:
      'An Othello player that chooses its moves with Monte Carlo Tree Search. I used MPI to spread the search over several cores, so it can look at more moves and play better in the same amount of time.',
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
    module: 'Computer Networks',
    mark: '88%',
    images: [
      { src: '/project_screenshots/voip/log_in.png', caption: 'The login screen has a dark-web hacker look, with falling 0s and 1s and creepy loading music. The sound waves next to the HALT logo move like a real voice note.' },
      { src: '/project_screenshots/voip/server_gui.png', caption: "The server window shows who's connected and logs everything that happens. It also has a PANIC button…" },
      { src: '/project_screenshots/voip/flashing_server_panic_button.png', caption: "…which flashes the screen red and shuts the whole server down. It's just a joke." },
      { src: '/project_screenshots/voip/main_client_gui.png', caption: 'The main client has a global chat, voice notes and a group call with everyone on the server. The screen flashes red when someone new joins, and when someone calls you, the Ben 10 theme song plays.' },
      { src: '/project_screenshots/voip/whisper_chats.png', caption: 'Whisper calls and messages are private, and they open in their own window.' },
      { src: '/project_screenshots/voip/plagiarism_easter_egg.png', caption: "We hid easter eggs that go off on the other person's screen when you send certain words. \"Plagiarism\" shows a fake Turnitin pop-up with 97% similarity." },
      { src: '/project_screenshots/voip/cs244_easter_egg.png', caption: '"Trauma" shows the spec for the CS244 compiler project, which everyone in Computer Science knows is really hard.' },
      { src: '/project_screenshots/voip/stemlearn_easter_egg.png', caption: '"STEMLearn" opens a fake STEMLearn login page (the site Stellenbosch students use for their work), and they have to press the sign-in button to get back.' },
      { src: '/project_screenshots/voip/marks_easter_egg.png', caption: '"Marks" plays a dun dun dunnn sound and flashes a "marks are out" message. "Stellenbosch" or "Maties" plays "Dis Altyd Lente", the Stellenbosch student song, and "annoying" plays Baby Shark at full volume on repeat.' },
    ],
    ratio: '16 / 9',
    kind: 'Java · UDP · Real-time audio',
    meta: '2026',
    description:
      'A voice-over-IP app. The server keeps track of who is online, and the calls go directly between the people talking over UDP. You can make one-on-one and group calls, chat in group channels, text during a call and send voice notes. I built the entire frontend using only JavaFX.',
    theme:
      'We made it look like a dark web hacker program: everything is red and black, with 0s and 1s falling in the background and creepy music while it loads. The log-in screen greets you with "Welcome stranger. Your IP has been noted.", private chats tell you to "Behave...", and the server even has a fake PANIC button.',
    tags: ['Java', 'UDP', 'Audio streaming', 'GUI'],
  },
  {
    title: 'Multicore Process Scheduler',
    slug: 'multicore-process-scheduler',
    module: 'Concurrency',
    mark: '100%',
    gui: false,
    kind: 'C · Operating systems',
    meta: '2026',
    description:
      'A program in C that simulates how an operating system schedules processes, on one core and on several cores. It covers a process from start to finish: setting up its process control block and memory, scheduling and running it, and ending it. It also detects and handles deadlocks.',
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
    module: 'Computer Networks',
    mark: '100%',
    portrait: true,
    ratio: '710 / 997',
    images: [
      { src: '/project_screenshots/rbudp_tcp/home_screen.png', caption: 'The home screen, where you choose to send or receive files, with a waving snail. The footer asks our lecturer to round our mark up.' },
      { src: '/project_screenshots/rbudp_tcp/send_files.png', caption: 'The sender: you pick the receiver, the file, TCP or RBUDP and the packet size, then watch the progress bar and live stats like speed and retransmits.' },
      { src: '/project_screenshots/rbudp_tcp/receive_files.png', caption: 'The receiver, set in space: you choose where to save the file, start listening, and watch the file come in.' },
    ],
    kind: 'Java · Networking · Experiments',
    meta: '2026',
    description:
      'Our version of the Reliable Blast UDP protocol for sending files. The file gets sent in numbered UDP packets, and TCP is used to ask for any lost packets again. There are sender and receiver GUIs with progress bars, and we ran experiments comparing its speed to TCP with different packet sizes, send rates and loss rates. I built the entire frontend using only JavaFX.',
    theme:
      "The design is a race between a snail and a rocket. TCP is the snail, because it's reliable but slow: it waits for every packet to be confirmed. RBUDP is the rocket, because it sends the whole file over UDP and only goes back for the packets that got lost, which makes it much faster. That's why there's a waving snail on the home screen and the receiver is set in space. The footer also has rotating jokes about it, written to make our markers laugh.",
    tags: ['Java', 'UDP', 'TCP', 'Performance analysis'],
  },
  {
    title: 'WISTL Compiler',
    slug: 'wistl-compiler',
    module: 'Computer Architecture',
    mark: '85.12%',
    gui: false,
    kind: 'C · Compiler design',
    meta: '2025',
    description:
      'A compiler written in C for WISTL, a simple language used for teaching. It does every step: scanning, parsing, checking the types and meaning, and generating JVM bytecode with Jasmin.',
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
    module: 'Data Structures & Algorithms',
    mark: '74%',
    gui: false,
    kind: 'Java · Algorithms · Bio-informatics',
    meta: '2025',
    description:
      'A project that ran the whole semester and was marked on speed. It finds quasi-palindromes in DNA (sequences that are almost palindromes, which are linked to genetic instability) when letters can be swapped next to each other or far apart, and it can generate strings with a given number of them.',
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
  'Frontend & Web': ['JavaScript', 'HTML', 'CSS', 'React', 'Vite', 'Express.js'],
  Programming: ['Java', 'JavaFX', 'C', 'Python', 'MATLAB', 'R', 'x86 Assembly'],
  'Data & Optimisation': ['SQL', 'MySQL', 'LINGO', 'AnyLogic'],
  'Tools & Collaboration': ['Git', 'GitHub', 'GitLab', 'Maven', 'Docker', 'CI/CD', 'Agile', 'Scrum', 'Jira', 'Confluence'],
}

// Which projects (by slug) use each skill. Hovering a skill on the home page shows these, and clicking it
// opens the projects page showing only them. Skills that aren't listed just aren't linked to a project.
const everyProject = projects.map((p) => p.slug)
const projectsWithGui = projects.filter((p) => p.gui !== false).map((p) => p.slug)

export const skillProjects = {
  'UI/UX design': ['hackathon-hosting-platform', 'community-event-volunteer-platform', 'honours-lab-management-app', 'peer-to-peer-file-sharing', 'voip-chat', 'rbudp-tcp-file-transfer'],
  'Product design': ['community-event-volunteer-platform'],
  'Responsive design': ['community-event-volunteer-platform'],
  Prototyping: ['community-event-volunteer-platform'],
  'User-centred design': ['community-event-volunteer-platform', 'honours-lab-management-app'],
  Figma: ['community-event-volunteer-platform'],
  Canva: projectsWithGui,
  JavaScript: ['hackathon-hosting-platform', 'honours-lab-management-app'],
  HTML: ['hackathon-hosting-platform', 'honours-lab-management-app'],
  CSS: ['hackathon-hosting-platform', 'honours-lab-management-app'],
  React: ['hackathon-hosting-platform', 'honours-lab-management-app'],
  Vite: ['honours-lab-management-app', 'hackathon-hosting-platform'],
  'Express.js': ['hackathon-hosting-platform'],
  Java: ['peer-to-peer-file-sharing', 'voip-chat', 'rbudp-tcp-file-transfer', 'quasi-palindromes-in-dna'],
  JavaFX: ['peer-to-peer-file-sharing', 'voip-chat', 'rbudp-tcp-file-transfer'],
  C: ['parallel-othello-ai', 'multicore-process-scheduler', 'wistl-compiler'],
  Git: everyProject,
  GitHub: everyProject,
  GitLab: everyProject,
  Docker: ['parallel-othello-ai'],
  'CI/CD': ['community-event-volunteer-platform'],
  Agile: ['hackathon-hosting-platform', 'community-event-volunteer-platform'],
  Scrum: ['community-event-volunteer-platform'],
  Jira: ['community-event-volunteer-platform'],
  Confluence: ['community-event-volunteer-platform'],
}

export const contact = {
  email: 'anvnstaden@gmail.com',
  github: 'https://github.com/anvnstaden',
  linkedin: 'https://www.linkedin.com/in/anja-van-staden',
  // The CV the contact section offers for download (the PDF lives in public/)
  cv: '/Anja-vanStaden-CV-Oct2026.pdf',
}

// Shown on the back of the ID badge on the home page when it flips over.
// The back of the ID badge on the home page: a tongue-in-cheek security clearance list. `status` is
// 'granted', or 'pending' with a `progress` from 0 to 1 for things still being learned.
export const accessLevels = [
  { area: 'UI/UX design', detail: 'Figma · prototyping', status: 'granted' },
  { area: 'Frontend', detail: 'React · JavaScript · CSS', status: 'granted' },
  { area: 'Systems', detail: 'Java · C · Python', status: 'granted' },
  { area: 'Data', detail: 'SQL · optimisation', status: 'granted' },
  { area: 'Deutsch', detail: 'learning every day', status: 'pending', progress: 0.6 },
]

// "My Journey" timeline under About Me, oldest first. `scene` picks the illustrated postcard
// (see components/JourneyScenes.jsx), `stats` are the chips under the text.
export const journey = [
  {
    scene: 'mossel-bay',
    when: '2021',
    place: 'Mossel Bay, South Africa',
    title: 'Point High School',
    text: 'I grew up in Mossel Bay, a small town on the Garden Route right by the sea. I finished matric at Point High School in 2021 with an 88% average.',
    stats: [
      { value: '88%', label: 'matric average' },
      { value: '≈ 1,6', label: 'German grade', lang: 'de' },
    ],
    footnote: 'German grade worked out with the modified Bavarian formula used by German universities.',
  },
  {
    scene: 'stellenbosch',
    when: '2022 – 2026',
    place: 'Stellenbosch, South Africa',
    title: 'Stellenbosch University',
    text: "I moved to Stellenbosch to attend university, where I'm studying Computer Science & Operations Research. Along the way I discovered how much I love UI/UX and frontend development.",
    stats: [
      { value: '77.5%', label: 'current average' },
      { value: '≈ 2,3', label: 'German grade', lang: 'de' },
    ],
    footnote: 'German grade worked out with the modified Bavarian formula used by German universities.',
    link: { to: '/projects', label: 'See what I built there' },
  },
  {
    scene: 'europe',
    when: '2027',
    place: 'Germany',
    title: 'Next stop: Germany',
    note: 'bis bald!',
    text: "Next up is Germany! I have Dutch citizenship, so I can work in the EU without a visa, and I'm learning German so I'm ready to start working there in 2027.",
    stats: [
      { value: '2027', label: 'ready to start' },
      { value: 'EU', label: 'no visa needed' },
    ],
  },
]
