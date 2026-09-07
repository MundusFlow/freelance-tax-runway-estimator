const SET_ASIDE_RATE = 0.28;

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const calculateBtn = document.getElementById("calculateBtn");
const resultEl = document.getElementById("result");

calculateBtn.addEventListener("click", () => {
  const income = parseFloat(document.getElementById("income").value) || 0;
  const expenses = parseFloat(document.getElementById("expenses").value) || 0;

  const netProfit = income - expenses;
  const taxReserve = Math.max(netProfit, 0) * SET_ASIDE_RATE;
  const spendable = Math.max(netProfit, 0) - taxReserve;

  resultEl.innerHTML = `
    <div class="result-box">
      <p class="result-intro">You should probably treat ${formatMoney(taxReserve)} as already spent.</p>
      <div class="result-stat">
        <span class="result-label">Estimated tax reserve:</span>
        <span class="result-value result-warning">${formatMoney(taxReserve)}</span>
      </div>
      <div class="result-stat">
        <span class="result-label">Spendable money:</span>
        <span class="result-value result-highlight">${formatMoney(spendable)}</span>
      </div>
    </div>
  `;

  if (typeof gtag === "function") {
    gtag("event", "calculate_tax_click");
  }
});

const runwayBtn = document.getElementById("runwayBtn");
const runwayResultEl = document.getElementById("runwayResult");

runwayBtn.addEventListener("click", () => {
  const savings = parseFloat(document.getElementById("savings").value) || 0;
  const monthlyExpenses = parseFloat(document.getElementById("monthlyExpenses").value) || 0;

  if (monthlyExpenses <= 0) {
    runwayResultEl.innerHTML = `<div class="result-box"><p class="result-intro">Enter your average monthly expenses to see your runway.</p></div>`;
    return;
  }

  const months = savings / monthlyExpenses;

  let wholeMonths = Math.floor(months);
  let days = Math.round((months - wholeMonths) * 30);
  if (days === 30) {
    wholeMonths += 1;
    days = 0;
  }
  const monthLabel = `${wholeMonths} month${wholeMonths === 1 ? "" : "s"}`;
  const dayLabel = `${days} day${days === 1 ? "" : "s"}`;
  const breakdown = days > 0 ? `${monthLabel} and ${dayLabel}` : monthLabel;

  runwayResultEl.innerHTML = `
    <div class="result-box">
      <p class="result-intro">If your income stopped today, your savings could cover approximately ${breakdown} of personal expenses.</p>
      <div class="result-stat">
        <span class="result-label">Runway:</span>
        <span class="result-value result-highlight">${months.toFixed(1)} months</span>
      </div>
    </div>
  `;

  if (typeof gtag === "function") {
    gtag("event", "calculate_runway_click");
  }
});
