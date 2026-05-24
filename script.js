/* ============================================
   Velki123.cc — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Ripple Effect ── */
  const rippleTargets = document.querySelectorAll('.btn');

  rippleTargets.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple-el';
      const rect = btn.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top  = (e.clientY - rect.top)  + 'px';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 750);
    });
  });

  /* ── Ticker pause on hover ── */
  const tickerTrack = document.querySelector('.ticker-track');
  const ticker = document.querySelector('.ticker');

  if (ticker && tickerTrack) {
    ticker.addEventListener('mouseenter', function () {
      tickerTrack.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', function () {
      tickerTrack.style.animationPlayState = 'running';
    });
  }

  /* ── Staggered button entrance ── */
  const btns = document.querySelectorAll('.btn');
  btns.forEach(function (btn, i) {
    btn.style.animationDelay = (0.2 + i * 0.1) + 's';
  });

  /* ── Dynamic Links Setup (from API) ── */
  fetch('/api/config')
    .then(res => res.json())
    .then(data => {
      const waBtn = document.querySelector('.btn-whatsapp');
      if (waBtn && data.whatsappNumber) {
        waBtn.href = 'https://wa.me/' + data.whatsappNumber;
      }

      const fbBtn = document.querySelector('.btn-facebook');
      if (fbBtn && data.messengerLink) {
        fbBtn.href = data.messengerLink;
      }
    })
    .catch(err => console.error('Failed to load contact links', err));

  /* ── QR Popup ── */
  const qrBtn = document.getElementById('qr-btn');
  const qrPopup = document.getElementById('qr-popup');
  const qrClose = document.querySelector('.popup-close');

  if (qrBtn && qrPopup && qrClose) {
    qrBtn.addEventListener('click', function(e) {
      e.preventDefault();
      qrPopup.classList.add('active');
      qrPopup.setAttribute('aria-hidden', 'false');
    });

    qrClose.addEventListener('click', function() {
      qrPopup.classList.remove('active');
      qrPopup.setAttribute('aria-hidden', 'true');
    });

    qrPopup.addEventListener('click', function(e) {
      if (e.target === qrPopup) {
        qrPopup.classList.remove('active');
        qrPopup.setAttribute('aria-hidden', 'true');
      }
    });
  }

});
