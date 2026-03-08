# Trevelade — CpE Portfolio
**Johndaleverth Pastorfide Echanova**

## Folder Structure
```
portfolio/
├── index.html          ← Clean HTML, no inline CSS/JS
├── css/
│   ├── style.css       ← @imports all CSS
│   ├── base.css        ← Variables, reset, global
│   ├── hero.css        ← Hero + gallery
│   ├── sections.css    ← Cards, skills, contact
│   ├── ui.css          ← Navbar, modals, edit bar
│   └── responsive.css  ← All media queries
├── js/
│   ├── data.js         ← All portfolio data (D) + photos (PH) — loads FIRST
│   ├── security.js     ← DevTools detection
│   ├── auth.js         ← Owner mode, SHA-256 password
│   ├── storage.js      ← save(), exportHTML(), loadS()
│   ├── swiper.js       ← Card pagination
│   ├── render.js       ← DOM renderers
│   ├── main.js         ← App init, sound, nav
│   ├── scroll.js       ← Scroll progress bar
│   ├── splash.js       ← Loading screen
│   └── counters.js     ← Stats, contact form
└── assets/             ← Local images here
```

## How to Run
Use **VS Code Live Server** — do NOT double-click index.html directly.

## Owner Access
Password: `engineer2025`

## Export & Deploy
Owner Mode → Export & Deploy → downloads zip with all edits baked in.
Upload the unzipped folder to GitHub Pages or Netlify.
