# Installation

With `npm`:

```
npm install @rnacanvas/key-bindings
```

# Usage

All exports of this package can be accessed as named imports.

```javascript
// an example import
import { KeyBinding } from '@rnacanvas/key-bindings';
```

## `class KeyBinding`

The `KeyBinding` class represents a key binding.

```javascript
var selectAll = () => {};

var keyBinding = new KeyBinding('A', () => selectAll(), { ctrlKey: true });

// bind the key binding to the entire webpage
keyBinding.owner = document.body;
```

Key bindings are not case-sensitive.
The above key binding will be triggered for both `Ctrl+A` and `Ctrl+a`.

Modifying key combinations are exclusive, however.
The above key binding will not be triggered by `Ctrl+Shift+A`, for instance.

### `owner`

Key bindings do not become active until their `owner` property has been set,
which stores a reference to the element that the key binding belongs to.

Setting the `owner` property of a key binding to the document body, for instance,
will bind the key binding to the entire webpage.

```javascript
// bind the key binding to the entire webpage
keyBinding.owner = document.body;

// deactivate the key binding
keyBinding.owner = undefined;
```

Key bindings can only possibly be triggered when their owner element has focus
and is the target of the necessary keyboard events.

Any element can be made focusable using the `tabindex` HTML property
(see the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) to learn more).

```javascript
// not focusable by default
var ele = document.createElement('div');

// the element is now focusable
ele.tabIndex = 0;

keyBinding.owner = ele;
```
