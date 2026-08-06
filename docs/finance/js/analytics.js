function monthKey(dateStr) {
  return dateStr ? dateStr.substring(0, 7) : '';
}

// Flags a merchant as recurring when it shows up in at least `minMonths`
// distinct months with fairly consistent withdrawal amounts (coefficient
// of variation under `maxVariance`) - a proxy for subscriptions/bills.
function detectRecurringMerchants(rows, options) {
  const minMonths = (options && options.minMonths) || 3;
  const maxVariance = (options && options.maxVariance) || 0.2;

  const byMerchant = {};
  rows.forEach(row => {
    const withdrawal = parseFloat(row.Withdrawal) || 0;
    if (withdrawal <= 0) return;
    const merchant = row.Transaction ? row.Transaction.trim() : 'Uncategorized';
    const month = monthKey(row.Date ? row.Date.substring(0, 10) : '');

    if (!byMerchant[merchant]) byMerchant[merchant] = { months: new Set(), amounts: [] };
    byMerchant[merchant].months.add(month);
    byMerchant[merchant].amounts.push(withdrawal);
  });

  const recurring = new Set();
  Object.keys(byMerchant).forEach(merchant => {
    const { months, amounts } = byMerchant[merchant];
    if (months.size < minMonths) return;

    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    if (mean === 0) return;

    const variance = amounts.reduce((sum, a) => sum + (a - mean) ** 2, 0) / amounts.length;
    const coefficientOfVariation = Math.sqrt(variance) / mean;

    if (coefficientOfVariation <= maxVariance) recurring.add(merchant);
  });

  return recurring;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Returns totals[0..6] (Sun..Sat) of withdrawal amounts by day-of-week.
function computeSpendingByWeekday(rows) {
  const totals = new Array(7).fill(0);

  rows.forEach(row => {
    const withdrawal = parseFloat(row.Withdrawal) || 0;
    if (withdrawal <= 0 || !row.Date) return;

    const [year, month, day] = row.Date.substring(0, 10).split('-').map(Number);
    if (!year || !month || !day) return;

    const weekday = new Date(year, month - 1, day).getDay();
    totals[weekday] += withdrawal;
  });

  return totals;
}

function computeIncomeVolatility(monthlyIncomeValues) {
  if (monthlyIncomeValues.length === 0) {
    return { avg: 0, min: 0, max: 0, stdDev: 0 };
  }

  const avg = monthlyIncomeValues.reduce((a, b) => a + b, 0) / monthlyIncomeValues.length;
  const min = Math.min(...monthlyIncomeValues);
  const max = Math.max(...monthlyIncomeValues);
  const variance = monthlyIncomeValues.reduce((sum, v) => sum + (v - avg) ** 2, 0) / monthlyIncomeValues.length;

  return { avg, min, max, stdDev: Math.sqrt(variance) };
}
