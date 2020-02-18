import React, { Ref, useRef, MutableRefObject, useCallback } from 'react';

// @ts-nocheck
export const useRefOrProvided = <T extends any>(
  providedRef: Ref<T> | null | undefined,
): Ref<T> => {
  const internalRef = useRef<T>(null);
  return providedRef || internalRef;
};

export const assignRef = <T>(ref: Ref<T>, el: T) => {
  if (typeof ref === 'function') {
    ref(el);
  } else {
    (ref as MutableRefObject<T>).current = el;
  }
};

// @ts-nocheck
export const useCombinedRefs = <T>(...refs: (Ref<T> | undefined)[]) => {
  const finalRef = useCallback((el: T) => {
    refs.forEach(ref => {
      if (ref) {
        assignRef(ref, el);
      }
    });
  }, refs);
  return finalRef;
};
