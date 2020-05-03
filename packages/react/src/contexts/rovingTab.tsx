import React, {
  createContext,
  useCallback,
  useEffect,
  forwardRef,
  useRef,
  useState,
} from 'react';
import {
  SelectionTrackingSystem,
  SelectionTrackingChangeEvent,
  SelectionTrackingChangeEventType,
  INITIAL_INDEX,
} from '@dimension/core';
import { useIdOrGenerated, useControlled } from '../internal/hooks';
import { useCombinedRefs } from '../internal/refs';
import { OverridableProps } from '../types';

export type RovingTabContextValue = {
  onSelect: (key: string, value?: any) => any;
  goToNext: () => any;
  goToPrevious: () => any;
  goToNextOrthogonal: () => any;
  goToPreviousOrthogonal: () => any;
  goUp: () => any;
  goDown: () => any;
  activeKey: string | null;
  selectedKey: string | null;
  id: string | null;
  wrap: boolean;
};

const RovingTabContext = createContext<RovingTabContextValue>({
  onSelect: () => {},
  goToNext: () => {},
  goToPrevious: () => {},
  goToNextOrthogonal: () => {},
  goToPreviousOrthogonal: () => {},
  goUp: () => {},
  goDown: () => {},
  activeKey: null,
  selectedKey: null,
  id: null,
  wrap: true,
});

export default RovingTabContext;

export type RovingTabContainerProps = OverridableProps<
  {
    noWrap?: boolean;
    value?: string | null;
    onChange?: (value: string | null) => any;
    /**
     * Disables the default behavior to scroll the selected element
     * into view
     */
    disableScrollIntoView?: boolean;
  },
  'div'
>;

export const RovingTabContainer = forwardRef<any, RovingTabContainerProps>(
  (
    {
      noWrap,
      children,
      onChange,
      value,
      component: CustomComponent = 'div',
      disableScrollIntoView,
      ...rest
    },
    ref,
  ) => {
    const id = useIdOrGenerated(rest.id);

    const [selectedKey, setSelectedKey] = useControlled<string | null>({
      controlled: value,
      default: null,
      onChange,
    });
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const { current: selectionSystem } = useRef(
      new SelectionTrackingSystem({
        initialSelectedKey: selectedKey,
      }),
    );

    useEffect(() => {
      // initialize selection system listener
      const onSelectionChange = (ev: SelectionTrackingChangeEvent) => {
        // for non-passive changes, focus the new active element
        if (!ev.passive) {
          ev.activeElement?.focus();
        }

        // update stored state
        setSelectedKey(ev.selectedKey);
        setActiveKey(ev.activeKey);
        if (!disableScrollIntoView) {
          ev.activeElement?.scrollIntoView({
            behavior: 'smooth',
          });
        }
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
    }, [selectionSystem, disableScrollIntoView]);

    // ref to the top level container element
    const containerRef = useCallback(
      (el: HTMLElement | null) => {
        selectionSystem.observe(el);
      },
      [selectionSystem],
    );

    // combined with user ref, if provided
    const finalRef = useCombinedRefs(containerRef, ref);

    useEffect(() => {
      if (!selectedKey) {
        selectionSystem.setActiveIndex(INITIAL_INDEX);
        return;
      }
      const info = selectionSystem.findElementInfo(selectedKey);
      if (!info) {
        console.warn(
          `Value of roving tab group ${id} was updated to ${selectedKey}, but no element index was found`,
        );
        return;
      }

      // update selection state, but don't focus the element
      selectionSystem.setActiveIndex(info.index || []);
    }, [selectedKey, selectionSystem]);

    // when the user selects an item, force update the selected index
    // TODO: move this behavior to a focus handler in the hook?
    const onSelect = useCallback(
      (key: string) => {
        const info = selectionSystem.findElementInfo(key);
        if (!info) {
          console.warn(
            `Roving tab group ${id} selected ${key}, but the associated element wasn't found in the element map`,
          );
          return;
        }

        // update selection state and focus new element
        selectionSystem.setSelectedKey(key);
        selectionSystem.setActiveIndex(info.index);
      },
      [selectionSystem, onChange],
    );

    const contextValue: RovingTabContextValue = {
      onSelect,
      activeKey,
      selectedKey,
      goToNext: selectionSystem.goToNext,
      goToPrevious: selectionSystem.goToPrevious,
      goUp: selectionSystem.goUp,
      goDown: selectionSystem.goDown,
      goToNextOrthogonal: selectionSystem.goToNextOrthogonal,
      goToPreviousOrthogonal: selectionSystem.goToPreviousOrthogonal,
      id,
      wrap: !noWrap,
    };

    return (
      <RovingTabContext.Provider value={contextValue}>
        {/*  multiline comment format required for prettier and ts to work in jsx.
          this props signature is too complex for TS due to the overridable nature.
        // @ts-ignore */ /* prettier-ignore */}
        <CustomComponent ref={finalRef} {...rest}>
        {children}
      </CustomComponent>
      </RovingTabContext.Provider>
    );
  },
);
