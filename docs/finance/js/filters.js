function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function monthsBefore(date, n) {
  return new Date(date.getFullYear(), date.getMonth() - n, date.getDate());
}

function parseDateInput(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function parseRowDate(row) {
  if (!row.Date) return null;
  return parseDateInput(row.Date.substring(0, 10));
}

// preset is one of: all, thisMonth, lastMonth, last3, last6, last12, lastN, custom
function getDateRangeForPreset(preset, months, customFrom, customTo) {
  const today = startOfDay(new Date());

  switch (preset) {
    case 'thisMonth':
      return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: today };
    case 'lastMonth':
      return {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0)
      };
    case 'last3':
      return { start: monthsBefore(today, 3), end: today };
    case 'last6':
      return { start: monthsBefore(today, 6), end: today };
    case 'last12':
      return { start: monthsBefore(today, 12), end: today };
    case 'lastN':
      return { start: monthsBefore(today, months || 1), end: today };
    case 'custom':
      return { start: parseDateInput(customFrom), end: parseDateInput(customTo) };
    case 'all':
    default:
      return { start: null, end: null };
  }
}

function filterRowsByDate(rows, start, end) {
  if (!start && !end) return rows;
  return rows.filter(row => {
    const d = parseRowDate(row);
    if (!d) return false;
    if (start && d < start) return false;
    if (end && d > end) return false;
    return true;
  });
}
