import {
  useContext,
  useCallback,
  KeyboardEvent,
  useRef,
  Ref,
  KeyboardEventHandler,
} from 'react';
import SelectionContext from '../contexts/selection';
import {
  keyActionPresets,
  KeyActions,
  processKeyboardEvent,
  getSelectFocusElementId,
  getSelectItemsContainerId,
} from '@dimension/core';
import { useCombinedRefs } from '../internal/refs';

export type UseSelectionFocusElementOptions = {
  /**
   * If you have an external ref you want to pass to the element
   * which will accept the props returned by this hook, pass it in here and it will
   * be merged with the hook's ref for you.
   */
  ref?: Ref<any>;
  /**
   * If you want to handle keyboard events for the element, pass your handler
   * in here to merge it as a convenience with this hook's internal handler.
   */
  onKeyDown?: KeyboardEventHandler<any>;
  /**
   * Change how keyboard keys affect the selection interaction
   */
  keyActions?: KeyActions;
  /**
   * Optionally override the element ID
   */
  id?: string;
};

export type UseSelectionFocusElementReturn = {
  props: SelectionFocusElementProvidedProps;
};

/**
 * A set of props which power a "focusable element" for a Selection system. Pass
 * them to the element you want to serve as the focusable element, like an `<input>`.
 */
export type SelectionFocusElementProvidedProps = {
  onKeyDown: KeyboardEventHandler<any>;
  ref: Ref<any>;
  id: string;
  'aria-controls': string;
};

/**
 * Returns props which can be passed to an element to cause it to be have as the
 * "focusable" element in a Selection system. Often, the "focusable" element is an
 * `<input>`, but it can be any type of element you like. Handlers will be attached
 * for listening to keyboard inputs to control the selected item. Must be the child
 * of a SelectionProvider.
 *
 * @category Selection
 */
export const useSelectionFocusElement = (
  options: UseSelectionFocusElementOptions,
): UseSelectionFocusElementReturn => {
  const {
    ref,
    onKeyDown,
    keyActions = keyActionPresets.flat.any,
    id,
  } = options;
  const {
    goToNext,
    goToPrevious,
    goDown,
    goUp,
    goToPreviousOrthogonal,
    goToNextOrthogonal,
    onSelect,
    id: groupId,
    wrap,
  } = useContext(SelectionContext);

  // TODO: use event callback (ref style)
  // to increase perf
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<any>) => {
      processKeyboardEvent(
        {
          goToNext,
          goToPrevious,
          goToNextOrthogonal,
          goToPreviousOrthogonal,
          goUp,
          goDown,
          select: onSelect,
        },
        keyActions,
        event,
        wrap,
      );

      onKeyDown && onKeyDown(event);
    },
    [
      onSelect,
      goToNext,
      goToPrevious,
      goToNextOrthogonal,
      goToPreviousOrthogonal,
      goUp,
      goDown,
      keyActions,
    ],
  );

  const internalRef = useRef<HTMLElement>(null);
  const combinedRef = useCombinedRefs(internalRef, ref);

  const props: SelectionFocusElementProvidedProps = {
    onKeyDown: handleKeyDown,
    ref: combinedRef,
    id: id || getSelectFocusElementId(groupId),
    'aria-controls': getSelectItemsContainerId(groupId),
  };

  return { props };
};
