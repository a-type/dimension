import React, { FC, useState } from 'react';
import { RovingTabContainer, RovingTabItem } from '@dimension/react';
import './Logo.css';

const size = 9;

const toKey = (coordinate: [number, number, number]) =>
  JSON.stringify(coordinate);

const LogoNode: FC<{ coordinate: [number, number, number] }> = ({
  coordinate,
  children,
}) => (
  <RovingTabItem
    value={toKey(coordinate)}
    className="logo-node"
    selectedProps={{
      className: 'logo-node selected',
    }}
    coordinate={[coordinate[0], coordinate[1]]}
  >
    {/* recursion!!! ahh!! */}
    {children ||
      (coordinate[2] < size ? (
        <LogoNode
          coordinate={[coordinate[0], coordinate[1], coordinate[2] + 1]}
        />
      ) : null)}
  </RovingTabItem>
);

// const recursivelyRenderNodes = (x: number, y: number, z: number) => {
//   if (level === size) return null;
//   return <LogoNode coordinate={[x, y, z]}>{recursivelyRenderNodes()}
// }

export const Logo: FC = () => {
  const [selected, setSelected] = useState<string | null>(toKey([0, 0, 0]));

  return (
    <RovingTabContainer
      className="logo"
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${size}, 1fr)`,
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gap: 16,
      }}
    >
      {new Array(size)
        .fill(null)
        .map((_, x) =>
          new Array(size)
            .fill(null)
            .map((__, y) => <LogoNode coordinate={[x, y, 0]} />),
        )}
    </RovingTabContainer>
  );
};
