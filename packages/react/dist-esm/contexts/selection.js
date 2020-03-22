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
import React, { createContext, useCallback, useEffect, useRef, useState, } from 'react';
import { useIdOrGenerated, useControlled } from '../internal/hooks';
import { SelectionTrackingSystem, INITIAL_INDEX, SelectionTrackingChangeEventType, } from '@dimension/core';
var SelectionContext = createContext({
    onSelect: function () { },
    goToNext: function () { },
    goToPrevious: function () { },
    goDown: function () { },
    goUp: function () { },
    goToNextOrthogonal: function () { },
    goToPreviousOrthogonal: function () { },
    selectedKey: null,
    containerRef: null,
    activeKey: null,
    id: '',
    wrap: true,
});
export default SelectionContext;
/**
 * Creates a Selection system, which allows attaching interaction handlers to a
 * focusable item (like an `<input>`) which control the selection state of a
 * disconnected set of elements. Used for things like autocomplete inputs.
 */
export var SelectionProvider = function (props) {
    var noWrap = props.noWrap, children = props.children, onChange = props.onChange, shallow = props.shallow, itemCount = props.itemCount, value = props.value, providedId = props.id, _a = props.disableScrollToActiveElement, disableScrollToActiveElement = _a === void 0 ? false : _a, rest = __rest(props, ["noWrap", "children", "onChange", "shallow", "itemCount", "value", "id", "disableScrollToActiveElement"]);
    var id = useIdOrGenerated(providedId, 'select');
    var _b = useControlled({
        controlled: value,
        default: null,
        onChange: onChange,
    }), selectedKey = _b[0], setSelectedKey = _b[1];
    var _c = useState(null), activeKey = _c[0], setActiveKey = _c[1];
    var selectionSystem = useRef(new SelectionTrackingSystem({
        initialSelectedKey: selectedKey,
        // this is an expected behavior for select-style widgets
        activeOptionFollowsSelection: true,
    })).current;
    useEffect(function () {
        // initialize selection system listener
        var onSelectionChange = function (ev) {
            var _a;
            // update stored state
            setSelectedKey(ev.selectedKey);
            setActiveKey(ev.activeKey);
            if (!disableScrollToActiveElement) {
                (_a = ev.activeElement) === null || _a === void 0 ? void 0 : _a.scrollIntoView({
                    behavior: 'smooth',
                });
            }
        };
        selectionSystem.on(SelectionTrackingChangeEventType, onSelectionChange);
        return function () {
            return void selectionSystem.off(SelectionTrackingChangeEventType, onSelectionChange);
        };
    }, [selectionSystem, disableScrollToActiveElement]);
    var containerRef = useCallback(function (el) {
        selectionSystem.observe(el);
    }, [selectionSystem]);
    // when the controlled value changes, update the selected index to match
    useEffect(function () {
        if (!selectedKey) {
            selectionSystem.setActiveIndex(INITIAL_INDEX);
            return;
        }
        var info = selectionSystem.findElementInfo(selectedKey);
        if (selectedKey && !info) {
            console.warn("Value was updated to " + selectedKey + ", but an element index could not be found");
            return;
        }
        selectionSystem.setActiveIndex(info.index);
    }, [selectedKey, selectionSystem]);
    /** either selects the provided value, or the current chosen value */
    var onSelect = useCallback(function (key) {
        var resolvedValue = key || activeKey;
        if (!resolvedValue) {
            return; // TODO: verify assumption
        }
        selectionSystem.setSelectedKey(resolvedValue);
    }, [activeKey, onChange]);
    var contextValue = {
        activeKey: activeKey,
        goToNext: selectionSystem.goToNext,
        goToPrevious: selectionSystem.goToPrevious,
        goDown: selectionSystem.goDown,
        goUp: selectionSystem.goUp,
        goToNextOrthogonal: selectionSystem.goToNextOrthogonal,
        goToPreviousOrthogonal: selectionSystem.goToPreviousOrthogonal,
        onSelect: onSelect,
        containerRef: containerRef,
        id: id,
        selectedKey: selectedKey,
        wrap: !noWrap,
    };
    return (React.createElement(SelectionContext.Provider, __assign({ value: contextValue }, rest), children));
};
//# sourceMappingURL=selection.js.map