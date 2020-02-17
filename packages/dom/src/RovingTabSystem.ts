import {
  SelectionTrackingSystem,
  SelectionTrackingChangeEventType,
  SelectionTrackingChangeEvent,
  generateId,
  getRovingTabContainerId,
} from '@dimension/core';

export class RovingTabSystem {
  /** DOM reference to the element which contains all selectable items */
  private $containerElement: HTMLElement | null = null;
  /**
   * determines whether the cursor should follow when the value
   * is programmatically changed
   */
  private $activeOptionFollowsSelection: boolean = false;

  /** the cuts of the selection tree and index movement logic */
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
    this.id = id || generateId('widget');

    this.trackingSystem.addEventListener(
      SelectionTrackingChangeEventType,
      this.handleTrackingChange as any,
    );
  }

  private handleTrackingChange = (event: SelectionTrackingChangeEvent) => {
    if (this.$containerElement) {
      const activeElement = event.activeElement;
      if (activeElement) {
        activeElement.focus();
      }
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
}
