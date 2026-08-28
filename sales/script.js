const pricingButtons = document.querySelectorAll("[data-toggle-pricing]");
const pricingDrawer = document.getElementById("pricing-drawer");
const underwritingDialog = document.getElementById("underwriting-dialog");
const copyChecklistButton = document.getElementById("copy-checklist");
const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");

menuButton.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") === "false";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.textContent = willOpen ? "Close" : "Menu";
  mobileNav.classList.toggle("is-open", willOpen);
  mobileNav.setAttribute("aria-hidden", String(!willOpen));
  if (willOpen) mobileNav.removeAttribute("inert");
  else mobileNav.setAttribute("inert", "");
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Menu";
    mobileNav.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    mobileNav.setAttribute("inert", "");
  });
});

pricingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const willOpen = pricingDrawer.getAttribute("aria-hidden") === "true";

    pricingButtons.forEach((pricingButton) => {
      pricingButton.setAttribute("aria-expanded", String(willOpen));
    });
    pricingDrawer.setAttribute("aria-hidden", String(!willOpen));
    pricingDrawer.classList.toggle("is-open", willOpen);

    if (willOpen) {
      pricingDrawer.removeAttribute("inert");
      window.setTimeout(() => pricingDrawer.scrollIntoView({ behavior: "smooth", block: "start" }), 220);
    } else {
      pricingDrawer.setAttribute("inert", "");
    }
  });
});

document.querySelectorAll("[data-open-underwriting]").forEach((button) => {
  button.addEventListener("click", () => underwritingDialog.showModal());
});

document.querySelector("[data-close-underwriting]").addEventListener("click", () => underwritingDialog.close());

underwritingDialog.addEventListener("click", (event) => {
  if (event.target === underwritingDialog) underwritingDialog.close();
});

const calculatorInputs = {
  roofValue: document.getElementById("roof-value"),
  roofCount: document.getElementById("roof-count"),
  roofRate: document.getElementById("roof-rate"),
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function updateCalculator() {
  const roofValue = Number(calculatorInputs.roofValue.value);
  const roofCount = Number(calculatorInputs.roofCount.value);
  const roofRate = Number(calculatorInputs.roofRate.value);
  const monthlyRevenue = roofValue * roofCount;
  const monthlyCost = roofRate * roofCount;

  document.getElementById("roof-value-output").textContent = currency.format(roofValue);
  document.getElementById("roof-count-output").textContent = String(roofCount);
  document.getElementById("roof-rate-output").textContent = currency.format(roofRate);
  document.getElementById("monthly-revenue").textContent = currency.format(monthlyRevenue);
  document.getElementById("monthly-cost").textContent = currency.format(monthlyCost);
  document.getElementById("net-before-costs").textContent = currency.format(monthlyRevenue - monthlyCost);
  document.getElementById("annual-revenue").textContent = currency.format(monthlyRevenue * 12);
}

Object.values(calculatorInputs).forEach((input) => input.addEventListener("input", updateCalculator));
updateCalculator();

copyChecklistButton.addEventListener("click", async () => {
  const checklist = [
    "ROOF RHINO — ROOFMAP™ UNDERWRITING CHECKLIST",
    "1. Service territory and preferred ZIP codes",
    "2. Average replacement value and minimum project value",
    "3. Roof types and replacement-to-repair mix",
    "4. Weekly inspection availability",
    "5. Sales and production capacity",
    "6. Historical inspection-to-sale close rate",
    "7. Licensing, insurance, and payment pathways",
    "8. Target launch date",
  ].join("\n");

  let copied = false;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(checklist);
      copied = true;
    } catch {
      copied = false;
    }
  }

  if (!copied) {
    const textarea = document.createElement("textarea");
    textarea.value = checklist;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    copied = document.execCommand("copy");
    textarea.remove();
  }

  copyChecklistButton.textContent = copied ? "Checklist Copied" : "Copy Unavailable";
  window.setTimeout(() => {
    copyChecklistButton.textContent = "Copy Underwriting Checklist";
  }, 2200);
});
