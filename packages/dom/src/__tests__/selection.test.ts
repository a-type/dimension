import {
  SelectionSystem,
  SelectionSystemChangeEvent,
  SelectionSystemChangeEventType,
} from '../SelectionSystem';
import { KeyCode } from '@dimension/core';
import { getByTestId, fireEvent, wait } from '@testing-library/dom';

function getExampleDOM(onChange: (newValue: string) => void) {
  const root = document.createElement('div');
  root.innerHTML = `
    <input data-testid="input" />
    <ul data-testid="itemsContainer">
    </ul>
  `;

  const system = new SelectionSystem();
  system.on(SelectionSystemChangeEventType, (ev: SelectionSystemChangeEvent) =>
    onChange(ev.selectedKey),
  );

  const input = root.querySelector('input');
  const itemsContainer = root.querySelector('[data-testid="itemsContainer"]');

  system.focusElement = input;
  system.itemsContainerElement = itemsContainer as HTMLElement;

  for (let i = 0; i < 3; i++) {
    const item = document.createElement('li');
    item.setAttribute('data-testid', `item-${i}`);
    system.addItem(item, {
      key: `${i}`,
    });
    itemsContainer.appendChild(item);
  }

  return root;
}

describe('selection system integration', () => {
  it('can move selection through a vertical list', async () => {
    const onChange = jest.fn();
    const container = getExampleDOM(onChange);
    const itemsContainer = getByTestId(container, 'itemsContainer');
    const input = getByTestId(container, 'input');
    const item0 = getByTestId(container, 'item-0');
    const item1 = getByTestId(container, 'item-1');
    const item2 = getByTestId(container, 'item-2');

    await wait(() => {
      expect(input).toHaveAttribute('aria-controls', itemsContainer.id);
    });

    input.focus();

    await wait(() => {
      expect(itemsContainer).toHaveAttribute('aria-activedescendant', item0.id);
    });

    fireEvent.keyDown(input, {
      keyCode: KeyCode.ArrowDown,
    });

    await wait(() => {
      expect(itemsContainer).toHaveAttribute('aria-activedescendant', item1.id);
    });

    fireEvent.keyDown(input, {
      keyCode: KeyCode.Enter,
    });

    await wait(() => {
      expect(onChange).toHaveBeenCalledWith('1');
    });

    fireEvent.keyDown(input, {
      keyCode: KeyCode.ArrowDown,
    });
    fireEvent.keyDown(input, {
      keyCode: KeyCode.ArrowDown,
    });

    await wait(() => {
      expect(itemsContainer).toHaveAttribute('aria-activedescendant', item0.id);
    });

    fireEvent.keyDown(input, {
      keyCode: KeyCode.ArrowUp,
    });

    await wait(() => {
      expect(itemsContainer).toHaveAttribute('aria-activedescendant', item2.id);
    });
  });
});
