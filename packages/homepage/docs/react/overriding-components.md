# Overriding Components

Every component in the React `dimension` bindings is 'overridable' - meaning that if you pass a custom component to the `component` prop, it will try to render with your component instead of the default element type.

```tsx
<RovingTabItem component="div" value="foo" />
<SelectionFocusElement component={MuiOutlinedInput} />
```

I've made a best-effort attempt at making this behavior TypeScript compatible, adapting the same technique used in Material-UI. But my efforts seem to not always yield great results. If this is an issue for your implementation, I'd recommend you try using the hooks directly instead. Each of the components is really just a thin wrapper for the hook functionality.
