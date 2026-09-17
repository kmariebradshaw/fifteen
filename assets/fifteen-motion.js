(() => {
  if (window.fifteenMotionLoaded) return;
  window.fifteenMotionLoaded = true;
  const states = new Map();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const selector = '.fifteen-home__hero-copy > *, .fifteen-home__benefit, .fifteen-home__collection > h2, .fifteen-home__product, .fifteen-home__story-copy, .fifteen-home__life-image, .fifteen-home__life-copy, .fifteen-home__subscribe';

  function stop(root) {
    const state = states.get(root);
    if (!state) return;
    state.observer.disconnect();
    state.animations.forEach(animation => animation.cancel());
    states.delete(root);
  }
  function init(root) {
    if (states.has(root) || reduced.matches || window.Shopify?.designMode ||
        !('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const animations = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        // Content is never hidden while waiting for the observer or for JavaScript.
        const siblings = Array.from(entry.target.parentElement.children);
        const delay = Math.min(siblings.indexOf(entry.target), 4) * 55;
        const animation = entry.target.animate(
          [{ opacity: .35, translate: '0 1rem' }, { opacity: 1, translate: '0 0' }],
          { duration: 580, delay, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'none' }
        );
        animations.add(animation);
        animation.onfinish = animation.oncancel = () => animations.delete(animation);
      });
    }, { threshold: .08 });
    states.set(root, { observer, animations });
    root.querySelectorAll(selector).forEach(element => observer.observe(element));
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
  reduced.addEventListener('change', () => {
    if (reduced.matches) Array.from(states.keys()).forEach(stop);
    else scan(document);
  });
})();
