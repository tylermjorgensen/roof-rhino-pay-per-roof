const offerButton = document.querySelector("[data-toggle-offer]");
const pricingDrawer = document.getElementById("pricing-drawer");
const underwritingDialog = document.getElementById("underwriting-dialog");
const copyChecklistButton = document.getElementById("copy-checklist");

offerButton.addEventListener("click", () => {
  const willOpen = offerButton.getAttribute("aria-expanded") !== "true";

  offerButton.setAttribute("aria-expanded", String(willOpen));
  pricingDrawer.setAttribute("aria-hidden", String(!willOpen));
  pricingDrawer.classList.toggle("is-open", willOpen);

  if (willOpen) {
    pricingDrawer.removeAttribute("inert");
    window.setTimeout(() => pricingDrawer.scrollIntoView({ behavior: "smooth", block: "start" }), 180);
  } else {
    pricingDrawer.setAttribute("inert", "");
  }
});

document.querySelectorAll("[data-open-underwriting]").forEach((button) => {
  button.addEventListener("click", () => underwritingDialog.showModal());
});

document.querySelector("[data-close-underwriting]").addEventListener("click", () => underwritingDialog.close());

underwritingDialog.addEventListener("click", (event) => {
  if (event.target === underwritingDialog) underwritingDialog.close();
});

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

  copyChecklistButton.textContent = copied ? "Checklist copied" : "Copy unavailable";
  window.setTimeout(() => {
    copyChecklistButton.textContent = "Copy underwriting checklist";
  }, 2200);
});
