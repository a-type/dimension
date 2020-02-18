/**
 * Represents the underlying selectable tree contained within a
 * particular DOM structure. The selectable tree may be sparser
 * than the actual DOM tree. Its shape may not even be equivalent.
 * For instance, the ordering tree nodes have a 2d array of children,
 * whereas DOM can only have 1d child arrays. Interpreting DOM structure
 * into an ordering tree is done in ./selection.ts
 */
export type DeepOrderingNode = {
  /**
   * The dimension selectable key of the node represented
   * at this part of the tree. `null` means this is the root,
   * which is a virtual node that holds the collection of initially
   * selectable sibling children.
   */
  key: string | null;
  /**
   * Whether the element should be skipped in ordering
   */
  disabled: boolean;
  /**
   * Children are stored as a list of rows to create a 2d structure.
   * To index into children, use the Y index first to select the desired
   * row, then the X index to index into that row.
   */
  children: DeepOrderingNode[][];
};

/**
 * A deep index is a 3d coordinate. It is a list of 2d vector coordinates.
 * Each item in the list represents a 2d coordinate at a particular level of the
 * 3d nested structure.
 */
export type DeepIndex = [number, number][];

export enum KeyCode {
  Space = 32,
  Enter = 13,
  ArrowUp = 38,
  ArrowDown = 40,
  ArrowLeft = 37,
  ArrowRight = 39,
  Escape = 27,
  Shift = 16,
  Alt = 18,
  Control = 17,
}

export type ElementMap = {
  [key: string]: {
    element: HTMLElement;
    index: DeepIndex;
  };
};
