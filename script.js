const progressBar = document.getElementById("progress-bar");
const mapDialog = document.getElementById("map-dialog");
const nextDialog = document.getElementById("next-dialog");
const copyBrief = document.getElementById("copy-brief");

const setProgress = () => {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const percent = available > 0 ? Math.min((window.scrollY / available) * 100, 100) : 0;
  progressBar.style.width = `${percent}%`;
};

window.addEventListener("scroll", setProgress, { passive: true });
setProgress();

document.querySelectorAll("[data-open-map]").forEach((button) => {
  button.addEventListener("click", () => mapDialog.showModal());
});

document.querySelector("[data-close-map]").addEventListener("click", () => mapDialog.close());

document.querySelectorAll("[data-open-next-step]").forEach((button) => {
  button.addEventListener("click", () => nextDialog.showModal());
});

document.querySelector("[data-close-next]").addEventListener("click", () => nextDialog.close());

[mapDialog, nextDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

copyBrief.addEventListener("click", async () => {
  const checklist = [
    "PAY PER ROOF — ROOFMAP UNDERWRITING CHECKLIST",
    "1. Service territory and preferred zip codes",
    "2. Average replacement value and minimum project value",
    "3. Roof types and replacement/repair mix",
    "4. Weekly inspection availability",
    "5. Sales and production capacity",
    "6. Historical inspection-to-sale close rate",
    "7. Licensing, insurance, financing, and payment pathways",
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

  copyBrief.textContent = copied ? "Checklist copied" : "Copy unavailable — ask your presenter";
  window.setTimeout(() => {
    copyBrief.textContent = "Copy the underwriting checklist";
  }, 2600);
});
