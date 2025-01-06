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

var kb = new KeyBinding('A', () => selectAll(), { ctrlKey: true });
```
