import { useContext, Ref } from 'react';
import SelectionContext from '../contexts/selection';
import { useCombinedRefs } from '../internal/refs';
import { getSelectItemsContainerId, getSelectItemId } from '@dimension/core';

export type UseSelectionItemsContainerOptions = {
  ref?: Ref<any>;
};

export const useSelectionItemsContainer = (
  options: UseSelectionItemsContainerOptions,
) => {
  const { ref } = options;
  const { containerRef, activeKey, id: groupId } = useContext(SelectionContext);
  const combinedRef = useCombinedRefs(containerRef, ref);

  const props = {
    ref: combinedRef,
    id: getSelectItemsContainerId(groupId),
    'aria-activedescendant': activeKey
      ? getSelectItemId(groupId, activeKey)
      : undefined,
  };

  return { props };
};
