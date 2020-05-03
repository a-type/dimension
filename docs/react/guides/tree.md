# Toggle Buttons

You want to create a recursively nested set of interactive elements, possibly using `<ul>` and `<li>` elements, which behave as a single control, allowing the user to move their selection between sub-levels of structured tree contents before tabbing on to the next interactive block.

First, pull in `<RovingTabContainer>`:

```tsx
import React, { useState, forwardRef, HTMLAttributes } from 'react';
import { RovingTabContainer } from '@dimension/react';

// using forwardRef is just good practice.
const Tree = forwardRef((props, ref) => {
  const [value, setValue] = useState('one');

  // passing "ul" as the component implementation for better semantic
  // structure.
  return (
    <RovingTabContainer
      value={value}
      onChange={setValue}
      ref={ref}
      component="ul"
      {...props}
    >
      {/* TODO */}
    </RovingTabContainer>
  );
});
```

So we've got a basic container element now. We're also overriding the `component` with `ul` to change the semantic implementation. By using the `RovingTabContainer`, we've created a system which will detect any children which will participate in the roving tab behavior. But first, we need to bind those children using either the `RovingTabItem` component or the `useRovingTabItem` hook:

**Using the component**

```tsx
import React, { forwardRef } from 'react';
import { RovingTabItem, keyActionPresets } from '@dimension/react';

const TreeItem = forwardRef(({ value, label, children, ...rest }, ref) => (
  <RovingTabItem
    value={value}
    ref={ref}
    keyActions={keyActionPresets.hierarchical.vertical}
    {...rest}
  >
    {({ selected }) => (
      <>
        <div className={selected ? 'tree-label-selected' : ''}>{label}</div>
        {children && <ul>{children}</ul>}
      </>
    )}
  </RovingTabItem>
));
```

**Using the hook**

```tsx
import React, { forwardRef } from 'react';
import { useRovingTabItem, keyActionPresets } from '@dimension/react';

const TreeItem = forwardRef(({ value, label, children, ...rest }, ref) => {
  const { props: rovingTabProps, selected } = useRovingTabItem({
    value,
    ref,
    keyActions: keyActionPresets.hierarchical.vertical,
  });

  return (
    <li {...rest} {...rovingTabProps}>
      <div className={selected ? 'tree-label-selected' : ''}>{label}</div>
      {children && <ul>{children}</ul>}
    </li>
  );
});
```

Note that our tree item accepts a `value` prop. This will indicate what value this tree node represents, and will be reported by `onChange` in our Tree when the user selects a node.

We also pass `label` to indicate the visual labeling of the tree item. Doing this allows us to reserve the `children` of this component for recursive nesting. If the user supplies `children`, we can wrap them in a nested `ul` within our tree item component. This usage will be clearer below.

Let's plug them in:

```tsx
import React, { useState, forwardRef, HTMLAttributes } from 'react';
import { RovingTabContainer } from '@dimension/react';

const Tree = forwardRef((props, ref) => {
  const [value, setValue] = useState('one');

  return (
    <RovingTabContainer value={value} onChange={setValue} ref={ref} {...props}>
      <TreeItem value="one" label="One" />
      <TreeItem value="two" label="Two">
        <TreeItem value="two-a" label="Two A" />
        <TreeItem value="two-b" label="Two B" />
        <TreeItem value="two-c" label="Two C">
          <TreeItem value="two-c-i" label="Two C i" />
          <TreeItem value="two-c-ii" label="Two C ii" />
        </TreeItem>
      </TreeItem>
      <TreeItem value="three" label="Three" />
    </RovingTabContainer>
  );
});
```

That was easy! The magic is mostly invisible, but `@dimension/react` detects the nested structure of your items and automatically builds the navigation map for your content based on the underlying DOM structure.

One important fact about `@dimension/react` is that you don't _have_ to nest the `TreeItem`s directly below the `RovingTabContainer` or each other. For instance, this still works:

```tsx
import React, { useState, forwardRef, HTMLAttributes } from 'react';
import { RovingTabContainer } from '@dimension/react';

const ToggleButtonsControl = forwardRef((props, ref) => {
  const [value, setValue] = useState('a');

  return (
    <RovingTabContainer value={value} onChange={setValue} ref={ref} {...props}>
      <div style={{ backgroundColor: 'black' }}>
        <TreeItem value="one" label="One" />
        <TreeItem value="two" label="Two">
          <div className="some-tree-item-grouping">
            <TreeItem value="two-a" label="Two A" />
            <TreeItem value="two-b" label="Two B" />
            <TreeItem value="two-c" label="Two C">
              <TreeItem value="two-c-i" label="Two C i" />
              <TreeItem value="two-c-ii" label="Two C ii" />
            </TreeItem>
          </div>
        </TreeItem>
        <TreeItem value="three" label="Three" />
      </div>
    </RovingTabContainer>
  );
});
```

That's the power of React context! Feel free to get creative with your DOM structure, as long as your tree items are still appropriately nested in the configuration you desire.
