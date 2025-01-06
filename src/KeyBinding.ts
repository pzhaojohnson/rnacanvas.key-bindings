export class KeyBinding {
  #onKeyDown;

  #keyDownListener;

  #options;

  #owner: HTMLElement | undefined = undefined;

  constructor(readonly key: string, onKeyDown: () => void, options?: Options) {
    this.#onKeyDown = onKeyDown;

    this.#keyDownListener = (event: KeyboardEvent) => this.#handleKeyDown(event);

    this.#options = options;
  }

  get #altKey(): boolean {
    return this.#options?.altKey ?? false;
  }

  get #ctrlKey(): boolean {
    return this.#options?.ctrlKey ?? false;
  }

  get #metaKey(): boolean {
    return this.#options?.metaKey ?? false;
  }

  get #shiftKey(): boolean {
    return this.#options?.shiftKey ?? false;
  }

  /**
   * The element that this key binding belongs to.
   *
   * Must be focusable for the key binding to work
   * (see the `taxindex` HTML property).
   */
  get owner() {
    return this.#owner;
  }

  set owner(owner) {
    this.#owner?.removeEventListener('keydown', this.#keyDownListener);

    owner?.addEventListener('keydown', this.#keyDownListener, { passive: false });

    this.#owner = owner;
  }

  #handleKeyDown(event: KeyboardEvent) {
    if (
      event.key.toUpperCase() === this.key.toUpperCase()
      && event.altKey === this.#altKey
      && event.ctrlKey === this.#ctrlKey
      && event.metaKey === this.#metaKey
      && event.shiftKey === this.#shiftKey
    ) {
      event.preventDefault();
      this.#onKeyDown();
    }
  }
}

type Options = {
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};
