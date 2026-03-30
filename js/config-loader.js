/**
 * config-loader.js
 * Loads config.json and populates all DOM elements.
 * Called from main.js after fetch resolves.
 */

const intensityMap = {
  full:   { color: 'var(--cream)',    dot: 'var(--cream-80)' },
  medium: { color: 'var(--cream-80)', dot: 'var(--cream-50)' },
  muted:  { color: 'var(--cream-50)', dot: 'var(--cream-28)' }
}

function getBrandStyle(brandIntensity) {
  return intensityMap[brandIntensity] || intensityMap.medium
}

// ── Nav ─────────────────────────────────────────────────────────────
function populateNav(config, lang) {
  const ui = config.ui[lang]
  const navCta = document.querySelector('.nav-cta')
  const mobileCta = document.querySelector('.nav-mobile-cta')
  if (navCta) navCta.textContent = ui.nav.cta
  if (mobileCta) mobileCta.textContent = ui.nav.cta
}

// ── Hero ─────────────────────────────────────────────────────────────
function populateHero(config, lang) {
  const ui = config.ui[lang]

  // Tagline
  const sub = document.querySelector('.hero-sub')
  if (sub) sub.textContent = ui.hero.tagline

  // Next event block — find closest upcoming event
  const now = new Date()
  const upcoming = config.events
    .filter(e => new Date(e.dateISO) >= now)
    .sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO))[0]

  const eventBlock = document.querySelector('.hero-event-block')
  if (!upcoming || !eventBlock) return

  const style = getBrandStyle(upcoming.brandIntensity)

  const labelEl = eventBlock.querySelector('.hero-event-label')
  const dateEl  = eventBlock.querySelector('.hero-event-date')
  const locEl   = eventBlock.querySelector('.hero-event-location')
  const tagEl   = eventBlock.querySelector('.hero-tag')
  const ctaEl   = eventBlock.querySelector('.hero-cta')

  if (labelEl) labelEl.textContent = ui.hero.nextEventLabel
  if (dateEl)  {
    dateEl.textContent = upcoming.date[lang]
    dateEl.style.color = style.color
  }
  if (locEl)   locEl.textContent = upcoming.location[lang]
  if (tagEl) {
    tagEl.textContent = upcoming.brand
    tagEl.style.color = style.color
    tagEl.style.borderColor = style.dot
  }
  if (ctaEl) {
    ctaEl.textContent = ui.hero.ctaPrimary
    if (upcoming.ticketUrl) {
      ctaEl.href = upcoming.ticketUrl
    }
  }

  // CTA secondary
  const ctaSecondary = eventBlock.querySelector('.hero-cta-secondary')
  if (ctaSecondary) ctaSecondary.textContent = ui.hero.ctaSecondary

  // Start countdown to next event
  startCountdown(upcoming.dateISO, config.ui[lang].countdown)
}

// ── Countdown ────────────────────────────────────────────────────────
function startCountdown(dateISO, labels) {
  const target = new Date(dateISO).getTime()

  const daysEl  = document.getElementById('cd-days')
  const hoursEl = document.getElementById('cd-hours')
  const minsEl  = document.getElementById('cd-mins')
  const secsEl  = document.getElementById('cd-secs')

  const lblDays  = document.querySelector('.cd-label-days')
  const lblHours = document.querySelector('.cd-label-hours')
  const lblMins  = document.querySelector('.cd-label-mins')
  const lblSecs  = document.querySelector('.cd-label-secs')

  if (lblDays)  lblDays.textContent  = labels.days
  if (lblHours) lblHours.textContent = labels.hours
  if (lblMins)  lblMins.textContent  = labels.minutes
  if (lblSecs)  lblSecs.textContent  = labels.seconds

  function tick() {
    const diff = target - Date.now()
    if (diff <= 0) return

    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)

    if (daysEl)  daysEl.textContent  = String(d).padStart(2, '0')
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0')
    if (minsEl)  minsEl.textContent  = String(m).padStart(2, '0')
    if (secsEl)  secsEl.textContent  = String(s).padStart(2, '0')
  }

  tick()
  setInterval(tick, 1000)
}

// ── Artists vertical scroll ───────────────────────────────────────────
function populateMarquee(config) {
  const trackLeft  = document.getElementById('artists-track-left')
  const trackRight = document.getElementById('artists-track-right')
  if (!trackLeft || !trackRight) return

  const artists = config.artists.marquee
  const mid = Math.ceil(artists.length / 2)
  const leftList  = artists.slice(0, mid)
  const rightList = artists.slice(mid)

  // Triplicate for seamless infinite scroll
  const renderCol = (list) =>
    [...list, ...list, ...list]
      .map(name => `<div class="artist-name">${name}</div>`)
      .join('')

  trackLeft.innerHTML  = renderCol(leftList)
  trackRight.innerHTML = renderCol(rightList)
}

// ── Events ───────────────────────────────────────────────────────────
function populateEvents(config, lang) {
  const ui = config.ui[lang]
  const list = document.querySelector('.events-list')
  if (!list) return

  const titleEl = document.querySelector('#eventi .section-title')
  if (titleEl) titleEl.textContent = ui.sections.events

  list.innerHTML = config.events.map(event => {
    const style = getBrandStyle(event.brandIntensity)
    const brandClass = `brand-${event.brandIntensity}`
    const tbaClass = event.tba ? 'is-tba' : ''
    const date = event.date[lang]
    const location = event.location[lang]

    const artistsHtml = event.artists.length > 0
      ? event.artists.map(a => `<span class="card-artist">${a}</span>`).join('')
      : ''

    const tbaArtistNote = event.artistsTba && event.artists.length > 0
      ? `<span class="card-artist" style="color:var(--cream-28)">+ ${lang === 'it' ? 'altri TBA' : 'more TBA'}</span>`
      : ''

    let actionHtml = ''
    if (event.soldOut) {
      actionHtml = `<span class="badge badge-sold">${ui.eventCard.soldOutLabel}</span>`
    } else if (event.tba) {
      actionHtml = `<span class="badge badge-tba">${ui.eventCard.tbaLabel}</span>`
    } else if (event.ticketUrl) {
      actionHtml = `<a class="card-cta" href="${event.ticketUrl}" target="_blank" rel="noopener" aria-label="${ui.eventCard.ticketsLabel} — ${event.brand}">
        ${ui.eventCard.ticketsLabel} <span aria-hidden="true">→</span>
      </a>`
    }

    return `
    <article class="event-card ${brandClass} ${tbaClass}" data-event-id="${event.id}">
      <div class="card-date-col">
        <div class="card-date-day" style="color:${style.color}">${date}</div>
        <div class="card-date-info">${location}</div>
      </div>
      <div class="card-main">
        <div class="card-brand-name" style="color:${style.color}">${event.brand}</div>
        <div class="card-location">${location}</div>
        <div class="card-artists">
          ${artistsHtml}
          ${tbaArtistNote}
        </div>
      </div>
      <div class="card-action">
        ${actionHtml}
      </div>
    </article>`
  }).join('')
}

// ── Brands ───────────────────────────────────────────────────────────
function populateBrands(config, lang) {
  const ui = config.ui[lang]
  const panelsEl = document.querySelector('.brand-panels')
  if (!panelsEl) return

  const titleEl = document.querySelector('#brand .section-title')
  if (titleEl) titleEl.textContent = ui.sections.brands

  const brands = [
    { key: 'aura', data: config.brands.aura },
    { key: 'umf',  data: config.brands.umf  },
    { key: 'solo', data: config.brands.solo  }
  ]

  panelsEl.innerHTML = brands.map(({ key, data }) => {
    const style = getBrandStyle(data.brandIntensity)
    const discoverText = lang === 'it' ? 'Scopri →' : 'Discover →'
    return `
    <div class="brand-panel" data-brand="${key}">
      <div class="brand-panel-name" style="color:${style.color}">${data.name}</div>
      <div class="brand-panel-tagline">${data.tagline[lang]}</div>
      <p class="brand-panel-desc">${data.description[lang]}</p>
      <div class="brand-panel-divider"></div>
      <a class="brand-panel-cta" href="#eventi" aria-label="${data.name}">${discoverText}</a>
    </div>`
  }).join('')
}

// ── History ──────────────────────────────────────────────────────────
function populateHistory(config, lang) {
  const ui = config.ui[lang]
  const h = config.history

  const titleEl = document.querySelector('#storia .section-title')
  if (titleEl) titleEl.textContent = ui.sections.history

  const subEl = document.querySelector('#storia .section-subtitle')
  if (subEl) subEl.textContent = ui.sections.historySubtitle

  // Stats — set data-target for GSAP counter animation
  const statsMap = [
    { selector: '#stat-years',     value: h.stats.years,          label: lang === 'it' ? 'anni di storia' : 'years of history' },
    { selector: '#stat-events',    value: h.stats.events,         label: lang === 'it' ? 'eventi' : 'events' },
    { selector: '#stat-attendees', value: h.stats.liveAttendees,  label: lang === 'it' ? 'live ogni anno' : 'live per year' },
    { selector: '#stat-locations', value: h.stats.locations,      label: lang === 'it' ? 'location storiche' : 'historic venues' }
  ]

  statsMap.forEach(({ selector, value, label }) => {
    const numEl = document.querySelector(`${selector} .stat-num`)
    const lblEl = document.querySelector(`${selector} .stat-label`)
    if (numEl) {
      numEl.dataset.target = value
      numEl.textContent = '0'
    }
    if (lblEl) lblEl.textContent = label
  })

  // Timeline
  const timeline = document.querySelector('.history-timeline-items')
  if (timeline) {
    timeline.innerHTML = h.milestones.map(m => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-year">${m.year}</div>
        <div class="timeline-label">${m.label[lang]}</div>
      </div>
    `).join('')
  }
}

// ── Sponsors ─────────────────────────────────────────────────────────
function populateSponsors(config, lang) {
  const ui = config.ui[lang]
  const grid = document.querySelector('.sponsor-grid')
  if (!grid) return

  const titleEl = document.querySelector('#sponsor .section-title')
  if (titleEl) titleEl.textContent = ui.sections.sponsor

  const subEl = document.querySelector('#sponsor .section-subtitle')
  if (subEl) subEl.textContent = ui.sections.sponsorSubtitle

  const featured = config.sponsorPackages.length - 1

  grid.innerHTML = config.sponsorPackages.map((pkg, i) => {
    const isFeatured = i === featured
    return `
    <div class="sponsor-card ${isFeatured ? 'featured' : ''}">
      <div class="sponsor-name">${pkg.name[lang]}</div>
      <div class="sponsor-price">${pkg.price}</div>
      <div class="sponsor-divider"></div>
      <ul class="sponsor-benefits">
        ${pkg.benefits[lang].map(b => `<li class="sponsor-benefit">${b}</li>`).join('')}
      </ul>
      <a class="sponsor-cta" href="#contatti" data-subject="Richiesta sponsorship — ${pkg.name[lang]}">
        ${ui.sponsorCard.requestCta} →
      </a>
    </div>`
  }).join('')
}

// ── Contact ───────────────────────────────────────────────────────────
function populateContact(config, lang) {
  const ui = config.ui[lang]

  const titleEl = document.querySelector('#contatti .section-title')
  if (titleEl) titleEl.textContent = ui.sections.contact

  const subEl = document.querySelector('#contatti .section-subtitle')
  if (subEl) subEl.textContent = ui.sections.contactSubtitle

  // Form labels / placeholders
  const fields = ['name', 'email', 'message']
  fields.forEach(f => {
    const label = document.querySelector(`[data-form-label="${f}"]`)
    const input = document.querySelector(`[data-form-field="${f}"]`)
    if (label) label.textContent = ui.form[f]
    if (input && ui.form[`${f}Placeholder`]) {
      input.placeholder = ui.form[`${f}Placeholder`]
    }
  })

  const typeLabel = document.querySelector('[data-form-label="type"]')
  if (typeLabel) typeLabel.textContent = ui.form.type

  const typeSelect = document.querySelector('[data-form-field="type"]')
  if (typeSelect) {
    typeSelect.innerHTML = ui.form.typeOptions.map(o =>
      `<option value="${o}">${o}</option>`
    ).join('')
  }

  const sendBtn = document.querySelector('[data-form-send]')
  if (sendBtn) sendBtn.textContent = ui.form.send

  // Social links
  const socials = [
    { selector: '.social-link-aura', href: config.meta.social.instagramAura, label: 'AURA' },
    { selector: '.social-link-umf',  href: config.meta.social.instagramUmf,  label: 'UMF' },
    { selector: '.social-link-solo', href: config.meta.social.instagramSolo, label: 'SOLO' }
  ]
  socials.forEach(({ selector, href, label }) => {
    const el = document.querySelector(selector)
    if (el) {
      el.href = href
      el.setAttribute('aria-label', `Instagram ${label}`)
    }
  })

  const emailEl = document.querySelector('.contact-email')
  if (emailEl) {
    emailEl.href = `mailto:${config.meta.contact.email}`
    emailEl.textContent = config.meta.contact.email
  }

  const pressEl = document.querySelector('.contact-press-kit')
  if (pressEl) {
    pressEl.href = config.meta.contact.pressKit
    pressEl.querySelector('span') && (pressEl.querySelector('span').textContent =
      lang === 'it' ? 'Download Press Kit' : 'Download Press Kit')
  }
}

// ── Footer ────────────────────────────────────────────────────────────
function populateFooter(config, lang) {
  const ui = config.ui[lang]

  const orgEl = document.querySelector('.footer-organizer')
  if (orgEl) orgEl.textContent = ui.footer.organizer

  const privEl = document.querySelector('.footer-privacy')
  if (privEl) privEl.textContent = ui.footer.privacy

  const cookieEl = document.querySelector('.footer-cookie')
  if (cookieEl) cookieEl.textContent = ui.footer.cookie

  const yearEl = document.querySelector('.footer-year')
  if (yearEl) yearEl.textContent = new Date().getFullYear()
}

// ── Mobile sticky bar ─────────────────────────────────────────────────
function populateStickyBar(config, lang) {
  const ui = config.ui[lang]
  const now = new Date()
  const upcoming = config.events
    .filter(e => new Date(e.dateISO) >= now && !e.soldOut && !e.tba)
    .sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO))[0]

  if (!upcoming) return

  const infoEl = document.querySelector('.sticky-bar-info')
  const ctaEl  = document.querySelector('.sticky-bar-cta')

  if (infoEl) infoEl.textContent = `${upcoming.brand} · ${upcoming.date[lang]}`
  if (ctaEl) {
    ctaEl.textContent = `${ui.eventCard.ticketsLabel} →`
    ctaEl.href = upcoming.ticketUrl || '#eventi'
  }
}

// ── Main export ───────────────────────────────────────────────────────
function populateDOM(config, lang) {
  populateNav(config, lang)
  populateHero(config, lang)
  populateMarquee(config)
  populateEvents(config, lang)
  populateBrands(config, lang)
  populateHistory(config, lang)
  populateSponsors(config, lang)
  populateContact(config, lang)
  populateFooter(config, lang)
  populateStickyBar(config, lang)
}

// Expose for i18n re-renders (partial update without full repopulate)
function updateTextContent(config, lang) {
  populateNav(config, lang)
  populateHero(config, lang)
  populateEvents(config, lang)
  populateBrands(config, lang)
  populateHistory(config, lang)
  populateSponsors(config, lang)
  populateContact(config, lang)
  populateFooter(config, lang)
  populateStickyBar(config, lang)
}
