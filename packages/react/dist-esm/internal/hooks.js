import { useRef, useEffect, useCallback, useState } from 'react';
import { generateId } from '@dimension/core';
export var useIsMounted = function () {
    var isMountedRef = useRef(false);
    useEffect(function () {
        setTimeout(function () { return (isMountedRef.current = true); }, 0);
    });
    return isMountedRef.current;
};
export var usePrevious = function (val) {
    var previousRef = useRef(val);
    useEffect(function () {
        previousRef.current = val;
    });
    return previousRef.current;
};
export var useIdOrGenerated = function (providedId, idBase) {
    var generatedId = useRef(generateId(idBase));
    if (providedId) {
        return providedId;
    }
    else {
        return generatedId.current;
    }
};
// adapted from MUI hook
export function useControlled(_a) {
    var controlled = _a.controlled, defaultProp = _a.default, name = _a.name, onChange = _a.onChange;
    var isControlled = useRef(controlled !== undefined).current;
    var _b = useState(defaultProp), valueState = _b[0], setValue = _b[1];
    var value = isControlled ? controlled : valueState;
    if (process.env.NODE_ENV !== 'production') {
        if (controlled && !onChange) {
            console.warn("A component with a controlled value " + name + " did not receive an onChange prop");
        }
        useEffect(function () {
            if (isControlled !== (controlled !== undefined)) {
                console.error([
                    "A component is changing " + (isControlled ? 'a ' : 'an un') + "controlled " + name + " to be " + (isControlled ? 'un' : '') + "controlled.",
                    'Elements should not switch from uncontrolled to controlled (or vice versa).',
                    "Decide between using a controlled or uncontrolled " + name + " " +
                        'element for the lifetime of the component.',
                    'More info: https://fb.me/react-controlled-components',
                ].join('\n'));
            }
        }, [controlled]);
        var defaultValue_1 = useRef(defaultProp).current;
        useEffect(function () {
            if (defaultValue_1 !== defaultProp) {
                console.error([
                    "A component is changing the default value of an uncontrolled " + name + " after being initialized. " +
                        ("To suppress this warning opt to use a controlled " + name + "."),
                ].join('\n'));
            }
        }, [JSON.stringify(defaultProp)]);
    }
    var setValueIfUncontrolled = useCallback(function (newValue) {
        if (!isControlled) {
            setValue(newValue);
        }
        onChange && onChange(newValue);
    }, [onChange]);
    return [value, setValueIfUncontrolled];
}
//# sourceMappingURL=hooks.js.map