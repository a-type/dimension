import { useContext } from 'react';
import SelectionContext from '../contexts/selection';
import { useCombinedRefs } from '../internal/refs';
import { getSelectItemsContainerId, getSelectItemId } from '@dimension/core';
export var useSelectionItemsContainer = function (options) {
    var ref = options.ref;
    var _a = useContext(SelectionContext), containerRef = _a.containerRef, activeKey = _a.activeKey, groupId = _a.id;
    var combinedRef = useCombinedRefs(containerRef, ref);
    var props = {
        ref: combinedRef,
        id: getSelectItemsContainerId(groupId),
        'aria-activedescendant': activeKey
            ? getSelectItemId(groupId, activeKey)
            : undefined,
    };
    return { props: props };
};
//# sourceMappingURL=useSelectionItemsContainer.js.map