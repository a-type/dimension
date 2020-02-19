import React from 'react';
import { render, act, fireEvent, wait } from '@testing-library/react';
import { SelectionProvider } from '../contexts/selection';
import { SelectionFocusElement } from '../components/SelectionFocusElement';
import { SelectionItemsContainer } from '../components/SelectionItemsContainer';
import { SelectionItem } from '../components/SelectionItem';
import { KeyCode } from '@dimension/core';

describe('selection system integration', () => {
  it('can select via keyboard on a vertical list', async () => {
    const onChange = jest.fn();

    const result = render(
      <SelectionProvider onChange={onChange}>
        <div data-testid="root">
          <SelectionFocusElement data-testid="input" />
          <SelectionItemsContainer data-testid="itemsContainer">
            <SelectionItem value="0" data-testid="item-0">
              0
            </SelectionItem>
            <SelectionItem value="1" data-testid="item-1">
              1
            </SelectionItem>
            <SelectionItem value="2" data-testid="item-2">
              2
            </SelectionItem>
          </SelectionItemsContainer>
        </div>
      </SelectionProvider>,
    );

    await wait(() => {
      const containerElement = result.getByTestId('itemsContainer');
      const containerId = containerElement.id;

      expect(result.getByTestId('input')).toHaveAttribute(
        'aria-controls',
        containerId,
      );
    });

    act(() => {
      fireEvent.focus(result.getByTestId('input'));
    });

    await wait(() => {
      const itemElement = result.getByTestId('item-0');
      const itemId = itemElement.id;

      expect(result.getByTestId('itemsContainer')).toHaveAttribute(
        'aria-activedescendant',
        itemId,
      );
    });

    act(() => {
      fireEvent.keyDown(result.getByTestId('input'), {
        keyCode: KeyCode.ArrowDown,
      });
    });

    await wait(() => {
      const itemElement = result.getByTestId('item-1');
      const itemId = itemElement.id;

      expect(result.getByTestId('itemsContainer')).toHaveAttribute(
        'aria-activedescendant',
        itemId,
      );
    });

    act(() => {
      fireEvent.keyDown(result.getByTestId('input'), {
        keyCode: KeyCode.Enter,
      });
    });

    await wait(() => {
      expect(onChange).toHaveBeenCalledWith('1');
    });

    await wait(() => {
      expect(result.getByTestId('item-1')).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    act(() => {
      fireEvent.keyDown(result.getByTestId('input'), {
        keyCode: KeyCode.ArrowDown,
      });
      fireEvent.keyDown(result.getByTestId('input'), {
        keyCode: KeyCode.ArrowDown,
      });
    });

    await wait(() => {
      const itemElement = result.getByTestId('item-0');
      const itemId = itemElement.id;

      expect(result.getByTestId('itemsContainer')).toHaveAttribute(
        'aria-activedescendant',
        itemId,
      );
    });

    act(() => {
      fireEvent.keyDown(result.getByTestId('input'), {
        keyCode: KeyCode.ArrowUp,
      });
    });

    await wait(() => {
      const itemElement = result.getByTestId('item-2');
      const itemId = itemElement.id;

      expect(result.getByTestId('itemsContainer')).toHaveAttribute(
        'aria-activedescendant',
        itemId,
      );
    });
  });
});
