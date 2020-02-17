import React, { forwardRef } from 'react';
import { useRow } from '../hooks/useRow';
import { OverridableProps } from '../types';

type RowProps = OverridableProps<{}, 'div'>;

export const Row = forwardRef<any, RowProps>(
  ({ component: CustomComponent = 'div', ...props }, ref) => {
    const { props: rowProps } = useRow();

    return <CustomComponent {...props} {...rowProps} ref={ref} />;
  },
);
