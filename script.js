const underwritingDialog = document.getElementById("underwriting-dialog");
const termsDialog = document.getElementById("terms-dialog");
const mapDialog = document.getElementById("map-dialog");
const copyChecklistButton = document.getElementById("copy-checklist");
const contractValueInput = document.getElementById("contract-value");
const feeOutput = document.getElementById("fee-output");
const multipleOutput = document.getElementById("multiple-output");
const remainderOutput = document.getElementById("remainder-output");
const planButtons = [...document.querySelectorAll("[data-fee]")];

let selectedFee = 3000;

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const updateEconomics = () => {
  const contractValue = Math.max(Number(contractValueInput.value) || 0, 0);
  const multiple = selectedFee > 0 ? contractValue / selectedFee : 0;
  const remainder = Math.max(contractValue - selectedFee, 0);

  feeOutput.textContent = formatCurrency(selectedFee);
  multipleOutput.textContent = `${multiple.toFixed(1)}×`;
  remainderOutput.textContent = formatCurrency(remainder);
};

planButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedFee = Number(button.dataset.fee);
    planButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
    updateEconomics();
  });
});

contractValueInput.addEventListener("input", updateEconomics);
updateEconomics();

const bindDialog = ({ dialog, openSelector, closeSelector }) => {
  document.querySelectorAll(openSelector).forEach((button) => {
    button.addEventListener("click", () => dialog.showModal());
  });

  document.querySelector(closeSelector).addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
};

bindDialog({
  dialog: underwritingDialog,
  openSelector: "[data-open-underwriting]",
  closeSelector: "[data-close-underwriting]",
});

bindDialog({
  dialog: termsDialog,
  openSelector: "[data-open-terms]",
  closeSelector: "[data-close-terms]",
});

bindDialog({
  dialog: mapDialog,
  openSelector: "[data-open-map]",
  closeSelector: "[data-close-map]",
});

copyChecklistButton.addEventListener("click", async () => {
  const checklist = [
    "PAY PER ROOF — ROOFMAP UNDERWRITING CHECKLIST",
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
    const fallback = document.createElement("textarea");
    fallback.value = checklist;
    fallback.setAttribute("readonly", "");
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";
    document.body.appendChild(fallback);
    fallback.select();
    copied = document.execCommand("copy");
    fallback.remove();
  }

  copyChecklistButton.textContent = copied ? "Checklist copied" : "Copy unavailable";
  window.setTimeout(() => {
    copyChecklistButton.textContent = "Copy underwriting checklist";
  }, 2400);
});
