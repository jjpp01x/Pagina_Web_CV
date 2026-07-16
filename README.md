# 🌐 josepalacios.site — Personal Portfolio & Interactive CV

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![W3C Validated](https://img.shields.io/badge/W3C-Validated-brightgreen?style=flat)](https://validator.w3.org/)
[![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-181717?style=flat&logo=github)](https://josepalacios.site)
[![Live](https://img.shields.io/badge/Live-josepalacios.site-2563EB?style=flat)](https://josepalacios.site)

> Personal portfolio website built as part of the **Internet Technology and Security** module (CEAC4011) at CESTE — BSc (Hons) Applied Computing, University of Wales Trinity Saint David.

**🔗 Live site: [josepalacios.site](https://josepalacios.site)**

---

## 📋 Table of Contents

- [About](#about)
- [Pages](#pages)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Responsive Design](#responsive-design)
- [Multilanguage System](#multilanguage-system)
- [Accessibility & Validation](#accessibility--validation)
- [Academic Projects Showcased](#academic-projects-showcased)
- [Academic Context](#academic-context)

---

## About

Interactive CV and professional portfolio for Jose Palacios Beortegui — Computer Engineering student at University of Wales Trinity Saint David (CESTE, Zaragoza), with a dual academic background in BA (Hons) Business Management and BSc (Hons) Applied Computing.

The site is designed to target junior IT / AI roles in Zürich, Switzerland, combining a clean professional aesthetic with real technical depth — multilanguage support, downloadable CV in three languages, and direct links to academic project repositories on GitHub.

---

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero section, about me, skills, certifications, CV download |
| Education | `education.html` | Academic timeline (UWTSD) and full work experience |
| Projects | `projects.html` | 4 academic technical projects with GitHub links |
| Contact | `contact.html` | Contact form (Formspree) and direct contact info |

---

## Features

- ✅ **Fully responsive** — mobile, tablet and desktop via CSS media queries
- ✅ **Hamburger navigation** — collapsible menu for mobile with `aria-label` and `aria-expanded`
- ✅ **Multilanguage system** — ES / EN / DE toggle with `localStorage` persistence across pages
- ✅ **CV download in 3 languages** — dropdown selector for ES / EN / DE PDFs
- ✅ **Scroll reveal animations** — `IntersectionObserver` API for entrance animations
- ✅ **Back-to-top button** — dynamically injected, appears after 400px scroll
- ✅ **Contact form** — Formspree backend with custom JS validation and HTML5 native validation
- ✅ **CSS custom properties** — full design system via `:root` variables
- ✅ **Semantic HTML5** — `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- ✅ **W3C validated** — HTML and CSS pass W3C validation with no errors
- ✅ **GitHub Pages deploy** — automatic deploy on push to `main` via CNAME

---

## Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Semantic page structure, accessibility attributes |
| CSS3 | Custom properties, Flexbox, Grid, `@keyframes`, media queries |
| JavaScript (Vanilla) | i18n system, hamburger menu, scroll reveal, form validation, back-to-top |
| Formspree | Contact form backend (no server required) |
| GitHub Pages | Static hosting with custom domain |

No frameworks. No libraries. No build tools. Pure HTML, CSS and JavaScript — demonstrating foundational web development skills.

---

## Project Structure

```
josepalacios.site/
│
├── index.html              # Home — hero, about, skills, CV download
├── education.html          # Education timeline & work experience
├── projects.html           # Academic projects showcase
├── contact.html            # Contact form & info
│
├── css/
│   └── styles.css          # Single stylesheet — 910 lines, all pages
│
├── js/
│   ├── translations.js     # i18n dictionary — ES / EN / DE (289 lines)
│   └── i18n.js             # i18n engine — applies translations, persists via localStorage
│
├── img/
│   ├── jpalacios.JPG       # Profile photo
│   └── uwtsd-logo.png      # University of Wales Trinity Saint David logo
│
├── docs/
│   ├── CV_Jose_Palacios_ES.pdf   # CV in Spanish
│   ├── CV_Jose_Palacios_EN.pdf   # CV in English
│   └── CV_Jose_Palacios_DE.pdf   # CV in German
│
├── favicon.svg             # Custom SVG favicon
└── CNAME                   # Custom domain: josepalacios.site
```

---

## Architecture

### CSS Design System
All colours, typography and spacing are defined as CSS custom properties in `:root`:

```css
:root {
    --color-primario:     #0f172a;  /* Dark blue — navbar, footer */
    --color-acento:       #3b82f6;  /* Bright blue — buttons, links */
    --color-fondo:        #f8fafc;  /* Off-white — page background */
    --color-texto:        #1e293b;  /* Dark grey — body text */
    --color-texto-claro:  #64748b;  /* Mid grey — secondary text */
    --fuente-principal: 'Segoe UI', Arial, sans-serif;
    --sombra: 0 2px 10px rgba(0, 0, 0, 0.1);
    --radio-borde: 8px;
}
```

### JavaScript Modules

**`i18n.js`** — Multilanguage engine:
- Reads saved language from `localStorage` (default: `es`)
- Applies translations to all `[data-i18n]` elements via `innerHTML`
- Applies placeholder translations to `[data-i18n-ph]` inputs
- Highlights the active language button
- Runs on `DOMContentLoaded` so language persists across page navigation

**Inline JS in each HTML** — Page-specific logic:
- Hamburger menu toggle with `aria-expanded`
- `IntersectionObserver` for scroll reveal (threshold: 0.15)
- Back-to-top button (dynamically appended to `<body>`)
- Auto-updating copyright year via `new Date().getFullYear()`

---

## Responsive Design

Mobile-first approach with CSS media queries:

| Breakpoint | Target | Key changes |
|------------|--------|-------------|
| `max-width: 768px` | Mobile | Hamburger menu, stacked hero, single-column grids |
| `max-width: 480px` | Small mobile | Reduced font sizes, adjusted padding |
| Default | Desktop | Full nav, two-column layouts, side-by-side hero |

Key responsive behaviours:
- Navigation collapses into hamburger menu — links hidden until toggled
- GitHub and LinkedIn icons remain visible in nav on all screen sizes
- Hero section stacks photo above text on mobile (`flex-direction: column-reverse`)
- Project cards switch from CSS Grid to single column
- Education timeline adjusts spacing and font sizes

---

## Multilanguage System

The site supports three languages with persistent selection:

| Language | Code | Coverage |
|----------|------|----------|
| Español | `es` | Full — all pages, nav, hero, about, projects, education, contact |
| English | `en` | Full — all pages |
| Deutsch | `de` | Full — all pages |

**How it works:**
1. `translations.js` exports a `translations` object with `es`, `en` and `de` keys
2. Every translatable element has a `data-i18n="key"` attribute
3. `i18n.js` reads the active language from `localStorage` and applies all translations on page load
4. Language selection is saved to `localStorage` so it persists when navigating between pages
5. The active language button gets the `.activo` class for visual feedback

---

## Accessibility & Validation

- All pages validated at [validator.w3.org](https://validator.w3.org/) — **no errors**
- CSS validated at [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/) — **no errors**
- `lang="es"` declared on `<html>` (language changes applied via JS)
- All `<img>` elements include descriptive `alt` attributes
- Hamburger button includes `aria-label="Abrir menú"` and `aria-expanded`
- Contact form labels linked to inputs via `for` / `id`
- External links include `rel="noopener noreferrer"`
- Back-to-top button includes `aria-label="Volver al inicio de la página"`
- Semantic sectioning: `<nav>`, `<main>`, `<section aria-label>`, `<article>`, `<footer>`

---

## Academic Projects Showcased

| Project | Stack | Module | Repo |
|---------|-------|--------|------|
| SkiCraft Custom Boots — Inventory DB | PostgreSQL · PL/pgSQL · Docker · Debian | Information Engineering (CEAC4010) | [heierling](https://github.com/jjpp01x/heierling) |
| Ski Resort Ticketing System | C · Python · SQLite · CLI | Software Development | [Ski-resort-ticketing-system](https://github.com/jjpp01x/Ski-resort-ticketing-system) |
| FTP Network Lab | VirtualBox · Windows Server 2019 · IIS · FileZilla | Networking | [Level4-Computing-engeniering](https://github.com/jjpp01x/Level4-Computing-engeniering) |
| Portfolio Website | HTML5 · CSS3 · JavaScript | Internet Technology & Security (CEAC4011) | [Pagina_Web_CV](https://github.com/jjpp01x/Pagina_Web_CV) |

---

## Academic Context

| Field | Detail |
|-------|--------|
| Institution | CESTE — Escuela Internacional de Negocios, Zaragoza |
| Awarding Body | University of Wales Trinity Saint David · Carmarthen, Wales, UK |
| Programme | BSc (Hons) Applied Computing |
| Module | Internet Technology and Security |
| Module Code | CEAC4011 |
| Assignment | Coursework 1 — Web Site Development |
| Level | Level 4 |
| Hosted at | [josepalacios.site](https://josepalacios.site) via GitHub Pages |

---

## Author

**Jose Palacios Beortegui**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-jose--palacios--beortegui-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/jose-palacios-beortegui/)
[![GitHub](https://img.shields.io/badge/GitHub-jjpp01x-181717?style=flat&logo=github)](https://github.com/jjpp01x)
[![Website](https://img.shields.io/badge/Website-josepalacios.site-2563EB?style=flat)](https://josepalacios.site)

---

*Built with HTML5, CSS3 and Vanilla JavaScript. No frameworks. Hosted on GitHub Pages. Validated by W3C.*
