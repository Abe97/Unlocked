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
  initImageInterludes()
  initEventsAnimation()
  initBrandsAnimation()
  initHistoryAnimation()
  initSponsorAnimation()
  initImageSlider()
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

// ── Artists vertical scroll ───────────────────────────────────────────
function initMarquee() {
  const trackLeft  = document.getElementById('artists-track-left')
  const trackRight = document.getElementById('artists-track-right')
  if (!trackLeft || !trackRight) return

  const section = document.querySelector('.section-artists')

  // Wait for DOM to be painted so heights are correct
  requestAnimationFrame(() => {
    const itemHeight = trackLeft.querySelector('.artist-name')?.offsetHeight || 80
    const leftList   = trackLeft.querySelectorAll('.artist-name')
    const rightList  = trackRight.querySelectorAll('.artist-name')

    // Each column has 3× the list — we scroll 1/3 then reset
    const leftUnit  = (leftList.length  / 3) * itemHeight
    const rightUnit = (rightList.length / 3) * itemHeight

    const speed = { left: 1.5, right: 1.5 }
    let yLeft  = 0
    let yRight = -rightUnit  // start offset so cols are staggered

    gsap.ticker.add(() => {
      yLeft  -= speed.left
      yRight += speed.right

      if (Math.abs(yLeft)  >= leftUnit)  yLeft  = 0
      if (yRight >= 0)                   yRight = -rightUnit

      trackLeft.style.transform  = `translateY(${yLeft}px)`
      trackRight.style.transform = `translateY(${yRight}px)`
    })

    // Slow down on section hover
    if (section) {
      section.addEventListener('mouseenter', () => {
        gsap.to(speed, { left: 0.3, right: 0.3, duration: 0.6, ease: 'power2.out' })
      })
      section.addEventListener('mouseleave', () => {
        gsap.to(speed, { left: 1.5, right: 1.5, duration: 0.5, ease: 'power2.inOut' })
      })
    }
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
      scrollTrigger: { trigger: '#storia', start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out'
    })
  }

  // Stat counters
  function initCounters() {
    gsap.utils.toArray('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target, 10)
      if (!target) return

      const obj = { val: 0 }
      gsap.to(obj, {
        scrollTrigger: {
          trigger: '#storia',
          start: 'top 60%',
          toggleActions: 'play none none none',
          invalidateOnRefresh: true
        },
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function() {
          const v = Math.round(obj.val)
          if (target >= 10000) {
            el.textContent = Math.round(v / 1000) + 'K'
          } else {
            el.textContent = v + '+'
          }
        },
        onComplete: function() {
          if (target >= 10000) {
            el.textContent = Math.round(target / 1000) + 'K'
          } else {
            el.textContent = target + '+'
          }
        }
      })
    })
  }

  setTimeout(initCounters, 150)

  // Vertical timeline — normal ScrollTrigger, no pin
  function initTimeline() {
    gsap.utils.toArray('.storia-event').forEach(el => {
      const isLeft  = el.classList.contains('left')
      const dot     = el.querySelector('.storia-event-dot')
      const year    = el.querySelector('.storia-event-year')
      const label   = el.querySelector('.storia-event-label')
      const xDir    = isLeft ? -1 : 1

      gsap.set(dot,   { scale: 0, transformOrigin: 'center center' })
      gsap.set(year,  { opacity: 0, x: xDir * 100 })
      gsap.set(label, { opacity: 0, x: xDir * 50 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      })

      tl.set(el, { opacity: 1 })
        .to(dot,   { scale: 1, duration: 0.4, ease: 'back.out(2.5)' })
        .to(year,  { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, '-=0.15')
        .to(label, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')
    })
  }

  setTimeout(initTimeline, 200)
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

// ── Image interludes: clip-path reveal + scale parallax ──────────────
function initImageInterludes() {
  gsap.utils.toArray('.img-interlude').forEach(el => {
    const inner = el.querySelector('.img-interlude-inner')

    // Clip-path: expand from 6% side margins to full width on scroll
    gsap.fromTo(el,
      { clipPath: 'inset(0 22% 0 22%)' },
      {
        clipPath: 'inset(0 0% 0 0%)',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 15%',
          scrub: 0.8
        }
      }
    )

    // Parallax: inner image drifts up slower than scroll
    if (inner) {
      gsap.fromTo(inner,
        { y: '0%' },
        {
          y: '-12%',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true
          }
        }
      )
    }
  })
}

// ── Photo Gallery Slider ──────────────────────────────────────────────
function initImageSlider() {
  const section = document.querySelector('.img-slider-section')
  if (!section) return

  const slides    = gsap.utils.toArray('.img-slide')
  const dotsCont  = section.querySelector('.slider-dots')
  const counterEl = section.querySelector('.slider-current')
  const totalEl   = section.querySelector('.slider-total')
  const total     = slides.length
  let current  = 0
  let animating = false

  // Clip-path reveal — same as img-interlude
  gsap.fromTo(section,
    { clipPath: 'inset(0 22% 0 22%)' },
    {
      clipPath: 'inset(0 0% 0 0%)',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'top 15%',
        scrub: 0.8
      }
    }
  )

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button')
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '')
    dot.setAttribute('aria-label', `Immagine ${i + 1}`)
    dot.addEventListener('click', () => goTo(i, i > current ? 1 : -1))
    dotsCont.appendChild(dot)
  })
  if (totalEl) totalEl.textContent = String(total).padStart(2, '0')

  // Initial states: first slide visible, rest hidden off-screen
  slides.forEach((slide, i) => {
    const inner = slide.querySelector('.img-slide-inner')
    if (i === 0) {
      gsap.set(slide, { opacity: 1, zIndex: 1 })
      gsap.set(inner, { xPercent: 0, skewX: 0 })
    } else {
      gsap.set(slide, { opacity: 1, zIndex: 0 })
      gsap.set(inner, { xPercent: 105, skewX: 0 })
    }
  })

  function updateUI(idx) {
    section.querySelectorAll('.slider-dot').forEach((d, i) =>
      d.classList.toggle('active', i === idx)
    )
    if (counterEl) counterEl.textContent = String(idx + 1).padStart(2, '0')
  }

  function goTo(next, dir = 1) {
    if (animating || next === current) return
    animating = true

    const outSlide = slides[current]
    const inSlide  = slides[next]
    const outInner = outSlide.querySelector('.img-slide-inner')
    const inInner  = inSlide.querySelector('.img-slide-inner')

    gsap.set(inSlide, { zIndex: 2 })
    gsap.set(outSlide, { zIndex: 1 })
    gsap.set(inInner, { xPercent: dir * 105, skewX: dir * -14 })

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(outSlide, { zIndex: 0 })
        gsap.set(outInner, { xPercent: dir * -105, skewX: 0 })
        current = next
        animating = false
        updateUI(current)
      }
    })

    tl.to(outInner, { xPercent: dir * -30, skewX: dir * 10, duration: 0.85, ease: 'power2.in' }, 0)
      .to(outSlide,  { opacity: 0, duration: 0.4, ease: 'power2.in' }, 0.45)
      .to(inInner,   { xPercent: 0, skewX: 0, duration: 0.85, ease: 'power2.out' }, 0.05)
  }

  section.querySelector('.slider-prev')?.addEventListener('click', () =>
    goTo((current - 1 + total) % total, -1)
  )
  section.querySelector('.slider-next')?.addEventListener('click', () =>
    goTo((current + 1) % total, 1)
  )

  // Auto-advance, paused on hover
  let autoTimer = setInterval(() => goTo((current + 1) % total, 1), 5000)
  section.addEventListener('mouseenter', () => clearInterval(autoTimer))
  section.addEventListener('mouseleave', () => {
    clearInterval(autoTimer)
    autoTimer = setInterval(() => goTo((current + 1) % total, 1), 5000)
  })

  updateUI(0)
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
