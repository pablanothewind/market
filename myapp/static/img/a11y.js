'use strict';
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const status = document.createElement('div');
  status.className = 'a11y-only';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  document.body.append(status);
  document.addEventListener('invalid', (event) => {
    const field = event.target;
    field.setAttribute('aria-invalid', 'true');
    const label = field.labels?.[0]?.textContent || field.getAttribute('placeholder') || 'this field';
    status.textContent = `${label}: ${field.validationMessage}`;
  }, true);
  document.addEventListener('input', (event) => {
    if (event.target.validity?.valid) event.target.removeAttribute('aria-invalid');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const button = document.querySelector('.navbar-toggle[aria-expanded="true"]');
    if (button) {
      const menu = document.getElementById(button.getAttribute('aria-controls'));
      if (menu?.classList.contains('collapsing') && window.jQuery) {
        window.jQuery(menu).one('shown.bs.collapse', () => { button.click(); button.focus(); });
      } else { button.click(); button.focus(); }
    }
  });
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.hash.length < 2) return;
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!target) return;
    target.setAttribute('tabindex', '-1');
    const focus = () => {
      // Avoid stealing focus if the visitor has moved to another control.
      if (document.activeElement !== link && document.activeElement !== document.body) return;
      target.focus({preventScroll:true});
    };
    if (reduced.matches || link.classList.contains('a11y-focusable')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (window.jQuery) window.jQuery('html, body').stop(true);
      target.scrollIntoView();
      target.focus({preventScroll:true});
    } else {
      // Preserve the original smooth-scroll duration and styling.
      window.setTimeout(focus, document.querySelector('.flexslider') ? 2100 : 1000);
    }
  }, true);

  function enhanceCarousels() {
    const slider = () => window.jQuery?.('.flexslider').data('flexslider');
    const carousel = () => window.jQuery?.('.testimonials-carousel').data('owlCarousel');
    const pause = () => {
      slider()?.pause();
      carousel()?.stop();
      document.querySelectorAll('[data-a11y-pause]').forEach(button => { if (button.textContent !== 'Resume rotating content') button.textContent = 'Resume rotating content'; });
    };
    document.querySelectorAll('.flex-next, .flex-prev').forEach(control => {
      control.setAttribute('aria-label', control.classList.contains('flex-next') ? 'Next slide and pause slideshow' : 'Previous slide and pause slideshow');
      if (!control.dataset.a11yReady) {
        control.dataset.a11yReady = 'true';
        control.addEventListener('click', pause);
      }
    });
    document.querySelectorAll('.flex-control-nav a, .testimonials-carousel .owl-page').forEach((control, index) => {
      control.setAttribute('role','button');
      control.setAttribute('tabindex','0');
      const group = control.closest('.owl-pagination, .flex-control-nav');
      const number = Array.from(group.querySelectorAll('.owl-page, a')).indexOf(control) + 1;
      control.setAttribute('aria-label', `Show ${control.closest('.testimonials-carousel') ? 'testimonial' : 'slide'} ${number} and pause rotation`);
      if (!control.dataset.a11yReady) {
        control.dataset.a11yReady = 'true';
        control.addEventListener('keydown', event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          if (control.classList.contains('owl-page')) window.jQuery(control).trigger('mouseup');
          else control.click();
          pause();
        });
        control.addEventListener('mouseup', () => window.setTimeout(pause, 0));
        control.addEventListener('touchend', () => window.setTimeout(pause, 0));
        control.addEventListener('click', pause);
        control.addEventListener('focus', pause);
      }
    });
    document.querySelectorAll('.flexslider, .testimonials-carousel').forEach(container => {
      if (!container.querySelector('[data-a11y-pause]')) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'a11y-only a11y-focusable';
        button.dataset.a11yPause = 'true';
        button.textContent = 'Pause rotating content';
        button.addEventListener('click', () => {
          if (button.textContent.startsWith('Resume')) {
            if (container.classList.contains('flexslider')) slider()?.play();
            else carousel()?.play();
            button.textContent = 'Pause rotating content';
          } else pause();
        });
        container.append(button);
      }
    });
    if (reduced.matches) pause();
  }
  if (document.querySelector('.flexslider')) {
    const observer = new MutationObserver(enhanceCarousels);
    observer.observe(document.querySelector('#home'), {childList:true, subtree:true});
    const testimonials = document.querySelector('.testimonials-carousel');
    if (testimonials) observer.observe(testimonials, {childList:true, subtree:true});
    enhanceCarousels();
    reduced.addEventListener('change', () => { if (reduced.matches) enhanceCarousels(); });
    // A failed legacy plugin must not leave the loading mask permanently covering the page.
    window.addEventListener('load', () => window.setTimeout(() => {
      const loader = document.getElementById('pageloader');
      if (loader && getComputedStyle(loader).display !== 'none') loader.style.display = 'none';
    }, 3000));
  }
})();
