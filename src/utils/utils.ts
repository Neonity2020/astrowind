import { I18N } from 'astrowind:config';

export const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(I18N?.language, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export const getFormattedDate = (date: Date): string => (date ? formatter.format(date) : '');

export const trim = (str = '', ch?: string) => {
  let start = 0,
    end = str.length || 0;
  while (start < end && str[start] === ch) ++start;
  while (end > start && str[end - 1] === ch) --end;
  return start > 0 || end < str.length ? str.substring(start, end) : str;
};

/** Grid column classes for the `columns` prop shared by several widgets. */
export const getColumnsClass = (columns?: number, fallback = ''): string =>
  columns === 4
    ? 'lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2'
    : columns === 3
      ? 'lg:grid-cols-3 sm:grid-cols-2'
      : columns === 2
        ? 'sm:grid-cols-2'
        : fallback;
