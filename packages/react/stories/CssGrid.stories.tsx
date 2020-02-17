import React, {
  useState,
  forwardRef,
  HTMLAttributes,
  useMemo,
  ReactNode,
  FC,
} from 'react';
import { RovingTabItem } from '../src/components/RovingTabItem';
import {
  RovingTabContainer,
  RovingTabContainerProps,
} from '../src/contexts/rovingTab';
import { keyActionPresets } from '@dimension/core';

export default {
  title: 'CSS Grid',
  component: RovingTabItem,
};

const GridItem = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement> & {
    value: string;
    x: number;
    y: number;
  }
>(({ value, x, y, ...rest }, ref) => {
  const coordinate = useMemo<[number, number]>(() => [x, y], [x, y]);

  return (
    <RovingTabItem
      className="grid-item"
      {...rest}
      ref={ref}
      coordinate={coordinate}
      value={value}
      disabled={value === '5'}
      keyActions={keyActionPresets.grid.horizontal}
      activeProps={{
        className: 'grid-item generic-active',
        style: { backgroundColor: 'lightblue' },
      }}
      selectedProps={{ style: { backgroundColor: 'white' } }}
    />
  );
});

const Grid = forwardRef<HTMLDivElement, RovingTabContainerProps>(
  (props, ref) => {
    return <RovingTabContainer id="grid-demo" ref={ref} {...props} />;
  },
);

export const CSSGrid = () => {
  return (
    <Grid
      className="grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: '8px',
      }}
    >
      {[
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
      ].map((row, y) =>
        row.map((value, x) => (
          <GridItem key={value} value={`${value}`} x={x} y={y}>
            Item {value}
          </GridItem>
        )),
      )}
    </Grid>
  );
};
