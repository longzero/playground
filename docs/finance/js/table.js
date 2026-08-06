let dataTableInstance = null;

function renderLargestTransactions(transactions) {
  const tbody = document.querySelector('#largestTransactionsTable tbody');
  tbody.innerHTML = '';

  transactions.forEach(t => {
    const tr = document.createElement('tr');
    [t.date, t.merchant, t.amount.toFixed(2)].forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function renderDataTable(dataRows) {
  // Destroy old instance completely if it exists
  if (dataTableInstance) {
    dataTableInstance.destroy();
    dataTableInstance = null;
  }

  // Re-populate tbody element
  const tbody = document.querySelector('#dataTable tbody');
  tbody.innerHTML = '';

  dataRows.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  // Re-initialize DataTable with newly populated rows
  dataTableInstance = new DataTable('#dataTable', {
    perPage: 10,
    perPageSelect: [10, 25, 50]
  });
}
