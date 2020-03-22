export declare const useIsMounted: () => boolean;
export declare const usePrevious: <T>(val: T) => T;
export declare const useIdOrGenerated: (providedId?: string | undefined, idBase?: string | undefined) => string;
export declare function useControlled<T>({ controlled, default: defaultProp, name, onChange, }: {
    controlled?: T;
    default: T;
    name?: string;
    onChange?: (val: T) => void;
}): [T, (val: T) => void];
