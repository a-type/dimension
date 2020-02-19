import React, { forwardRef, ReactNode, FC } from 'react';
import {
  keyActionPresets,
  RovingTabContainer,
  RovingTabItem,
} from '@dimension/react';

import './Tree.css';

type TreeItemProps = {
  value: string;
  label: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
};

const TreeItem = forwardRef<HTMLLIElement, TreeItemProps>(
  ({ value, label, children, ...rest }, ref) => (
    <RovingTabItem
      className="Tree-item"
      component="li"
      value={value}
      keyActions={keyActionPresets.hierarchical.vertical}
      ref={ref}
      {...rest}
    >
      {({ selected, active, disabled }) => {
        let className = 'Tree-label';
        if (disabled) {
          className += ' disabled';
        }
        if (active) {
          className += ' active';
        }
        if (selected) {
          className += ' selected';
        }
        return (
          <>
            <div className={className}>{label}</div>
            {children && <ul className="Tree-subtree">{children}</ul>}
          </>
        );
      }}
    </RovingTabItem>
  ),
);

export const Tree: FC = () => {
  return (
    <RovingTabContainer component="ul" className="Tree">
      <TreeItem value="one" label="One" />
      <TreeItem value="two" label="Two">
        <TreeItem value="two-a" label="Two A" />
        <TreeItem value="two-b" label="Two B" />
        <TreeItem value="two-c" label="Two C">
          <TreeItem value="two-c-i" label="Two C i" />
          <TreeItem value="two-c-ii" label="Two C ii" />
        </TreeItem>
      </TreeItem>
      <TreeItem value="three" label="Three" />
    </RovingTabContainer>
  );
};
