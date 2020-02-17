import React, { HTMLAttributes, forwardRef } from 'react';
import { Row } from '../src/components/Row';
import { RovingTabItem } from '../src/components/RovingTabItem';
import {
  RovingTabContainer,
  RovingTabContainerProps,
} from '../src/contexts/rovingTab';
import { keyActionPresets } from '@dimension/core';

export default {
  title: 'Flexbox Grid',
};

const GridRow = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  (props, ref) => (
    <Row
      className="flex-grid-row"
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
      ref={ref}
      {...props}
    />
  ),
);

const GridItem = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement> & { value: string }
>(({ value, ...rest }, ref) => (
  <RovingTabItem
    className="flex-grid-item"
    activeProps={{ style: { backgroundColor: 'lightblue', flex: '1 0 0' } }}
    selectedProps={{ style: { backgroundColor: 'white', flex: '1 0 0' } }}
    style={{ flex: '1 0 0' }}
    value={value}
    ref={ref}
    keyActions={keyActionPresets.grid.horizontal}
    disabled={value === '10'}
    {...rest}
  />
));

const Grid = forwardRef<HTMLDivElement, RovingTabContainerProps>(
  (props, ref) => {
    return <RovingTabContainer id="flex-grid-demo" ref={ref} {...props} />;
  },
);

export const FlexboxGrid = () => {
  return (
    <Grid
      className="flex-grid"
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {[0, 1, 2, 3].map(rowIdx => (
        <GridRow key={rowIdx}>
          {[0, 1, 2, 3].map(itemIdx => (
            <GridItem key={itemIdx} value={`${rowIdx * 4 + itemIdx}`}>
              Item {rowIdx * 4 + itemIdx}
            </GridItem>
          ))}
        </GridRow>
      ))}
    </Grid>
  );
};
