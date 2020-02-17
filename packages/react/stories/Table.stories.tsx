import React, { HTMLAttributes, forwardRef } from 'react';
import { Row } from '../src/components/Row';
import { RovingTabItem } from '../src/components/RovingTabItem';
import {
  RovingTabContainer,
  RovingTabContainerProps,
} from '../src/contexts/rovingTab';
import { keyActionPresets } from '@dimension/core';

export default {
  title: 'Table',
};

const TableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>((props, ref) => {
  return <Row className="table-row" component="tr" {...props} ref={ref} />;
});

const TableCell = forwardRef<
  HTMLTableDataCellElement,
  HTMLAttributes<HTMLTableDataCellElement> & { value: string }
>(({ value, ...rest }, ref) => (
  <RovingTabItem
    component="td"
    className="table-cell"
    {...rest}
    value={value}
    ref={ref}
    keyActions={keyActionPresets.grid.horizontal}
    activeProps={{ style: { backgroundColor: 'lightblue' } }}
    selectedProps={{ style: { border: '1px solid red' } }}
  />
));

const Table = forwardRef<HTMLTableElement, RovingTabContainerProps>(
  (props, ref) => {
    return (
      <RovingTabContainer
        component="table"
        id="table-demo"
        ref={ref}
        {...props}
      />
    );
  },
);

export const TableDemo = () => {
  return (
    <Table className="table">
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
          <th>Column 3</th>
          <th>Column 4</th>
        </tr>
      </thead>
      <tbody>
        {[0, 1, 2, 3].map(rowIdx => (
          <TableRow key={rowIdx}>
            {[0, 1, 2, 3].map(itemIdx => (
              <TableCell key={itemIdx} value={`${rowIdx * 4 + itemIdx}`}>
                Item {rowIdx * 4 + itemIdx}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
};
