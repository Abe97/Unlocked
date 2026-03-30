/**
 * animations.js
 * All GSAP animations. Called with initAnimations(config) from main.js.
 * Respects prefers-reduced-motion.
 */

function initAnimations(config) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) {
    // Ensure everything is visible without animation
    document.querySelectorAll('.anim-target').forEach(el => {
      el.style.opacity = '1'
    })
    return
  }

  gsap.registerPlugin(ScrollTrigger, TextPlugin)

  initNavAnimation()
  initHeroAnimation()
  initMarquee()
  initEventsAnimation()
  initBrandsAnimation()
  initHistoryAnimation()
  initSponsorAnimation()
  initContactAnimation()
  initFooterAnimation()
  initCursor()
}

// ── Nav ──────────────────────────────────────────────────────────────
function initNavAnimation() {
  const nav = document.querySelector('.nav')
  if (!nav) return

  gsap.from(nav, {
    y: -60,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.1
  })

  let lastScrollY = 0
  let scrolled = false

  window.addEventListener('scroll', () => {
    const y = window.scrollY
    if (y > 80 && !scrolled) {
      nav.classList.add('scrolled')
      scrolled = true
    } else if (y <= 80 && scrolled) {
      nav.classList.remove('scrolled')
      scrolled = false
    }
    lastScrollY = y
  }, { passive: true })
}

// ── Hero ─────────────────────────────────────────────────────────────
function initHeroAnimation() {
  const titleEl = document.querySelector('.hero-title')
  if (!titleEl) return

  // Split "UNLOCKED" into individual char spans
  const text = titleEl.textContent.trim()
  titleEl.innerHTML = text.split('').map(c =>
    `<span class="char" style="display:inline-block">${c}</span>`
  ).join('')

  const tl = gsap.timeline({ delay: 0.2 })

  tl.from('.hero-title .char', {
    y: 120,
    opacity: 0,
    duration: 1.2,
    stagger: 0.06,
    ease: 'power4.out'
  })
  .from('.hero-sub', {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'power3.out'
  }, '-=0.5')
  .from('.hero-event-block', {
    x: -60,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out'
  }, '-=0.6')
  .from('.hero-countdown', {
    opacity: 0,
    scale: 0.92,
    duration: 0.7,
    ease: 'back.out(1.2)'
  }, '-=0.4')
  .from('.hero-corner', {
    opacity: 0,
    scale: 0.5,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power3.out'
  }, '-=0.6')
  .from('.hero-counter-label', {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out'
  }, '-=0.4')
}

// ── Marquee ───────────────────────────────────────────────────────────
function initMarquee() {
  const track = document.querySelector('.marquee-track')
  const wrap  = document.querySelector('.marquee-wrap')
  if (!track || !wrap) return

  const obj = { speed: 1 }
  let x = 0

  const totalWidth = track.scrollWidth / 2

  gsap.ticker.add(() => {
    x -= obj.speed * 0.8
    if (Math.abs(x) >= totalWidth) x = 0
    track.style.transform = `translateX(${x}px)`
  })

  wrap.addEventListener('mouseenter', () => {
    gsap.to(obj, { speed: 0, duration: 0.4, ease: 'power2.out' })
  })

  wrap.addEventListener('mouseleave', () => {
    gsap.to(obj, { speed: 1, duration: 0.5, ease: 'power2.inOut' })
  })
}

// ── Events ────────────────────────────────────────────────────────────
function initEventsAnimation() {
  const titleEl = document.querySelector('#eventi .section-title')
  if (titleEl) {
    gsap.from(titleEl, {
      scrollTrigger: {
        trigger: titleEl,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      clipPath: 'inset(0 100% 0 0)',
      duration: 1.0,
      ease: 'power3.out'
    })
  }

  // Cards animate on scroll — re-run after DOM is populated
  function animateCards() {
    gsap.utils.toArray('.event-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true
        },
        y: 60,
        opacity: 0,
        duration: 0.7,
        delay: i * 0.08,
        ease: 'power3.out'
      })
    })
  }

  // Slight delay to ensure config-loader has populated cards
  setTimeout(animateCards, 100)
}

// ── Brands ────────────────────────────────────────────────────────────
function initBrandsAnimation() {
  const titleEl = document.querySelector('#brand .section-title')
  if (titleEl) {
    gsap.from(titleEl, {
      scrollTrigger: { trigger: titleEl, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    })
  }

  function animatePanels() {
    gsap.utils.toArray('.brand-panel').forEach((panel, i) => {
      gsap.from(panel, {
        scrollTrigger: {
          trigger: panel,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true
        },
        x: 80,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power3.out'
      })

      const inner = panel.querySelectorAll('.brand-panel-tagline, .brand-panel-desc, .brand-panel-cta')
      gsap.from(inner, {
        scrollTrigger: {
          trigger: panel,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: i * 0.15 + 0.3,
        stagger: 0.08,
        ease: 'power2.out'
      })
    })
  }

  setTimeout(animatePanels, 100)
}

// ── History ───────────────────────────────────────────────────────────
function initHistoryAnimation() {
  // Section title
  const titleEl = document.querySelector('#storia .section-title')
  if (titleEl) {
    gsap.from(titleEl, {
      scrollTrigger: { trigger: titleEl, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    })
  }

  // Stat counters
  function initCounters() {
    gsap.utils.toArray('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target, 10)
      if (!target) return

      gsap.fromTo(el,
        { textContent: 0 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true
          },
          textContent: target,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function() {
            // Format large numbers
            const val = Math.round(parseFloat(el.textContent))
            if (target >= 10000) {
              el.textContent = (val / 1000).toFixed(0) + 'K'
            } else if (target >= 100) {
              el.textContent = val + '+'
            } else {
              el.textContent = val + '+'
            }
          }
        }
      )
    })
  }

  setTimeout(initCounters, 150)

  // Timeline line draw
  const line = document.querySelector('.timeline-line')
  if (line) {
    gsap.from(line, {
      scrollTrigger: {
        trigger: '.history-timeline',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        invalidateOnRefresh: true
      },
      scaleY: 0,
      duration: 1.2,
      ease: 'power3.out'
    })
  }

  // Timeline items
  function animateTimeline() {
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power3.out'
      })
    })
  }

  setTimeout(animateTimeline, 150)

  // Gallery
  gsap.utils.toArray('.gallery-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
        invalidateOnRefresh: true
      },
      opacity: 0,
      scale: 0.96,
      duration: 0.6,
      delay: i * 0.08,
      ease: 'power3.out'
    })
  })
}

// ── Sponsors ──────────────────────────────────────────────────────────
function initSponsorAnimation() {
  function animateSponsor() {
    gsap.utils.toArray('.sponsor-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true
        },
        y: 60,
        opacity: 0,
        duration: 0.7,
        delay: i * 0.12,
        ease: 'power3.out'
      })

      const price = card.querySelector('.sponsor-price')
      if (price) {
        gsap.from(price, {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true
          },
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          delay: i * 0.12 + 0.2,
          ease: 'back.out(1.2)'
        })
      }
    })
  }

  setTimeout(animateSponsor, 100)
}

// ── Contact ───────────────────────────────────────────────────────────
function initContactAnimation() {
  const inner = document.querySelector('.contact-inner')
  if (!inner) return

  gsap.from(inner.children, {
    scrollTrigger: {
      trigger: inner,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
      invalidateOnRefresh: true
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  })
}

// ── Footer ────────────────────────────────────────────────────────────
function initFooterAnimation() {
  const logo = document.querySelector('.footer-logo')
  if (!logo) return

  gsap.to(logo, {
    scrollTrigger: {
      trigger: 'footer',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    },
    y: -20,
    ease: 'none'
  })
}

// ── Custom cursor ─────────────────────────────────────────────────────
function initCursor() {
  const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0
  if (isTouchDevice) {
    document.body.classList.add('touch-device')
    return
  }

  const cursor    = document.querySelector('.cursor')
  const cursorDot = document.querySelector('.cursor-dot')
  if (!cursor || !cursorDot) return

  window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.6,
      ease: 'power3.out'
    })
    gsap.to(cursorDot, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1
    })
  })

  document.querySelectorAll('a, button, .event-card, .brand-panel, .sponsor-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 2.5, duration: 0.3, ease: 'power2.out' })
    })
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' })
    })
  })
}

// ── Mobile sticky bar hide in events section ──────────────────────────
function initStickyBarBehavior() {
  const bar = document.querySelector('.mobile-sticky-bar')
  const eventsSection = document.querySelector('#eventi')
  if (!bar || !eventsSection) return

  ScrollTrigger.create({
    trigger: eventsSection,
    start: 'top bottom',
    end: 'bottom top',
    onEnter:      () => bar.classList.add('hidden'),
    onLeave:      () => bar.classList.remove('hidden'),
    onEnterBack:  () => bar.classList.add('hidden'),
    onLeaveBack:  () => bar.classList.remove('hidden')
  })
}

// Called after DOM is populated
function initPostPopulate() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) return

  ScrollTrigger.refresh()
  initStickyBarBehavior()
}
