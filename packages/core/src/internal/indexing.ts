import { DeepOrderingNode, DeepIndex } from '../types';

export class InvalidIndexError extends Error {
  constructor(index: DeepIndex) {
    super(
      `Index ${JSON.stringify(
        index,
      )} is not a valid position in the provided selectable element structure`,
    );
  }
}

export const getOffsetIndex = (
  currentIndex: number,
  length: number,
  offset: number,
  wrap?: boolean,
) => {
  let prospectiveNewIndex = currentIndex + offset;
  if (!wrap) {
    // clamp the value to available
    return Math.max(0, Math.min(length - 1, prospectiveNewIndex));
  }
  if (prospectiveNewIndex < 0) {
    prospectiveNewIndex += length;
  }
  while (prospectiveNewIndex >= length) {
    prospectiveNewIndex -= length;
  }

  return prospectiveNewIndex;
};

export const resolveIndexLocation = (
  ordering: DeepOrderingNode,
  index: DeepIndex,
): DeepOrderingNode | null => {
  if (index.length === 0) {
    return ordering;
  } else {
    const [firstPosition, ...rest] = index;
    const [firstX, firstY] = firstPosition;

    if (!ordering.children[firstY] || !ordering.children[firstY][firstX]) {
      return null;
    }

    return resolveIndexLocation(
      // Y is indexed first since the conceptual model of the 2d children array
      // is rows stacked on top of one another
      //
      // [0, 1, 2, 3, 4, 5]
      // [6, 7, 8, 9, a, b]
      // [c, d, e, f, g, h]
      //
      // first we select which row (using Y) then the index in that row (X)
      ordering.children[firstY]?.[firstX] ?? null,
      rest,
    );
  }
};

export const findNextEnabledIndex = (
  file: DeepOrderingNode[],
  index: number,
  wrap: boolean,
) => {
  let searchIndex = index + 1;
  while (searchIndex < file.length) {
    if (file[searchIndex] && !file[searchIndex].disabled) {
      return searchIndex;
    }
    searchIndex += 1;
  }
  if (!wrap) {
    return index;
  }
  searchIndex = 0;
  while (searchIndex < index) {
    if (file[searchIndex] && !file[searchIndex].disabled) {
      return searchIndex;
    }
    searchIndex += 1;
  }
  return index;
};

export const findPreviousEnabledIndex = (
  file: DeepOrderingNode[],
  index: number,
  wrap: boolean,
) => {
  let searchIndex = index - 1;
  while (searchIndex >= 0) {
    if (file[searchIndex] && !file[searchIndex].disabled) {
      return searchIndex;
    }
    searchIndex -= 1;
  }
  if (!wrap) {
    return index;
  }
  searchIndex = file.length - 1;
  while (searchIndex > index) {
    if (file[searchIndex] && !file[searchIndex].disabled) {
      return searchIndex;
    }
    searchIndex -= 1;
  }
  return index;
};

const fileIsAllDisabled = (file: DeepOrderingNode[] = []) =>
  file.reduce(
    (areAllDisabled, child) => areAllDisabled && (!child || child.disabled),
    true,
  );

const getColumn = (parent: DeepOrderingNode, columnIndex: number) =>
  parent.children.reduce((col, row) => [...col, row[columnIndex]], []);

type IndexOffset =
  | 'previousOrthogonal'
  | 'nextOrthogonal'
  | 'previous'
  | 'next';

/**
 * Cycles a deep index to the next sibling. It's not possible to "escape"
 * a sibling group with a horizontal move like this. If there are a couple
 * sibling elements, it will move to the next one (with or without wrap).
 * If there's only 1, it won't do anything.
 */
export const getOffsetDeepIndex = (
  currentIndex: DeepIndex,
  ordering: DeepOrderingNode,
  offset: IndexOffset,
  wrap?: boolean,
): DeepIndex => {
  const prefixIndices = currentIndex.slice(0, currentIndex.length - 1);
  const parent = resolveIndexLocation(ordering, prefixIndices);

  if (!parent) {
    throw new InvalidIndexError(currentIndex);
  }

  const operantCurrentPosition = currentIndex[currentIndex.length - 1];

  // scan the file (row | column) we are moving within to ensure
  // there is at least one enabled item to move to
  if (offset === 'next' || offset === 'previous') {
    // row
    const row = parent.children[operantCurrentPosition[1]];
    if (fileIsAllDisabled(row)) {
      // TODO: evaluate this behavior
      // don't move
      return currentIndex;
    } else {
      // move to the first enabled item after the current one
      const fileIndex =
        offset === 'next'
          ? findNextEnabledIndex(row, operantCurrentPosition[0], !!wrap)
          : findPreviousEnabledIndex(row, operantCurrentPosition[0], !!wrap);

      return [...prefixIndices, [fileIndex, operantCurrentPosition[1]]];
    }
  } else {
    // column
    const columnIndex = operantCurrentPosition[0];
    const column = getColumn(parent, columnIndex);
    if (fileIsAllDisabled(column)) {
      // TODO: evaluate this behavior
      // don't move
      return currentIndex;
    } else {
      // move to the first enabled item after the current one
      const fileIndex =
        offset === 'nextOrthogonal'
          ? findNextEnabledIndex(column, operantCurrentPosition[1], !!wrap)
          : findPreviousEnabledIndex(column, operantCurrentPosition[1], !!wrap);

      return [...prefixIndices, [operantCurrentPosition[0], fileIndex]];
    }
  }
};

/**
 * A simple upward traversal, selecting the previously selected parent
 * index. It is assumed that your index is valid within your nested
 * structure.
 */
export const getUpwardDeepIndex = (
  currentIndex: DeepIndex,
  ordering: DeepOrderingNode,
): DeepIndex => {
  // don't go "up" to nothing
  if (currentIndex.length === 1) return currentIndex;

  // TODO: evaluate this behavior
  // if the parent is disabled, don't move
  const upwardIndex = currentIndex.slice(0, currentIndex.length - 1);
  const parent = resolveIndexLocation(ordering, upwardIndex);
  if (!parent || parent.disabled) {
    return currentIndex;
  }

  return upwardIndex;
};

/**
 * Traverses downward if there's a child grouping, selecting the first
 * index in the children.
 */
export const getDownwardDeepIndex = (
  currentIndex: DeepIndex,
  ordering: DeepOrderingNode,
): DeepIndex => {
  const current = resolveIndexLocation(ordering, currentIndex);

  if (!current) {
    throw new InvalidIndexError(currentIndex);
  }

  if (!current.children[0]) {
    return currentIndex;
  }

  // TODO: evaluate this behavior
  // find the first enabled child to move to
  if (fileIsAllDisabled(current.children[0])) {
    return currentIndex;
  }
  const enabledChildIndex = findNextEnabledIndex(
    current.children[0],
    -1,
    false,
  );

  const downwardIndex: DeepIndex = [...currentIndex, [enabledChildIndex, 0]];
  return downwardIndex;
};

/**
 * Gets the closes valid index to a supplied deep index for
 * the given ordering tree.
 *
 * TODO: make this work with disabled items, and in general just work
 * better
 */
export const getClosestValidDeepIndex = (
  prospectiveIndex: DeepIndex,
  ordering: DeepOrderingNode,
): DeepIndex => {
  // special case: go up from nothing if there's something to go to
  if (prospectiveIndex.length === 0) {
    const firstLevel = resolveIndexLocation(ordering, [[0, 0]]);
    if (!firstLevel?.disabled) {
      return [[0, 0]];
    }
  }

  return prospectiveIndex.reduce<DeepIndex>((rebuiltIndex, [nextX, nextY]) => {
    const level = resolveIndexLocation(ordering, rebuiltIndex);

    if (!level || !level.children.length) {
      // reached a point where the index specifies a position,
      // but the children are empty, so we "cut off" the index at
      // its current place
      return rebuiltIndex;
    } else {
      // otherwise, try to get close to the provided position,
      // but stop at the end of the children list.
      const closestY = Math.min(level.children.length - 1, nextY);
      const closestX = Math.min(level.children[closestY]?.length ?? 0, nextX);
      return [...rebuiltIndex, [closestX, closestY]];
    }
  }, []);
};
