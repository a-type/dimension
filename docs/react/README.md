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

## Next Steps

See the Guides section in the sidebar for some case studies.
