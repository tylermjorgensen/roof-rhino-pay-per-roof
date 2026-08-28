const underwritingDialog = document.getElementById("underwriting-dialog");
const termsDialog = document.getElementById("terms-dialog");
const mapDialog = document.getElementById("map-dialog");
const copyChecklistButton = document.getElementById("copy-checklist");
const offerToggle = document.getElementById("offer-toggle");
const offerPanel = document.getElementById("offer-panel");

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

offerToggle.addEventListener("click", () => {
  const willOpen = offerToggle.getAttribute("aria-expanded") !== "true";

  offerToggle.setAttribute("aria-expanded", String(willOpen));
  offerPanel.setAttribute("aria-hidden", String(!willOpen));
  offerPanel.classList.toggle("is-open", willOpen);

  if (willOpen) {
    offerPanel.removeAttribute("inert");
    window.setTimeout(() => {
      offerPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 220);
  } else {
    offerPanel.setAttribute("inert", "");
  }
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
