const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const themeToggle = $("#themeToggle");
const themeIcon = $(".theme-icon", themeToggle);

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const isDark = theme === "dark";
  themeIcon.textContent = isDark ? "Light" : "Dark";
  themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
};

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || savedTheme === "dark") {
  setTheme(savedTheme);
}

themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  setTheme(current === "dark" ? "light" : "dark");
});

const menuButton = $("#menuBtn");
const mobileMenu = $("#mobileMenu");

const toggleMobileMenu = (open) => {
  const isOpen = open ?? !mobileMenu.classList.contains("is-open");
  mobileMenu.classList.toggle("is-open", isOpen);
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.textContent = isOpen ? "Close" : "Menu";
};

menuButton?.addEventListener("click", () => toggleMobileMenu());
$$(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => toggleMobileMenu(false));
});

$("#year").textContent = new Date().getFullYear();

$$("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy");
    try {
      await navigator.clipboard.writeText(value);
      const previousText = button.textContent;
      button.textContent = "Email copied";
      setTimeout(() => {
        button.textContent = previousText;
      }, 1400);
    } catch {
      window.location.href = `mailto:${value}`;
    }
  });
});

const filters = $$(".filter");
const projectCards = $$("#projectGrid .project");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((item) => {
      const active = item === filter;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    const selectedTag = filter.dataset.filter;
    projectCards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(/\s+/).filter(Boolean);
      card.hidden = selectedTag !== "all" && !tags.includes(selectedTag);
    });
  });
});

const caseStudies = {
  closetsearch: {
    title: "ClosetSearch",
    body: `
      <p><strong>The idea:</strong> Make resale discovery feel like a focused fashion product—not a spreadsheet of marketplace results.</p>
      <p><strong>What I built:</strong> A documentation-led TypeScript monorepo with a React web app, an API boundary, shared listing and user models, provider adapters, cookie-backed authentication, and local SQLite persistence.</p>
      <p><strong>Intelligence layer:</strong></p>
      <ul>
        <li>Explainable personalization from onboarding choices, likes, saved searches, filters, watchlists, and preferred sources</li>
        <li>Observed-data pricing ranges and cautious under-market context without pretending to forecast prices</li>
        <li>An alert-ready matcher that connects saved intent to relevant listings</li>
      </ul>
      <p><strong>Why it matters to me:</strong> ClosetSearch connects my experience in fashion resale with full-stack engineering and my interest in careful, useful ML-driven product features.</p>
      <p><strong>Current boundary:</strong> It is a constrained preview release candidate. Real provider coverage and deeper ML recommendations are the next major steps.</p>
    `,
  },
  "speak-bridge": {
    title: "Speak-Bridge",
    body: `
      <p><strong>The idea:</strong> Explore how computer vision can reduce a communication barrier by translating ASL gestures into spoken output in real time.</p>
      <p><strong>System flow:</strong> Live camera input feeds hand-landmark tracking, a classification loop, and streaming interface updates.</p>
      <p><strong>Engineering decisions:</strong></p>
      <ul>
        <li>Keep the model pipeline modular so components can improve without rewriting the interface</li>
        <li>Design for low-latency feedback so users can correct a sign quickly</li>
        <li>Surface live state and confidence instead of hiding uncertainty</li>
      </ul>
      <p><strong>What I learned:</strong> A model is only one part of an AI product. Input quality, latency, feedback, and interface design determine whether the system is actually usable.</p>
      <p><strong>Next questions:</strong> Broader gesture coverage, accuracy benchmarks, and testing in more realistic settings.</p>
    `,
  },
};

const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalBody = $("#modalBody");
const modalClose = $("#modalClose");
const modalDone = $("#modalOk");
let lastFocusedElement = null;

const openModal = (key) => {
  const study = caseStudies[key];
  if (!study) return;

  lastFocusedElement = document.activeElement;
  modalTitle.textContent = study.title;
  modalBody.innerHTML = study.body;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalClose.focus();
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastFocusedElement?.focus();
};

$$("[data-open]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(button.getAttribute("data-open"));
  });
});

modalClose?.addEventListener("click", closeModal);
modalDone?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => {
  if (event.target?.getAttribute?.("data-close") === "true") closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});
