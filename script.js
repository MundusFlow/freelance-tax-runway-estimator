const SET_ASIDE_RATE = 0.28;

const calculateBtn = document.getElementById("calculateBtn");
const resultEl = document.getElementById("result");

calculateBtn.addEventListener("click", () => {
  const income = parseFloat(document.getElementById("income").value) || 0;
  const expenses = parseFloat(document.getElementById("expenses").value) || 0;

  const netProfit = income - expenses;
  const setAside = Math.max(netProfit, 0) * SET_ASIDE_RATE;

  resultEl.textContent = `Set aside about $${setAside.toFixed(2)} for taxes this quarter.`;

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
    runwayResultEl.textContent = "Enter your average monthly expenses to see your runway.";
    return;
  }

  const months = savings / monthlyExpenses;

  runwayResultEl.textContent = `Your runway is about ${months.toFixed(1)} months.`;

  if (typeof gtag === "function") {
    gtag("event", "calculate_runway_click");
  }
});
