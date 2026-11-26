// Site content. Edit text here; the pages pick it up automatically. The German version of it is in content.de.js.
// `projects` are my university projects and `personalProjects` the ones I built myself; each has its own page.
// The projects pages show them in this order, so the strongest go first. The ones without a GUI are grouped at the
// end of the university page as engineering projects.
//
// Screenshots: put image files in public/project_screenshots/<folder>/ and list them in that
// project's `images`, e.g.
//   images: [
//     { src: '/project_screenshots/hackathon/editor.webp', caption: 'Shared code editor' },
//   ],
// Add as many as you like (3 or more works best); visitors can click through them and
// open each one full size. Screen recordings (.webm or .mp4) work too: they play silently on a loop. The first image is also the project's thumbnail on the home page.
// Mark an image `more: true` to leave it out of the carousel: it only shows under "See all screens", so the
// carousel stays a short highlight reel.
// Keep files light for phones: screenshots as WebP (at most 1920px wide), recordings as H.264 .mp4 without
// sound, each with a `<name>-poster.webp` of its first frame next to it, which shows until the video plays.
// Set `portrait: true` when the screenshots are taller than they are wide (e.g. a narrow app window),
// or `ratio: 'width / height'` when they have different proportions from the default 1915 x 962.
// Slides always fill their frame, so a screenshot that's a slightly different size gets trimmed a little.
//
// Projects without a user interface set `gui: false` and list `highlights` instead;
// they get a terminal-style panel rather than a screenshot gallery.
// Projects with a `featured` number appear on the home page, in that order. Add `link` to show a "View project" link
// (`linkLabel` changes its text).
// `note` is an optional handwritten aside next to the title, and `label` an optional badge next to the year
// (e.g. 'Client work').
// `tagline` is the one-line summary under the title, and `role`, `team` (how many people; 1 is solo) and `time`
// are the at-a-glance line under it.
// `theme` is an optional paragraph explaining the project's visual theme.
// `module` is the university module the project was for.
// `mark` is the final mark; use 'TBA' while a project is still in progress. Its German grade is worked out from it.
// `stack` is the list of technologies shown under "Tech stack", and `technical` optional notes on how it's built.
// `caseStudy` is the story behind the project, shown under "Read the case study": the `problem`, the `user`, the
// `research`, the `decisions`, the `outcome` and what I `learned`, and the `reflection`. Group projects add `role`
// (my part). Projects without real users (most of the ones without a GUI) leave out `user` and `research`.

export const projects = [
  {
    title: 'Neighbourly: Volunteering Platform',
    slug: 'community-event-volunteer-platform',
    featured: 2,
    label: 'Industry project',
    tagline: 'A live platform that swaps paper sign-in sheets for QR check-ins, and gives volunteers a neighbourhood that grows.',
    role: 'Scrum Master, UI/UX & frontend',
    team: 6,
    time: '3 months',
    mark: '85.4%',
    module: 'Software Engineering',
    link: 'https://neighbourly.dpdns.org/',
    images: [
      { src: '/project_screenshots/volunteer_platform/walkthrough.mp4', caption: 'A quick walkthrough as a volunteer: the landing page, browsing events, My Attendance, My Statistics, the achievements road and the profile page.' },
      { src: '/project_screenshots/volunteer_platform/landing_page.webp', caption: 'The landing page for Neighbourly, with a hand-drawn neighbourhood and the headline "The future of volunteering is here".' },
      { src: '/project_screenshots/volunteer_platform/animated_logo_intro.webp', more: true, caption: "The first time you visit, there's an animated logo intro with sound, which you can skip." },
      { src: '/project_screenshots/volunteer_platform/landing_page_info.webp', more: true, caption: 'The landing page explains what Neighbourly is, how it works and why it matters, each in its own colour.' },
      { src: '/project_screenshots/volunteer_platform/browse_events.webp', caption: 'Browsing events: you can search by event or organisation, filter by cause, and see how many spots are left.' },
      { src: '/project_screenshots/volunteer_platform/event_signup.webp', more: true, caption: 'Signing up for an event takes one click. You get a confirmation email and a reminder 24 hours before.' },
      { src: '/project_screenshots/volunteer_platform/successful_event_signup.webp', caption: 'After signing up you get confetti and a QR code to show the organiser at the event, plus a button to add it to Google Calendar.' },
      { src: '/project_screenshots/volunteer_platform/volunteer_attendance.webp', more: true, caption: 'My Attendance shows the events you went to and your volunteer hours. You can filter by attended, awaiting confirmation, upcoming or absent.' },
      { src: '/project_screenshots/volunteer_platform/notifications.webp', more: true, caption: 'Notifications for sign-up confirmations, reminders and event changes, all in one place.' },
      { src: '/project_screenshots/volunteer_platform/volunteer_stats.webp', caption: 'My Statistics shows your total hours, events, badges and organisations helped, plus your hours per month and per cause.' },
      { src: '/project_screenshots/volunteer_platform/volunteer_achievements.webp', more: true, caption: 'My Achievements: you grow your own little neighbourhood by volunteering, with 30 buildings to unlock.' },
      { src: '/project_screenshots/volunteer_platform/volunteer_achievement_road.webp', caption: 'Each cause grows its own building along the road, like a tent that turns into a cabin, a park bench or a braai stand.' },
      { src: '/project_screenshots/volunteer_platform/volunteer_profile.webp', more: true, caption: 'The volunteer profile with your hours, events and badges, and shortcuts to your statistics and QR check-ins.' },
      { src: '/project_screenshots/volunteer_platform/faq.webp', more: true, caption: 'An FAQ for both volunteers and organisations.' },
      { src: '/project_screenshots/volunteer_platform/organisation_dashboard.webp', caption: 'The organisation dashboard: events hosted, volunteers, attendance rate, upcoming events and a table of all their events.' },
      { src: '/project_screenshots/volunteer_platform/organisation_create_event.webp', more: true, caption: 'Creating an event shows a live preview of the card volunteers will see.' },
      { src: '/project_screenshots/volunteer_platform/organisation_qr_code_scanner.webp', caption: "At the event, organisers scan volunteers' QR codes (with the camera, an uploaded image or by typing the code in) and the attendance updates straight away." },
    ],
    kind: 'Entelect industry project · Full-stack',
    meta: '2026',
    description:
      "Our industry project with Entelect, built in a team of six. It's a website for community organisations to create events, find volunteers and keep track of attendance and volunteer hours. I was the team's Scrum Master and worked on both the code and the usability of the site.",
    stack: ['Next.js', 'React', 'Tailwind CSS', 'shadcn/ui', 'Express.js', 'Prisma', 'Better Auth', 'Vitest', 'GitLab CI/CD'],
    caseStudy: {
      role: 'I was the Scrum Master. I also designed the look and the flows (including the hand-drawn neighbourhood and the achievements), built frontend pages in Next.js and Tailwind, and went through the site to find and fix usability problems.',
      problem: 'Community organisations kept track of their volunteers with spreadsheets, WhatsApp groups and paper sign-in sheets. And people who wanted to help had no single place to find events that fit their time and the causes they care about.',
      user: 'Students and young people who want to give back and need proof of their hours, and the coordinators at NGOs and community groups who plan events and check people in on the day. Entelect, our industry partner, gave us the brief and acted as the client.',
      research: 'We met our Entelect contact regularly to turn the brief into user stories, and designed the volunteer and organisation screens as a prototype before writing any code. I looked at existing volunteering platforms and found most felt corporate and gave volunteers no reason to come back. Once it worked, we had people try the site and fixed the places where they got stuck.',
      decisions: "Because other platforms gave volunteers no reason to return, ours lets them grow their own little neighbourhood as they help. Attendance is recorded by scanning a QR code, so organisers don't need paper lists and the hours are counted automatically.",
      outcome: 'Neighbourly is live at neighbourly.dpdns.org and deploys automatically from our pipeline, with a tested backend and a public coverage report. Entelect was happy with the final demo, and we got 85.4%.',
      learned: 'Being Scrum Master taught me how to keep six people moving in the same direction, and that small branches, merge requests and code reviews are essential in a big team. Volunteers and organisations want very different things from the same app, so each of them needed their own flow.',
      reflection: "I'd agree on shared components and styles at the very start, so the pages built by different people looked consistent sooner.",
    },
  },
  {
    title: 'HALT: Hackathon Platform',
    slug: 'hackathon-hosting-platform',
    featured: 3,
    tagline: 'A hackathon platform where teams code together live and get marked automatically.',
    role: 'UI/UX, visual design & frontend',
    team: 4,
    time: '4 weeks',
    module: 'Web Development & Databases',
    mark: '89%',
    images: [
      { src: '/project_screenshots/hackathon/parallax_effect.mp4', caption: 'The chrome hands and figures move with a parallax effect, which makes the landing, log-in and sign-up pages feel a bit 3D.' },
      { src: '/project_screenshots/hackathon/landing.webp', more: true, caption: 'The landing page, with two chrome hands reaching for the "Ready to build?" box.' },
      { src: '/project_screenshots/hackathon/sign_up.webp', more: true, caption: 'Signing up to join a hackathon.' },
      { src: '/project_screenshots/hackathon/log_in.webp', more: true, caption: 'Logging in. The chrome guy points you to the form.' },
      { src: '/project_screenshots/hackathon/home.webp', caption: 'Your home page shows your group invitations, a button to start your own hackathon, and all your groups.' },
      { src: '/project_screenshots/hackathon/pending_invitations.webp', more: true, caption: 'All your group invitations in one pop-up, where you can accept or decline them.' },
      { src: '/project_screenshots/hackathon/create_group.webp', caption: 'Creating your own group: you pick a name and an icon, set up the hackathon and invite people. Whoever creates the group is its admin.' },
      { src: '/project_screenshots/hackathon/your_groups.webp', more: true, caption: 'Your groups, split into the ones you joined and the ones you run. You can search them and filter by forming teams, in progress or ended.' },
      { src: '/project_screenshots/hackathon/group_overview.webp', more: true, caption: "Each group's overview shows the main numbers and a short explanation of how the scoring works." },
      { src: '/project_screenshots/hackathon/group_members.webp', more: true, caption: 'Everyone in the group and their teams. Team leaders are marked, your team is highlighted, and people without a team are listed at the bottom.' },
      { src: '/project_screenshots/hackathon/team_tab.mp4', caption: 'The Teams tab, where you can accept invites from other teams, see your own team and look through every team in the group. Teams get locked once the hackathon starts.' },
      { src: '/project_screenshots/hackathon/problems.webp', more: true, caption: 'The problems page: each problem with its input and output format, examples, and how many test cases are hidden.' },
      { src: '/project_screenshots/hackathon/full_screen_editor.webp', caption: 'The shared editor in full screen. Everyone on the team can code at the same time, with the files on the left and the problem on the right. Only the team leader can submit.' },
      { src: '/project_screenshots/hackathon/submissions.webp', more: true, caption: 'Every submission your team made, with how many tests passed, the runtime and when it was submitted.' },
      { src: '/project_screenshots/hackathon/submission_details.webp', caption: 'Clicking a submission shows how it did on each test case, like a wrong answer, a time limit or a runtime error.' },
      { src: '/project_screenshots/hackathon/leaderboard.webp', caption: "The live leaderboard. Each team's best three problems count, and the lowest score wins." },
      { src: '/project_screenshots/hackathon/admin_overview.webp', caption: "The same group from the admin's side. It turns pink and gets an extra Admin tab." },
      { src: '/project_screenshots/hackathon/admin_panel.webp', more: true, caption: 'The Admin tab, for inviting members, checking pending invites and changing the hackathon settings before it starts.' },
      { src: '/project_screenshots/hackathon/manage_problems.webp', more: true, caption: 'Admins add the problems before the hackathon starts, can edit or delete them, and start the hackathon when everyone is ready.' },
      { src: '/project_screenshots/hackathon/edit_problems.webp', more: true, caption: 'Editing a problem: the title, description, input and output format, and the test cases, which can be hidden from the teams.' },
      { src: '/project_screenshots/hackathon/admin_group_members.webp', more: true, caption: "Admins can see everyone in the group and which team they're on, including who still needs a team." },
      { src: '/project_screenshots/hackathon/admin_teams.webp', more: true, caption: "The teams page from the admin's side, with every team and its leader." },
    ],
    ratio: '1927 / 962',
    kind: 'React · Express · WebSockets',
    meta: '2026',
    description:
      'A website for running student hackathons, built in a group of four. Admins create groups, add problems with hidden test cases and start the hackathon. Teams write code together in a shared editor that updates live, and their Python submissions get marked automatically and show up on a live leaderboard. We called it HALT after the four of us (Hannah, Anja, Leo and Tiana), and because HALT is also an assembly instruction. We were not allowed to use any external libraries, so the entire frontend is built with plain React.',
    theme:
      'We went for a retro synthwave look: a neon pink and cyan grid, a starry sky, glitchy fonts and shiny chrome hands and figures. On the landing, log-in and sign-up pages they move with a parallax effect.',
    stack: ['React', 'Vite', 'Express.js', 'WebSockets', 'PostgreSQL', 'Prisma', 'JWT', 'Vitest'],
    caseStudy: {
      role: "I designed and built the landing, log-in and sign-up pages, with the parallax chrome hands and the grid. I also built parts of the group and team pages, like the new-leader view, colours that match each group and a Start hackathon button that stays greyed out until it's allowed, plus the setting for how many problems count and the mock data we tested with.",
      problem: "Our lecturer's brief: a platform for running student hackathons, from forming teams to marking and ranking their code. The features were set, so the design challenge was making something that complex clear, and fun, to use under time pressure.",
      user: 'Students competing in teams, who need to code together under time pressure and see where they stand. Team leaders, who manage their team and are the only ones who can submit, and the organisers who set up the problems and run the event.',
      research: 'We broke the spec down into features and edge cases, like what happens to teams once a hackathon starts. We also looked at competitive coding sites like LeetCode, Kattis and HackerRank to see how they usually show problems, submissions and leaderboards.',
      decisions: "A retro synthwave look with chrome hands and parallax makes it feel like an event, not a marking system. The admin's view of a group turns pink, so you always know which role you're in, and only the team leader can submit, which keeps the submission limit fair and stops teammates overwriting each other.",
      outcome: 'A complete platform that runs a hackathon from sign-up to the final leaderboard, with everything (even the live shared editor) built without external frontend libraries. We got 89%.',
      learned: "Keeping several people's edits in sync without losing anyone's changes is much harder than it looks. Building without libraries showed me what component libraries normally do for you, and designing for members, leaders and admins taught me to show each person only what they can actually do.",
      reflection: "I'd get a plain version of every feature working first, and add the theme and animations afterwards.",
    },
  },
  {
    title: 'Honours Lab Management App',
    slug: 'honours-lab-management-app',
    tagline: "A seat map that shows who's sitting where in the lab, themed as a medieval castle.",
    role: 'UI/UX design & code',
    team: 1,
    time: '6 weeks',
    module: 'Web Development & Databases',
    mark: '100%',
    images: [
      { src: '/project_screenshots/honours_lab/login_screen.webp', caption: 'Logging in on a parchment scroll. Students are called "Scholars".' },
      { src: '/project_screenshots/honours_lab/login_screen_funny_error_msgs.webp', caption: "I made the error messages funny. If the username doesn't exist you get \"Guards, seize them! No account exists with that username.\"" },
      { src: '/project_screenshots/honours_lab/my_seat.webp', caption: 'Picking a seat on the 7 × 10 map. Your seat is highlighted, and you can give it up with "Relinquish Throne".' },
      { src: '/project_screenshots/honours_lab/other_students_seats.webp', caption: 'Clicking a taken seat shows who is sitting there, with their profile picture and name.' },
      { src: '/project_screenshots/honours_lab/announcements_page.webp', caption: 'Announcements can be tagged as Decree, Warning, Gossip, Feast or Study Session, and filtered by tag.' },
      { src: '/project_screenshots/honours_lab/profile_page_w_customisable_colours.webp', caption: "On the profile page you can change the app's main and accent colours. Every page has its own background." },
      { src: '/project_screenshots/honours_lab/profile_photo_change.webp', caption: 'You pick a profile picture from a set of medieval "sigils", like a dragon, a wizard, a knight or a jester.' },
      { src: '/project_screenshots/honours_lab/qa_section.webp', caption: 'The Q&A section, "Spill Your Secrets, Scholar", where you answer questions about yourself and can delete your answers again.' },
    ],
    kind: 'React · Frontend · UI design',
    meta: '2026',
    description:
      "A single-page app for managing the honours computer lab. The main part is a 7 × 10 seat map that shows who is sitting where. It also has logging in, profiles you can edit, a Q&A section, announcements you can filter by tag, and your own colour theme, all saved in the browser. We weren't allowed to use any external libraries, so it's all plain React.",
    theme:
      'I gave it a medieval fantasy theme. Students are called "Scholars" and log in on a parchment scroll, seats are thrones, announcements are decrees, and profile pictures are "sigils". Every page has its own illustrated background, and all the text is written in the same medieval style.',
    stack: ['React', 'Vite', 'JavaScript', 'CSS', 'localStorage'],
    caseStudy: {
      problem: 'In the honours lab nobody knew who was sitting where or which seats were free. The brief asked for a lab management app, and my challenge was making a practical tool people would actually enjoy opening.',
      user: "Honours students who share the lab every day and want to find a seat and see who's around.",
      research: 'I broke the spec into features and planned each screen before building, and based the 7 × 10 seat map on the actual layout of the lab. For the look and the wording I looked at fantasy games and medieval illustrations, which is where the "sigil" profile pictures came from.',
      decisions: "A medieval fantasy theme with thrones, decrees and sigils turns a dull admin tool into something people enjoy opening. The error messages are jokes in character, so getting something wrong isn't frustrating, and everyone can choose their own colours so the app feels like theirs.",
      outcome: 'It was my first full React app built on my own, from the design to the code. It got 100%, and my classmates enjoyed the theme and the jokes when I showed it to them.',
      learned: 'I learned to manage state across pages in plain React and keep it in localStorage, and to plan my own time with nobody else checking. I also learned that copy is design too: the medieval wording does as much for the theme as the visuals, and small personal touches make people want to use a tool.',
      reflection: "I'd add a real backend, because with browser storage only, people can't see each other's seats on different computers. I'd also plan the seat map for phones, since students would check for a free seat on their way to the lab.",
    },
  },
  {
    title: 'Peer-to-Peer File Sharing',
    slug: 'peer-to-peer-file-sharing',
    tagline: 'Anonymous, encrypted file sharing that someone with no networking knowledge can use.',
    role: 'UI/UX, frontend, visuals & sound',
    team: 4,
    time: '2 weeks',
    module: 'Computer Networks',
    mark: '94%',
    images: [
      { src: '/project_screenshots/p2p/swaying_login.mp4', caption: 'The log-in screen sways like a ship, with the Pirates of the Caribbean soundtrack playing in the background.' },
      { src: '/project_screenshots/p2p/log_in.webp', caption: '"Name yerself or the plank awaits". Every key you type makes a coin sound, and every click makes a water drop sound.' },
      { src: '/project_screenshots/p2p/client_gui.webp', caption: "The client, where you search for files, sort and filter the results, pause or cancel downloads and share your own files. The banner at the top switches between pirate and file-transfer quotes, like \"The code is more what you'd call guidelines than actual rules.\"" },
      { src: '/project_screenshots/p2p/server_gui.webp', caption: 'The server log, with octopuses around the edges. Connects, disconnects, searches and downloads each get their own colour.' },
    ],
    portrait: true,
    ratio: '1 / 1',
    kind: 'Java · JavaFX · Networking',
    meta: '2026',
    description:
      'An anonymous file-sharing app where people download files straight from each other. A small server handles searches and returns exact and close matches. It introduces two people using encrypted keys, and then the file goes directly between them over Tailscale, with pause, resume and an animated progress bar. I built the entire frontend using only JavaFX.',
    theme:
      'We gave it a pirate theme: old treasure maps, wooden signs, skulls and ships, and all the text is in pirate speak. Files are treasure, and sharing them is "distributing plunder among yer crew". Typing sounds like coins, clicking sounds like water drops, and the log-in screen sways like a ship while the Pirates of the Caribbean soundtrack plays.',
    stack: ['Java', 'JavaFX', 'Encryption', 'Tailscale'],
    caseStudy: {
      role: 'I designed and built the whole frontend (the client, log-in and server windows) and made all the custom assets: the audio, backgrounds, fonts and animations. I also wrote the Makefile, the README and the report.',
      problem: "Sharing files usually means uploading them to a company's server first. This app sends them straight from one person to another, without anyone seeing who's online or what they're downloading. The challenge was making a technical networking tool simple, and fun, for people who know nothing about networks.",
      user: 'People who know nothing about networking and just want search, download, pause and resume to work, without having to understand what happens underneath.',
      research: 'Our experiments showed that transfer time grows with file size, because every chunk is encrypted and sent separately, and that sending got much faster with encryption turned off, so the security has a real cost in speed. I also looked at how torrent apps show searches, progress and paused downloads.',
      decisions: 'A pirate theme where files are treasure makes an abstract idea easy to picture, and coin sounds for typing and water drops for clicks make every action feel acknowledged. Search returns close matches as well as exact ones, so a typo or half a name still finds the file, and the server log gives connects, searches and downloads their own colours so you can follow it at a glance.',
      outcome: 'Files transferred between different computers over Tailscale, with pause and resume, and the theme and sounds made our demo stand out. We got 94%.',
      learned: "I learned how far JavaFX can be pushed with CSS and animation when its default components can't be customised, and how to make my own sounds, backgrounds, fonts and animations so everything feels like it belongs together.",
      reflection: "I'd add a way to turn the music and sounds off, since not everyone wants audio all the time. And I'd connect the frontend to the backend earlier, so integration problems showed up sooner.",
    },
  },
  {
    title: 'VoIP Chat',
    slug: 'voip-chat',
    tagline: 'Calls, chat and voice notes in one app, with a personality people remember.',
    role: 'UI/UX, frontend, visuals & sound',
    team: 4,
    time: '3 weeks',
    module: 'Computer Networks',
    mark: '88%',
    images: [
      { src: '/project_screenshots/voip/log_in.webp', caption: 'The login screen has a dark-web hacker look, with falling 0s and 1s and creepy loading music. The sound waves next to the HALT logo move like a real voice note.' },
      { src: '/project_screenshots/voip/server_gui.webp', caption: "The server window shows who's connected and logs everything that happens. It also has a PANIC button…" },
      { src: '/project_screenshots/voip/flashing_server_panic_button.webp', caption: "…which flashes the screen red and shuts the whole server down. It's just a joke." },
      { src: '/project_screenshots/voip/main_client_gui.webp', caption: 'The main client has a global chat, voice notes and a group call with everyone on the server. The screen flashes red when someone new joins, and when someone calls you, the Ben 10 theme song plays.' },
      { src: '/project_screenshots/voip/whisper_chats.webp', caption: 'Whisper calls and messages are private, and they open in their own window.' },
      { src: '/project_screenshots/voip/plagiarism_easter_egg.webp', caption: "We hid easter eggs that go off on the other person's screen when you send certain words. \"Plagiarism\" shows a fake Turnitin pop-up with 97% similarity." },
      { src: '/project_screenshots/voip/cs244_easter_egg.webp', caption: '"Trauma" shows the spec for the CS244 compiler project, which everyone in Computer Science knows is really hard.' },
      { src: '/project_screenshots/voip/stemlearn_easter_egg.webp', caption: '"STEMLearn" opens a fake STEMLearn login page (the site Stellenbosch students use for their work), and they have to press the sign-in button to get back.' },
      { src: '/project_screenshots/voip/marks_easter_egg.webp', caption: '"Marks" plays a dun dun dunnn sound and flashes a "marks are out" message. "Stellenbosch" or "Maties" plays "Dis Altyd Lente", the Stellenbosch student song, and "annoying" plays Baby Shark at full volume on repeat.' },
    ],
    ratio: '16 / 9',
    kind: 'Java · UDP · Real-time audio',
    meta: '2026',
    description:
      'A voice-over-IP app. The server keeps track of who is online, and the calls go directly between the people talking over UDP. You can make one-on-one and group calls, chat in group channels, text during a call and send voice notes. I built the entire frontend using only JavaFX.',
    theme:
      'We made it look like a dark web hacker program: everything is red and black, with 0s and 1s falling in the background and creepy music while it loads. The log-in screen greets you with "Welcome stranger. Your IP has been noted.", private chats tell you to "Behave...", and the server even has a fake PANIC button.',
    stack: ['Java', 'JavaFX', 'UDP', 'Audio streaming'],
    caseStudy: {
      role: 'I built the whole frontend (the client, whisper, server and log-in windows), designed all the sounds, backgrounds and easter eggs, and wrote the report, the README and the code documentation.',
      problem: 'Calls, group chat, private messages and voice notes usually live in separate tools, and this puts them in one app. The challenge was giving a technical audio app a personality people remember.',
      user: "Classmates on the same server who want to chat, call and send each other voice notes, and whoever runs the server, who needs to see who's connected and what's happening.",
      research: 'We expected the server to slow down as more people connected, but it got faster: how a message is routed mattered more than how many people were online. Voice notes sent over TCP took only a few milliseconds longer when they were ten times as long. For the layout, I looked at how Discord and WhatsApp handle calls, channels and voice notes.',
      decisions: "A red-and-black dark-web hacker look makes a classroom chat app feel secret and fun, with hidden easter eggs for classmates to find. Whisper calls and messages open in their own window, so it's always clear what's private, and the screen flashes when someone joins and a theme song plays when you're called, so you never miss it.",
      outcome: 'One-on-one and group calls worked between different computers, along with the chat and voice notes, and the easter eggs got a big reaction in the demo. We got 88%.',
      learned: 'I learned to build animations like the falling 0s and 1s with JavaFX timelines and some maths, and that sound can be part of the interface. Inside jokes for a specific audience make a product memorable, and as the only frontend person I had to design screens that fit what three backend teammates were building.',
      reflection: "I'd make the flashing and the loud sounds optional, with a setting to mute them, because they can be too much and flashing can be a problem for some people. I'd also plug the backend into the GUI earlier, so we found integration bugs sooner.",
    },
  },
  {
    title: 'RBUDP & TCP File Transfer',
    slug: 'rbudp-tcp-file-transfer',
    tagline: 'Two file-transfer protocols, raced against each other and shown live.',
    role: 'UI/UX & frontend',
    team: 4,
    time: '3 weeks',
    module: 'Computer Networks',
    mark: '100%',
    portrait: true,
    ratio: '710 / 997',
    images: [
      { src: '/project_screenshots/rbudp_tcp/home_screen.webp', caption: 'The home screen, where you choose to send or receive files, with a waving snail. The footer asks our lecturer to round our mark up.' },
      { src: '/project_screenshots/rbudp_tcp/send_files.webp', caption: 'The sender: you pick the receiver, the file, TCP or RBUDP and the packet size, then watch the progress bar and live stats like speed and retransmits.' },
      { src: '/project_screenshots/rbudp_tcp/receive_files.webp', caption: 'The receiver, set in space: you choose where to save the file, start listening, and watch the file come in.' },
    ],
    kind: 'Java · Networking · Experiments',
    meta: '2026',
    description:
      'Our version of the Reliable Blast UDP protocol for sending files. The file gets sent in numbered UDP packets, and TCP is used to ask for any lost packets again. There are sender and receiver GUIs with progress bars, and we ran experiments comparing its speed to TCP with different packet sizes, send rates and loss rates. I built the entire frontend using only JavaFX.',
    theme:
      "The design is a race between a snail and a rocket. TCP is the snail, because it's reliable but slow: it waits for every packet to be confirmed. RBUDP is the rocket, because it sends the whole file over UDP and only goes back for the packets that got lost, which makes it much faster. That's why there's a waving snail on the home screen and the receiver is set in space. The footer also has rotating jokes about it, written to make our markers laugh.",
    stack: ['Java', 'JavaFX', 'UDP', 'TCP'],
    caseStudy: {
      role: 'I designed and built all three screens (the home screen, the sender and the receiver), and wrote the Makefile and the JavaDoc.',
      problem: 'TCP is reliable, but it waits for every packet to be confirmed. We built both TCP and Reliable Blast UDP, which sends everything at once and only goes back for lost packets, to find out whether RBUDP can send big files faster and still get every byte there.',
      user: 'Students learning networking, who can watch the difference between the two protocols happen live, and anyone who needs to send a large file from one computer to another.',
      research: "On a single machine, TCP was 2–3× faster than our RBUDP, because the operating system optimises TCP so well when there's no delay. Raising RBUDP's send rate kept making it faster with surprisingly little packet loss, and bigger packets helped up to a point, with a dip at around 16 KB.",
      decisions: "TCP is a snail and RBUDP a rocket, so the difference makes sense at a glance, and rotating jokes in the footer make a dry topic memorable. Speed, packets and retransmits update live during a transfer, and Start Transfer stays greyed out until every field is filled in, so you can't start a broken transfer.",
      outcome: 'Both protocols send files correctly, with lost packets detected and sent again. We got 100%.',
      learned: "This was my first JavaFX frontend, and the start of building the GUIs for all our networking projects. It showed me that a simple metaphor can explain a technical idea better than a paragraph, that live feedback makes an invisible process understandable, and that it's better to prevent mistakes in the interface than to show an error afterwards.",
      reflection: "I'd show the speed as a live graph, so runs can be compared side by side, and connect the backend to the GUI earlier so the statistics were right sooner.",
    },
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
    stack: ['C', 'MPI', 'Docker', 'Monte Carlo Tree Search'],
    caseStudy: {
      problem: 'A game AI only has a few seconds per move, so the more of the game it can explore in that time, the better it plays. So I built an Othello player and spread its search across several cores with MPI.',
      decisions: 'I used Monte Carlo Tree Search instead of hand-written rules, because it works out which moves are good by playing out lots of random games, and that work can be shared between cores.',
      outcome: 'The parallel version explored more moves in the same time limit and made better choices. I got 85%.',
      learned: "I learned to split work between processes with MPI and combine their results, and that adding cores doesn't make things proportionally faster, because the cores spend time sending each other their results.",
      reflection: "I'd start earlier, because debugging parallel code takes much longer than debugging normal code.",
    },
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
    stack: ['C', 'Operating systems', 'Scheduling'],
    caseStudy: {
      problem: "An operating system has to decide which program runs next, and on which core, without leaving any of them waiting forever. When processes wait on each other's resources everything can freeze, so the scheduler also has to notice deadlocks and fix them. I simulated this on one core and on several.",
      decisions: 'I got the single-core version fully working before extending it to several cores. For deadlocks, I chose to detect them and recover, rather than trying to prevent every possible one.',
      outcome: 'It got full marks (100%).',
      learned: 'I now understand what an operating system does behind the scenes every time a program runs, and that with several cores, shared data has to be protected carefully or bugs only show up some of the time.',
      reflection: "I'd write small test cases before the code, especially for deadlocks, and start earlier, because concurrency bugs take a long time to track down.",
    },
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
    stack: ['C', 'Jasmin', 'JVM bytecode'],
    caseStudy: {
      problem: "Computers can't run code the way people write it, so a compiler translates it, step by step, into something the machine can run. I built a full compiler for WISTL, a small teaching language, in stages over the semester.",
      decisions: 'I built and tested each stage (the scanner, parser, type checker and code generator) before starting the next, and ran the shared student test cases against every stage to catch mistakes early.',
      outcome: 'I got 85.12%.',
      learned: 'It was my biggest C project, and it taught me to structure a large program. Knowing what happens between writing code and running it has made me a better programmer in every language.',
      reflection: "I'd write more of my own tests for edge cases instead of relying on the shared ones, and start each stage earlier, because every bug carries over into the next stage.",
    },
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
    stack: ['Java', 'String algorithms'],
    caseStudy: {
      problem: 'Near-palindromes in DNA are linked to genetic instability, so finding them quickly in long sequences matters. Checking every possible swap takes far too long, and the project was marked on speed as well as correctness.',
      decisions: 'Instead of trying every swap, I counted the letters and their positions, which cut out most of the work, and reused results from shorter substrings instead of starting from scratch each time.',
      outcome: 'I got 74%.',
      learned: "The difference between a slow and a fast algorithm isn't theory: it's seconds versus hours. A slow, simple solution turned out to be the best way to test a fast one, and small things in Java, like how strings are built or copied, make a big difference to speed.",
      reflection: "I'd test more edge cases, like very long or repetitive strings, and spend more time on the maths on paper before writing code.",
    },
  },
]

export const personalProjects = [
  {
    title: 'Eva Kritzas: Brand & Booking Site',
    slug: 'eva-website',
    featured: 1,
    label: 'Client work',
    tagline: "Turned Eva's DM inbox into a site where brides enquire with every detail filled in and brow clients book themselves.",
    role: 'UI/UX design, build & launch',
    team: 1,
    time: '1 month, ongoing',
    note: 'and its own dashboard!',
    link: 'https://www.evakritzas.co.za/',
    linkLabel: 'Visit the website',
    images: [
      { src: '/project_screenshots/eva_website/load_in.mp4', caption: "The intro plays like a film's title sequence: the logo draws itself in gold, Eva's signature writes on, and the titles fly to their places on the home page as the black fades away." },
      { src: '/project_screenshots/eva_website/home.webp', caption: 'The home page, with Eva in front of her embossed logo.' },
      { src: '/project_screenshots/eva_website/hey_there.webp', more: true, caption: 'Eva introduces herself in her own words and signs off with her signature.' },
      { src: '/project_screenshots/eva_website/home_scroll.mp4', more: true, caption: 'Scrolling down the home page: her services, then her reels playing in phone frames over a huge outlined "SEEN", and where to follow her.' },
      { src: '/project_screenshots/eva_website/bridal.webp', more: true, caption: 'The bridal page, with black torn-paper edges and gold details that carry through the whole site.' },
      { src: '/project_screenshots/eva_website/bridal_scroll.mp4', caption: 'Scrolling down the bridal page, from the steps of a booking to a gallery of her brides.' },
      { src: '/project_screenshots/eva_website/how_it_works.webp', more: true, caption: 'How It Works takes brides through the steps, from the first enquiry to the wedding morning.' },
      { src: '/project_screenshots/eva_website/behind_the_scenes.webp', more: true, caption: "Behind the scenes, with photos from real wedding mornings laid out like polaroids and Eva's signature." },
      { src: '/project_screenshots/eva_website/whats_included.webp', more: true, caption: 'What you get with a bridal booking, next to a card for asking for a quote.' },
      { src: '/project_screenshots/eva_website/portfolio.webp', more: true, caption: 'The portfolio, a photo grid you can filter by category, like Bridal, Editorial or Brows & Lashes.' },
      { src: '/project_screenshots/eva_website/portfolio_filter.mp4', caption: 'The filters swap the photos with a soft fade, and clicking a photo opens it full size. Further down are the publications her work has appeared in, and client reviews you can click through.' },
      { src: '/project_screenshots/eva_website/services.webp', more: true, caption: 'The services page has a card for each kind of makeup and hair booking: bridal, matric dance, events and editorial.' },
      { src: '/project_screenshots/eva_website/brows_lashes.mp4', caption: 'Brows & lashes: dragging across the photo compares before and after, and further down is her price list.' },
      { src: '/project_screenshots/eva_website/about.webp', more: true, caption: 'The About page, where Eva tells her story next to a black-and-white portrait.' },
      { src: '/project_screenshots/eva_website/faq.webp', more: true, caption: 'The FAQ, with the questions grouped by topic. The answers slide open.' },
      { src: '/project_screenshots/eva_website/contact.webp', caption: "The contact page sends brow and lash clients straight to online booking. Everyone else fills in the enquiry form, and once it's sent the site shows its own thank-you page." },
      { src: '/project_screenshots/eva_website/book.webp', more: true, caption: 'Brow and lash treatments can be booked online. A note at the top shows when Eva is away.' },
      { src: '/project_screenshots/eva_website/book_calendar.webp', caption: "Picking a treatment opens Eva's calendar right on the page, recoloured to match the site." },
      { src: '/project_screenshots/eva_website/dashboard.webp', caption: 'The dashboard, shown here with sample numbers. It sums up the week in a sentence, then shows the statistics underneath.' },
    ],
    ratio: '16 / 9',
    kind: 'Astro · Vite · TypeScript',
    description:
      "A website for Eva Kritzas, a makeup and hair artist based in Stellenbosch. It has pages for her bridal work, portfolio, services and FAQ, plus an enquiry form. I also built a dashboard that tracks all of the website's statistics: how many people visited, which pages they looked at, how they found her, where they are, whether they're on a phone or a computer, and how fast the site loads.",
    technical: [
      'A static Astro site with no database or CMS. The business details and copy live in one data file, so most updates need no page code.',
      'The dashboard is its own Cloudflare project, written in plain TypeScript with Vite.',
      'Serverless functions call the APIs and hold the secret keys, so nothing private reaches the browser.',
      'The statistics come from Cloudflare Web Analytics and the speed score from Google PageSpeed Insights, reused for 30 minutes.',
    ],
    stack: ['Astro', 'TypeScript', 'Vite', 'Cloudflare', 'Cloudflare Web Analytics', 'PageSpeed Insights API'],
    caseStudy: {
      problem: "Eva's bookings and questions came in through Instagram DMs and WhatsApp, so details got lost and she kept answering the same questions. Instagram was her only home online, with nowhere professional to send a bride, and brow and lash clients had to message back and forth to find a time.",
      user: "Brides planning months ahead, who want to see her bridal work and how a booking works before they enquire. Clients for matric dances, events and shoots who want a quick quote, and local brow and lash clients booking on their phones. And Eva herself, who isn't technical and needs a site she doesn't have to look after.",
      research: "I talked to Eva about her clients, the questions she gets most and how a wedding morning works. I went through her Instagram and its insights, which showed that most of her audience is on their phones, looked at other makeup artists' and bridal vendors' sites to see what felt dated, and made a moodboard for an editorial, luxury feel.",
      decisions: "Bridal and makeup bookings stay enquiry-only, because every wedding gets its own quote, while brows and lashes are booked online through Cal.com. It's a static Astro site with all the text in one data file, so it's fast, cheap to host and there's nothing for Eva to maintain.",
      outcome: 'Eva now sends one link instead of explaining her services in every DM, brow and lash clients book their own times, and bridal enquiries arrive with the date, venue and number of people already filled in.',
      learned: "I learned to turn a client's vague feedback into concrete design changes, to design for phones first and to keep big photos and videos fast. I also put a real site live, with its own domain, hosting, forms and analytics.",
      reflection: "I'd watch a few of Eva's actual clients use the site before launch, instead of guessing what they need. I'd also collect all her photos and text first, because designing around placeholders meant redoing pages later.",
    },
  },
  {
    title: 'Study & Job-Hunt Dashboard',
    slug: 'study-tracker',
    tagline: 'One dashboard for my real study time, goals and job hunt.',
    role: 'UI/UX design & code',
    team: 1,
    time: 'Ongoing',
    images: [
      { src: '/project_screenshots/study_tracker/today.webp', caption: 'The Today page, with how long I studied today, my daily goal and the last two weeks by app. All the screenshots show demo data.' },
      { src: '/project_screenshots/study_tracker/study.webp', caption: 'The Study page: a calendar of how close I came to my goal each day, when I tend to study, and where my week went.' },
      { src: '/project_screenshots/study_tracker/job_ideas.webp', caption: 'Job ideas: openings from job boards, each rated against my skills and marked if it needs German.' },
      { src: '/project_screenshots/study_tracker/todo_habits.webp', caption: 'My calendar, to-do list and habits, all on the same page as my study time.' },
    ],
    ratio: '16 / 9',
    kind: 'Python · ActivityWatch · Personal tool',
    description:
      'A dashboard that tracks what I do on my computer and turns it into something useful. It uses ActivityWatch to see which apps and websites I use, works out which of that counts as studying, and shows my progress towards my daily goals. It also helps with my job search by finding openings, rating how well they fit me and keeping track of my applications, and it has my to-do list, habits, calendar and break reminders. It is completely customised to my needs, so every feature is there because I actually wanted it.',
    technical: [
      'One Python file using only the standard library, so there is nothing to install. It runs its own local web server.',
      'Activity comes from the ActivityWatch local API, and regex rules I can edit decide what counts as studying.',
      'Openings come from the Arbeitsagentur, Arbeitnow and Remotive APIs, and each one gets scored against my profile.',
      'Applications are saved to a Google Sheet through Google Apps Script.',
    ],
    theme:
      'It matches the aesthetic of this portfolio, with the same pink and butter colours, cream cards, chunky outlines and hard shadows.',
    stack: ['Python', 'JavaScript', 'HTML', 'CSS', 'ActivityWatch', 'Google Apps Script', 'Google Sheets'],
    caseStudy: {
      problem: "I felt busy all day but had no idea how much of my computer time was actually studying. My to-dos, habits, calendar and goals were spread over different apps, I'd sit for hours without a break, and looking for jobs in Germany meant checking lots of job boards and losing track of where I'd applied.",
      user: 'Me: a final-year student who is studying, job hunting and planning a move to Germany, all at the same time.',
      research: "I tried existing focus and time-tracking apps, but they were paid, ran in the cloud or didn't know what counts as studying for me. I found out that the Arbeitsagentur, Arbeitnow and Remotive have free APIs, so job openings could come in automatically. Beyond that, I added each feature when I noticed I needed it.",
      decisions: "It's one Python file using only the standard library, so there's nothing to install, and everything stays on my own computer because activity data is private. Rules I can edit decide what counts as studying, since the same website (like YouTube) can be study or a break, and every job opening is scored against my skills and flagged if it needs German.",
      outcome: 'I use it every day, and seeing my real hours has made me study more consistently. All my job applications are in one place, and it replaced several separate apps.',
      learned: 'Being my own user made it easy to know what matters, but also easy to keep adding features forever. I learned to combine several outside APIs into one view, and that raw activity data only helps once it\'s turned into something you can act on, like "you\'re 40 minutes from today\'s goal".',
      reflection: "I'd plan the main pages up front instead of adding features wherever they fit at the time, and make it easier to set up, so friends could use it too.",
    },
  },
]

export const skills = {
  'Design & Prototyping': ['UI/UX design', 'Product design', 'User-centred design', 'Responsive design', 'Prototyping', 'Figma', 'Canva'],
  'Frontend & Web': ['JavaScript', 'HTML', 'CSS', 'React', 'Vite', 'Express.js', 'Vercel', 'Cloudflare'],
  Programming: ['Java', 'JavaFX', 'C', 'Python', 'MATLAB', 'R', 'x86 Assembly'],
  'Data & Optimisation': ['SQL', 'MySQL', 'LINGO', 'AnyLogic'],
  'Tools & Collaboration': ['Git', 'GitHub', 'GitLab', 'Maven', 'Docker', 'CI/CD', 'Agile', 'Scrum', 'Jira', 'Confluence', 'Google Business Profile'],
}

// Which projects (by slug) use each skill. Hovering a skill on the home page shows these, and clicking it
// opens the projects page showing only them (the personal page when they're all personal projects). 'this-site'
// is this portfolio itself, which has no entry of its own. Skills that aren't listed just aren't linked to a project.
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
  React: ['community-event-volunteer-platform', 'hackathon-hosting-platform', 'honours-lab-management-app'],
  Vite: ['honours-lab-management-app', 'hackathon-hosting-platform'],
  'Express.js': ['hackathon-hosting-platform'],
  Vercel: ['this-site'],
  Cloudflare: ['eva-website'],
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
  cv: '/Anja-vanStaden-CV-November2026.pdf',
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
// (see components/JourneyScenes.jsx), `stats` are the chips under the text. Chips marked `german` are German
// grades, which only show in German or when the site is pointed at Germany, along with the `footnote` explaining
// them. The last stop is wherever the site is pointed (see destinations.js), so its wording is written for any
// place `d`; the German version of it is in content.de.js.
export const journey = [
  {
    scene: 'mossel-bay',
    when: '2021',
    place: 'Mossel Bay, South Africa',
    title: 'Point High School',
    text: 'I grew up in Mossel Bay, a small town on the Garden Route right by the sea. I finished matric at Point High School in 2021 with an 88% average.',
    stats: [
      { value: '88%', label: 'matric average' },
      { value: '≈ 1,7', label: 'German grade', lang: 'de', german: true },
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
      { value: '≈ 2,3', label: 'German grade', lang: 'de', german: true },
    ],
    footnote: 'German grade worked out with the modified Bavarian formula used by German universities.',
    link: { to: '/projects', label: 'See what I built there' },
  },
  {
    scene: 'europe',
    when: '2027',
    place: (d) => d.place,
    title: (d) => `Next stop: ${d.to}`,
    note: (d) => `${d.hello}!`,
    text: (d) => `Next up is ${d.to}! I have Dutch citizenship, so I can work anywhere in the EU without a visa or sponsorship. ${d.plan}`,
    flag: (d) => d.flag,
    greeting: (d) => d.postcard,
  },
]
