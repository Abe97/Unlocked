/**
 * main.js
 * Entry point. Fetches config.json, initialises i18n, populates DOM,
 * then fires animations.
 */

(async function init() {
  // Prevent browser scroll restoration so GSAP initialises at y=0
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)

  // Load config
  let config
  try {
    const res = await fetch('./site.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    config = await res.json()
  } catch (err) {
    console.error('[Unlocked] Failed to load config.json:', err)
    return
  }

  // Determine initial language
  const lang = localStorage.getItem('lang') || 'it'

  // Populate all DOM content from config
  populateDOM(config, lang)

  // Init i18n toggle (must run after populateDOM so elements exist)
  initI18n(config)

  // Init GSAP animations
  initAnimations(config)

  // Refresh ScrollTrigger after DOM is fully painted
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initPostPopulate()
    })
  })

  // ── Sponsor CTA pre-fills contact form subject ────────────────────
  document.addEventListener('click', (e) => {
    const cta = e.target.closest('[data-subject]')
    if (!cta) return
    const subjectField = document.querySelector('[data-form-field="type"]')
    if (subjectField) {
      // Select "Sponsorship" option
      const options = Array.from(subjectField.options)
      const sponsorOpt = options.find(o => o.value.toLowerCase().includes('sponsor'))
      if (sponsorOpt) subjectField.value = sponsorOpt.value
    }
    document.querySelector('#contatti')?.scrollIntoView({ behavior: 'smooth' })
  })

  // ── Contact form submission ───────────────────────────────────────
  const form = document.querySelector('.contact-form')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const data = new FormData(form)
      const endpoint = config.meta.formEndpoint

      if (endpoint) {
        if (config.meta.formAccessKey) {
          data.append('access_key', config.meta.formAccessKey)
        }
        fetch(endpoint, { method: 'POST', body: data })
          .then(() => showFormSuccess())
          .catch(() => showFormSuccess()) // Graceful fallback
      } else {
        // Fallback to mailto
        const name    = data.get('name') || ''
        const email   = data.get('email') || ''
        const type    = data.get('type') || ''
        const message = data.get('message') || ''
        const mailto  = `mailto:${config.meta.contact.email}?subject=${encodeURIComponent(type)}&body=${encodeURIComponent(`Da: ${name} <${email}>\n\n${message}`)}`
        window.open(mailto)
      }
    })
  }

  function showFormSuccess() {
    const btn = document.querySelector('[data-form-send]')
    if (!btn) return
    const original = btn.textContent
    btn.textContent = '✓'
    btn.disabled = true
    setTimeout(() => {
      btn.textContent = original
      btn.disabled = false
    }, 3000)
  }

  // ── Mobile hamburger menu ─────────────────────────────────────────
  const hamburger   = document.querySelector('.nav-hamburger')
  const mobileMenu  = document.querySelector('.nav-mobile-menu')

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open')
      hamburger.setAttribute('aria-expanded', open)
      hamburger.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(4px, 4px)' : ''
      hamburger.querySelectorAll('span')[1].style.opacity   = open ? '0' : '1'
      hamburger.querySelectorAll('span')[2].style.transform = open ? 'rotate(-45deg) translate(4px, -4px)' : ''
    })

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open')
        hamburger.setAttribute('aria-expanded', 'false')
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1' })
      })
    })
  }

  // ── Hero audio toggle ─────────────────────────────────────────────
  const audioBtn = document.querySelector('.hero-audio-btn')
  const heroVideo = document.querySelector('.hero-bg video')
  if (audioBtn && heroVideo) {
    audioBtn.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted
      audioBtn.classList.toggle('active', !heroVideo.muted)
      audioBtn.setAttribute('aria-pressed', String(!heroVideo.muted))
      audioBtn.setAttribute('aria-label', heroVideo.muted ? 'Attiva audio' : 'Disattiva audio')
    })
  }

  // ── Re-animate cursor on new dynamic elements ─────────────────────
  // Delegate hover events to document for dynamically added elements
  document.addEventListener('mouseenter', (e) => {
    if (e.target.matches('a, button, .event-card, .brand-panel, .sponsor-card')) {
      gsap?.to('.cursor', { scale: 2.5, duration: 0.3, ease: 'power2.out' })
    }
  }, true)

  document.addEventListener('mouseleave', (e) => {
    if (e.target.matches('a, button, .event-card, .brand-panel, .sponsor-card')) {
      gsap?.to('.cursor', { scale: 1, duration: 0.3, ease: 'power2.out' })
    }
  }, true)

  // Cookie consent is handled by Iubenda via GTM

})()
