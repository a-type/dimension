import * as React from 'react';
import { SelectionFocusElement } from '../src/components/SelectionFocusElement';
import { SelectionItem } from '../src/components/SelectionItem';
import { SelectionItemsContainer } from '../src/components/SelectionItemsContainer';
import { SelectionProvider } from '../src/contexts/selection';
import { Manager, Reference, Popper } from 'react-popper';

export default {
  title: 'Autocomplete',
};

const SelectInput = React.forwardRef<any, any>((props, ref) => (
  <SelectionFocusElement
    {...props}
    ref={ref}
    component="input"
    placeholder="Type something..."
  />
));

const SelectOption = React.forwardRef<
  any,
  { value: string; children: React.ReactNode }
>(({ value, ...props }, ref) => (
  <SelectionItem
    {...props}
    component="li"
    role="option"
    value={value}
    ref={ref}
    disabled={value === '5'}
    className="select-option"
    activeProps={{
      className: 'selection-option generic-active',
      style: { backgroundColor: 'lightblue' },
    }}
    selectedProps={{ style: { backgroundColor: 'lightgray' } }}
  />
));

const SelectOptions = React.forwardRef<
  any,
  { children: React.ReactNode; className?: string; style?: React.CSSProperties }
>((props, ref) => (
  <SelectionItemsContainer
    role="listbox"
    {...props}
    style={{ ...props.style, width: 300 }}
    ref={ref}
  />
));

const defaultOptions = [
  {
    id: '1',
    name: 'IN',
  },
  {
    id: '2',
    name: 'TE',
  },
  {
    id: '3',
    name: 'RR',
  },
  {
    id: '4',
    name: 'EA',
  },
  {
    id: '5',
    name: 'CT',
  },
  {
    id: '6',
    name: 'IV',
  },
  {
    id: '7',
    name: 'E.',
  },
];

export const Select = () => {
  const [value, setValue] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [options, setOptions] = React.useState([...defaultOptions]);
  const [popperOpen, setPopperOpen] = React.useState(false);

  // update the input value when the user types
  const handleInputChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(ev.target.value);
    },
    [setInputValue],
  );

  // filter available options by the input value
  const filteredOptions = React.useMemo(
    () =>
      options.filter(opt =>
        opt.name.toLowerCase().includes(inputValue?.toLowerCase() ?? ''),
      ),
    [inputValue, options],
  );

  // respond to user value selection. this example supports custom values,
  // which is most of the logic here.
  const handleValueChange = React.useCallback(
    (newValue: string | null) => {
      // using a static "create" value is one way to allow custom entries
      // not included in the suggestions list.
      if (newValue === 'create') {
        // hypothetically, you'd want to call some API or something in a real app.
        // for this simple example, we just push the new option onto our list
        const newId = `${Math.floor(Math.random() * 1000000)}`;
        setOptions(existing => [
          ...existing,
          {
            id: newId,
            name: inputValue,
          },
        ]);
        setValue(newId);
      } else {
        setValue(newValue);
      }
      setPopperOpen(false);
    },
    [setValue, inputValue, setOptions, setPopperOpen],
  );

  // when the selected value changes, populate it into the input
  React.useEffect(() => {
    setInputValue(options.find(({ id }) => id === value)?.name ?? '');
  }, [value, setInputValue]);

  // handle clicking outside, using ref propagation through the popper
  // components, and eventually down to the underlying DOM elements.
  const inputRef = React.useRef<HTMLInputElement>(null);
  const popperRef = React.useRef<HTMLElement>(null);
  // this does the click-outside magic.
  React.useEffect(() => {
    const handleDocumentClick = (ev: MouseEvent) => {
      // if the click was inside the input or the popper, exit early
      if (
        (inputRef.current &&
          inputRef.current.contains(ev.target as HTMLElement)) ||
        (popperRef.current &&
          popperRef.current.contains(ev.target as HTMLElement))
      ) {
        return;
      }
      // close the popper
      setPopperOpen(false);
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [inputRef, popperRef, setPopperOpen]);

  // open the popper when the input gains focus
  const handleInputFocus = React.useCallback(
    (ev: React.FocusEvent) => {
      setPopperOpen(true);
    },
    [setPopperOpen],
  );
  // close the popper when the input loses focus
  const handleInputBlur = React.useCallback(
    (ev: React.FocusEvent) => {
      setPopperOpen(false);
    },
    [setPopperOpen],
  );

  return (
    <SelectionProvider value={value} onChange={handleValueChange}>
      {/*
      // @ts-ignore */}
      <Manager>
        {/*
        // @ts-ignore */}
        <Reference innerRef={inputRef}>
          {/*
          // @ts-ignore */}
          {({ ref }) => (
            <SelectInput
              ref={ref}
              onChange={handleInputChange}
              value={inputValue}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
            />
          )}
        </Reference>
        {true && (
          // @ts-ignore
          <Popper placement="bottom" innerRef={popperRef}>
            {/*
            // @ts-ignore */}
            {({ ref, style, placement }) => (
              <SelectOptions
                className="popper"
                ref={ref}
                style={style}
                data-placement={placement}
              >
                {filteredOptions.map(opt => (
                  <SelectOption key={opt.id} value={opt.id}>
                    {opt.name}
                  </SelectOption>
                ))}
                {filteredOptions.length === 0 && (
                  <SelectOption value="create">{inputValue}</SelectOption>
                )}
              </SelectOptions>
            )}
          </Popper>
        )}
      </Manager>
    </SelectionProvider>
  );
};
