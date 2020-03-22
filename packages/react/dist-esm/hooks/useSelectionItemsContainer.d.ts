import { Ref } from 'react';
export declare type UseSelectionItemsContainerOptions = {
    ref?: Ref<any>;
};
export declare const useSelectionItemsContainer: (options: UseSelectionItemsContainerOptions) => {
    props: {
        ref: (el: any) => void;
        id: string;
        'aria-activedescendant': string | undefined;
    };
};
