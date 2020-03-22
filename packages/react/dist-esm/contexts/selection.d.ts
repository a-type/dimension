import React, { FC, Ref } from 'react';
export declare type SelectionContextValue = {
    onSelect: (value?: string) => any;
    goToNext: () => any;
    goToPrevious: () => any;
    goToNextOrthogonal: () => any;
    goToPreviousOrthogonal: () => any;
    goDown: () => any;
    goUp: () => any;
    selectedKey: string | null;
    activeKey: string | null;
    containerRef: Ref<any>;
    id: string;
    wrap: boolean;
};
declare const SelectionContext: React.Context<SelectionContextValue>;
export default SelectionContext;
export declare type SelectionProviderProps = {
    /**
     * Controls whether the selection should jump back to the first element when
     * the user reaches the last element.
     */
    noWrap?: boolean;
    /**
     * This is a performance optimization. If all the selectable items are direct
     * DOM descendants of the container element, you can enable "shallow" mode to
     * reduce the overhead of scanning the DOM for items.
     */
    shallow?: boolean;
    /**
     * If you are using virtualized items, you must provide the total number
     * of items here to ensure selection works as expected.
     */
    itemCount?: number;
    /**
     * Optionally provide a controlled value to the Selection system. The provided
     * value will be selected by default.
     */
    value?: string | null;
    /**
     * When the user selects an item, its provided value will be passed to this
     * callback.
     */
    onChange?: (value: string | null) => any;
    /**
     * Supply a unique ID for this selection system. This ID will be used as
     * a prefix for any auto-generated IDs to ensure that IDs are unique.
     * If not provided, a random one will be used.
     */
    id?: string;
    /**
     * If set to true, this will disable the default behavior of scrolling
     * to the active element when it changes.
     */
    disableScrollToActiveElement?: boolean;
};
/**
 * Creates a Selection system, which allows attaching interaction handlers to a
 * focusable item (like an `<input>`) which control the selection state of a
 * disconnected set of elements. Used for things like autocomplete inputs.
 */
export declare const SelectionProvider: FC<SelectionProviderProps>;
