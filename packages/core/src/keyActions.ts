import { KeyCode } from './types';

export enum Action {
  GoNext,
  GoPrevious,
  GoUp,
  GoDown,
  GoNextOrthogonal,
  GoPreviousOrthogonal,
  Select,
  DoNothing,
}

export type KeyActions = {
  up: Action;
  down: Action;
  left: Action;
  right: Action;
  enter: Action;
  space: Action;
  escape: Action;
};

export const keyActionPresets: {
  hierarchical: {
    horizontal: KeyActions;
    vertical: KeyActions;
  };
  flat: {
    horizontal: KeyActions;
    vertical: KeyActions;
    any: KeyActions;
  };
  grid: {
    horizontal: KeyActions;
    vertical: KeyActions;
  };
  threeDimensional: {
    horizontal: KeyActions;
    vertical: KeyActions;
  };
} = {
  hierarchical: {
    horizontal: {
      up: Action.GoUp,
      down: Action.GoDown,
      left: Action.GoPrevious,
      right: Action.GoNext,
      enter: Action.Select,
      space: Action.Select,
      escape: Action.DoNothing,
    },
    vertical: {
      up: Action.GoPrevious,
      down: Action.GoNext,
      left: Action.GoUp,
      right: Action.GoDown,
      enter: Action.Select,
      space: Action.Select,
      escape: Action.DoNothing,
    },
  },
  flat: {
    horizontal: {
      up: Action.DoNothing,
      down: Action.DoNothing,
      left: Action.GoPrevious,
      right: Action.GoNext,
      enter: Action.Select,
      space: Action.Select,
      escape: Action.DoNothing,
    },
    vertical: {
      up: Action.GoPrevious,
      down: Action.GoNext,
      left: Action.DoNothing,
      right: Action.DoNothing,
      enter: Action.Select,
      space: Action.Select,
      escape: Action.DoNothing,
    },
    any: {
      up: Action.GoPrevious,
      down: Action.GoNext,
      left: Action.GoPrevious,
      right: Action.GoNext,
      enter: Action.Select,
      space: Action.Select,
      escape: Action.DoNothing,
    },
  },
  grid: {
    horizontal: {
      up: Action.GoPreviousOrthogonal,
      down: Action.GoNextOrthogonal,
      left: Action.GoPrevious,
      right: Action.GoNext,
      enter: Action.Select,
      space: Action.Select,
      escape: Action.DoNothing,
    },
    vertical: {
      up: Action.GoPrevious,
      down: Action.GoNext,
      left: Action.GoPreviousOrthogonal,
      right: Action.GoNextOrthogonal,
      enter: Action.Select,
      space: Action.Select,
      escape: Action.DoNothing,
    },
  },
  threeDimensional: {
    horizontal: {
      up: Action.GoPreviousOrthogonal,
      down: Action.GoNextOrthogonal,
      left: Action.GoPrevious,
      right: Action.GoNext,
      enter: Action.Select,
      space: Action.GoDown,
      escape: Action.GoUp,
    },
    vertical: {
      up: Action.GoPrevious,
      down: Action.GoNext,
      left: Action.GoPreviousOrthogonal,
      right: Action.GoNextOrthogonal,
      enter: Action.Select,
      space: Action.GoDown,
      escape: Action.GoUp,
    },
  },
};

export const getKeyboardAction = (keyActions: KeyActions, keyCode: KeyCode) => {
  switch (keyCode) {
    case KeyCode.ArrowUp:
      return keyActions.up;
    case KeyCode.ArrowDown:
      return keyActions.down;
    case KeyCode.ArrowLeft:
      return keyActions.left;
    case KeyCode.ArrowRight:
      return keyActions.right;
    case KeyCode.Enter:
      return keyActions.enter;
    case KeyCode.Space:
      return keyActions.space;
    default:
      return Action.DoNothing;
  }
};

export const processKeyboardEvent = (
  implementations: {
    goToNext: () => any;
    goToPrevious: () => any;
    goToNextOrthogonal: () => any;
    goToPreviousOrthogonal: () => any;
    goUp: () => any;
    goDown: () => any;
    select: () => any;
  },
  keyActions: KeyActions,
  event: {
    keyCode: number;
    preventDefault: () => void;
    stopPropagation: () => void;
  },
) => {
  const keyCode: KeyCode = event.keyCode;
  const action = getKeyboardAction(keyActions, keyCode);
  if (action === Action.DoNothing) {
    return;
  }

  switch (action) {
    case Action.GoDown:
      implementations.goDown();
      break;
    case Action.GoUp:
      implementations.goUp();
      break;
    case Action.GoNext:
      implementations.goToNext();
      break;
    case Action.GoPrevious:
      implementations.goToPrevious();
      break;
    case Action.GoNextOrthogonal:
      implementations.goToNextOrthogonal();
      break;
    case Action.GoPreviousOrthogonal:
      implementations.goToPreviousOrthogonal();
      break;
    case Action.Select:
      implementations.select();
      break;
  }

  event.preventDefault();
  event.stopPropagation();
};
