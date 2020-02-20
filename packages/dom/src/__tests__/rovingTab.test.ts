import {
  RovingTabSystem,
  RovingTabSystemChangeEvent,
  RovingTabSystemChangeEventType,
} from '../RovingTabSystem';
import { KeyCode } from '@dimension/core';
import { getByTestId, fireEvent, wait } from '@testing-library/dom';

function getExampleDOM(onChange: (newValue: string | null) => void) {
  const root = document.createElement('div');
  root.innerHTML = `
    <div data-testid="container">
    </div>
  `;

  const system = new RovingTabSystem();
  system.on(RovingTabSystemChangeEventType, (ev: RovingTabSystemChangeEvent) =>
    onChange(ev.selectedKey),
  );

  const container = root.querySelector('[data-testid="container"]');
  if (!container)
    throw new Error("Couldn't find the container (check the dom above)");

  system.containerElement = container as HTMLElement;

  for (let i = 0; i < 3; i++) {
    const item = document.createElement('li');
    item.setAttribute('data-testid', `item-${i}`);
    system.addItem(item, {
      key: `${i}`,
    });
    container.appendChild(item);
  }

  return root;
}

describe('selection system integration', () => {
  it('can move selection through a vertical list', async () => {
    const onChange = jest.fn();
    const root = getExampleDOM(onChange);
    const item0 = getByTestId(root, 'item-0');
    item0.focus = jest.fn();
    const item1 = getByTestId(root, 'item-1');
    item1.focus = jest.fn();
    const item2 = getByTestId(root, 'item-2');
    item2.focus = jest.fn();

    await wait(() => {
      expect(item0).toHaveAttribute('tabindex', '0');
    });

    item0.focus();

    fireEvent.keyDown(item0, {
      keyCode: KeyCode.ArrowRight,
    });

    await wait(() => {
      expect(item0).toHaveAttribute('tabindex', '-1');
      expect(item1).toHaveAttribute('tabindex', '0');
      expect(item1.focus).toHaveBeenCalled();
    });

    (item1.focus as jest.Mock).mockReset();

    fireEvent.keyDown(item1, {
      keyCode: KeyCode.Enter,
    });

    await wait(() => {
      expect(onChange).toHaveBeenCalledWith('1');
    });

    fireEvent.keyDown(item1, {
      keyCode: KeyCode.ArrowRight,
    });
    fireEvent.keyDown(item2, {
      keyCode: KeyCode.ArrowRight,
    });

    await wait(() => {
      expect(item0.focus).toHaveBeenCalled();
    });
    (item0.focus as jest.Mock).mockReset();

    fireEvent.keyDown(item0, {
      keyCode: KeyCode.ArrowLeft,
    });

    await wait(() => {
      expect(item2.focus).toHaveBeenCalled();
    });
    (item2.focus as jest.Mock).mockReset();
  });
});
