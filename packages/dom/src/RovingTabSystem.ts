import { EventEmitter } from 'events';
import {
  SelectionTrackingSystem,
  SelectionTrackingChangeEventType,
  SelectionTrackingChangeEvent,
  generateId,
  getRovingTabContainerId,
  KeyActions,
  keyActionPresets,
  KEY_DATA_ATTRIBUTE,
  DISABLED_ATTRIBUTE,
  X_INDEX_DATA_ATTRIBUTE,
  Y_INDEX_DATA_ATTRIBUTE,
  processKeyboardEvent,
} from '@dimension/core';

export const RovingTabSystemChangeEventType = 'RovingTabSystemChange';
export class RovingTabSystemChangeEvent {
  readonly selectedKey: string | null;

  constructor(selectedKey: string | null) {
    this.selectedKey = selectedKey;
  }
}

export class RovingTabSystem extends EventEmitter {
  /** DOM reference to the element which contains all selectable items */
  private $containerElement: HTMLElement | null = null;
  /**
   * determines whether the cursor should follow when the value
   * is programmatically changed
   */
  private $activeOptionFollowsSelection: boolean = false;
  /**
   * determines how keyboard movement affects the selection cursor
   */
  private $keyActions: KeyActions = keyActionPresets.flat.any;
  /**
   * whether selection should wrap when the user reaches the end
   */
  private $wrap: boolean = true;

  /** the cuts of the selection tree and index movement logic */
  private trackingSystem: SelectionTrackingSystem;
  /** mandatory unique ID used to construct element ids and link them */
  readonly id: string;

  private previousSelectedKey: string | null = null;
  private previousActiveElement: HTMLElement | null = null;

  constructor({
    initialSelectedKey,
    activeOptionFollowsSelection = false,
    id,
    keyActions = keyActionPresets.flat.any,
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
    });
    this.$activeOptionFollowsSelection = activeOptionFollowsSelection;
    this.$keyActions = keyActions;
    this.$wrap = wrap;
    this.id = id || generateId('widget');

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
    if (this.$containerElement) {
      const activeElement = event.activeElement;
      // FIXME there may be a more elegant way to do this...
      if (
        this.previousActiveElement &&
        this.previousActiveElement !== activeElement
      ) {
        this.previousActiveElement.setAttribute('tabindex', '-1');
      }
      if (activeElement) {
        activeElement.setAttribute('tabindex', '0');
        activeElement.focus();
      }
      this.previousActiveElement = activeElement;
    }

    if (event.selectedKey !== this.previousSelectedKey) {
      this.previousSelectedKey = event.selectedKey;
      this.emit(
        RovingTabSystemChangeEventType,
        new RovingTabSystemChangeEvent(event.selectedKey),
      );
    }
  };

  private setupContainerElement = (element: HTMLElement) => {
    element.id = getRovingTabContainerId(this.id);
  };

  get containerElement() {
    return this.$containerElement;
  }
  set containerElement(element: HTMLElement | null) {
    this.$containerElement = element;
    this.trackingSystem.observe(element);
    if (element) {
      this.setupContainerElement(element);
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

  private handleItemClick = (ev: MouseEvent) => {
    if (!ev.currentTarget) return;
    const value = (ev.currentTarget as HTMLElement).getAttribute(
      KEY_DATA_ATTRIBUTE,
    );
    this.trackingSystem.setSelectedKey(value);
  };

  private handleItemKeyDown = (ev: KeyboardEvent) => {
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
    element.addEventListener('click', this.handleItemClick);
    element.addEventListener('keydown', this.handleItemKeyDown);
  };

  removeItem = (element: HTMLElement) => {
    element.removeEventListener('click', this.handleItemClick);
    element.removeEventListener('keydown', this.handleItemKeyDown);
    // TODO: consider unsetting attributes
  };
}
