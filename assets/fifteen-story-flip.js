if (!customElements.get('fifteen-story-flip')) {
  customElements.define('fifteen-story-flip', class extends HTMLElement {
    connectedCallback() {
      if (this.ready) return;
      this.front = this.querySelector('[data-flip-front]');
      this.back = this.querySelector('[data-flip-back]');
      this.returnButton = this.querySelector('[data-flip-return]');
      if (!this.front || !this.back || !this.returnButton) return;
      this.ready = true;
      this.front.addEventListener('click', () => this.setOpen(true, true));
      this.returnButton.addEventListener('click', () => this.setOpen(false, true));
      this.addEventListener('pointerenter', event => {
        if (event.pointerType === 'mouse' && matchMedia('(hover: hover)').matches) this.setOpen(true);
      });
      this.addEventListener('pointerleave', event => {
        if (event.pointerType === 'mouse' && !this.contains(document.activeElement)) this.setOpen(false);
      });
      this.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); this.setOpen(false, true); }
      });
      this.addEventListener('focusout', () => {
        queueMicrotask(() => {
          if (!this.contains(document.activeElement) && !this.matches(':hover')) this.setOpen(false);
        });
      });
      this.classList.add('is-ready');
      this.setOpen(false);
    }
    setOpen(open, moveFocus = false) {
      if (open && this.front.contains(document.activeElement)) moveFocus = true;
      this.classList.toggle('is-flipped', open);
      this.front.setAttribute('aria-expanded', String(open));
      this.front.inert = open;
      this.back.inert = !open;
      this.front.setAttribute('aria-hidden', String(open));
      this.back.setAttribute('aria-hidden', String(!open));
      if (moveFocus) (open ? this.returnButton : this.front).focus({ preventScroll: true });
    }
  });
}
