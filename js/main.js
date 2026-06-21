(function () {
  // ---- Cart state ----
  let cart = JSON.parse(localStorage.getItem('eb_cart') || '[]');

  function saveCart() {
    localStorage.setItem('eb_cart', JSON.stringify(cart));
    updateCartUI();
  }

  function addToCart(planKey) {
    const plan = DL.plans[planKey];
    if (!plan) return;
    cart = [plan];
    saveCart();
    DL.selectPlan(planKey);
  }

  function getCart() {
    return cart;
  }

  function clearCart() {
    cart = [];
    saveCart();
  }

  function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = cart.length;
      badge.style.display = cart.length ? 'inline' : 'none';
    }
  }

  // ---- Scroll tracking ----
  let scrollTracked = new Set();
  function initScrollTracking() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const pct = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
          const depths = [25, 50, 75, 90, 100];
          depths.forEach(d => {
            if (pct >= d && !scrollTracked.has(d)) {
              scrollTracked.add(d);
              DL.pushScrollDepth(d);
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ---- Video tracking ----
  function initVideoTracking() {
    document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]').forEach(el => {
      el.addEventListener('play', () => DL.pushVideoProgress('start', el.title || 'Video'));
      el.addEventListener('ended', () => DL.pushVideoProgress('complete', el.title || 'Video'));
    });
  }

  // ---- CTA clicks ----
  function initCTATracking() {
    document.querySelectorAll('[data-track]').forEach(el => {
      el.addEventListener('click', () => {
        DL.pushClick(el.dataset.track, el.dataset.category || 'cta');
      });
    });
  }

  // ---- Nav toggle mobile ----
  function initNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
        toggle.classList.toggle('open');
      });
    }
  }

  // ---- Global click tracking ----
  function initGlobalClicks() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-track]');
      if (btn) {
        DL.pushClick(btn.dataset.track, btn.dataset.category || 'click');
      }
      const planBtn = e.target.closest('[data-plan]');
      if (planBtn) {
        e.preventDefault();
        const plan = planBtn.dataset.plan;
        addToCart(plan);
        window.location.href = planBtn.href || '/checkout.html';
      }
    });
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initScrollTracking();
    initVideoTracking();
    initCTATracking();
    initGlobalClicks();
    updateCartUI();
  });

  window.App = { addToCart, getCart, clearCart };
})();
