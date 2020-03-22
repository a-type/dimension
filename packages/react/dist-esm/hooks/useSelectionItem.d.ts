import { DISABLED_ATTRIBUTE, KEY_DATA_ATTRIBUTE, X_INDEX_DATA_ATTRIBUTE, Y_INDEX_DATA_ATTRIBUTE } from '@dimension/core';
import { GenericProps } from '../types';
export declare type SelectionItemOptions = {
    /**
     * Optionally supply a value represented by this
     * item. This value will be reported by the Selection system if the user selects the
     * item.
     */
    value?: string;
    /**
     * For advanced use cases, you can manually specify the ordering of this item. If
     * omitted, order will be inferred by DOM structure.
     */
    coordinate?: number | [number, number];
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
export declare const useSelectionItem: ({ value, coordinate, disabled, selectedProps, activeProps, }: SelectionItemOptions) => {
    props: {
        [KEY_DATA_ATTRIBUTE]: string;
        [X_INDEX_DATA_ATTRIBUTE]: number | undefined;
        [Y_INDEX_DATA_ATTRIBUTE]: number | undefined;
        [DISABLED_ATTRIBUTE]: boolean | undefined;
        onClick: () => void;
        id: string;
    };
    active: boolean;
    selected: boolean;
    disabled: boolean | undefined;
};
