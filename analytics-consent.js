/* MYCNC3D: GA4 is loaded only after explicit analytics consent. */
(() => {
  'use strict';
  const ID = 'G-CBG6Y4EPSE';
  const KEY = 'mycnc3d-ga4-consent-v1';
  const MAX_AGE = 180 * 86400000;
  const fr = document.documentElement.lang.toLowerCase().startsWith('fr');
  const t = fr ? {
    title: 'Respect de votre vie privée',
    intro: "Avec votre accord, MYCNC3D utilise Google Analytics pour mesurer l'audience et améliorer le site. Refuser ne limite pas l'accès. Cloudflare Web Analytics fonctionne indépendamment de ce choix.",
    accept: 'Tout accepter', reject: 'Tout refuser', customize: 'Personnaliser',
    link: 'Données personnelles et cookies', settings: 'Gérer les cookies',
    modal: 'Préférences de confidentialité', explain: 'Vous pouvez modifier votre choix à tout moment.',
    essential: 'Fonctionnement essentiel', required: 'Toujours actif',
    essentialInfo: 'Conservation locale de votre choix, sans cookie Google.',
    analytics: 'Google Analytics 4', analyticsInfo: 'Mesure les pages visitées et les interactions. Les cookies de mesure ne sont autorisés qu’après votre accord.',
    cloudflare: "Cloudflare Web Analytics est un service distinct : ce choix ne contrôle que Google Analytics.",
    save: 'Enregistrer mon choix', close: 'Fermer'
  } : {
    title: 'Your privacy matters',
    intro: 'With your permission, MYCNC3D uses Google Analytics to understand visits and improve this website. Refusing will not limit access. Cloudflare Web Analytics operates separately from this choice.',
    accept: 'Accept all', reject: 'Reject all', customize: 'Customize',
    link: 'Personal data and cookies', settings: 'Manage cookies',
    modal: 'Privacy preferences', explain: 'You can change your choice at any time.',
    essential: 'Essential operation', required: 'Always active',
    essentialInfo: 'Locally remembers your decision, without Google cookies.',
    analytics: 'Google Analytics 4', analyticsInfo: 'Measures page views and interactions. Analytics cookies are allowed only after your consent.',
    cloudflare: 'Cloudflare Web Analytics is a separate service: this choice only controls Google Analytics.',
    save: 'Save my choices', close: 'Close'
  };
  const legal = fr ? '/mentions-legales.html' : '/legal-notice.html';
  const getChoice = () => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY));
      return v && ['yes', 'no'].includes(v.choice) &&
        Number.isFinite(v.time) && v.time <= Date.now() &&
        Date.now() - v.time < MAX_AGE ? v.choice === 'yes' : null;
    } catch (_) { return null; }
  };
  let choice = getChoice();
  let loaded = false;
  let transientChoice = false;
  window['ga-disable-' + ID] = choice !== true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });

  function loadGoogle() {
    if (loaded) return;
    loaded = true;
    window['ga-disable-' + ID] = false;
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', ID, { send_page_view: true });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID);
    document.head.appendChild(tag);
  }
  function eraseCookies() {
    const domains = ['', location.hostname, '.' + location.hostname, 'mycnc3d.com', '.mycnc3d.com'];
    let cookieList;
    try { cookieList = document.cookie.split(';'); } catch (_) { return; }
    cookieList.forEach(part => {
      const n = part.split('=')[0].trim();
      if (!/^_ga($|_)/.test(n)) return;
      domains.forEach(domain => {
        try {
          document.cookie = n + '=; Max-Age=0; path=/; SameSite=Lax' +
            (domain ? '; domain=' + domain : '');
        } catch (_) { /* Cookie access may be disabled by browser settings. */ }
      });
    });
  }
  const remember = yes => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ choice: yes ? 'yes' : 'no', time: Date.now() }));
      transientChoice = false;
    } catch (_) { transientChoice = true; /* Apply choice for this page only. */ }
  };

  function init() {
    const banner = document.createElement('section');
    banner.className = 'myc-consent-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', t.title);
    banner.innerHTML =
      '<div class="myc-consent-copy"><h2>' + t.title + '</h2><p>' + t.intro +
      '</p><a href="' + legal + '">' + t.link + '</a></div>' +
      '<div class="myc-consent-actions">' +
      '<button type="button" data-consent="yes" class="myc-consent-btn myc-consent-choice">' + t.accept + '</button>' +
      '<button type="button" data-consent="no" class="myc-consent-btn myc-consent-choice">' + t.reject + '</button>' +
      '<button type="button" data-consent="custom" class="myc-consent-btn myc-consent-alt">' + t.customize + '</button></div>';

    const settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'myc-privacy-settings';
    settings.textContent = t.settings;
    settings.setAttribute('aria-label', t.settings);

    const overlay = document.createElement('div');
    overlay.className = 'myc-consent-overlay';
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="myc-consent-dialog" role="dialog" aria-modal="true" aria-labelledby="myc-consent-heading">' +
      '<header><h2 id="myc-consent-heading">' + t.modal + '</h2>' +
      '<button class="myc-consent-close" type="button" data-consent="close" aria-label="' + t.close + '">×</button></header>' +
      '<p>' + t.explain + '</p>' +
      '<div class="myc-consent-option"><div><strong>' + t.essential + '</strong><small>' +
      t.essentialInfo + '</small></div><span>' + t.required + '</span></div>' +
      '<label class="myc-consent-option" for="myc-ga4-switch"><span><strong>' + t.analytics +
      '</strong><small>' + t.analyticsInfo + '</small></span>' +
      '<input id="myc-ga4-switch" type="checkbox"></label>' +
      '<p class="myc-cloudflare-note">' + t.cloudflare + ' <a href="' + legal + '">' + t.link + '</a></p>' +
      '<div class="myc-consent-dialog-actions">' +
      '<button type="button" data-consent="save" class="myc-consent-btn myc-consent-choice">' + t.save + '</button>' +
      '<button type="button" data-consent="no" class="myc-consent-btn myc-consent-choice">' + t.reject + '</button>' +
      '<button type="button" data-consent="yes" class="myc-consent-btn myc-consent-choice">' + t.accept + '</button>' +
      '</div></div>';

    document.body.append(banner, settings, overlay);
    let priorFocus = null;
    let background = [];
    const sync = () => {
      banner.hidden = choice !== null;
      settings.hidden = choice === null;
      if (choice === true) loadGoogle();
    };
    const close = () => {
      overlay.hidden = true;
      background.forEach(([el, wasInert]) => { el.inert = wasInert; });
      background = [];
      document.body.classList.remove('myc-consent-dialog-open');
      if (priorFocus && priorFocus.isConnected && !priorFocus.closest('[hidden]')) {
        priorFocus.focus();
      } else if (!settings.hidden) settings.focus();
    };
    const open = () => {
      priorFocus = document.activeElement;
      overlay.querySelector('#myc-ga4-switch').checked = choice === true;
      overlay.hidden = false;
      background = Array.from(document.body.children)
        .filter(el => el !== overlay)
        .map(el => [el, el.inert]);
      background.forEach(([el]) => { el.inert = true; });
      document.body.classList.add('myc-consent-dialog-open');
      overlay.querySelector('.myc-consent-close').focus();
    };
    const decide = granted => {
      const needsReload = !granted && loaded;
      choice = granted;
      remember(granted);
      window['ga-disable-' + ID] = !granted;
      if (!granted) {
        window.gtag('consent', 'update', { analytics_storage: 'denied' });
        eraseCookies();
      }
      sync();
      close();
      if (needsReload) location.reload(); // Remove previously loaded Google scripts.
    };
    // Honour withdrawal/clearing in another tab and expiry on a long-lived page.
    const reconcile = () => {
      if (transientChoice) return;
      const current = getChoice();
      if (current === choice) return;
      const needsReload = current !== true && loaded;
      choice = current;
      window['ga-disable-' + ID] = current !== true;
      if (current !== true) {
        window.gtag('consent', 'update', { analytics_storage: 'denied' });
        eraseCookies();
      }
      sync();
      close();
      if (needsReload) location.reload();
    };
    window.addEventListener('storage', event => {
      if (event.key === KEY || event.key === null) {
        transientChoice = false;
        reconcile();
      }
    });
    window.addEventListener('pageshow', reconcile);
    document.addEventListener('visibilitychange', reconcile);
    window.setInterval(reconcile, 60000);
    [banner, overlay].forEach(el => el.addEventListener('click', event => {
      const control = event.target.closest('button[data-consent]');
      if (!control) return;
      const action = control.dataset.consent;
      if (action === 'yes') decide(true);
      if (action === 'no') decide(false);
      if (action === 'save') decide(overlay.querySelector('#myc-ga4-switch').checked);
      if (action === 'custom') open();
      if (action === 'close') close();
    }));
    settings.addEventListener('click', open);
    overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
    document.addEventListener('keydown', event => {
      if (overlay.hidden) return;
      if (event.key === 'Escape') { close(); return; }
      if (event.key !== 'Tab') return;
      const all = Array.from(overlay.querySelectorAll('button, input, a[href]'));
      const first = all[0], last = all[all.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
