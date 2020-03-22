var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { useContext, useRef, useCallback } from 'react';
import RovingTabContext from '../contexts/rovingTab';
import { processKeyboardEvent, keyActionPresets, DISABLED_ATTRIBUTE, normalizeCoordinate, KEY_DATA_ATTRIBUTE, VALUE_DATA_ATTRIBUTE, X_INDEX_DATA_ATTRIBUTE, Y_INDEX_DATA_ATTRIBUTE, } from '@dimension/core';
import { useCombinedRefs } from '../internal/refs';
import { useIdOrGenerated } from '../internal/hooks';
var defaultSelectedProps = { 'aria-checked': true };
var defaultActiveProps = {};
/**
 * Returns props which can be passed to an element to include it in a roving
 * tab system. Components which use this hook must be children of a RovingTabProvider.
 *
 * @category Roving Tab
 */
export var useRovingTabItem = function (options) {
    var _a;
    if (options === void 0) { options = {}; }
    var value = options.value, ref = options.ref, coordinate = options.coordinate, _b = options.keyActions, keyActions = _b === void 0 ? keyActionPresets.flat.any : _b, disabled = options.disabled, _c = options.selectedProps, selectedProps = _c === void 0 ? defaultSelectedProps : _c, _d = options.activeProps, activeProps = _d === void 0 ? defaultActiveProps : _d;
    var _e = useContext(RovingTabContext), onSelect = _e.onSelect, goToNext = _e.goToNext, goToPrevious = _e.goToPrevious, activeKey = _e.activeKey, selectedKey = _e.selectedKey, goUp = _e.goUp, goDown = _e.goDown, goToNextOrthogonal = _e.goToNextOrthogonal, goToPreviousOrthogonal = _e.goToPreviousOrthogonal, wrap = _e.wrap;
    var key = useIdOrGenerated(value, 'item');
    var elementRef = useRef(null);
    var combinedRef = useCombinedRefs(elementRef, ref);
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
            select: function () {
                if (!disabled) {
                    onSelect(key, value);
                }
            },
        }, keyActions, event, wrap);
    }, [
        onSelect,
        key,
        value,
        goToNext,
        goToPrevious,
        goToNextOrthogonal,
        goToPreviousOrthogonal,
        goUp,
        goDown,
        keyActions,
        disabled,
    ]);
    var handleClick = useCallback(function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (disabled) {
            return;
        }
        onSelect(key, value);
    }, [onSelect, key, value, disabled]);
    var _f = normalizeCoordinate(coordinate), manualXCoordinate = _f[0], manualYCoordinate = _f[1];
    var selected = selectedKey === key;
    var active = activeKey === key;
    return {
        props: __assign(__assign((_a = { ref: combinedRef, onKeyDown: handleKeyDown, onClick: handleClick }, _a[KEY_DATA_ATTRIBUTE] = key, _a[VALUE_DATA_ATTRIBUTE] = value, _a[X_INDEX_DATA_ATTRIBUTE] = manualXCoordinate, _a[Y_INDEX_DATA_ATTRIBUTE] = manualYCoordinate, _a[DISABLED_ATTRIBUTE] = disabled, _a.tabIndex = activeKey === key ? 0 : -1, _a), (selected ? selectedProps : {})), (active ? activeProps : {})),
        selected: selected,
        active: active,
        disabled: disabled,
    };
};
//# sourceMappingURL=useRovingTabItem.js.map