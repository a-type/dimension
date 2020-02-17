import { DeepOrderingNode, ElementMap, DeepIndex } from './types';
import { discoverOrderingStructure } from './internal/tree';
import { CONTAINER_ATTRIBUTE } from './constants';
import {
  INITIAL_INDEX,
  KEY_DATA_ATTRIBUTE,
  DISABLED_ATTRIBUTE,
  X_INDEX_DATA_ATTRIBUTE,
  Y_INDEX_DATA_ATTRIBUTE,
  ROW_CONTAINER_ATTRIBUTE,
} from './constants';
import {
  getClosestValidDeepIndex,
  resolveIndexLocation,
  getOffsetDeepIndex,
  getDownwardDeepIndex,
  getUpwardDeepIndex,
} from './internal/indexing';

export const SelectionTrackingChangeEventType = 'SelectionTrackingChange' as const;

export class SelectionTrackingChangeEvent extends Event {
  readonly orderingTree: DeepOrderingNode;
  readonly elementMap: ElementMap;
  readonly deepIndex: DeepIndex;
  /**
   * Passive changes represent updates which are a result of DOM structure
   * changes or initialization, not user interaction.
   */
  readonly passive: boolean;

  constructor(
    orderingTree: DeepOrderingNode,
    elementMap: ElementMap,
    deepIndex: DeepIndex,
    passive: boolean,
  ) {
    super(SelectionTrackingChangeEventType);
    this.orderingTree = orderingTree;
    this.elementMap = elementMap;
    this.deepIndex = deepIndex;
    this.passive = passive;
  }

  get activeKey() {
    const info = resolveIndexLocation(this.orderingTree, this.deepIndex);
    if (!info || !info.key) return null;
    return info.key;
  }

  get activeElement() {
    const key = this.activeKey;
    if (!key) return null;
    return this.elementMap[key]?.element ?? null;
  }
}

/**
 * The Selection Tracking System is an internal generalized system which
 * monitors the DOM tree, identifies selectable elements and maps them, and
 * manages the low-level movement of the selected index. It provides events
 * for changes in the selection tree and state.
 */
export class SelectionTrackingSystem extends EventTarget {
  /** the map of all selectable items in the DOM */
  private $orderingTree: DeepOrderingNode = {
    key: null,
    children: [],
    disabled: false,
  };
  /** a lookup hash of element key to DOM element and index location */
  private $elementMap: ElementMap = {};
  /** the currently active index location */
  private $activeIndex: DeepIndex = INITIAL_INDEX;
  /** the currently selected key */
  private $selectedKey: string | null = null;
  /** a reference to the DOM element that contains all selectable items */
  private $containerElement: HTMLElement | null = null;
  /**
   * whether the system should look for children inside other nested
   * selection systems or not
   */
  private $crossContainerBoundaries: boolean = false;

  constructor({ initialSelectedKey }: { initialSelectedKey?: string } = {}) {
    super();
    this.$selectedKey = initialSelectedKey || null;
  }

  /**
   * Rescans the entire DOM subtree to discover the current
   * selectable element ordering and tree structure
   */
  private scanContainer = () => {
    // presently we actually ignore the mutations and rescan the whole tree.
    // TODO: optimize rescanning by interpreting mutations as a diff to existing
    // tree?

    if (!this.$containerElement) {
      return;
    }

    const newOrdering: DeepOrderingNode = {
      key: null,
      children: [],
      disabled: false,
    };

    const newElementMap: ElementMap = {};

    discoverOrderingStructure(
      newOrdering,
      newElementMap,
      this.$containerElement,
      {
        crossContainerBoundaries: this.$crossContainerBoundaries,
        parentIndex: [],
        crossAxisRowPosition: 0,
      },
    );

    this.$orderingTree = newOrdering;
    this.$elementMap = newElementMap;

    const newDeepIndex = getClosestValidDeepIndex(
      this.$activeIndex,
      newOrdering,
    );
    this.$activeIndex = newDeepIndex;

    // all mutation-originated change events are passive
    this.dispatchEvent(
      new SelectionTrackingChangeEvent(
        this.$orderingTree,
        this.$elementMap,
        this.$activeIndex,
        true,
      ),
    );
  };

  private mutationObserver: MutationObserver = new MutationObserver(
    this.scanContainer,
  );

  /**
   * Whether or not this selection system will dive into nested
   * selection systems to discover items (defaults to false)
   */
  get crossContainerBoundaries() {
    return this.$crossContainerBoundaries;
  }
  /**
   * Set whether this selection system should dive into nested
   * selection systems to discover items (defaults to false)
   */
  set crossContainerBoundaries(crossContainerBoundaries: boolean) {
    this.$crossContainerBoundaries = crossContainerBoundaries;
  }

  /**
   * Updates the observed item container element, reacting to changes
   * in its DOM subtree structure to construct and re-construct a view
   * of the selectable items within it and their relationships.
   */
  observe = (containerElement: HTMLElement | null) => {
    if (this.$containerElement || !containerElement) {
      this.mutationObserver.disconnect(); // disconnect from any previous container
    }

    this.$containerElement = containerElement;

    if (!containerElement) return;

    containerElement.setAttribute(CONTAINER_ATTRIBUTE, 'true');

    // do an initial scan
    this.scanContainer();

    this.mutationObserver.observe(containerElement, {
      // observe changes to child dom structure
      childList: true,
      // observe the full subtree
      subtree: true,
      // observe attribute changes...
      attributes: true,
      // ...for these attributes only
      attributeFilter: [
        KEY_DATA_ATTRIBUTE,
        DISABLED_ATTRIBUTE,
        X_INDEX_DATA_ATTRIBUTE,
        Y_INDEX_DATA_ATTRIBUTE,
        ROW_CONTAINER_ATTRIBUTE,
        CONTAINER_ATTRIBUTE,
      ],
    });
  };

  /**
   * Looks up the index and element reference of an item by key. Returns null
   * if the element is not found.
   */
  findElementInfo = (searchKey: string) => this.$elementMap[searchKey] ?? null;

  /**
   * Traverses an index and finds the key of the represented item, if it exists.
   * Returns null if the index doesn't match any path in the tree.
   */
  findKeyFromIndex = (index: DeepIndex) => {
    const node = resolveIndexLocation(this.$orderingTree, index);
    if (!node || !node.key) return null;
    return node.key;
  };

  /**
   * Traverses an index and looks up the element of the matching key, if it exists.
   * Returns null if the index doesn't match any path in the tree.
   */
  findElementFromIndex = (index: DeepIndex) => {
    const key = this.findKeyFromIndex(index);
    if (!key) return null;
    return this.findElementInfo(key)?.element ?? null;
  };

  /**
   * Returns the active (highlighted) item key
   */
  get activeKey() {
    // TODO: memoize?
    return this.findKeyFromIndex(this.$activeIndex);
  }

  /**
   * Returns the active (highlighted) DOM element
   */
  get activeElement() {
    const key = this.activeKey;
    if (!key) return;
    return this.findElementInfo(key)?.element;
  }

  /**
   * Returns the active (highlighted) index in the ordering tree
   */
  get activeIndex() {
    return this.$activeIndex;
  }

  /**
   * Returns the selected (current value) item key
   */
  get selectedKey() {
    return this.$selectedKey;
  }

  /**
   * Returns the selected (current value) DOM element
   */
  get selectedElement() {
    if (!this.$selectedKey) return null;
    return this.findElementInfo(this.$selectedKey)?.element;
  }

  /**
   * Updates the current index, as the result of a move or other user
   * interaction. Pass "true" to the passive param if the operation shouldn't
   * be considered a user interaction response.
   */
  setIndex = (newIndex: DeepIndex, passive: boolean = false) => {
    if (newIndex.length === 0) {
      this.$activeIndex = newIndex;
      this.dispatchEvent(
        new SelectionTrackingChangeEvent(
          this.$orderingTree,
          this.$elementMap,
          this.$activeIndex,
          passive,
        ),
      );
      return;
    }

    const node = resolveIndexLocation(this.$orderingTree, newIndex);
    if (!node?.key) {
      // TODO: evaluate if this needs to be a thrown error, or
      // a silent failure which accepts the invalid index.
      console.error(
        `Set selection index to ${JSON.stringify(
          newIndex,
        )}, but no item was discovered at that position`,
      );
      return;
    }

    this.$activeIndex = newIndex;

    this.dispatchEvent(
      new SelectionTrackingChangeEvent(
        this.$orderingTree,
        this.$elementMap,
        this.$activeIndex,
        passive,
      ),
    );
  };

  /**
   * Returns the total count of items
   */
  get itemCount() {
    return Object.keys(this.$elementMap).length;
  }

  // movement methods

  private doOffsetIndexMove = (
    moveType: 'next' | 'previous' | 'nextOrthogonal' | 'previousOrthogonal',
    wrap?: boolean,
  ) =>
    this.setIndex(
      getOffsetDeepIndex(this.$activeIndex, this.$orderingTree, moveType, wrap),
    );

  /**
   * Moves the index to the next enabled item in the current file on the main axis.
   */
  goToNext = (wrap?: boolean) => this.doOffsetIndexMove('next', wrap);
  /**
   * Moves the index to the previous enabled item in the current file on the main axis.
   */
  goToPrevious = (wrap?: boolean) => this.doOffsetIndexMove('previous', wrap);
  /**
   * Moves the index to the next enabled item in the current file on the orthogonal axis.
   */
  goToNextOrthogonal = (wrap?: boolean) =>
    this.doOffsetIndexMove('nextOrthogonal', wrap);
  /**
   * Moves the index to the previous enabled item in the current file on the
   * orthogonal axis.
   */
  goToPreviousOrthogonal = (wrap?: boolean) =>
    this.doOffsetIndexMove('previousOrthogonal', wrap);
  /**
   * Moves the index down one level in the hierarchy, if the next level down exists and
   * is enabled.
   */
  goDown = () =>
    this.setIndex(getDownwardDeepIndex(this.$activeIndex, this.$orderingTree));
  /**
   * Moves the index up one level in the hierarchy, if the previous level exists and
   * is enabled.
   */
  goUp = () =>
    this.setIndex(getUpwardDeepIndex(this.$activeIndex, this.$orderingTree));
}
