# React Library API

## Components

### RovingTabContainer

Top-level context provider and logic layer for a group of `RovingTabItem`s.

#### Usage

Render it anywhere in the tree. It needs `RovingTabItem`s somewhere further down in the tree to manage in order to be useful.

#### Props

- `value` [`string | null`, optional]: Provide a controlled value to the Roving Tab system, forcing a particular item to be selected.
- `onChange` [`(value: string | null) => any`, optional]: Listen for changes to the selected value.
- `noWrap` [`boolean`, optional]: If provided `true`, disables wrapping from the last item back to the first, or vice versa.
- `disableScrollIntoView` [`boolean`, optional]: If provided `true`, will prevent the default behavior of scrolling the selected element into view in the browser window.
- `component` [`Component`, optional]: Changes the underlying component which will be rendered as an implementation of this item. [Read more](/react/overriding-components.md).

### SelectionProvider

Top-level context provider and logic layer for a Selection system.

#### Usage

Render it anywhere in the tree. It needs one `SelectionFocusElement` and one `SelectionItemsContainer` somewhere below it in the tree to function correctly.

#### Props

- `value` [`string | null`, optional]: Provide a controlled value to the Selection system, forcing a particular item to be selected.
- `onChange` [`(value: string | null) => any`, optional]: Listen for changes to the selected value.
- `id` [`string`, optional]: Provide a unique ID to the Selection system, and the generated id attributes for the components will be derived from it.
- `disableScrollToActiveElement` [`boolean`, optional]: Disables scrolling to the active element as the user moves their selection.
- `noWrap` [`boolean`, optional]: If provided `true`, disables wrapping from the last item back to the first, or vice versa.
- `component` [`Component`, optional]: Changes the underlying component which will be rendered as an implementation of this item. [Read more](/react/overriding-components.md).

### RovingTabItem

Represents an item which is a child of a larger focusable control. This child can receive DOM focus by 'passing it around' with its siblings using the 'roving tabindex' method.

#### Usage

Must be the child or grandchild of a `RovingTabContainer`.

#### Props

- `value` [`string`, optional]: The value represented by this item. When selected, the parent `RovingTabContainer`'s `onChange` will surface this value to you.
- `coordinate` [`number | [number, number]`, optional]: A 1-d or 2-d coordinate to be manually applied to this item. [Read more about manual coordinates.](/manual-coordinates.md)
- `keyActions` [[KeyActions](/core/api.md#KeyActions), optional]: Configured actions for keyboard events.
- `selectedProps` [`Record<string, any>`, optional]: Any props you want to apply to an item which is currently selected.
- `activeProps` [`Record<string, any>`, optional]: Any props you want to apply to an item which is currently active.
- `disabled` [`boolean`, optional]: Disables interaction or focus of this item.
- `component` [`Component`, optional]: Changes the underlying component which will be rendered as an implementation of this item. [Read more](/react/overriding-components.md).

### Row

Creates a row in a 2-d selection layout. Items within the row will be considered on the same 'plane' of selection, and moving cross-axis will attempt to move selection to the same index in an adjacent Row.

Rows can let you create 2-dimensionality without using [manual coordinates](/manual-coordinates.md).

#### Usage

No special usage constraints.

#### Props

- `component` [`Component`, optional]: Changes the underlying component which will be rendered as an implementation of this item. [Read more](/react/overriding-components.md).

### SelectionFocusElement

Represents the focus-able element in a Selection system. A Selection system needs one item to retain DOM focus, while keyboard controls move the visual selection between other disconnected elements.

#### Usage

Must be the child or grandchild of a `SelectionProvider`.

#### Props

- `keyActions` [[KeyActions](/core/api.md#KeyActions), optional]: Configured actions for keyboard events.
- `component` [`Component`, optional]: Changes the underlying component which will be rendered as an implementation of this item. [Read more](/react/overriding-components.md).

### SelectionItem

Represents an item which can be selected within a Selection system.

#### Usage

Must be the child or grandchild of a `SelectionItemsContainer`.

#### Props

- `value` [`string`, optional]: The value represented by this item. When selected, the parent `SelectionProvider`'s `onChange` will surface this value to you.
- `coordinate` [`number | [number, number]`, optional]: A 1-d or 2-d coordinate to be manually applied to this item. [Read more about manual coordinates.](/manual-coordinates.md)
- `selectedProps` [`Record<string, any>`, optional]: Any props you want to apply to an item which is currently selected.
- `activeProps` [`Record<string, any>`, optional]: Any props you want to apply to an item which is currently active.
- `disabled` [`boolean`, optional]: Disables interaction or focus of this item.
- `component` [`Component`, optional]: Changes the underlying component which will be rendered as an implementation of this item. [Read more](/react/overriding-components.md).

### SelectionItemsContainer

Creates a container in which you can render `SelectionItem`s. Usage of this container is required, but items can be placed at any level below it in the tree.

#### Usage

Must be the child or grandchild of a `SelectionProvider`.

#### Props

- `component` [`Component`, optional]: Changes the underlying component which will be rendered as an implementation of this item. [Read more](/react/overriding-components.md).

## Hooks

### useRovingTabItem

The guts of a RovingTabItem. Allows you to plug the core behavior into any component.

#### Options

The hook accepts a single object with the following properties:

- `value` [`string`, optional]: The value represented by this item. When selected, the parent `RovingTabContainer`'s `onChange` will surface this value to you.
- `coordinate` [`number | [number, number]`, optional]: A 1-d or 2-d coordinate to be manually applied to this item. [Read more about manual coordinates.](/manual-coordinates.md)
- `keyActions` [[KeyActions](/core/api.md#KeyActions), optional]: Configured actions for keyboard events.
- `selectedProps` [`Record<string, any>`, optional]: Any props you want to apply to an item which is currently selected.
- `activeProps` [`Record<string, any>`, optional]: Any props you want to apply to an item which is currently active.
- `disabled` [`boolean`, optional]: Disables interaction or focus of this item.
- `ref` [`Ref<Element>`, optional]: If you need ref access to your component, pass your ref into the hook using this property. It will be applied to the component after being merged with internal ref usages.

#### Returns

The hook returns an object with the following properties:

- `props` [`Object`]: You should pass these props to the component you render. The contents of the props are not disclosed as a reliable part of the API.
- `selected` [`boolean`]: Whether the item is currently selected.
- `active` [`boolean`]: Whether the item is currently active.
- `disabled` [`boolean`]: Whether the item is currently disabled.

### useRow

Creates the props which should be passed to any element you want to act as a row within a 2-d selection structure. See the `Row` component for more detail.

#### Options

The hook accepts no arguments.

#### Returns

The hook returns an object with the following properties:

- `props` [`Object`]: You should pass these props to the component you render. The contents of the props are not disclosed as a reliable part of the API.

### useSelectionFocusElement

The guts of a SelectionFocusElement. Allows you to plug the core behavior into any component.

#### Options

The hook accepts a single object with the following properties:

- `keyActions` [[KeyActions](/core/api.md#KeyActions), optional]: Configured actions for keyboard events.
- `onKeyDown` [`KeyboardEventHandler<any>`, optional]: If you rely on `onKeyDown` event behavior in your other component logic, you should pass the prop through this hook so the behavior can be merged with internal library behavior.
- `ref` [`Ref<Element>`, optional]: If you need ref access to your component, pass your ref into the hook using this property. It will be applied to the component after being merged with internal ref usages.
- `id` [`string`, optional]: Optionally override the element's id attribute.

#### Returns

The hook returns an object with the following properties:

- `props` [`Object`]: You should pass these props to the component you render. The contents of the props are not disclosed as a reliable part of the API.

### useSelectionItem

The guts of a SelectionItem. Allows you to plug the core behavior into any component.

#### Options

The hook accepts a single object with the following properties:

- `value` [`string`, optional]: The value represented by this item. When selected, the parent `SelectionProvider`'s `onChange` will surface this value to you.
- `coordinate` [`number | [number, number]`, optional]: A 1-d or 2-d coordinate to be manually applied to this item. [Read more about manual coordinates.](/manual-coordinates.md)
- `selectedProps` [`Record<string, any>`, optional]: Any props you want to apply to an item which is currently selected.
- `activeProps` [`Record<string, any>`, optional]: Any props you want to apply to an item which is currently active.
- `disabled` [`boolean`, optional]: Disables interaction or focus of this item.

#### Returns

The hook returns an object with the following properties:

- `props` [`Object`]: You should pass these props to the component you render. The contents of the props are not disclosed as a reliable part of the API.

### useSelectionItemsContainer

The guts of a SelectionItemsContainer. Allows you to plug the core behavior into any component.

#### Options

The hook accepts a single object with the following properties:

- `ref` [`Ref<Element>`, optional]: If you need ref access to your component, pass your ref into the hook using this property. It will be applied to the component after being merged with internal ref usages.

#### Returns

The hook returns an object with the following properties:

- `props` [`Object`]: You should pass these props to the component you render. The contents of the props are not disclosed as a reliable part of the API.
