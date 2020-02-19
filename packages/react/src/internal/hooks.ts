import { useRef, useEffect, useCallback, useState } from 'react';
import { generateId } from '@dimension/core';

export const useIsMounted = () => {
  const isMountedRef = useRef(false);
  useEffect(() => {
    setTimeout(() => (isMountedRef.current = true), 0);
  });
  return isMountedRef.current;
};

export const usePrevious = <T>(val: T) => {
  const previousRef = useRef(val);
  useEffect(() => {
    previousRef.current = val;
  });
  return previousRef.current;
};

export const useIdOrGenerated = (
  providedId?: string,
  idBase?: string,
): string => {
  const generatedId = useRef<string>(generateId(idBase));
  if (providedId) {
    return providedId;
  } else {
    return generatedId.current;
  }
};

// adapted from MUI hook
export function useControlled<T>({
  controlled,
  default: defaultProp,
  name,
  onChange,
}: {
  controlled?: T;
  default: T;
  name?: string;
  onChange?: (val: T) => void;
}): [T, (val: T) => void] {
  const { current: isControlled } = useRef(controlled !== undefined);
  const [valueState, setValue] = useState(defaultProp);
  const value = isControlled ? (controlled as T) : valueState;

  if (process.env.NODE_ENV !== 'production') {
    if (controlled && !onChange) {
      console.warn(
        `A component with a controlled value ${name} did not receive an onChange prop`,
      );
    }

    useEffect(() => {
      if (isControlled !== (controlled !== undefined)) {
        console.error(
          [
            `A component is changing ${
              isControlled ? 'a ' : 'an un'
            }controlled ${name} to be ${isControlled ? 'un' : ''}controlled.`,
            'Elements should not switch from uncontrolled to controlled (or vice versa).',
            `Decide between using a controlled or uncontrolled ${name} ` +
              'element for the lifetime of the component.',
            'More info: https://fb.me/react-controlled-components',
          ].join('\n'),
        );
      }
    }, [controlled]);

    const { current: defaultValue } = useRef(defaultProp);

    useEffect(() => {
      if (defaultValue !== defaultProp) {
        console.error(
          [
            `A component is changing the default value of an uncontrolled ${name} after being initialized. ` +
              `To suppress this warning opt to use a controlled ${name}.`,
          ].join('\n'),
        );
      }
    }, [JSON.stringify(defaultProp)]);
  }

  const setValueIfUncontrolled = useCallback(
    newValue => {
      if (!isControlled) {
        setValue(newValue);
      }
      onChange && onChange(newValue);
    },
    [onChange],
  );

  return [value, setValueIfUncontrolled];
}
