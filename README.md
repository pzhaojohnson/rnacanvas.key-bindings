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

// bind the key binding to the entire webpage
kb.owner = document.body;
```

Key bindings are not case-sensitive.
The above key binding will be triggered for both `Ctrl+A` and `Ctrl+a`.

Modifying key combinations are exclusive, however.
The above key binding will not be triggered by `Ctrl+Shift+A`, for instance.
