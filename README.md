<div align="center">

<img src="docs/banner.svg" alt="Anja van Staden, UI/UX designer and software engineer" width="100%" />

<br />

<img src="public/favicon.svg" alt="AvS logo" height="56" />

### My personal portfolio, designed and built from scratch.

<em>Final-year Computer Science &amp; Operations Research student at Stellenbosch University</em>
<br />
<em>Proudly South African &amp; Dutch · open to work in Germany from 2027</em>

<br />
<br />

![React](https://img.shields.io/badge/React_19-2d1e38?style=for-the-badge&logo=react&logoColor=f39bc0)
![Vite](https://img.shields.io/badge/Vite-2d1e38?style=for-the-badge&logo=vite&logoColor=f0c65a)
![React Router](https://img.shields.io/badge/React_Router-2d1e38?style=for-the-badge&logo=reactrouter&logoColor=4fb286)
![CSS](https://img.shields.io/badge/Hand--written_CSS-2d1e38?style=for-the-badge&logo=css&logoColor=b9a7f2)

</div>

---

## ✦ What's inside

| | |
|---|---|
| 🎨 **Playful, hand-made design** | A cream, plum, pink and green palette, chunky offset shadows, and handwritten pen notes that write themselves onto the page. |
| 🌗 **Light & dark mode** | Follows your system setting on first visit, then remembers your choice. |
| 🪄 **Scroll animations** | Highlighter strokes, hand-drawn underlines and circles, titles that rise letter by letter, and a *Let's talk* that zooms in from huge as you scroll. |
| 🗂️ **Projects page** | Every project slides in and out as you scroll, with a screenshot gallery and full-screen viewer, or a terminal panel for projects without a UI. |
| 👀 **Little surprises** | A custom cursor, cards that tilt toward your mouse, blinking eyes that follow you around, and a finger that won't stop tapping *Get in touch*. |
| 🇿🇦 🇳🇱 🇩🇪 **Three-country nods** | English titles with German written alongside, plus Afrikaans and Dutch greetings. |
| ♿ **Considerate by default** | Respects *reduced motion*, keeps everything keyboard-reachable, and uses no heavy animation libraries, so scrolling stays smooth. |

---

## ✦ Run it locally

> **You'll need** [Node.js](https://nodejs.org) **20.19+** or **22.12+**.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server with hot reload
npm run dev
```

Then open **http://localhost:5173** ✨

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server with instant hot reload |
| `npm run build` | Builds an optimised production site into `dist/` |
| `npm run preview` | Serves the production build locally to check it |
| `npm run lint` | Checks the code with ESLint |

---

## ✦ Make it yours

All the text lives in **one file**, so content updates don't require touching the layout:

```
src/data/content.js     ← projects, skills and contact details
```

**Adding project screenshots** 📸

1. Drop the images into `public/projects/<project-slug>/`
2. List them in that project's `images` in `content.js`:

```js
images: [
  { src: '/projects/hackathon-hosting-platform/editor.png', caption: 'Shared code editor' },
  { src: '/projects/hackathon-hosting-platform/leaderboard.png', caption: 'Live leaderboard' },
  { src: '/projects/hackathon-hosting-platform/problems.png', caption: 'Problem setup' },
],
```

The first image doubles as the project's thumbnail on the home page. Projects with `gui: false` show a terminal-style `highlights` panel instead.

---

## ✦ Project structure

```
├── public/
│   ├── favicon.svg          logo, also used in the navbar
│   └── profile.jpeg         hero photo
├── src/
│   ├── data/content.js      all site content
│   ├── pages/
│   │   ├── Home.jsx         hero, about, featured work, skills, contact
│   │   └── Projects.jsx     every project, galleries and lightbox
│   ├── components/          flags, doodles, titles and text-splitting helpers
│   ├── App.jsx              navbar, routing, theme toggle, scroll effects
│   ├── App.css              layout, components and animations
│   └── index.css            colour tokens, fonts, cursor and scrollbar
└── docs/banner.svg          the banner at the top of this README
```

---

## ✦ Deploying

`npm run build` outputs a static site in `dist/` that can be hosted on Netlify, Vercel, GitHub Pages or any static host.

> 💡 The site has two routes (`/` and `/projects`), so set your host to serve `index.html` for every path. Otherwise, refreshing `/projects` will show a 404.

---

<div align="center">

### ✦ Let's talk · *Lass uns reden* · *Kom ons gesels* ✦

[![Email](https://img.shields.io/badge/anvnstaden@gmail.com-f39bc0?style=for-the-badge&logo=gmail&logoColor=2d1e38)](mailto:anvnstaden@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-b9a7f2?style=for-the-badge&logo=github&logoColor=2d1e38)](https://github.com/anvnstaden)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-4fb286?style=for-the-badge&logo=linkedin&logoColor=2d1e38)](https://www.linkedin.com/in/anja-van-staden)

<sub>Designed &amp; built by Anja van Staden in Stellenbosch</sub>

</div>
