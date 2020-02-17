import {
  SelectionTrackingSystem,
  SelectionTrackingChangeEventType,
  SelectionTrackingChangeEvent,
  generateId,
  getSelectFocusElementId,
  getSelectItemsContainerId,
  KEY_DATA_ATTRIBUTE,
  DISABLED_ATTRIBUTE,
  X_INDEX_DATA_ATTRIBUTE,
  Y_INDEX_DATA_ATTRIBUTE,
  getSelectItemId,
} from '@dimension/core';

const FOCUS_ELEMENT_CONTROLS_ATTRIBUTE = 'aria-controls';
const CONTAINER_ACTIVE_DESCENDANT_ATTRIBUTE = 'aria-activedescendant';

export class SelectionSystem {
  /** DOM reference to the element which keeps focus and accepts keyboard input during selection */
  private $focusElement: HTMLElement | null = null;
  /** DOM reference to the element which is the parent of all item elements */
  private $itemsContainerElement: HTMLElement | null = null;
  /**
   * determines whether the cursor should follow when the value is
   * programmatically changed
   */
  private $activeOptionFollowsSelection: boolean = false;

  /** the guts of the selection tree and index movement logic */
  private trackingSystem: SelectionTrackingSystem;
  /** mandatory unique ID used to construct element ids and link them */
  readonly id: string;

  constructor({
    initialSelectedKey,
    activeOptionFollowsSelection = false,
    id,
  }: {
    initialSelectedKey?: string;
    activeOptionFollowsSelection?: boolean;
    id?: string;
  }) {
    this.trackingSystem = new SelectionTrackingSystem({
      initialSelectedKey,
    });
    this.$activeOptionFollowsSelection = activeOptionFollowsSelection;
    this.id = id || generateId('select');

    this.trackingSystem.addEventListener(
      SelectionTrackingChangeEventType,
      this.handleTrackingChange as any,
    );
  }

  private handleTrackingChange = (event: SelectionTrackingChangeEvent) => {
    if (this.$itemsContainerElement) {
      const activeKey = event.activeKey;
      if (activeKey) {
        this.$itemsContainerElement.setAttribute(
          CONTAINER_ACTIVE_DESCENDANT_ATTRIBUTE,
          getSelectItemId(this.id, activeKey),
        );
      } else {
        this.$itemsContainerElement.removeAttribute(
          CONTAINER_ACTIVE_DESCENDANT_ATTRIBUTE,
        );
      }
    }
  };

  private setupFocusElement = (element: HTMLElement) => {
    element.id = getSelectFocusElementId(this.id);
    element.setAttribute(
      FOCUS_ELEMENT_CONTROLS_ATTRIBUTE,
      getSelectItemsContainerId(this.id),
    );
  };

  get focusElement() {
    return this.$focusElement;
  }
  set focusElement(element: HTMLElement | null) {
    this.$focusElement = element;
    if (element) {
      this.setupFocusElement(element);
    }
  }

  private setupItemsContainerElement = (element: HTMLElement) => {
    element.id = getSelectItemsContainerId(this.id);
    const currentKey = this.trackingSystem.activeKey;
    if (currentKey) {
      element.setAttribute(
        CONTAINER_ACTIVE_DESCENDANT_ATTRIBUTE,
        getSelectItemId(this.id, currentKey),
      );
    }
  };

  get itemsContainerElement() {
    return this.$itemsContainerElement;
  }
  set itemsContainerElement(element: HTMLElement | null) {
    this.$itemsContainerElement = element;
    this.trackingSystem.observe(element);
    if (element) {
      this.setupItemsContainerElement(element);
    }
  }

  get activeOptionFollowsSelection() {
    return this.$activeOptionFollowsSelection;
  }
  set activeOptionFollowsSelection(activeOptionFollowsSelection: boolean) {
    this.$activeOptionFollowsSelection = activeOptionFollowsSelection;
  }

  get selectedKey() {
    return this.trackingSystem.selectedKey;
  }
  set selectedKey(selectedKey: string | null) {
    this.trackingSystem.setSelectedKey(selectedKey);
  }

  addItem = (
    element: HTMLElement,
    {
      key,
      coordinate,
      disabled,
    }: {
      key: string;
      disabled?: boolean;
      coordinate?: number | [number, number];
    },
  ) => {
    element.setAttribute(KEY_DATA_ATTRIBUTE, key);
    element.setAttribute(DISABLED_ATTRIBUTE, disabled ? 'true' : 'false');
    if (coordinate) {
      if (typeof coordinate === 'number') {
        element.setAttribute(X_INDEX_DATA_ATTRIBUTE, `${coordinate}`);
      } else {
        element.setAttribute(X_INDEX_DATA_ATTRIBUTE, `${coordinate[0]}`);
        element.setAttribute(Y_INDEX_DATA_ATTRIBUTE, `${coordinate[1]}`);
      }
    }
    element.id = getSelectItemId(this.id, key);
  };
}
