import { useContext, useCallback } from 'react';
import SelectionContext from '../contexts/selection';
import {
  getSelectItemId,
  DISABLED_ATTRIBUTE,
  normalizeCoordinate,
  KEY_DATA_ATTRIBUTE,
  X_INDEX_DATA_ATTRIBUTE,
  Y_INDEX_DATA_ATTRIBUTE,
} from '@dimension/core';
import { GenericProps } from '../types';
import { useIdOrGenerated } from '../internal/hooks';

export type SelectionItemOptions = {
  /**
   * Optionally supply a value represented by this
   * item. This value will be reported by the Selection system if the user selects the
   * item.
   */
  value?: string;
  /**
   * For advanced use cases, you can manually specify the ordering of this item. If
   * omitted, order will be inferred by DOM structure.
   */
  coordinate?: number | [number, number];
  /**
   * If disabled, this item will still exist within the selection navigation,
   * but the user won't be able to select it.
   */
  disabled?: boolean;
  /**
   * Props which will be supplied to the element when it is active -
   * i.e. when the user is highlighting it. By default no props
   * are provided for this state.
   */
  activeProps?: GenericProps;
  /**
   * Props which will be supplied to the element when it is selected -
   * i.e. when the current value of the control matches this option. By
   * default ARIA attributes will be supplied
   */
  selectedProps?: GenericProps;
};

export const useSelectionItem = ({
  value,
  coordinate,
  disabled,
  selectedProps,
  activeProps,
}: SelectionItemOptions) => {
  const key = useIdOrGenerated(value, 'selection-item');

  const { onSelect, activeKey, selectedKey, id: groupId } = useContext(
    SelectionContext,
  );

  const handleClick = useCallback(() => {
    if (disabled) return;
    onSelect(value);
  }, [onSelect, disabled]);

  const [manualXCoordinate, manualYCoordinate] = normalizeCoordinate(
    coordinate,
  );

  const selected = selectedKey === key;
  const active = activeKey === key;

  const props = {
    [KEY_DATA_ATTRIBUTE]: key,
    [X_INDEX_DATA_ATTRIBUTE]: manualXCoordinate,
    [Y_INDEX_DATA_ATTRIBUTE]: manualYCoordinate,
    [DISABLED_ATTRIBUTE]: disabled,
    onClick: handleClick,
    id: getSelectItemId(groupId, key),
    ...(selected ? selectedProps : {}),
    ...(active ? activeProps : {}),
  };

  return {
    props,
    active,
    selected,
    disabled,
  };
};
