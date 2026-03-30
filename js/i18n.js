/**
 * i18n.js
 * Manages IT/EN language toggle. Persists selection in localStorage.
 */

let currentLang = localStorage.getItem('lang') || 'it'
let _config = null

function initI18n(config) {
  _config = config
  applyLang(currentLang, false)
  bindToggle()
}

function applyLang(lang, animate = true) {
  currentLang = lang
  localStorage.setItem('lang', lang)
  document.documentElement.lang = lang

  // Update toggle button states
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang)
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false')
  })

  // Re-populate all text content
  if (_config) {
    updateTextContent(_config, lang)
  }
}

function bindToggle() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.lang !== currentLang) {
        applyLang(btn.dataset.lang, true)
      }
    })
  })
}

function getCurrentLang() {
  return currentLang
}
