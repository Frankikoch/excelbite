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
          <button class="btn btn-sm btn-ghost" id="cookie-settings-link">Configurar</button>
          <button class="btn btn-sm btn-primary" id="cookie-accept-all">Aceptar todas</button>
        </div>
        <div id="cookie-settings-panel" style="display:none;margin-top:16px;border-top:1px solid rgba(255,255,255,0.2);padding-top:16px">
          <div class="cookie-toggle-row">
            <label><input type="checkbox" id="cs-analytics" checked> Analítica</label>
            <span>Medimos cómo usas la web para mejorarla.</span>
          </div>
          <div class="cookie-toggle-row">
            <label><input type="checkbox" id="cs-ads" checked> Publicidad</label>
            <span>Mostrarte anuncios relevantes en otras plataformas.</span>
          </div>
          <div class="cookie-toggle-row">
            <label><input type="checkbox" id="cs-personalization" checked> Personalización</label>
            <span>Contenido adaptado a tus preferencias.</span>
          </div>
          <button class="btn btn-sm btn-primary" id="cookie-save-settings" style="margin-top:12px">Guardar preferencias</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('cookie-accept-all').addEventListener('click', function () {
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

    document.getElementById('cookie-deny').addEventListener('click', function () {
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

    document.getElementById('cookie-settings-link').addEventListener('click', function () {
      var panel = document.getElementById('cookie-settings-panel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('cookie-save-settings').addEventListener('click', function () {
      var analytics = document.getElementById('cs-analytics').checked ? 'granted' : 'denied';
      var ads = document.getElementById('cs-ads').checked ? 'granted' : 'denied';
      var personalization = document.getElementById('cs-personalization').checked ? 'granted' : 'denied';
      updateConsent({
        ad_storage: ads,
        ad_user_data: ads,
        ad_personalization: personalization,
        analytics_storage: analytics,
        functionality_storage: 'granted',
        personalization_storage: personalization,
        security_storage: 'granted'
      });
      banner.remove();
    });
  }

  var saved = getSavedConsent();
  if (saved) {
    applyConsent(saved);
  } else {
    applyConsent(defaultConsent);
    document.addEventListener('DOMContentLoaded', buildBanner);
  }

  window.ConsentManager = { updateConsent: updateConsent, getSavedConsent: getSavedConsent };
})();
