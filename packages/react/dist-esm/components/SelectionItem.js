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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { forwardRef } from 'react';
import { useSelectionItem } from '../hooks/useSelectionItem';
export var SelectionItem = forwardRef(function (_a, ref) {
    var _b = _a.component, CustomComponent = _b === void 0 ? 'li' : _b, value = _a.value, selectedProps = _a.selectedProps, activeProps = _a.activeProps, children = _a.children, disabled = _a.disabled, coordinate = _a.coordinate, props = __rest(_a, ["component", "value", "selectedProps", "activeProps", "children", "disabled", "coordinate"]);
    var _c = useSelectionItem({
        value: value,
        disabled: disabled,
        coordinate: coordinate,
        selectedProps: selectedProps,
        activeProps: activeProps,
    }), containerProps = _c.props, selected = _c.selected, active = _c.active;
    return (React.createElement(CustomComponent, __assign({ ref: ref }, props, containerProps, { disabled: disabled }), typeof children === 'function'
        ? children({
            selected: selected,
            active: active,
            disabled: !!disabled,
        })
        : children));
});
//# sourceMappingURL=SelectionItem.js.map