# Toggle Buttons

You want to create a 1-dimensional, grouped set of interactive elements (like `<button>`s) which behave as a single control, allowing the user to move their selection between the options before tabbing on to the next interactive block.

First, pull in `<RovingTabContainer>`:

```tsx
import React, { useState, forwardRef, HTMLAttributes } from 'react';
import { RovingTabContainer } from '@dimension/react';

// using forwardRef is just good practice.
const ToggleButtonsControl = forwardRef((props, ref) => {
  const [value, setValue] = useState('a');

  return (
    <RovingTabContainer value={value} onChange={setValue} ref={ref} {...props}>
      {/* TODO */}
    </RovingTabContainer>
  );
});
```

So we've got a basic container element now. If you want something other than a `<div>`, you can use the `component` prop to change the implementation. By using the `RovingTabContainer`, we've created a system which will detect any children which will participate in the roving tab behavior. But first, we need to bind those children using either the `RovingTabItem` component or the `useRovingTabItem` hook:

**Using the component**

```tsx
import React, { forwardRef } from 'react';
import { useRovingTabItem } from '@dimension/react';

const ToggleButton = forwardRef(({ value, ...rest }, ref) => (
  <RovingTabItem
    selectedProps={{ 'aria-checked': true }}
    value={value}
    ref={ref}
    {...rest}
  />
));
```

**Using the hook**

```tsx
import React, { forwardRef } from 'react';
import { useRovingTabItem } from '@dimension/react';

const ToggleButton = forwardRef(({ value, ...rest }, ref) => {
  const { props: tabItemProps } = useRovingTabItem({ value, ref });

  return <button {...rest} {...tabItemProps} />;
});
```

Note that our button also accepts a `value` prop. This will indicate what value this button represents in our control, so that when a user selects a button we will know what value the control now has.

Let's plug them in:

```tsx
import React, { useState, forwardRef, HTMLAttributes } from 'react';
import { RovingTabContainer } from '@dimension/react';

const ToggleButtonsControl = forwardRef((props, ref) => {
  const [value, setValue] = useState('a');

  return (
    <RovingTabContainer value={value} onChange={setValue} ref={ref} {...props}>
      <ToggleButton value="a">Option A</ToggleButton>
      <ToggleButton value="b">Option B</ToggleButton>
      <ToggleButton value="c">Option C</ToggleButton>
    </RovingTabContainer>
  );
});
```

That was easy! One important fact about `@dimension/react` is that you don't _have_ to nest the `ToggleButton`s directly below the `RovingTabContainer`, or even on the same DOM level as each other! For instance, this still works:

```tsx
import React, { useState, forwardRef, HTMLAttributes } from 'react';
import { RovingTabContainer } from '@dimension/react';

const ToggleButtonsControl = forwardRef((props, ref) => {
  const [value, setValue] = useState('a');

  return (
    <RovingTabContainer value={value} onChange={setValue} ref={ref} {...props}>
      <ToggleButton value="a">Option A</ToggleButton>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <ToggleButton value="b">Option B</ToggleButton>
        <ToggleButton value="c">Option C</ToggleButton>
      </div>
    </RovingTabContainer>
  );
});
```

That's the power of React context!
