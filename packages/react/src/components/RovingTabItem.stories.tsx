import React, { useState } from 'react';
import { RovingTabItem } from './RovingTabItem';
import { RovingTabContainer } from '../contexts/rovingTab';

export default {
  title: 'RovingTabItem',
  component: RovingTabItem,
};

const ToggleButton = ({ value }: { value: string }) => (
  <RovingTabItem component="button" value={value} disabled={value === 'io'}>
    {({ active, selected, disabled }) => (
      <span>
        {selected && '*'}
        {value}
      </span>
    )}
  </RovingTabItem>
);

export const ToggleButtons = () => {
  const [value, setValue] = useState<string | null>('di');

  return (
    <RovingTabContainer
      value={value}
      onChange={setValue}
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <ToggleButton value="di" />
      <ToggleButton value="me" />
      <ToggleButton value="ns" />
      <ToggleButton value="io" />
      <ToggleButton value="n." />
    </RovingTabContainer>
  );
};
