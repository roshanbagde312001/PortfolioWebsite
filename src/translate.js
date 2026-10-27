/*
 * Whole-page translation powered by the Google Translate element.
 * The script is only loaded once a visitor picks a language other than English,
 * and the choice is remembered in the `googtrans` cookie that the engine reads.
 */

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文' },
];

const CODES = LANGUAGES.map((l) => l.code);
const SCRIPT_ID = 'gt-script';
// Things that must stay as written: code, terminals, keyboard shortcuts, live-updating captions
const KEEP = 'pre, code, kbd, samp, .nsw-cmd, .nsw-out, .vi-caption, .vi-orb, .vi-launch-orb';

export function currentLanguage() {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
  const code = m ? decodeURIComponent(m[1]) : 'en';
  return CODES.includes(code) ? code : 'en';
}

function setCookie(code) {
  const host = location.hostname;
  const domains = ['', host, host.includes('.') ? '.' + host.split('.').slice(-2).join('.') : ''];
  for (const d of new Set(domains)) {
    const dom = d ? `;domain=${d}` : '';
    document.cookie =
      code === 'en'
        ? `googtrans=;path=/${dom};expires=Thu, 01 Jan 1970 00:00:00 GMT`
        : `googtrans=/en/${code};path=/${dom};max-age=31536000`;
  }
}

/* Mark code / terminals as non-translatable, now and as React renders more. */
let observer;
function protectCode() {
  const mark = (root) => root.querySelectorAll?.(KEEP).forEach((el) => el.classList.add('notranslate'));
  mark(document);
  if (observer) return;
  observer = new MutationObserver((list) => {
    for (const m of list) m.addedNodes.forEach((n) => n.nodeType === 1 && (n.matches?.(KEEP) ? n.classList.add('notranslate') : mark(n)));
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

let loading;
function loadEngine() {
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const host = document.createElement('div');
    host.id = 'google_translate_element';
    host.hidden = true;
    document.body.appendChild(host);
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: CODES.join(','), autoDisplay: false }, 'google_translate_element');
      resolve();
    };
    const s = document.createElement('script');
    s.id = SCRIPT_ID;
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    s.onerror = () => {
      loading = null;
      reject(new Error('Translation service unavailable'));
    };
    document.head.appendChild(s);
  });
  return loading;
}

/* The engine's hidden <select> appears a moment after init. */
function waitForCombo(timeout = 6000) {
  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const tick = () => {
      const c = document.querySelector('select.goog-te-combo');
      if (c && c.options.length > 1) return resolve(c);
      if (performance.now() - t0 > timeout) return reject(new Error('Translation service did not start'));
      setTimeout(tick, 100);
    };
    tick();
  });
}

export async function setLanguage(code) {
  document.documentElement.lang = code;
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
  setCookie(code);

  if (code === 'en') {
    // Back to the original text; reload only if the engine never ran
    const combo = document.querySelector('select.goog-te-combo');
    if (!combo) return;
    combo.value = 'en';
    combo.dispatchEvent(new Event('change'));
    setTimeout(() => {
      if (document.documentElement.classList.contains('translated-ltr') || document.documentElement.classList.contains('translated-rtl')) location.reload();
    }, 600);
    return;
  }

  protectCode();
  await loadEngine();
  const combo = await waitForCombo();
  combo.value = code;
  combo.dispatchEvent(new Event('change'));
}

/* Re-apply a remembered language on first load. */
export function restoreLanguage() {
  const code = currentLanguage();
  if (code !== 'en') setLanguage(code).catch(() => {});
  return code;
}

/*
 * Google Translate swaps text nodes for <font> wrappers, which makes React throw
 * when it later removes/inserts those nodes. Make those DOM calls forgiving.
 * (Standard workaround — facebook/react#11538.)
 */
export function patchDomForTranslation() {
  if (typeof Node !== 'function' || Node.prototype.__gtPatched) return;
  Node.prototype.__gtPatched = true;
  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child);
  };
  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (node, ref) {
    if (ref && ref.parentNode !== this) return insertBefore.call(this, node, null);
    return insertBefore.call(this, node, ref);
  };
}

/* True while the page is machine-translated (the engine tags <html>). */
export function isTranslated() {
  const c = document.documentElement.classList;
  return c.contains('translated-ltr') || c.contains('translated-rtl');
}
