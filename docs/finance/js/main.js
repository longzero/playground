let allRows = [];
let activeFilter = { preset: 'all', months: 1, from: null, to: null };
let whatIfState = { noIncome: false, spendingPct: 0, extraExpense: 0 };

document.addEventListener('DOMContentLoaded', () => {
  parseCSV(sampleCSV, loadRows);

  document.getElementById('csvFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      parseCSVFile(file, loadRows);
    }
  });

  setUpFilterControls();
  setUpWhatIfControls();

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', refreshDashboard);
  }
});

function setUpFilterControls() {
  const presetEl = document.getElementById('datePreset');
  const monthsEl = document.getElementById('presetMonths');
  const fromEl = document.getElementById('rangeFrom');
  const toEl = document.getElementById('rangeTo');

  presetEl.addEventListener('change', () => {
    activeFilter.preset = presetEl.value;
    updateFilterControlsVisibility();
    refreshDashboard();
  });

  monthsEl.addEventListener('change', () => {
    activeFilter.months = parseInt(monthsEl.value, 10) || 1;
    refreshDashboard();
  });

  fromEl.addEventListener('change', () => {
    activeFilter.from = fromEl.value;
    refreshDashboard();
  });

  toEl.addEventListener('change', () => {
    activeFilter.to = toEl.value;
    refreshDashboard();
  });
}

function setUpWhatIfControls() {
  const noIncomeEl = document.getElementById('whatIfNoIncome');
  const spendingPctEl = document.getElementById('whatIfSpendingPct');
  const spendingPctLabelEl = document.getElementById('whatIfSpendingPctLabel');
  const extraExpenseEl = document.getElementById('whatIfExtraExpense');

  noIncomeEl.addEventListener('change', () => {
    whatIfState.noIncome = noIncomeEl.checked;
    refreshDashboard();
  });

  spendingPctEl.addEventListener('input', () => {
    whatIfState.spendingPct = parseInt(spendingPctEl.value, 10) || 0;
    spendingPctLabelEl.textContent = `${whatIfState.spendingPct}%`;
    refreshDashboard();
  });

  extraExpenseEl.addEventListener('input', () => {
    whatIfState.extraExpense = parseFloat(extraExpenseEl.value) || 0;
    refreshDashboard();
  });
}

function updateFilterControlsVisibility() {
  document.getElementById('lastNWrapper').hidden = activeFilter.preset !== 'lastN';
  document.getElementById('customRangeWrapper').hidden = activeFilter.preset !== 'custom';
}

function resetFilterToAll() {
  activeFilter = { preset: 'all', months: 1, from: null, to: null };
  document.getElementById('datePreset').value = 'all';
  document.getElementById('rangeFrom').value = '';
  document.getElementById('rangeTo').value = '';
  updateFilterControlsVisibility();
}

function loadRows(rows) {
  allRows = rows;
  resetFilterToAll();
  refreshDashboard();
}

// Single entry point for re-rendering everything from allRows.
// Any future feature (date filters, dark mode, what-if) should change
// state and call this, rather than wiring up its own render calls.
function refreshDashboard() {
  const { start, end } = getDateRangeForPreset(
    activeFilter.preset, activeFilter.months, activeFilter.from, activeFilter.to
  );
  const rows = filterRowsByDate(allRows, start, end);
  const recurringMerchants = detectRecurringMerchants(allRows);

  let totalSpending = 0;
  let totalIncome = 0;
  const monthlyData = {};
  const merchantData = {};
  const monthlySplit = {};
  const monthlyMerchantBreakdown = {};
  const tableBodyData = [];
  const balancePoints = [];
  const largeTransactionCandidates = [];

  rows.forEach(row => {
    const loads = parseFloat(row.Loads) || 0;
    const withdrawal = parseFloat(row.Withdrawal) || 0;
    const dateStr = row.Date ? row.Date.substring(0, 7) : 'Unknown';
    const merchant = row.Transaction ? row.Transaction.trim() : 'Uncategorized';

    balancePoints.push({
      date: row.Date ? row.Date.substring(0, 10) : '',
      balance: parseFloat(row.Balance) || 0
    });

    totalIncome += loads;
    totalSpending += withdrawal;

    if (!monthlyData[dateStr]) {
      monthlyData[dateStr] = { income: 0, spending: 0 };
    }
    monthlyData[dateStr].income += loads;
    monthlyData[dateStr].spending += withdrawal;

    if (withdrawal > 0) {
      merchantData[merchant] = (merchantData[merchant] || 0) + withdrawal;

      if (!monthlySplit[dateStr]) monthlySplit[dateStr] = { fixed: 0, discretionary: 0 };
      if (!monthlyMerchantBreakdown[dateStr]) monthlyMerchantBreakdown[dateStr] = { fixed: {}, discretionary: {} };

      const category = recurringMerchants.has(merchant) ? 'fixed' : 'discretionary';
      monthlySplit[dateStr][category] += withdrawal;
      monthlyMerchantBreakdown[dateStr][category][merchant] =
        (monthlyMerchantBreakdown[dateStr][category][merchant] || 0) + withdrawal;

      largeTransactionCandidates.push({
        date: row.Date ? row.Date.substring(0, 10) : '',
        merchant,
        amount: withdrawal
      });
    }

    tableBodyData.push([
      row.Date ? row.Date.substring(0, 10) : '',
      merchant,
      loads.toFixed(2),
      withdrawal.toFixed(2),
      parseFloat(row.Balance || 0).toFixed(2),
      row.Notes || ''
    ]);
  });

  document.getElementById('kpiSpending').textContent = `$${totalSpending.toFixed(2)}`;
  document.getElementById('kpiIncome').textContent = `$${totalIncome.toFixed(2)}`;
  document.getElementById('kpiNet').textContent = `$${(totalIncome - totalSpending).toFixed(2)}`;

  const savingsRateData = {};
  Object.keys(monthlyData).forEach(month => {
    const { income, spending } = monthlyData[month];
    savingsRateData[month] = income > 0 ? ((income - spending) / income) * 100 : null;
  });

  const monthlyIncomeValues = Object.keys(monthlyData).map(m => monthlyData[m].income);
  const incomeVolatility = computeIncomeVolatility(monthlyIncomeValues);

  const monthCount = Object.keys(monthlyData).length;
  const avgMonthlyIncome = monthCount > 0 ? totalIncome / monthCount : 0;

  const totalFixed = Object.values(monthlySplit).reduce((sum, m) => sum + m.fixed, 0);
  const totalDiscretionary = Object.values(monthlySplit).reduce((sum, m) => sum + m.discretionary, 0);
  const avgMonthlyFixed = monthCount > 0 ? totalFixed / monthCount : 0;
  const avgMonthlyDiscretionary = monthCount > 0 ? totalDiscretionary / monthCount : 0;

  const effectiveIncome = whatIfState.noIncome ? 0 : avgMonthlyIncome;
  const effectiveSpending = Math.max(0,
    avgMonthlyFixed + avgMonthlyDiscretionary * (1 + whatIfState.spendingPct / 100) + whatIfState.extraExpense
  );

  const sortedBalancePoints = [...balancePoints].sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
  const latestBalance = sortedBalancePoints.length > 0
    ? sortedBalancePoints[sortedBalancePoints.length - 1].balance
    : 0;

  const runwayMonths = calculateRunwayMonths(latestBalance, effectiveIncome, effectiveSpending);
  const projectedSnapshots = projectBalance(latestBalance, effectiveIncome, effectiveSpending, 6);

  const largestTransactions = [...largeTransactionCandidates]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);
  const weekdayTotals = computeSpendingByWeekday(rows);

  renderBalanceChart(balancePoints, projectedSnapshots);
  renderMonthlyChart(monthlyData);
  renderMerchantChart(merchantData);
  renderDiscretionaryChart(monthlySplit, monthlyMerchantBreakdown);
  renderSavingsRateChart(savingsRateData);
  renderDataTable(tableBodyData);
  renderLargestTransactions(largestTransactions);
  renderDayOfWeekHeatmap(weekdayTotals);
  renderRecurringMerchants(recurringMerchants);
  updateDiscretionaryCaption(recurringMerchants);
  renderIncomeVolatility(incomeVolatility);
  renderWhatIfStats(effectiveIncome - effectiveSpending, runwayMonths);
}

function renderDayOfWeekHeatmap(weekdayTotals) {
  const container = document.getElementById('dayOfWeekHeatmap');
  container.innerHTML = '';

  const maxTotal = Math.max(...weekdayTotals, 0.01);
  weekdayTotals.forEach((amount, i) => {
    const intensity = 0.12 + (amount / maxTotal) * 0.43;
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.style.backgroundColor = `rgba(59, 130, 246, ${intensity})`;
    cell.innerHTML =
      `<div class="heatmap-cell-label">${WEEKDAY_LABELS[i]}</div>` +
      `<div class="heatmap-cell-value">$${amount.toFixed(0)}</div>`;
    container.appendChild(cell);
  });
}

function renderWhatIfStats(netMonthly, runwayMonths) {
  document.getElementById('whatIfNetMonthly').textContent = `$${netMonthly.toFixed(2)}`;
  document.getElementById('whatIfRunway').textContent = formatRunway(runwayMonths);
}

function renderIncomeVolatility(stats) {
  document.getElementById('volAvg').textContent = `$${stats.avg.toFixed(2)}`;
  document.getElementById('volMin').textContent = `$${stats.min.toFixed(2)}`;
  document.getElementById('volMax').textContent = `$${stats.max.toFixed(2)}`;
  document.getElementById('volStdDev').textContent = `$${stats.stdDev.toFixed(2)}`;
}

function renderRecurringMerchants(recurringSet) {
  const el = document.getElementById('recurringList');
  el.textContent = recurringSet.size === 0
    ? 'None detected'
    : Array.from(recurringSet).sort().join(', ');
}

function updateDiscretionaryCaption(recurringSet) {
  const el = document.getElementById('discretionaryCaption');
  const list = recurringSet.size === 0 ? 'none detected yet' : Array.from(recurringSet).sort().join(', ');
  el.textContent = `Fixed = recurring bills (${list}). Discretionary = everything else. Hover a bar for the merchant breakdown.`;
}
