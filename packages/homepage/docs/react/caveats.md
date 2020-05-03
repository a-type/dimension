# Caveats

The logic required to conveniently and intuitively support complicated selection navigation in multiple dimensions does introduce a few caveats which must be considered.

## 1. Performance impacts based on DOM complexity and DOM mutations

To achieve the maximum level of stability and predictability for the ordering of selectable items in complex DOM structures, this library relies on scanning the child DOM tree when elements are added, removed, or re-ordered within a `<RovingTabContainer>` or any component you attach to `useSelectionItemsContainer` of the Selection system. It doesn't scan the entire document, just the elements nested under either of these containers.

Avoid unnecessary DOM modifications within these containers, and try to simplify their DOM structure as much as possible. Try to place the containers as close to the bottom of the DOM tree as possible (don't wrap more components in your container than is necessary to include all item children).

## 2. Lack of virtualization support

At the moment, virtualization is not supported. While it may be theoretically possible to support, it hasn't made it on the roadmap yet and will be pretty complex to implement.

## 3. Requirements around manual coordinates

When DOM structure can't properly infer the correct selection structure, manually supplying item coordinates is required. For instance, using CSS Grid for a grid layout means that the content is visually represented as a 2D grid, but in DOM the items are all still direct siblings. In such cases, you will need to pass the `coordinate` option to the `useRovingTabItem` hook to indicate where in the 2D structure the item lies.
