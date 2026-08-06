# Finance Dashboard — Plan

## Architecture

Static site, no build step: `index.html` + `styles.css` + `js/*.js` (classic
scripts sharing globals, not ES modules, so it still works opened directly
via `file://`).

- `js/data.js` — sample CSV generator, CSV parsing helpers
- `js/filters.js` — date range presets + custom range filtering
- `js/analytics.js` — recurring-merchant detection, income volatility stats
- `js/projection.js` — `projectBalance()` / `calculateRunwayMonths()` /
  `formatRunway()`, the shared engine behind runway and what-if
- `js/charts.js` — all Chart.js render functions
- `js/table.js` — transaction DataTable renderer
- `js/main.js` — `allRows` + `whatIfState`, and `refreshDashboard()`, the single
  orchestrator every feature routes through (any state change re-runs the
  whole render pipeline, so nothing falls out of sync)

## Done

- Split single-file HTML into `index.html` / `styles.css` / `js/` modules
- Central `refreshDashboard()` orchestrator in `main.js`
- Date range filtering — presets (This/Last month, Last 3/6/12 months, Last N
  months) + custom From/To range
- Dark mode — OS-only (`prefers-color-scheme`), no manual toggle; charts and
  the DataTable re-themed via CSS vars + `getComputedStyle`; background `#000`
- Balance-over-time line chart (full width), from the `Balance` column
- Recurring/subscription detector — flags a merchant recurring if it appears
  in ≥3 distinct months with amount variance under ~20% (coefficient of
  variation), shown as a "Recurring Merchants" card
- Discretionary vs. fixed spending — stacked monthly chart built on the
  recurring flags, with a caption naming the current fixed merchants + rule,
  and a hover tooltip showing the merchant-level breakdown per segment
- Savings rate trend — `(income − spending) / income` per month; months with
  no income render as a gap in the line, not a false 0%
- Income volatility view — avg/min/max/std-dev stat cards for monthly income
- Shared projection engine (`projectBalance()` / `calculateRunwayMonths()`),
  powering:
  - Runway — projected months-until-$0, with an "assume no income" worst-case
    toggle
  - What-if sliders — adjustable discretionary-spending % and extra monthly
    expense, overlaid as a dashed projection on the balance-over-time chart.
    The spending slider scales only the average *discretionary* portion
    (from the fixed/discretionary split), leaving fixed/recurring bills
    unchanged
- Table UX wins — day-of-week spending heatmap (plain CSS/DOM, no charting
  library), and a Largest Transactions list (top 10 single withdrawals)

## Left to build (in order)

1. **Top Spending Merchants** — configurable top-N (currently hardcoded to 7)
   + ability to hide/show individual merchants
2. **Manual override** for recurring/fixed classification — let the user
   correct whether a specific merchant counts as fixed/recurring, overriding
   the auto-detection from `detectRecurringMerchants`

## Backlog (explicitly deferred)

- Full merchant → category mapping (groceries/dining/utilities/etc.) +
  category pie chart
- Budget-vs-actual per category
