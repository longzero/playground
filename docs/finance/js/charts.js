let monthlyChartInstance = null;
let merchantChartInstance = null;
let balanceChartInstance = null;
let discretionaryChartInstance = null;
let savingsRateChartInstance = null;

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// projectedSnapshots: [{ month: 1, balance }, ...] from projectBalance(), extending
// forward from the last actual balance point. Pass [] to render with no projection.
function renderBalanceChart(balancePoints, projectedSnapshots) {
  const projected = projectedSnapshots || [];
  const sorted = [...balancePoints].sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
  const actualLabels = sorted.map(p => p.date);
  const actualValues = sorted.map(p => p.balance);
  const projectedLabels = projected.map(p => `+${p.month}mo`);
  const labels = actualLabels.concat(projectedLabels);
  const textColor = cssVar('--text-main');
  const gridColor = cssVar('--border-color');

  const actualData = actualValues.concat(projected.map(() => null));

  // bridges the actual line into the dashed projection at the last real point
  const projectedData = actualValues.map(() => null);
  if (actualValues.length > 0) projectedData[actualValues.length - 1] = actualValues[actualValues.length - 1];
  projected.forEach(p => projectedData.push(p.balance));

  if (balanceChartInstance) balanceChartInstance.destroy();

  const ctx = document.getElementById('balanceChart').getContext('2d');
  balanceChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Balance ($)',
          data: actualData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.2,
          pointRadius: 2,
          spanGaps: false
        },
        {
          label: 'Projected ($)',
          data: projectedData,
          borderColor: '#f59e0b',
          borderDash: [6, 4],
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.2,
          pointRadius: 2,
          spanGaps: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { color: textColor } } },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }
  });
}

function renderMonthlyChart(monthlyData) {
  const labels = Object.keys(monthlyData).sort();
  const incomeVals = labels.map(l => monthlyData[l].income);
  const spendingVals = labels.map(l => monthlyData[l].spending);
  const textColor = cssVar('--text-main');
  const gridColor = cssVar('--border-color');

  if (monthlyChartInstance) monthlyChartInstance.destroy();

  const ctx = document.getElementById('monthlyChart').getContext('2d');
  monthlyChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Spending ($)', data: spendingVals, backgroundColor: '#ef4444' },
        { label: 'Income ($)', data: incomeVals, backgroundColor: '#10b981' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { color: textColor } } },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }
  });
}

function renderMerchantChart(merchantData) {
  const sorted = Object.entries(merchantData).sort((a, b) => b[1] - a[1]).slice(0, 7);
  const labels = sorted.map(i => i[0]);
  const values = sorted.map(i => i[1]);
  const textColor = cssVar('--text-main');
  const gridColor = cssVar('--border-color');

  if (merchantChartInstance) merchantChartInstance.destroy();

  const ctx = document.getElementById('merchantChart').getContext('2d');
  merchantChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Spent ($)',
        data: values,
        backgroundColor: '#3b82f6'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }
  });
}

function renderDiscretionaryChart(monthlySplit, monthlyMerchantBreakdown) {
  const labels = Object.keys(monthlySplit).sort();
  const fixedVals = labels.map(l => monthlySplit[l].fixed);
  const discretionaryVals = labels.map(l => monthlySplit[l].discretionary);
  const textColor = cssVar('--text-main');
  const gridColor = cssVar('--border-color');

  if (discretionaryChartInstance) discretionaryChartInstance.destroy();

  const ctx = document.getElementById('discretionaryChart').getContext('2d');
  discretionaryChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Fixed ($)', data: fixedVals, backgroundColor: '#f59e0b', stack: 'spending' },
        { label: 'Discretionary ($)', data: discretionaryVals, backgroundColor: '#8b5cf6', stack: 'spending' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      // 'nearest' + intersect so hovering one segment only shows that segment's breakdown,
      // not both Fixed and Discretionary for the month at once
      interaction: { mode: 'nearest', intersect: true },
      plugins: {
        legend: { position: 'top', labels: { color: textColor } },
        tooltip: {
          callbacks: {
            afterLabel: (context) => {
              const month = context.label;
              const category = context.dataset.label.startsWith('Fixed') ? 'fixed' : 'discretionary';
              const breakdown = (monthlyMerchantBreakdown[month] || {})[category] || {};
              return Object.entries(breakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([merchant, amount]) => `  ${merchant}: $${amount.toFixed(2)}`);
            }
          }
        }
      },
      scales: {
        x: { stacked: true, ticks: { color: textColor }, grid: { color: gridColor } },
        y: { stacked: true, beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }
  });
}

// savingsRateData: { month: percent|null }. null (no income that month) renders as a gap.
function renderSavingsRateChart(savingsRateData) {
  const labels = Object.keys(savingsRateData).sort();
  const values = labels.map(l => savingsRateData[l]);
  const textColor = cssVar('--text-main');
  const gridColor = cssVar('--border-color');

  if (savingsRateChartInstance) savingsRateChartInstance.destroy();

  const ctx = document.getElementById('savingsRateChart').getContext('2d');
  savingsRateChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Savings Rate (%)',
        data: values,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.2,
        pointRadius: 3,
        spanGaps: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => context.raw === null ? 'No income this month' : `${context.raw.toFixed(1)}%`
          }
        }
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor, callback: (v) => `${v}%` }, grid: { color: gridColor } }
      }
    }
  });
}
