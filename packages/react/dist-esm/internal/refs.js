import { useRef, useCallback } from 'react';
// @ts-nocheck
export var useRefOrProvided = function (providedRef) {
    var internalRef = useRef(null);
    return providedRef || internalRef;
};
export var assignRef = function (ref, el) {
    if (typeof ref === 'function') {
        ref(el);
    }
    else {
        ref.current = el;
    }
};
// @ts-nocheck
export var useCombinedRefs = function () {
    var refs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        refs[_i] = arguments[_i];
    }
    var finalRef = useCallback(function (el) {
        refs.forEach(function (ref) {
            if (ref) {
                assignRef(ref, el);
            }
        });
    }, refs);
    return finalRef;
};
//# sourceMappingURL=refs.js.map