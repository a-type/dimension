import React from 'react';
import { render, act, fireEvent, wait } from '@testing-library/react';
import { RovingTabContainer } from '../contexts/rovingTab';
import { RovingTabItem } from '../components/RovingTabItem';
import { KeyCode } from '@dimension/core';

describe('selection system integration', () => {
  it('can select via keyboard on a vertical list', async () => {
    const onChange = jest.fn();

    const result = render(
      <RovingTabContainer onChange={onChange}>
        <RovingTabItem value="0" data-testid="item-0">
          0
        </RovingTabItem>
        <RovingTabItem value="1" data-testid="item-1">
          1
        </RovingTabItem>
        <RovingTabItem value="2" data-testid="item-2">
          2
        </RovingTabItem>
      </RovingTabContainer>,
    );

    await wait(() => {
      expect(result.getByTestId('item-0')).toHaveAttribute('tabindex', '0');
      expect(result.getByTestId('item-1')).toHaveAttribute('tabindex', '-1');
      expect(result.getByTestId('item-2')).toHaveAttribute('tabindex', '-1');
    });

    act(() => {
      fireEvent.focus(result.getByTestId('item-0'));
    });

    await wait(() => {
      expect(result.getByTestId('item-0')).toHaveFocus();
    });

    act(() => {
      fireEvent.keyDown(result.getByTestId('item-0'), {
        keyCode: KeyCode.ArrowRight,
      });
    });

    await wait(() => {
      expect(result.getByTestId('item-0')).toHaveAttribute('tabindex', '-1');
      expect(result.getByTestId('item-1')).toHaveAttribute('tabindex', '0');
      expect(result.getByTestId('item-1')).toHaveFocus();
    });

    act(() => {
      fireEvent.keyDown(result.getByTestId('item-1'), {
        keyCode: KeyCode.Enter,
      });
    });

    await wait(() => {
      expect(onChange).toHaveBeenCalledWith('1');
    });

    await wait(() => {
      expect(result.getByTestId('item-1')).toHaveAttribute(
        'aria-checked',
        'true',
      );
    });

    act(() => {
      fireEvent.keyDown(result.getByTestId('item-1'), {
        keyCode: KeyCode.ArrowDown,
      });
      fireEvent.keyDown(result.getByTestId('item-2'), {
        keyCode: KeyCode.ArrowDown,
      });
    });

    await wait(() => {
      expect(result.getByTestId('item-0')).toHaveFocus();
    });

    act(() => {
      fireEvent.keyDown(result.getByTestId('item-0'), {
        keyCode: KeyCode.ArrowUp,
      });
    });

    await wait(() => {
      expect(result.getByTestId('item-2')).toHaveFocus();
    });
  });
});
