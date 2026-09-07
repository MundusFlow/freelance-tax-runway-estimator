const SET_ASIDE_RATE = 0.28;

const calculateBtn = document.getElementById("calculateBtn");
const resultEl = document.getElementById("result");

calculateBtn.addEventListener("click", () => {
  const income = parseFloat(document.getElementById("income").value) || 0;
  const expenses = parseFloat(document.getElementById("expenses").value) || 0;

  const netProfit = income - expenses;
  const taxReserve = Math.max(netProfit, 0) * SET_ASIDE_RATE;
  const spendable = Math.max(netProfit, 0) - taxReserve;

  resultEl.innerHTML = `
    <p class="result-line result-warning">Treat $${taxReserve.toFixed(2)} as already spent — that's your estimated tax reserve.</p>
    <p class="result-line result-highlight">Spendable money: $${spendable.toFixed(2)}</p>
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
    runwayResultEl.innerHTML = `<p class="result-line">Enter your average monthly expenses to see your runway.</p>`;
    return;
  }

  const months = savings / monthlyExpenses;

  const runOutDate = new Date();
  runOutDate.setMonth(runOutDate.getMonth() + Math.floor(months));
  const runOutLabel = runOutDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  runwayResultEl.innerHTML = `
    <p class="result-line result-warning">Zero new clients starting today, and you're out of money by ${runOutLabel}.</p>
    <p class="result-line result-highlight">That's about ${months.toFixed(1)} months of runway.</p>
  `;

  if (typeof gtag === "function") {
    gtag("event", "calculate_runway_click");
  }
});
