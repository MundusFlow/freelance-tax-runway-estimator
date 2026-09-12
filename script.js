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

// ---------------------------------------------------------------------------
// Shared result-extras markup: an interpretation sentence + benchmark line
// (right under the headline number) and a next-calculator link + low-key
// upgrade line (after the breakdown/tip). Both calculators below call these
// instead of repeating the same four blocks of HTML twice.
// ---------------------------------------------------------------------------
const UPGRADE_HTML =
  'Want this saved automatically every quarter, with a full income &amp; expense dashboard? ' +
  '<a href="#cta">Get The Freelance CFO &rarr;</a>';

function interpretationBlock(sentence, benchmark) {
  return `
        <p class="result-interpretation">${sentence}</p>
        <p class="result-benchmark">&#128202; ${benchmark}</p>`;
}

function followUpBlock(nextHref, nextLabel) {
  return `
        <a class="result-next-link" href="${nextHref}">Next: ${nextLabel} &rarr;</a>
        <p class="result-upgrade">${UPGRADE_HTML}</p>`;
}

// Clears every input back to blank and disables the calculate button again,
// so a visitor can start from a clean slate instead of the example.
function wireClearButton(clearBtnId, inputs, button, resultElToClear) {
  const clearBtn = document.getElementById(clearBtnId);
  if (!clearBtn) return;
  clearBtn.addEventListener("click", () => {
    inputs.forEach((input) => {
      input.value = "";
    });
    button.disabled = true;
    resultElToClear.innerHTML = "";
    inputs[0]?.focus();
  });
}

const calculateBtn = document.getElementById("calculateBtn");
const resultEl = document.getElementById("result");
const incomeInput = document.getElementById("income");
const expensesInput = document.getElementById("expenses");

wireUpForm([incomeInput, expensesInput], calculateBtn);
wireClearButton("tax_clearBtn", [incomeInput, expensesInput], calculateBtn, resultEl);

function calculateTax() {
  const income = parseFloat(incomeInput.value) || 0;
  const expenses = parseFloat(expensesInput.value) || 0;

  const netProfit = income - expenses;
  const taxReserve = Math.max(netProfit, 0) * SET_ASIDE_RATE;
  const spendable = Math.max(netProfit, 0) - taxReserve;

  const interpretation = `Setting aside ${formatMoney(taxReserve)} (${(SET_ASIDE_RATE * 100).toFixed(0)}% of your ${formatMoney(Math.max(netProfit, 0))} profit) leaves you ${formatMoney(spendable)} that's truly yours to spend or save.`;
  const benchmark = "Many small business owners reserve 25-30% of profit for taxes, but this varies by state and situation &mdash; consult a tax professional.";

  resultEl.innerHTML = `
    <div class="result-box">
      <p class="result-headline-label">Your Estimated Tax Reserve</p>
      <p class="result-headline-value result-warning">${formatMoney(taxReserve)}</p>
      ${interpretationBlock(interpretation, benchmark)}

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
      ${followUpBlock("#runway-calculator", "Runway Calculator")}
    </div>
  `;
}

calculateBtn.addEventListener("click", () => {
  calculateTax();
  if (typeof gtag === "function") {
    gtag("event", "calculate_tax_click");
  }
});

calculateTax(); // show a working result immediately, using the pre-filled example

const runwayBtn = document.getElementById("runwayBtn");
const runwayResultEl = document.getElementById("runwayResult");
const savingsInput = document.getElementById("savings");
const monthlyExpensesInput = document.getElementById("monthlyExpenses");

wireUpForm([savingsInput, monthlyExpensesInput], runwayBtn);
wireClearButton("runway_clearBtn", [savingsInput, monthlyExpensesInput], runwayBtn, runwayResultEl);

function calculateRunway() {
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

  const interpretation = `At ${formatMoney(monthlyExpenses)}/month, your ${formatMoney(savings)} gives you about ${breakdown} of runway before you'd need new client income.`;
  const benchmark = "Common guidance is 3-6 months of operating expenses in reserve (general guideline).";

  runwayResultEl.innerHTML = `
    <div class="result-box">
      <p class="result-headline-label">Your Estimated Runway</p>
      <p class="result-headline-value result-highlight">${months.toFixed(1)} months</p>
      ${interpretationBlock(interpretation, benchmark)}

      <div class="result-breakdown">
        <p class="breakdown-title">Based on:</p>
        <div class="breakdown-row"><span>${formatMoney(savings)} in savings</span></div>
        <div class="breakdown-row"><span>&divide; ${formatMoney(monthlyExpenses)} avg. monthly expenses</span></div>
        <div class="breakdown-row breakdown-total"><span>= ${months.toFixed(1)} months of runway</span></div>
      </div>

      <p class="result-tip">&#128161; That's about ${breakdown} before you'd need new income.</p>
      ${followUpBlock("#tax-set-aside", "Tax Set-Aside")}
    </div>
  `;
}

runwayBtn.addEventListener("click", () => {
  calculateRunway();
  if (typeof gtag === "function") {
    gtag("event", "calculate_runway_click");
  }
});

calculateRunway();

// Sticky bottom CTA bar: stays hidden until the visitor scrolls past the
// hero or runs either calculator, so the first screen isn't a sales pitch.
const stickyBar = document.getElementById("stickyBar");

if (stickyBar) {
  let stickyBarShown = false;

  const showStickyBar = () => {
    if (stickyBarShown) return;
    stickyBarShown = true;
    stickyBar.classList.add("visible");
    if (typeof gtag === "function") {
      gtag("event", "sticky_cta_shown");
    }
  };

  const hero = document.querySelector(".hero");
  if (hero) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > hero.offsetHeight) {
        showStickyBar();
      }
    });
  }

  calculateBtn.addEventListener("click", showStickyBar);
  runwayBtn.addEventListener("click", showStickyBar);
}

// Lightbox: click a product screenshot to view it full-size.
const lightbox = document.getElementById("lightbox");

if (lightbox) {
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  const openLightbox = (img) => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
  };

  document.querySelectorAll(".product-screenshot").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img));
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}
