/**
 * @jest-environment jsdom
 */

import { KeyBinding } from './KeyBinding';

describe('`class KeyBinding`', () => {
  test('`constructor()`', () => {
    var onKeyDown = jest.fn();

    var kb = new KeyBinding('S', onKeyDown, { altKey: true, ctrlKey: false, metaKey: true });
    expect(kb.key).toBe('S');

    var owner = new ElementMock();
    kb.owner = owner;

    Object.defineProperty(document, 'activeElement', { value: owner, writable: true });

    owner.dispatchEvent(new EventMock('keydown', { key: 'S', altKey: true, metaKey: true }));
    expect(onKeyDown).toHaveBeenCalledTimes(1);

    // incorrect modifying keys
    owner.dispatchEvent(new EventMock('keydown', { key: 'S' }));
    owner.dispatchEvent(new EventMock('keydown', { key: 'S', altKey: true }));
    owner.dispatchEvent(new EventMock('keydown', { key: 'S', metaKey: true }));

    // not called a second time
    expect(onKeyDown).toHaveBeenCalledTimes(1);

    // the owner element is not focused
    document.activeElement = new ElementMock();

    owner.dispatchEvent(new EventMock('keydown', { key: 'S', altKey: true, metaKey: true }));

    // not called a second time
    expect(onKeyDown).toHaveBeenCalledTimes(1);

    document.activeElement = owner;

    owner.dispatchEvent(new EventMock('keydown', { key: 'S', altKey: true, metaKey: true }));
    expect(onKeyDown).toHaveBeenCalledTimes(2);

    // prevents default event responses
    var event = new EventMock('keydown', { key: 'S', altKey: true, metaKey: true });

    expect(event.preventDefault).not.toHaveBeenCalled();
    owner.dispatchEvent(event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);

    // lowercase key
    owner.dispatchEvent(new EventMock('keydown', { key: 's', altKey: true, metaKey: true }));
    expect(onKeyDown).toHaveBeenCalledTimes(4);

    // extra modifying keys
    owner.dispatchEvent(new EventMock('keydown', { key: 'S', altKey: true, metaKey: true, ctrlKey: true }));
    owner.dispatchEvent(new EventMock('keydown', { key: 'S', altKey: true, metaKey: true, shiftKey: true }));

    // not called a fifth time
    expect(onKeyDown).toHaveBeenCalledTimes(4);
  });

  test('`get owner()`', () => {
    var kb = new KeyBinding('A', () => {});
    expect(kb.owner).toBeUndefined();

    var owner = new ElementMock();
    kb.owner = owner;
    expect(kb.owner).toBe(owner);
  });

  test('`set owner()`', () => {
    var onKeyDown = jest.fn();
    var kb = new KeyBinding('G', onKeyDown);

    var owner1 = new ElementMock();
    kb.owner = owner1;

    Object.defineProperty(document, 'activeElement', { value: owner1, writable: true });

    owner1.dispatchEvent(new EventMock('keydown', { key: 'G' }));
    expect(onKeyDown).toHaveBeenCalledTimes(1);

    var owner2 = new ElementMock();
    kb.owner = owner2;

    // unbinds the key binding from owner 1
    owner1.dispatchEvent(new EventMock('keydown', { key: 'G' }));
    expect(onKeyDown).toHaveBeenCalledTimes(1);

    document.activeElement = owner2;

    owner2.dispatchEvent(new EventMock('keydown', { key: 'G' }));
    expect(onKeyDown).toHaveBeenCalledTimes(2);

    kb.owner = undefined;

    // unbinds the key binding from owner 2
    owner2.dispatchEvent(new EventMock('keydown', { key: 'G' }));
    expect(onKeyDown).toHaveBeenCalledTimes(2);
  });
});

class ElementMock {
  #eventListeners = {
    'keydown': [],
  };

  addEventListener(name, listener, options) {
    this.#eventListeners[name].push(listener);

    if (name === 'keydown' && options.passive !== false) {
      throw new Error('Key-down event listeners cannot be passive.');
    }
  }

  hasEventListener(name, listener) {
    return this.#eventListeners[name].includes(listener);
  }

  removeEventListener(name, listener) {
    this.#eventListeners[name] = this.#eventListeners[name].filter(li => li !== listener);
  }

  dispatchEvent(event) {
    this.#eventListeners[event.type].forEach(listener => listener(event));
  }
}

class EventMock {
  constructor(type, options) {
    this.type = type;

    this.key = options.key;

    this.altKey = options.altKey ?? false;
    this.ctrlKey = options.ctrlKey ?? false;
    this.metaKey = options.metaKey ?? false;
    this.shiftKey = options.shiftKey ?? false;
  }

  preventDefault = jest.fn();
}
