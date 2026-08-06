function generateRandomCSV() {
  const merchants = [
    "Canadian Tire", "Iga Extra", "Manoir Du Cafe", "Brasserie St-Pancrace",
    "Pizza Salvatore", "Starlink Internet", "Metro Supermarket", "Shell Oil",
    "Tim Hortons", "Amazon.ca", "Hydro-Quebec", "Pharmaprix"
  ];

  let balance = 18500.00;
  let csvLines = ["Date,Transaction,Loads,Withdrawal,Balance,Notes,source_file"];

  const dates = [
    "2025-10-01", "2025-10-03", "2025-10-07", "2025-10-12", "2025-10-18", "2025-10-25",
    "2025-11-02", "2025-11-05", "2025-11-10", "2025-11-15", "2025-11-20", "2025-11-28",
    "2025-12-01", "2025-12-04", "2025-12-09", "2025-12-14", "2025-12-19", "2025-12-24"
  ];

  dates.forEach((date) => {
    const isIncome = Math.random() < 0.15;
    let loads = "0.00";
    let withdrawal = "0.00";
    let merchant = "";

    if (isIncome) {
      const incomeAmt = (Math.random() * 500 + 50).toFixed(2);
      loads = incomeAmt;
      merchant = Math.random() > 0.5 ? "E-Transfer Deposit" : "Cash back bonus";
      balance += parseFloat(incomeAmt);
    } else {
      const spendAmt = (Math.random() * 120 + 4).toFixed(2);
      withdrawal = spendAmt;
      merchant = merchants[Math.floor(Math.random() * merchants.length)];
      balance -= parseFloat(spendAmt);
    }

    const fullDate = `${date} 00:00:00 +0000 UTC`;
    csvLines.push(`${fullDate},${merchant},${loads},${withdrawal},${balance.toFixed(2)},,randomized_demo_data.csv`);
  });

  return csvLines.join("\n");
}

const sampleCSV = generateRandomCSV();

function parseCSV(csvContent, onComplete) {
  Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => onComplete(results.data)
  });
}

function parseCSVFile(file, onComplete) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => onComplete(results.data)
  });
}
