import { useContext, useCallback, useRef, } from 'react';
import SelectionContext from '../contexts/selection';
import { keyActionPresets, processKeyboardEvent, getSelectFocusElementId, getSelectItemsContainerId, } from '@dimension/core';
import { useCombinedRefs } from '../internal/refs';
/**
 * Returns props which can be passed to an element to cause it to be have as the
 * "focusable" element in a Selection system. Often, the "focusable" element is an
 * `<input>`, but it can be any type of element you like. Handlers will be attached
 * for listening to keyboard inputs to control the selected item. Must be the child
 * of a SelectionProvider.
 *
 * @category Selection
 */
export var useSelectionFocusElement = function (options) {
    var ref = options.ref, onKeyDown = options.onKeyDown, _a = options.keyActions, keyActions = _a === void 0 ? keyActionPresets.flat.any : _a, id = options.id;
    var _b = useContext(SelectionContext), goToNext = _b.goToNext, goToPrevious = _b.goToPrevious, goDown = _b.goDown, goUp = _b.goUp, goToPreviousOrthogonal = _b.goToPreviousOrthogonal, goToNextOrthogonal = _b.goToNextOrthogonal, onSelect = _b.onSelect, groupId = _b.id, wrap = _b.wrap;
    // TODO: use event callback (ref style)
    // to increase perf
    var handleKeyDown = useCallback(function (event) {
        processKeyboardEvent({
            goToNext: goToNext,
            goToPrevious: goToPrevious,
            goToNextOrthogonal: goToNextOrthogonal,
            goToPreviousOrthogonal: goToPreviousOrthogonal,
            goUp: goUp,
            goDown: goDown,
            select: onSelect,
        }, keyActions, event, wrap);
        onKeyDown && onKeyDown(event);
    }, [
        onSelect,
        goToNext,
        goToPrevious,
        goToNextOrthogonal,
        goToPreviousOrthogonal,
        goUp,
        goDown,
        keyActions,
    ]);
    var internalRef = useRef(null);
    var combinedRef = useCombinedRefs(internalRef, ref);
    var props = {
        onKeyDown: handleKeyDown,
        ref: combinedRef,
        id: id || getSelectFocusElementId(groupId),
        'aria-controls': getSelectItemsContainerId(groupId),
    };
    return { props: props };
};
//# sourceMappingURL=useSelectionFocusElement.js.map