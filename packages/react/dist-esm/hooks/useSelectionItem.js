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
import { useContext, useCallback } from 'react';
import SelectionContext from '../contexts/selection';
import { getSelectItemId, DISABLED_ATTRIBUTE, normalizeCoordinate, KEY_DATA_ATTRIBUTE, X_INDEX_DATA_ATTRIBUTE, Y_INDEX_DATA_ATTRIBUTE, } from '@dimension/core';
import { useIdOrGenerated } from '../internal/hooks';
var defaultSelectedProps = { 'aria-selected': true };
var defaultActiveProps = {};
export var useSelectionItem = function (_a) {
    var _b;
    var value = _a.value, coordinate = _a.coordinate, disabled = _a.disabled, _c = _a.selectedProps, selectedProps = _c === void 0 ? defaultSelectedProps : _c, _d = _a.activeProps, activeProps = _d === void 0 ? defaultActiveProps : _d;
    var key = useIdOrGenerated(value, 'selection-item');
    var _e = useContext(SelectionContext), onSelect = _e.onSelect, activeKey = _e.activeKey, selectedKey = _e.selectedKey, groupId = _e.id;
    var handleClick = useCallback(function () {
        if (disabled)
            return;
        onSelect(value);
    }, [onSelect, disabled]);
    var _f = normalizeCoordinate(coordinate), manualXCoordinate = _f[0], manualYCoordinate = _f[1];
    var selected = selectedKey === key;
    var active = activeKey === key;
    var props = __assign(__assign((_b = {}, _b[KEY_DATA_ATTRIBUTE] = key, _b[X_INDEX_DATA_ATTRIBUTE] = manualXCoordinate, _b[Y_INDEX_DATA_ATTRIBUTE] = manualYCoordinate, _b[DISABLED_ATTRIBUTE] = disabled, _b.onClick = handleClick, _b.id = getSelectItemId(groupId, key), _b), (selected ? selectedProps : {})), (active ? activeProps : {}));
    return {
        props: props,
        active: active,
        selected: selected,
        disabled: disabled,
    };
};
//# sourceMappingURL=useSelectionItem.js.map