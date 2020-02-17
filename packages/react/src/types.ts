import { ComponentPropsWithRef, ElementType } from 'react';

// this is not as robust a solution as things like Material-UI,
// but it's the only thing I've tried that 'works' so far.
export type OverridableProps<P, D extends ElementType> = P &
  (
    | ({
        component?: D;
      } & ComponentPropsWithRef<D>)
    | {
        component: ElementType;
        [propType: string]: any;
      }
  );

export type GenericProps = { [prop: string]: any };
