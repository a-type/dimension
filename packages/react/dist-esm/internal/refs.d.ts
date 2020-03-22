import React from 'react';
export declare const useRefOrProvided: <T extends any>(providedRef: ((instance: T | null) => void) | React.RefObject<T> | null | undefined) => React.Ref<T>;
export declare const assignRef: <T>(ref: React.Ref<T>, el: T) => void;
export declare const useCombinedRefs: <T>(...refs: (((instance: T | null) => void) | React.RefObject<T> | null | undefined)[]) => (el: T) => void;
