import React, { forwardRef, ReactNode } from 'react';
import { useSelectionItem } from '../hooks/useSelectionItem';
import { OverridableProps } from '../types';

type SelectionItemRenderPropFn = (params: {
  selected: boolean;
  disabled: boolean;
  active: boolean;
}) => JSX.Element;

export type SelectionItemProps = OverridableProps<
  {
    value?: string;
    selectedProps?: { [prop: string]: any };
    activeProps?: { [prop: string]: any };
    disabled?: boolean;
    coordinate?: number | [number, number];
    children?: ReactNode | SelectionItemRenderPropFn;
  },
  'li'
>;

export const SelectionItem = forwardRef<any, SelectionItemProps>(
  (
    {
      component: CustomComponent = 'li',
      value,
      selectedProps,
      activeProps,
      children,
      disabled,
      coordinate,
      ...props
    },
    ref,
  ) => {
    const { props: containerProps, selected, active } = useSelectionItem({
      value,
      disabled,
      coordinate,
      selectedProps,
      activeProps,
    });

    return (
      <CustomComponent
        ref={ref}
        {...props}
        {...containerProps}
        disabled={disabled}
      >
        {typeof children === 'function'
          ? (children as SelectionItemRenderPropFn)({
              selected,
              active,
              disabled: !!disabled,
            })
          : children}
      </CustomComponent>
    );
  },
);
