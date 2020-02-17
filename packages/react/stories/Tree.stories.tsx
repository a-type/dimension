import React, { forwardRef, ReactNode, FC } from 'react';
import { RovingTabItem } from '../src/components/RovingTabItem';
import { RovingTabContainer } from '../src/contexts/rovingTab';
import { keyActionPresets } from '@dimension/core';

export default {
  title: 'Tree',
};

type TreeItemProps = {
  value: string;
  label: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
};

const TreeItem = forwardRef<HTMLLIElement, TreeItemProps>(
  ({ value, label, children, ...rest }, ref) => (
    <RovingTabItem
      component="li"
      value={value}
      keyActions={keyActionPresets.hierarchical.vertical}
      ref={ref}
      {...rest}
    >
      {({ selected, active, disabled }) => {
        const style = disabled
          ? { opacity: 0.2 }
          : active
          ? { backgroundColor: 'lightblue' }
          : selected
          ? { backgroundColor: 'lightgray' }
          : {};
        return (
          <>
            <div style={style}>{label}</div>
            {children && <ul>{children}</ul>}
          </>
        );
      }}
    </RovingTabItem>
  ),
);

type TreeProps = {
  id?: string;
};

const Tree: FC<TreeProps> = ({ children, id }) => {
  return (
    <RovingTabContainer id={id}>
      <ul>{children}</ul>
    </RovingTabContainer>
  );
};

export const TreeDemo: FC = () => {
  return (
    <Tree id="tree-demo">
      <TreeItem value="one" label="One" />
      <TreeItem value="two" label="Two">
        <TreeItem value="two-a" label="Two A" />
        <TreeItem value="two-b" label="Two B" disabled />
        <TreeItem value="two-c" label="Two C">
          <TreeItem value="two-c-i" label="Two C i" disabled />
          <TreeItem value="two-c-ii" label="Two C ii" />
        </TreeItem>
      </TreeItem>
      <TreeItem value="three" label="Three" />
    </Tree>
  );
};
