import React, { forwardRef } from 'react';
import { useSelectionItemsContainer } from '../hooks/useSelectionItemsContainer';
import { OverridableProps } from '../types';

export type SelectionItemsContainerProps = OverridableProps<{}, 'ul'>;

export const SelectionItemsContainer = forwardRef<
  any,
  SelectionItemsContainerProps
>(({ component: CustomComponent = 'ul', ...props }, ref) => {
  const { props: containerProps } = useSelectionItemsContainer({
    ref,
  });

  return <CustomComponent {...props} {...containerProps} />;
});
