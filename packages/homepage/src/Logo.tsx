import React, { FC, useState } from 'react';
import {
  RovingTabContainer,
  RovingTabItem,
  keyActionPresets,
} from '@dimension/react';
import './Logo.css';

const size = 5;

type Coordinate = [number, number];

const toKey = (coordinate: Coordinate) => JSON.stringify(coordinate);

const LogoNode: FC<{ coordinate: [number, number] }> = ({
  coordinate,
  children,
}) => (
  <RovingTabItem
    value={toKey(coordinate)}
    className="logo-node"
    component="div"
    selectedProps={{
      className: 'logo-node selected',
    }}
    coordinate={[coordinate[0], coordinate[1]]}
    keyActions={keyActionPresets.grid.horizontal}
  ></RovingTabItem>
);

export const Logo: FC = () => {
  return (
    <RovingTabContainer
      className="logo"
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${size}, 1fr)`,
        gridTemplateColumns: `repeat(${size}, 1fr)`,
      }}
    >
      {new Array(size)
        .fill(null)
        .map((_, y) =>
          new Array(size)
            .fill(null)
            .map((__, x) => (
              <LogoNode key={toKey([x, y])} coordinate={[x, y]} />
            )),
        )}
    </RovingTabContainer>
  );
};
