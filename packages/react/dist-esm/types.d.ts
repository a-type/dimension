import { ComponentPropsWithRef, ElementType } from 'react';
export declare type OverridableProps<P, D extends ElementType> = P & (({
    component?: D;
} & ComponentPropsWithRef<D>) | {
    component: ElementType;
    [propType: string]: any;
});
export declare type GenericProps = {
    [prop: string]: any;
};
