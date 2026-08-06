// Projects balance forward month by month using a constant net monthly
// change. Returns an array of { month, balance } for months 1..months.
function projectBalance(startBalance, monthlyIncome, monthlySpending, months) {
  const snapshots = [];
  let balance = startBalance;
  for (let i = 1; i <= months; i++) {
    balance += monthlyIncome - monthlySpending;
    snapshots.push({ month: i, balance });
  }
  return snapshots;
}

// Months until balance reaches 0 at the given constant monthly net change.
// Returns null when balance is stable or growing (never reaches 0).
function calculateRunwayMonths(startBalance, monthlyIncome, monthlySpending) {
  const netMonthly = monthlyIncome - monthlySpending;
  if (netMonthly >= 0) return null;
  if (startBalance <= 0) return 0;
  return startBalance / -netMonthly;
}

function formatRunway(months) {
  if (months === null) return 'Balance is stable or growing — no runway limit';
  if (months <= 0) return 'Already at or below $0';

  const wholeMonths = Math.floor(months);
  const remDays = Math.round((months - wholeMonths) * 30);
  const monthPart = wholeMonths > 0 ? `${wholeMonths} month${wholeMonths === 1 ? '' : 's'}` : '';
  const dayPart = `${remDays} day${remDays === 1 ? '' : 's'}`;
  return `~${[monthPart, dayPart].filter(Boolean).join(', ')}`;
}
