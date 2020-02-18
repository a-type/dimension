# @dimension/react

The React bindings for the Dimension DOM keyboard selection system.


## Getting Started

### Concepts

To start using `@dimension/react`, there are a few basic concepts to go over:

#### Selection vs. Roving TabIndex

This library powers two similar, but distinctive interaction patterns:

1. **Selection**: Selection is a pattern where the user focuses a single element (usually a text input), and the focus remains on that element while they select between multiple options presented in a separate view. The most common version of this is a Select or Autocomplete field.
2. **Roving TabIndex**: Roving TabIndex is a technique used to move "focusability" between multiple related elements. When the user first tabs into the control, their focus will be applied to the current active element. As the user moves their selection, the actual DOM focus will follow the movement. The most common version of this is a Radio Group or Toggle Buttons.

#### Active vs. Selected

In either interaction pattern, we have a group of "options" which the user can navigate between. Each of these options can have one or both of the following states: `active` and `selected`.

`active` represents the "highlighted" value. The active state doesn't imply that the active item is the actual value of the parent control or widget. It simply means that the user has moved their active focus to that item. Commonly referred to as "highlighted."

`selected` represents the actual real value of the control or widget, regardless of where the user's active cursor is. Selected items often have a distinct visual state that is more subdued than the active item, so that the user knows what the current value is, but isn't distracted from their current focus position.

### Library Usage Patterns

This library exposes two ways to use its tools: standard components and hooks.

The basic components will render an actual DOM element. For instance, by default, the `SelectionFocusElement` component renders an `<input>`. You can control the actual rendered element by supplying a `component` prop to override the internal implementation. Beyond that, these components take props which roughly align to the options provided to the hooks. The `*Item` components also have render-prop variations which allow access to the `active` and `selected` states.

The hooks are a stylistic convenience provided to those who would rather have full control over their components. The hooks will generally return an object with a `props` key which you should spread to your element. Some hooks also return additional info, like `active` and `selected` for `use*Item` hooks.

Since this library uses Context to power a lot of its magic, you can't just use hooks. You will need to make use at least of the `SelectionProvider` or `RovingTabContainer` components as context providers.

### Guides

That covers the basic concepts.

The guides below will illustrate some common use cases:

### Select / Autocomplete / Combo Box

`@dimension/react` can power Select-style components, giving you flexibility on DOM structure and implementation details.

**See [the Select guide](./guides/select.md) to get started.**

### Toggle Buttons (1-dimensional roving tabindex)

Roving tabindex is a low-level technique to move the user's tab position between a grouped set of elements using the keyboard. Whenever focus leaves the group and returns to it, the selected element will still be where the user left it. This is great for constructs like Toggle Buttons, where selection is exclusive and all the buttons should be treated as one focusable widget.

**See [the Toggle Buttons guide](./guides/toggle-buttons.md) to get started**

### Tree (nested roving tabindex)

Recursive nesting structures are simple to achieve, by nesting roving tabindex items and specifying which keyboard interactions the user will utilize to navigate the structure.

**See [the Tree guide](./guides/tree.md) to get started**

### Grid (2-dimensional roving tabindex)

Grids are 2-dimensional navigation structures, where the user can use arrow keys to move up, down, left or right. A common type of navigable grid is a calendar control.

**See [the Grid guide](./guides/grid.md) to get started**

## Caveats

The logic required to conveniently and intuitively support complicated selection navigation in multiple dimensions does introduce a few caveats which must be considered.

### 1. Performance impacts based on DOM complexity and DOM mutations

To achieve the maximum level of stability and predictability for the ordering of selectable items in complex DOM structures, this library relies on scanning the child DOM tree when elements are added, removed, or re-ordered within a `<RovingTabContainer>` or any component you attach to `useSelectionItemsContainer` of the Selection system. It doesn't scan the entire document, just the elements nested under either of these containers.

Avoid unnecessary DOM modifications within these containers, and try to simplify their DOM structure as much as possible. Try to place the containers as close to the bottom of the DOM tree as possible (don't wrap more components in your container than is necessary to include all item children).

### 2. Lack of virtualization support

At the moment, virtualization is not supported. While it may be theoretically possible to support, it hasn't made it on the roadmap yet and will be pretty complex to implement.

### 3. Requirements around manual coordinates

When DOM structure can't properly infer the correct selection structure, manually supplying item coordinates is required. For instance, using CSS Grid for a grid layout means that the content is visually represented as a 2D grid, but in DOM the items are all still direct siblings. In such cases, you will need to pass the `coordinate` option to the `useRovingTabItem` hook to indicate where in the 2D structure the item lies.
