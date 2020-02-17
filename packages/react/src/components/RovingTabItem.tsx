import React, { forwardRef, ReactNode } from 'react';
import { useRovingTabItem } from '../hooks/useRovingTabItem';
import { KeyActions } from '@dimension/core';
import { OverridableProps } from '../types';

type RovingTabItemRenderPropFn = (params: {
  selected: boolean;
  disabled: boolean;
  active: boolean;
}) => JSX.Element;
type RovingTabItemProps = OverridableProps<
  {
    value?: string;
    coordinate?: number | [number, number];
    keyActions?: KeyActions;
    selectedProps?: { [prop: string]: any };
    activeProps?: { [prop: string]: any };
    disabled?: boolean;
    children?: ReactNode | RovingTabItemRenderPropFn;
  },
  'button'
>;

export const RovingTabItem = forwardRef<any, RovingTabItemProps>(
  (
    {
      component: CustomComponent = 'button',
      value,
      coordinate,
      keyActions,
      selectedProps,
      activeProps,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const { props: containerProps, selected, active } = useRovingTabItem({
      value,
      ref,
      coordinate,
      keyActions,
      disabled,
      selectedProps,
      activeProps,
    });

    return (
      <CustomComponent {...props} {...containerProps} disabled={disabled}>
        {typeof children === 'function'
          ? (children as RovingTabItemRenderPropFn)({
              selected,
              active,
              disabled: !!disabled,
            })
          : children}
      </CustomComponent>
    );
  },
);
