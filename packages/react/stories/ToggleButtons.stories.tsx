import React, { useState } from 'react';
import { RovingTabItem } from '../src/components/RovingTabItem';
import { RovingTabContainer } from '../src/contexts/rovingTab';

export default {
  title: 'Toggle Buttons',
};

const ToggleButton = ({ value }: { value: string }) => (
  <RovingTabItem component="button" value={value} disabled={value === 'io'}>
    {({ selected }) => (
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
