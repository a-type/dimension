import React, {
  forwardRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import {
  SelectionFocusElement,
  SelectionItem,
  SelectionItemsContainer,
  SelectionProvider,
} from '@dimension/react';

import './Select.css';

const SelectInput = forwardRef((props: any, ref) => (
  <SelectionFocusElement
    {...props}
    ref={ref}
    className="Select-input"
    placeholder="Type..."
  />
));

const SelectOption = forwardRef((props: any, ref) => (
  <SelectionItem
    {...props}
    ref={ref}
    component="li"
    role="option"
    className="Select-option"
    value={props.value}
    activeProps={{
      className: 'Select-option active',
    }}
    selectedProps={{
      className: 'Select-option selected',
    }}
  />
));

const SelectOptions = forwardRef((props: any, ref) => (
  <SelectionItemsContainer
    {...props}
    ref={ref}
    role="listbox"
    className="Select-options"
    style={{
      position: 'absolute',
      height: props.open ? 150 : 0,
      padding: props.open ? '8px 2px' : '0px 0px',
      overflow: 'auto',
      transition: '0.2s ease-in height, padding',
    }}
  />
));

const defaultOptions = [
  {
    id: '1',
    name: 'DI',
  },
  {
    id: '2',
    name: 'ME',
  },
  {
    id: '3',
    name: 'NS',
  },
  {
    id: '4',
    name: 'IO',
  },
  {
    id: '5',
    name: 'N.',
  },
];

export const Select = () => {
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const [optionsVisible, setOptionsVisible] = useState(false);

  const handleInputChange = useCallback(ev => setInputValue(ev.target.value), [
    setInputValue,
  ]);

  const filteredOptions = useMemo(
    () =>
      defaultOptions.filter(opt =>
        opt.name.toLowerCase().includes(inputValue.toLowerCase()),
      ),
    [inputValue],
  );

  const handleValueChange = useCallback(newId => setValue(newId), [setValue]);

  useEffect(() => {
    setInputValue(defaultOptions.find(({ id }) => id === value)?.name ?? '');
  }, [value, setInputValue]);

  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDocumentClick = ev => {
      if (controlRef.current?.contains(ev.target)) {
        return;
      }

      setOptionsVisible(false);
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [controlRef, setOptionsVisible]);

  const handleInputFocus = useCallback(() => setOptionsVisible(true), [
    setOptionsVisible,
  ]);
  const handleInputBlur = useCallback(() => setOptionsVisible(false), [
    setOptionsVisible,
  ]);

  return (
    <SelectionProvider value={value} onChange={handleValueChange}>
      <div ref={controlRef} style={{ position: 'relative' }}>
        <SelectInput
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <SelectOptions open={optionsVisible}>
          {filteredOptions.map(({ id, name }) => (
            <SelectOption value={id}>{name}</SelectOption>
          ))}
        </SelectOptions>
      </div>
    </SelectionProvider>
  );
};
