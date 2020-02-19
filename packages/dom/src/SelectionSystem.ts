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
  processKeyboardEvent,
  KeyActions,
  keyActionPresets,
} from '@dimension/core';
import { EventEmitter } from 'events';

const FOCUS_ELEMENT_CONTROLS_ATTRIBUTE = 'aria-controls';
const CONTAINER_ACTIVE_DESCENDANT_ATTRIBUTE = 'aria-activedescendant';

export const SelectionSystemChangeEventType = 'SelectionSystemChange';
export class SelectionSystemChangeEvent {
  readonly selectedKey: string | null;

  constructor(selectedKey: string | null) {
    this.selectedKey = selectedKey;
  }
}

export class SelectionSystem extends EventEmitter {
  /** DOM reference to the element which keeps focus and accepts keyboard input during selection */
  private $focusElement: HTMLElement | null = null;
  /** DOM reference to the element which is the parent of all item elements */
  private $itemsContainerElement: HTMLElement | null = null;
  /**
   * determines how keyboard movement affects the selection cursor
   */
  private $keyActions: KeyActions = keyActionPresets.flat.vertical;
  /**
   * whether selection should wrap when the user reaches the end
   */
  private $wrap: boolean = true;

  /** the guts of the selection tree and index movement logic */
  private trackingSystem: SelectionTrackingSystem;
  /** mandatory unique ID used to construct element ids and link them */
  readonly id: string;

  private previousSelectedKey: string | null = null;

  constructor({
    initialSelectedKey,
    activeOptionFollowsSelection = false,
    id,
    keyActions = keyActionPresets.flat.vertical,
    wrap = true,
  }: {
    initialSelectedKey?: string;
    activeOptionFollowsSelection?: boolean;
    id?: string;
    keyActions?: KeyActions;
    wrap?: boolean;
  } = {}) {
    super();

    this.trackingSystem = new SelectionTrackingSystem({
      initialSelectedKey,
      activeOptionFollowsSelection,
    });
    this.$keyActions = keyActions;
    this.$wrap = wrap;
    this.id = id || generateId('select');

    this.trackingSystem.on(
      SelectionTrackingChangeEventType,
      this.handleTrackingChange,
    );
  }

  get keyActions() {
    return this.$keyActions;
  }
  set keyActions(keyActions: KeyActions) {
    this.$keyActions = keyActions;
  }

  get wrap() {
    return this.$wrap;
  }
  set wrap(wrap: boolean) {
    this.$wrap = wrap;
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

    if (event.selectedKey !== this.previousSelectedKey) {
      this.previousSelectedKey = event.selectedKey;
      this.emit(
        SelectionSystemChangeEventType,
        new SelectionSystemChangeEvent(event.selectedKey),
      );
    }
  };

  private handleFocusElementKeyDown = (ev: KeyboardEvent) => {
    processKeyboardEvent(
      {
        goToNext: this.trackingSystem.goToNext,
        goToPrevious: this.trackingSystem.goToPrevious,
        goUp: this.trackingSystem.goUp,
        goDown: this.trackingSystem.goDown,
        goToNextOrthogonal: this.trackingSystem.goToNextOrthogonal,
        goToPreviousOrthogonal: this.trackingSystem.goToPreviousOrthogonal,
        select: () =>
          this.trackingSystem.setSelectedKey(this.trackingSystem.activeKey),
      },
      this.$keyActions,
      ev,
      this.$wrap,
    );
  };

  private setupFocusElement = (element: HTMLElement) => {
    element.id = getSelectFocusElementId(this.id);
    element.setAttribute(
      FOCUS_ELEMENT_CONTROLS_ATTRIBUTE,
      getSelectItemsContainerId(this.id),
    );
    element.addEventListener('keydown', this.handleFocusElementKeyDown);
  };

  private teardownFocusElement = (element: HTMLElement) => {
    element.removeEventListener('keydown', this.handleFocusElementKeyDown);
    // TODO: consider removing attributes
  };

  get focusElement() {
    return this.$focusElement;
  }
  set focusElement(element: HTMLElement | null) {
    if (this.$focusElement) {
      this.teardownFocusElement(this.$focusElement);
    }
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

  get selectedKey() {
    return this.trackingSystem.selectedKey;
  }
  set selectedKey(selectedKey: string | null) {
    this.trackingSystem.setSelectedKey(selectedKey);
  }

  private handleItemClick = (ev: MouseEvent) => {
    if (!ev.currentTarget) return;
    const value = (ev.currentTarget as HTMLElement).getAttribute(
      KEY_DATA_ATTRIBUTE,
    );
    this.trackingSystem.setSelectedKey(value);
  };

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
    element.addEventListener('click', this.handleItemClick);
  };

  removeItem = (element: HTMLElement) => {
    element.removeEventListener('click', this.handleItemClick);
    // TODO: consider unsetting attributes
  };
}
