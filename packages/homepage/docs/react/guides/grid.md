# Grid

You want to create a 2-dimensional, grouped set of interactive elements (like `<button>`s) which behave as a single control, allowing the user to move their selection between the options, going in any of the 4 cardinal directions, before tabbing on to the next interactive block.

First, pull in `<RovingTabContainer>`:

```tsx
import React, { useState, forwardRef, HTMLAttributes } from 'react';
import { RovingTabContainer } from '@dimension/react';

// using forwardRef is just good practice.
const Grid = forwardRef((props, ref) => {
  const [value, setValue] = useState('a');

  return (
    <RovingTabContainer value={value} onChange={setValue} ref={ref} {...props}>
      {/* TODO */}
    </RovingTabContainer>
  );
});
```

So we've got a basic container element now. If you want something other than a `<div>`, you can use the `component` prop to change the implementation. By using the `RovingTabContainer`, we've created a system which will detect any children which will participate in the roving tab behavior. But first, we need to bind those children using either the `RovingTabItem` component, or the `useRovingTabItem` hook:

**Using the component**

```tsx
import React, { forwardRef } from 'react';
import { RovingTabItem, keyActionPresets } from '@dimension/react';

const GridItem = forwardRef(({ value, ...rest }, ref) => (
  <RovingTabItem
    component="button"
    value={value}
    ref={ref}
    keyActions={keyActionPresets.grid.horizontal}
    {...rest}
  />
));
```

**Using the hook**

```tsx
import React, { forwardRef } from 'react';
import { useRovingTabItem, keyActionPresets } from '@dimension/react';

const GridItem = forwardRef(({ value, ...rest }, ref) => {
  const { props: tabItemProps } = useRovingTabItem({
    value,
    ref,
    // required to get the right keyboard movement
    keyActions: keyActionPresets.grid.horizontal,
  });

  return <button {...rest} {...tabItemProps} />;
});
```

Note that our button also accepts a `value` prop. This will indicate what value this button represents in our control, so that when a user selects a button we will know what value the control now has.

We also must supply `keyActions` to `useRovingTabItem` to indicate the type of keyboard movement we want for the grid. The `grid.horizontal` preset will get us what we want - where "left" and "right" move horizontally in a row, and "up" and "down" switch between rows.

To create our 2d grid structure, we need to delineate rows for our items to sit in. There's currently two ways to do this: by wrapping them in Row elements (tagged in the roving tab system), or by specifying exact grid coordinates for each item. To keep things simpler, we'll use the Rows. Like the items, you can either use a `Row` component or `useRow` hook:

**Using the component**

```tsx
import React, { forwardRef } from 'react';
import { Row } from '@dimension/react';

// you could also just use Row directly without wrapping it in your own
// abstraction.
const GridRow = forwardRef((props, ref) => <Row component="div" {...props} />);
```

**Using the hook**

```tsx
import React, { forwardRef } from 'react';
import { useRow } from '@dimension/react';

const GridRow = forwardRef((props, ref) => {
  const { props: rowProps } = useRow();

  return <div {...props} {...rowProps} />;
});
```

Either version simply adds some basic props which the roving tab system needs to identify rows of items.

Now we can create rows of items in our grid:

```tsx
import React, { useState, forwardRef, HTMLAttributes } from 'react';
import { RovingTabContainer } from '@dimension/react';

const Grid = forwardRef((props, ref) => {
  const [value, setValue] = useState('a');

  return (
    <RovingTabContainer value={value} onChange={setValue} ref={ref} {...props}>
      <GridRow>
        <GridItem value="a">Option A</GridItem>
        <GridItem value="b">Option B</GridItem>
        <GridItem value="c">Option C</GridItem>
      </GridRow>
      <GridRow>
        <GridItem value="d">Option D</GridItem>
        <GridItem value="e">Option E</GridItem>
        <GridItem value="f">Option F</GridItem>
      </GridRow>
    </RovingTabContainer>
  );
});
```

That was easy! One important fact about `@dimension/react` is that you don't _have_ to nest the `GridRow`s directly below the `RovingTabContainer` or the `GridItem`s directly below the `GridRow`s. You have full flexibility in DOM nesting. For instance, this is valid:

```tsx
import React, { useState, forwardRef, HTMLAttributes } from 'react';
import { RovingTabContainer } from '@dimension/react';

const GridItemsControl = forwardRef((props, ref) => {
  const [value, setValue] = useState('a');

  return (
    <RovingTabContainer value={value} onChange={setValue} ref={ref} {...props}>
      <div style={{ position: 'fixed' }}>
        <GridRow>
          <GridItem value="a">Option A</GridItem>
          <GridItem value="b">Option B</GridItem>
          <GridItem value="c">Option C</GridItem>
        </GridRow>
        <div style={{ backgroundColor: 'black' }}>
          <GridRow>
            <GridItem value="d">Option D</GridItem>
            <GridItem value="e">Option E</GridItem>
            <GridItem value="f">Option F</GridItem>
          </GridRow>
          <GridRow>
            <GridItem value="g">Option G</GridItem>
            <GridItem value="h">Option H</GridItem>
            <GridItem value="i">Option I</GridItem>
          </GridRow>
        </div>
      </div>
    </RovingTabContainer>
  );
});
```

This system also works equally well with semantic table elements. You can utilize the `component` prop of `RovingTabContainer` to override its implementation with `table`, and then use `tr` for the rows and `td` for the items - and everything works as expected.
