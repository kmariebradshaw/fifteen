(() => {
  if (window.fifteenMotionLoaded) return;
  window.fifteenMotionLoaded = true;
  const states = new Map();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const selector = '.fifteen-home__benefit, .fifteen-home__collection > h2, .fifteen-home__product, .fifteen-home__story-copy, .fifteen-home__life-image, .fifteen-home__life-copy, .fifteen-home__subscribe';

  function stop(root) {
    const state = states.get(root);
    if (!state) return;
    state.observer.disconnect();
    state.animations.forEach(animation => animation.cancel());
    root.removeEventListener('focusin', state.onFocus);
    states.delete(root);
  }
  function init(root) {
    if (states.has(root) || reduced.matches || window.Shopify?.designMode ||
        !('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const animations = new Map();
    const observer = new IntersectionObserver(entries => {
      const stagger = new Map();
      entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top ||
          a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach(entry => {
          observer.unobserve(entry.target);
          const animation = animations.get(entry.target);
          if (!animation) return;
          const group = entry.target.parentElement;
          const index = stagger.get(group) || 0;
          stagger.set(group, index + 1);
          animation.effect.updateTiming({ delay: Math.min(index, 4) * 85 });
          animation.play();
        });
    }, { threshold: .01, rootMargin: '0px 0px -40px 0px' });
    const onFocus = event => {
      animations.forEach((animation, element) => {
        if (element.contains(event.target)) {
          observer.unobserve(element);
          animation.cancel();
        }
      });
    };
    states.set(root, { observer, animations, onFocus });
    root.addEventListener('focusin', onFocus);
    try {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      root.querySelectorAll(selector).forEach(element => {
        const rect = element.getBoundingClientRect();
        // Never animate the hero, the initial viewport, or content above a restored scroll position.
        if (rect.top < viewportHeight || rect.width === 0 || rect.height === 0) return;
        // Prepare only offscreen content; backwards fill holds the first frame during stagger delays.
        const animation = element.animate(
          [{ opacity: 0, translate: '0 .65rem' }, { opacity: 1, translate: '0 0' }],
          { duration: 600, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'backwards' }
        );
        animation.pause();
        animation.currentTime = 0;
        animations.set(element, animation);
        animation.oncancel = () => animations.delete(element);
        animation.onfinish = () => {
          animations.delete(element);
          animation.cancel();
        };
        observer.observe(element);
      });
    } catch {
      // Restore normal visibility if enhancement setup cannot complete.
      stop(root);
    }
  }
  function scan(scope) {
    if (scope.matches?.('.fifteen-home')) init(scope);
    scope.querySelectorAll('.fifteen-home').forEach(init);
  }
  function boot() { scan(document); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
  document.addEventListener('shopify:section:load', event => scan(event.target));
  document.addEventListener('shopify:section:unload', event => {
    states.forEach((_, root) => { if (event.target.contains(root)) stop(root); });
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) Array.from(states.keys()).forEach(stop);
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) Array.from(states.keys()).forEach(stop);
    else scan(document);
  });
})();
