import * as React from 'react';
import { SelectionItem } from '../src/components/SelectionItem';
import { SelectionItemsContainer } from '../src/components/SelectionItemsContainer';
import { SelectionProvider } from '../src/contexts/selection';
import { SelectionFocusElement } from '../src/components/SelectionFocusElement';
import { keyActionPresets } from '@dimension/core';

export default {
  title: 'Date Picker',
};

const Day = React.forwardRef<
  HTMLDivElement,
  { week: number; weekDay: number; value: Date }
>(({ week, weekDay, value }, ref) => (
  <SelectionItem
    value={getDateValue(value)}
    className="calendar-day"
    component="div"
    coordinate={[weekDay, week]}
    activeProps={{
      style: {
        gridColumn: `${weekDay + 1} / span 1`,
        gridRow: `${week + 1} / span 1`,
        backgroundColor: 'lightblue',
      },
    }}
    selectedProps={{
      style: {
        gridColumn: `${weekDay + 1} / span 1`,
        gridRow: `${week + 1} / span 1`,
        backgroundColor: 'lightgray',
      },
    }}
    ref={ref}
    style={{
      gridColumn: `${weekDay + 1} / span 1`,
      gridRow: `${week + 1} / span 1`,
    }}
  >
    {value.getDate().toString()}
  </SelectionItem>
));

const DayGrid = React.forwardRef<
  HTMLDivElement,
  { month: number; year: number }
>(({ month, year }, ref) => {
  const weeks = getMonthWeeks(year, month);

  return (
    <SelectionItemsContainer
      ref={ref}
      className="calendar-grid"
      component="div"
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${weeks.length}, 1fr)`,
        gridTemplateColumns: `repeat(7, 1fr)`,
      }}
    >
      {weeks.map((week, weekIndex) =>
        week.map(
          (dayOrNull, dayIndex) =>
            dayOrNull && (
              <Day weekDay={dayIndex} week={weekIndex} value={dayOrNull} />
            ),
        ),
      )}
    </SelectionItemsContainer>
  );
});

export const DatePickerDemo = () => {
  const [value, setValue] = React.useState<string | null>(
    getDateValue(new Date()),
  );
  const [displayedMonth, setDisplayedMonth] = React.useState(new Date());

  return (
    <div className="datepicker">
      <SelectionProvider value={value} onChange={setValue}>
        <SelectionFocusElement
          keyActions={keyActionPresets.grid.horizontal}
          value={value}
        />
        <DayGrid
          year={displayedMonth.getFullYear()}
          month={displayedMonth.getMonth()}
        />
      </SelectionProvider>
    </div>
  );
};

/**
 * Returns the days in a month, partitioned by week, with each day
 * placed in the corresponding index of each week array according to
 * the day of the week it represents (weeks start on Sunday).
 * For instance, if the month begins on Wednesday, the return value may look like:
 * [
 *   [null, null, null, Date, Date, Date, Date],
 *   [Date, Date, Date, Date, Date, Date, Date],
 *   ...
 * ]
 */
const getMonthWeeks = (year: number, month: number) => {
  const date = new Date(year, month, 1);

  // first, since we accept any number for month, we grab and store the 'resolved'
  // values. For instance, if the user passes month=15, after we've put it in a date
  // above, we can then pull out the resolved month of April of the following year.
  const resolvedMonth = date.getMonth();

  // nulls to avoid sparse arrays, which behave strangely with .map
  const weeks: (Date | null)[][] = [[null, null, null, null, null, null, null]];
  let currentWeek = 0;

  while (date.getMonth() === resolvedMonth) {
    weeks[currentWeek][date.getDay()] = new Date(date);
    date.setDate(date.getDate() + 1);
    if (date.getDay() === 0 && date.getMonth() === resolvedMonth) {
      weeks.push([null, null, null, null, null, null, null]);
      currentWeek++;
    }
  }
  return weeks;
};

/**
 * Returns a stable string value for any particular day.
 */
const getDateValue = (date: Date) => {
  const copy = new Date(date);
  copy.setMilliseconds(0);
  copy.setSeconds(0);
  copy.setMinutes(0);
  copy.setHours(0);
  return copy.toUTCString();
};
