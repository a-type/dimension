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
import React, { createContext, useCallback, useEffect, forwardRef, useRef, useState, } from 'react';
import { SelectionTrackingSystem, SelectionTrackingChangeEventType, INITIAL_INDEX, } from '@dimension/core';
import { useIdOrGenerated, useControlled } from '../internal/hooks';
import { useCombinedRefs } from '../internal/refs';
var RovingTabContext = createContext({
    onSelect: function () { },
    goToNext: function () { },
    goToPrevious: function () { },
    goToNextOrthogonal: function () { },
    goToPreviousOrthogonal: function () { },
    goUp: function () { },
    goDown: function () { },
    activeKey: null,
    selectedKey: null,
    id: null,
    wrap: true,
});
export default RovingTabContext;
export var RovingTabContainer = forwardRef(function (_a, ref) {
    var noWrap = _a.noWrap, children = _a.children, onChange = _a.onChange, observeDeep = _a.observeDeep, itemCount = _a.itemCount, value = _a.value, _b = _a.component, CustomComponent = _b === void 0 ? 'div' : _b, disableScrollIntoView = _a.disableScrollIntoView, rest = __rest(_a, ["noWrap", "children", "onChange", "observeDeep", "itemCount", "value", "component", "disableScrollIntoView"]);
    var id = useIdOrGenerated(rest.id);
    var _c = useControlled({
        controlled: value,
        default: null,
        onChange: onChange,
    }), selectedKey = _c[0], setSelectedKey = _c[1];
    var _d = useState(null), activeKey = _d[0], setActiveKey = _d[1];
    var selectionSystem = useRef(new SelectionTrackingSystem({
        initialSelectedKey: selectedKey,
    })).current;
    useEffect(function () {
        // initialize selection system listener
        var onSelectionChange = function (ev) {
            var _a;
            // for non-passive changes, focus the new active element
            if (!ev.passive) {
                (_a = ev.activeElement) === null || _a === void 0 ? void 0 : _a.focus();
            }
            // update stored state
            setSelectedKey(ev.selectedKey);
            setActiveKey(ev.activeKey);
        };
        selectionSystem.on(SelectionTrackingChangeEventType, onSelectionChange);
        return function () {
            return void selectionSystem.off(SelectionTrackingChangeEventType, onSelectionChange);
        };
    }, [selectionSystem]);
    // ref to the top level container element
    var containerRef = useCallback(function (el) {
        selectionSystem.observe(el);
    }, [selectionSystem]);
    // combined with user ref, if provided
    var finalRef = useCombinedRefs(containerRef, ref);
    useEffect(function () {
        if (!selectedKey) {
            selectionSystem.setActiveIndex(INITIAL_INDEX);
            return;
        }
        var info = selectionSystem.findElementInfo(selectedKey);
        if (!info) {
            console.warn("Value of roving tab group " + id + " was updated to " + selectedKey + ", but no element index was found");
            return;
        }
        // update selection state, but don't focus the element
        selectionSystem.setActiveIndex(info.index || []);
    }, [selectedKey, selectionSystem]);
    // when the user selects an item, force update the selected index
    // TODO: move this behavior to a focus handler in the hook?
    var onSelect = useCallback(function (key) {
        var info = selectionSystem.findElementInfo(key);
        if (!info) {
            console.warn("Roving tab group " + id + " selected " + key + ", but the associated element wasn't found in the element map");
            return;
        }
        // update selection state and focus new element
        selectionSystem.setSelectedKey(key);
        selectionSystem.setActiveIndex(info.index);
    }, [selectionSystem, onChange]);
    var contextValue = {
        onSelect: onSelect,
        activeKey: activeKey,
        selectedKey: selectedKey,
        goToNext: selectionSystem.goToNext,
        goToPrevious: selectionSystem.goToPrevious,
        goUp: selectionSystem.goUp,
        goDown: selectionSystem.goDown,
        goToNextOrthogonal: selectionSystem.goToNextOrthogonal,
        goToPreviousOrthogonal: selectionSystem.goToPreviousOrthogonal,
        id: id,
        wrap: !noWrap,
    };
    return (React.createElement(RovingTabContext.Provider, { value: contextValue },
        React.createElement(CustomComponent, __assign({ ref: finalRef }, rest), children)));
});
//# sourceMappingURL=rovingTab.js.map