const SET_ASIDE_RATE = 0.28;

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

// Disables `button` until every input in `inputs` has a value, and lets
// pressing Enter in any of those inputs trigger the button (same as a click).
function wireUpForm(inputs, button) {
  const updateDisabledState = () => {
    button.disabled = !inputs.every((input) => input.value.trim() !== "");
  };

  inputs.forEach((input) => {
    input.addEventListener("input", updateDisabledState);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        button.click();
      }
    });
  });

  updateDisabledState();
}

const calculateBtn = document.getElementById("calculateBtn");
const resultEl = document.getElementById("result");
const incomeInput = document.getElementById("income");
const expensesInput = document.getElementById("expenses");

wireUpForm([incomeInput, expensesInput], calculateBtn);

calculateBtn.addEventListener("click", () => {
  const income = parseFloat(incomeInput.value) || 0;
  const expenses = parseFloat(expensesInput.value) || 0;

  const netProfit = income - expenses;
  const taxReserve = Math.max(netProfit, 0) * SET_ASIDE_RATE;
  const spendable = Math.max(netProfit, 0) - taxReserve;

  resultEl.innerHTML = `
    <div class="result-box">
      <p class="result-headline-label">Your Estimated Tax Reserve</p>
      <p class="result-headline-value result-warning">${formatMoney(taxReserve)}</p>

      <div class="result-breakdown">
        <p class="breakdown-title">Based on:</p>
        <div class="breakdown-row"><span>${formatMoney(income)} income</span></div>
        <div class="breakdown-row"><span>&minus; ${formatMoney(expenses)} expenses</span></div>
        <div class="breakdown-row breakdown-total"><span>= ${formatMoney(netProfit)} estimated net profit</span></div>
        <div class="breakdown-row">
          <span>Suggested tax reserve (${(SET_ASIDE_RATE * 100).toFixed(0)}%):</span>
          <span>${formatMoney(taxReserve)}</span>
        </div>
        <div class="breakdown-row">
          <span>Spendable money:</span>
          <span>${formatMoney(spendable)}</span>
        </div>
      </div>

      <p class="result-tip">&#128161; Treat this money as already spent.</p>
    </div>
  `;

  if (typeof gtag === "function") {
    gtag("event", "calculate_tax_click");
  }
});

const runwayBtn = document.getElementById("runwayBtn");
const runwayResultEl = document.getElementById("runwayResult");
const savingsInput = document.getElementById("savings");
const monthlyExpensesInput = document.getElementById("monthlyExpenses");

wireUpForm([savingsInput, monthlyExpensesInput], runwayBtn);

runwayBtn.addEventListener("click", () => {
  const savings = parseFloat(savingsInput.value) || 0;
  const monthlyExpenses = parseFloat(monthlyExpensesInput.value) || 0;

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
      <p class="result-headline-label">Your Estimated Runway</p>
      <p class="result-headline-value result-highlight">${months.toFixed(1)} months</p>

      <div class="result-breakdown">
        <p class="breakdown-title">Based on:</p>
        <div class="breakdown-row"><span>${formatMoney(savings)} in savings</span></div>
        <div class="breakdown-row"><span>&divide; ${formatMoney(monthlyExpenses)} avg. monthly expenses</span></div>
        <div class="breakdown-row breakdown-total"><span>= ${months.toFixed(1)} months of runway</span></div>
      </div>

      <p class="result-tip">&#128161; That's about ${breakdown} before you'd need new income.</p>
    </div>
  `;

  if (typeof gtag === "function") {
    gtag("event", "calculate_runway_click");
  }
});
