(function () {
  const CONSENT_KEY = 'excel_bite_consent';

  const defaultConsent = {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  };

  function applyConsent(consent) {
    gtag('consent', 'default', consent);
  }

  function updateConsent(consent) {
    gtag('consent', 'update', consent);
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    dataLayer.push({
      event: 'consent_update',
      consent_status: {
        analytics_storage: consent.analytics_storage || 'denied',
        ad_storage: consent.ad_storage || 'denied',
        ad_user_data: consent.ad_user_data || 'denied',
        ad_personalization: consent.ad_personalization || 'denied'
      }
    });
  }

  function getSavedConsent() {
    try {
      const saved = localStorage.getItem(CONSENT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  }

  function buildBanner() {
    if (document.getElementById('cookie-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-banner-content">
        <p>Usamos cookies para mejorar tu experiencia y medir nuestras campañas. <a href="/#privacidad">Más info</a></p>
        <div class="cookie-banner-btns">
          <button class="btn btn-sm btn-ghost" id="cookie-deny">Solo necesarias</button>
          <button class="btn btn-sm btn-primary" id="cookie-accept-all">Aceptar todas</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('cookie-accept-all').addEventListener('click', () => {
      updateConsent({
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
        functionality_storage: 'granted',
        personalization_storage: 'granted',
        security_storage: 'granted'
      });
      banner.remove();
    });

    document.getElementById('cookie-deny').addEventListener('click', () => {
      updateConsent({
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        personalization_storage: 'denied',
        security_storage: 'granted'
      });
      banner.remove();
    });
  }

  const saved = getSavedConsent();
  if (saved) {
    applyConsent(saved);
  } else {
    applyConsent(defaultConsent);
    document.addEventListener('DOMContentLoaded', buildBanner);
  }

  window.ConsentManager = { updateConsent, getSavedConsent };
})();
