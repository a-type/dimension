import { Ref, KeyboardEvent } from 'react';
import { KeyActions, DISABLED_ATTRIBUTE, KEY_DATA_ATTRIBUTE, VALUE_DATA_ATTRIBUTE, X_INDEX_DATA_ATTRIBUTE, Y_INDEX_DATA_ATTRIBUTE } from '@dimension/core';
import { GenericProps } from '../types';
export declare type UseRovingTabItemOptions<T extends HTMLElement = any> = {
    /**
     * Optionally supply a value represented by this
     * item. This value will be reported by the RovingTabProvider if the user selects the
     * item.
     */
    value?: string;
    /**
     * If you have an external ref you want to pass to the element
     * which will accept the props returned by this hook, pass it in here and it will
     * be merged with the hook's ref for you.
     */
    ref?: Ref<T>;
    /**
     * For advanced use cases, you can manually specify the ordering of this item. If
     * omitted, order will be inferred by DOM structure.
     */
    coordinate?: number | [number, number];
    /**
     * Determines the keyboard arrow directions which can be used
     * to move from this item to next or previous items. By default the user can use
     * up or left to go back, and down or right to go forward (flat.any preset)
     */
    keyActions?: KeyActions;
    /**
     * If disabled, this item will still exist within the selection navigation,
     * but the user won't be able to select it.
     */
    disabled?: boolean;
    /**
     * Props which will be supplied to the element when it is active -
     * i.e. when the user is highlighting it. By default no props
     * are provided for this state.
     */
    activeProps?: GenericProps;
    /**
     * Props which will be supplied to the element when it is selected -
     * i.e. when the current value of the control matches this option. By
     * default ARIA attributes will be supplied
     */
    selectedProps?: GenericProps;
};
/**
 * Returns props which can be passed to an element to include it in a roving
 * tab system. Components which use this hook must be children of a RovingTabProvider.
 *
 * @category Roving Tab
 */
export declare const useRovingTabItem: <T extends HTMLElement>(options?: UseRovingTabItemOptions<T>) => {
    props: {
        ref: (el: T) => void;
        onKeyDown: (event: KeyboardEvent<any>) => void;
        onClick: (ev: any) => void;
        [KEY_DATA_ATTRIBUTE]: string;
        [VALUE_DATA_ATTRIBUTE]: string | undefined;
        [X_INDEX_DATA_ATTRIBUTE]: number | undefined;
        [Y_INDEX_DATA_ATTRIBUTE]: number | undefined;
        [DISABLED_ATTRIBUTE]: boolean | undefined;
        tabIndex: number;
    };
    selected: boolean;
    active: boolean;
    disabled: boolean | undefined;
};
