# Select

You want to bind interaction events to a single element (like an `<input>`), and have them control the selection state of a separate collection of elements (like `li` items in a pop-out box).

First, pull in `<SelectionProvider>`:

```tsx
import React, { useState } from 'react';
import { SelectionProvider } from '@dimension/react';

const Select = () => {
  const [value, setValue] = useState(null);

  return (
    <SelectionProvider value={value} onChange={setValue}>
      <>{/* TODO */}</>
    </SelectionProvider>
  );
};
```

Great, that's the start. This provider powers the Selection system, which will automatically detect your focusable element (your `<input>`, for instance), the options container, and the options themselves. But to help it do that, you'll need to wire up your components with hooks. Let's create the focusable input first. We can either use the component version, or the hook version.

**Using the component**

```tsx
import React, { forwardRef } from 'react';
import { SelectionFocusElement } from '@dimension/react';

const SelectInput = forwardRef(props, ref) => (
  return <SelectionFocusElement component="input" placeholder="Search..." ref={ref} {...props} />);
```

**Using the hook**

```tsx
import React, { forwardRef } from 'react';
import { useSelectionFocusElement } from '@dimension/react';

const SelectInput = forwardRef(props, ref) => {
  const { props: selectionProps } = useSelectionFocusElement({ ref });

  return <input {...props} {...selectionProps} placeholder="Search..." />;
};
```

By using `SelectionFocusElement`, or passing the props we get from `useSelectionFocusElement`, we make our input discoverable to the Selection system as the primary, focusable, interactive element for our selection experience. For all other purposes, this is just a regular input. You are responsible for attaching `value` and `onChange` props, for instance, to respond to the user's typing and determine which options they can see. Or, if you don't want to allow searching, you could use a `<div>` instead. `@dimension/react` isn't opinionated about this.

Now we can add our input to our Select. For this example, we'll wire up the input change events too, so that the user can type.

```tsx
import React, { useState } from 'react';
import { SelectionProvider } from '@dimension/react';

const Select = () => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');

  return (
    <SelectionProvider value={value} onChange={setValue}>
      <SelectInput
        value={inputValue}
        onChange={ev => setInputValue(ev.target.value)}
      />
    </SelectionProvider>
  );
};
```

Nothing special is happening yet. Let's make the options container and the options themselves. We'll model them as a `<ul>` with `<li>` components, attaching `role` and `aria-selected` attributes to indicate their usage as a list of options.

**Using the components**

```tsx
import React from 'react';
import { SelectionItem, SelectionItemsContainer } from '@dimension/react';

const SelectOption = forwardRef(({ value, ...props }, ref) =>
  (
    <SelectionItem
      component="li"
      role="option"
      value={value}
      selectedProps={{ 'aria-selected': true }}
      ref={ref}
      {...props}
    />
  )
);

const SelectOptions = forwardRef((props, ref) =>
  return <SelectionItemsContainer component="ul" role="listbox" ref={ref} {...props} />
);
```

**Using the hooks**

```tsx
import React from 'react';
import { useSelectionItem, useSelectionItemsContainer } from '@dimension/react';

const SelectOption = forwardRef(({ value, ...props }, ref) => {
  const { props: selectionProps, selected } = useSelectionItem({ value });

  return (
    <li
      role="option"
      aria-selected={selected}
      {...props}
      {...selectionProps}
      ref={ref}
    />
  );
});

const SelectOptions = forwardRef((props, ref) => {
  const { props: selectionProps } = useSelectionItemsContainer({ ref });

  return <ul role="listbox" {...props} {...selectionProps} />;
});
```

Using the `useSelectionItem` and `useSelectionItemsContainer` hooks, we can connect our components to be discovered by the Selection system. The `SelectOption` component also takes a `value` prop, which will be used by the system to determine the value the user has selected when they choose an option.

These components may make more sense when we plug them into our system:

```tsx
import React, { useState, useMemo } from 'react';
import { SelectionProvider } from '@dimension/react';

const options = ['Foo', 'Bar', 'Baz', 'Bop', 'Qux', 'Thud', 'Corge'];

const Select = () => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');

  // filter the options the user sees based on what they type
  const filteredOptions = useMemo(
    () => options.filter(option => option.toLowerCase().includes(inputValue)),
    [inputValue]
  );

  return (
    <SelectionProvider value={value} onChange={setValue}>
      <SelectInput
        value={inputValue}
        onChange={ev => setInputValue(ev.target.value)}
      />
      <SelectOptions>
        {filteredOptions.map(option => (
          <SelectOption value={option} key={option}>
            {option}
          </SelectOption>
        ))}
      </SelectOptions>
    </SelectionProvider>
  );
};
```

We're close to a working demo! You can now focus the input and use arrow keys to select one of the options, or type to filter them down. The filtering, of course, is all done with _your_ code; `@dimension/react` isn't opinionated about how that happens.

One last thing: when you select a value, nothing happens. While we're storing it in state, we don't do anything with the new value when we get it. It's up to you what experience you want to create with this value. In a lot of cases, it makes sense to change the contents of the input to reflect the chosen value, so let's do that:

```tsx
import React, { useState, useMemo, useCallback } from 'react';
import { SelectionProvider } from '@dimension/react';

const options = ['Foo', 'Bar', 'Baz', 'Bop', 'Qux', 'Thud', 'Corge'];

const Select = () => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');

  // filter the options the user sees based on what they type
  const filteredOptions = useMemo(
    () => options.filter(option => option.toLowerCase().includes(inputValue)),
    [inputValue]
  );

  // updates the input value when the selected value changes. there are a few
  // ways to do this (you could use a useEffect that triggers on value change, too),
  // but this is a simple one.
  const handleSelection = useCallback(
    (newValue: string) => {
      setValue(newValue);
      setInputValue(newValue);
    },
    [setValue, setInputValue]
  );

  return (
    // we pass handleSelection instead of setValue here vvvv
    <SelectionProvider value={value} onChange={handleSelection}>
      <SelectInput
        value={inputValue}
        onChange={ev => setInputValue(ev.target.value)}
      />
      <SelectOptions>
        {filteredOptions.map(option => (
          <SelectOption value={option} key={option}>
            {option}
          </SelectOption>
        ))}
      </SelectOptions>
    </SelectionProvider>
  );
};
```

And that covers the core functionality of keyboard selection! Of course, this is a pretty static-looking Select component as-is. It doesn't have pop-out functionality; in fact the options are always visible, even when the input isn't focused. But those details are up to you to fill out. You still have access to the components that make up your Select, so you can listen to `focus` or `click` events as needed, store open / closed state for a popup, and integrate pop-over libraries like [react-popper](https://www.npmjs.com/package/react-popper) alongside the Selection system.

For an example of what a more full-featured Select might look like, take a look at [the demo](../homepage/src/Select.tsx).
