(function () {
  const pages = [
    { href: "index.html", label: "Home" },
    { href: "actions.html", label: "Actions" },
    { href: "events.html", label: "Events" },
    { href: "ledger.html", label: "Ledger" },
    { href: "travel.html", label: "Travel" },
    { href: "research.html", label: "Research" },
    { href: "ecosystem.html", label: "System Map" },
    { href: "boundaries.html", label: "Reality Check" },
    { href: "contribute.html", label: "Contribute" },
    { href: "sources.html", label: "Sources" }
  ];

  const pageId = document.body.dataset.page || "index";
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("[data-nav] a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.setAttribute("aria-current", "page");
    }
  });

  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      document.body.classList.toggle("nav-open", !open);
    });
  }

  const toTop = document.querySelector("[data-to-top]");
  if (toTop) {
    const syncTop = () => {
      toTop.classList.toggle("is-visible", window.scrollY > 520);
    };
    window.addEventListener("scroll", syncTop, { passive: true });
    syncTop();
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  const sequenceMount = document.querySelector("[data-sequence-nav]");
  if (sequenceMount) {
    const index = pages.findIndex((page) => page.href === currentPath || pageId + ".html" === page.href);
    const previous = pages[(index - 1 + pages.length) % pages.length];
    const next = pages[(index + 1) % pages.length];
    sequenceMount.innerHTML = `
      <a class="sequence-link" href="${previous.href}">
        <span>Previous</span>
        <strong>${previous.label}</strong>
      </a>
      <a class="sequence-link next" href="${next.href}">
        <span>Next</span>
        <strong>${next.label}</strong>
      </a>
    `;
  }

  const contributionForm = document.querySelector("[data-contribution-form]");
  const output = document.querySelector("[data-markdown-output]");
  const copyButton = document.querySelector("[data-copy-markdown]");
  const downloadButton = document.querySelector("[data-download-markdown]");
  const resetButton = document.querySelector("[data-reset-form]");

  function getFormValue(name) {
    const field = contributionForm ? contributionForm.elements[name] : null;
    return field ? String(field.value || "").trim() : "";
  }

  function buildMarkdown() {
    const title = getFormValue("title") || "Untitled GAJRA Earth trace";
    const role = getFormValue("role") || "Contributor";
    const place = getFormValue("place") || "Not specified";
    const time = getFormValue("time") || "Not estimated";
    const action = getFormValue("action") || "Not specified yet";
    const abundance = getFormValue("abundance") || "Not specified yet";
    const proof = getFormValue("proof") || "Not specified yet";
    const boundary = getFormValue("boundary") || "No private material included.";
    const wallet = getFormValue("wallet") || "Optional / not supplied";

    return `# ${title}

## Contributor

- Role: ${role}
- Place or network: ${place}
- Contribution hours (research only): ${time}
- Public handle or wallet: ${wallet}

## Proposed action

${action}

## Definition of joyful responsible abundance

${abundance}

## Public receipt

${proof}

## Red line

${boundary}

## Status

Draft GAJRA Earth public trace. No financial claim, token allocation, official partnership or legal commitment.
`;
  }

  function syncMarkdown() {
    if (!contributionForm || !output) return;
    output.value = buildMarkdown();
  }

  if (contributionForm && output) {
    contributionForm.addEventListener("input", syncMarkdown);
    syncMarkdown();
  }

  if (copyButton && output) {
    copyButton.addEventListener("click", async () => {
      syncMarkdown();
      await navigator.clipboard.writeText(output.value);
      copyButton.textContent = "Copied";
      window.setTimeout(() => {
        copyButton.textContent = "Copy Markdown";
      }, 1500);
    });
  }

  if (downloadButton && output) {
    downloadButton.addEventListener("click", () => {
      syncMarkdown();
      const blob = new Blob([output.value], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "gajra-earth-trace.md";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  }

  if (resetButton && contributionForm) {
    resetButton.addEventListener("click", () => {
      contributionForm.reset();
      syncMarkdown();
    });
  }
})();
