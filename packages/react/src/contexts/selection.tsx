import React, {
  createContext,
  FC,
  useCallback,
  useEffect,
  Ref,
  useRef,
  useState,
} from 'react';
import { useIdOrGenerated, useControlled } from '../internal/hooks';
import {
  SelectionTrackingSystem,
  INITIAL_INDEX,
  SelectionTrackingChangeEvent,
  SelectionTrackingChangeEventType,
} from '@dimension/core';

export type SelectionContextValue = {
  onSelect: (value?: string) => any;
  goToNext: () => any;
  goToPrevious: () => any;
  goToNextOrthogonal: () => any;
  goToPreviousOrthogonal: () => any;
  goDown: () => any;
  goUp: () => any;
  selectedKey: string | null;
  activeKey: string | null;
  containerRef: Ref<any>;
  id: string;
  wrap: boolean;
};

const SelectionContext = createContext<SelectionContextValue>({
  onSelect: () => {},
  goToNext: () => {},
  goToPrevious: () => {},
  goDown: () => {},
  goUp: () => {},
  goToNextOrthogonal: () => {},
  goToPreviousOrthogonal: () => {},
  selectedKey: null,
  containerRef: null,
  activeKey: null,
  id: '',
  wrap: true,
});

export default SelectionContext;

export type SelectionProviderProps = {
  /**
   * Controls whether the selection should jump back to the first element when
   * the user reaches the last element.
   */
  noWrap?: boolean;
  /**
   * This is a performance optimization. If all the selectable items are direct
   * DOM descendants of the container element, you can enable "shallow" mode to
   * reduce the overhead of scanning the DOM for items.
   */
  shallow?: boolean;
  /**
   * If you are using virtualized items, you must provide the total number
   * of items here to ensure selection works as expected.
   */
  itemCount?: number;
  /**
   * Optionally provide a controlled value to the Selection system. The provided
   * value will be selected by default.
   */
  value?: string | null;
  /**
   * When the user selects an item, its provided value will be passed to this
   * callback.
   */
  onChange?: (value: string | null) => any;
  /**
   * Supply a unique ID for this selection system. This ID will be used as
   * a prefix for any auto-generated IDs to ensure that IDs are unique.
   * If not provided, a random one will be used.
   */
  id?: string;
};

/**
 * Creates a Selection system, which allows attaching interaction handlers to a
 * focusable item (like an `<input>`) which control the selection state of a
 * disconnected set of elements. Used for things like autocomplete inputs.
 */
export const SelectionProvider: FC<SelectionProviderProps> = props => {
  const {
    noWrap,
    children,
    onChange,
    shallow,
    itemCount,
    value,
    id: providedId,
    ...rest
  } = props;

  const id = useIdOrGenerated(providedId, 'select');

  const [selectedKey, setSelectedKey] = useControlled<string | null>({
    controlled: value,
    default: null,
    onChange,
  });
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const { current: selectionSystem } = useRef(
    new SelectionTrackingSystem({
      initialSelectedKey: selectedKey,
      // this is an expected behavior for select-style widgets
      activeOptionFollowsSelection: true,
    }),
  );

  useEffect(() => {
    // initialize selection system listener
    const onSelectionChange = (ev: SelectionTrackingChangeEvent) => {
      // update stored state
      setSelectedKey(ev.selectedKey);
      setActiveKey(ev.activeKey);
    };
    selectionSystem.on(
      SelectionTrackingChangeEventType,
      onSelectionChange as any,
    );
    return () =>
      void selectionSystem.off(
        SelectionTrackingChangeEventType,
        onSelectionChange as any,
      );
  }, [selectionSystem]);

  const containerRef = useCallback(
    (el: HTMLElement) => {
      selectionSystem.observe(el);
    },
    [selectionSystem],
  );

  // when the controlled value changes, update the selected index to match
  useEffect(() => {
    if (!selectedKey) {
      selectionSystem.setActiveIndex(INITIAL_INDEX);
      return;
    }
    const info = selectionSystem.findElementInfo(selectedKey);
    if (selectedKey && !info) {
      console.warn(
        `Value was updated to ${selectedKey}, but an element index could not be found`,
      );
      return;
    }
    selectionSystem.setActiveIndex(info.index);
  }, [selectedKey, selectionSystem]);

  /** either selects the provided value, or the current chosen value */
  const onSelect = useCallback(
    (key?: string) => {
      const resolvedValue = key || activeKey;
      if (!resolvedValue) {
        return; // TODO: verify assumption
      }
      selectionSystem.setSelectedKey(resolvedValue);
    },
    [activeKey, onChange],
  );

  const contextValue: SelectionContextValue = {
    activeKey,
    goToNext: selectionSystem.goToNext,
    goToPrevious: selectionSystem.goToPrevious,
    goDown: selectionSystem.goDown,
    goUp: selectionSystem.goUp,
    goToNextOrthogonal: selectionSystem.goToNextOrthogonal,
    goToPreviousOrthogonal: selectionSystem.goToPreviousOrthogonal,
    onSelect,
    containerRef,
    id,
    selectedKey,
    wrap: !noWrap,
  };

  return (
    <SelectionContext.Provider value={contextValue} {...rest}>
      {children}
    </SelectionContext.Provider>
  );
};
