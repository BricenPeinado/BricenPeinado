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
      <p><strong>The idea:</strong> Turn fragmented fashion resale listings into comparable market intelligence for active buyers and sellers.</p>
      <p><strong>What I built:</strong> A multi-marketplace pipeline that normalizes listings across brands, categories, conditions, sizes, and providers.</p>
      <p><strong>Intelligence layer:</strong></p>
      <ul>
        <li>Developing ML-driven fair-value estimates from comparable listing data</li>
        <li>Detecting pricing anomalies and identifying trend signals</li>
        <li>Surfacing potential resale opportunities for a close-knit fashion community</li>
      </ul>
      <p><strong>Stack:</strong> React, Node.js, Express, and MongoDB.</p>
      <p><strong>Why it matters to me:</strong> ClosetSearch connects my experience in fashion resale with full-stack engineering and applied machine learning.</p>
    `,
  },
  "speak-bridge": {
    title: "Speak-Bridge",
    body: `
      <p><strong>The idea:</strong> Explore how computer vision can reduce a communication barrier by translating ASL gestures into spoken output in real time.</p>
      <p><strong>System flow:</strong> Webcam frames stream through hand-landmark detection and AI-based interpretation, returning structured sign hypotheses, confidence scores, and visual cues.</p>
      <p><strong>Engineering decisions:</strong></p>
      <ul>
        <li>Implemented FastAPI streaming endpoints and live landmark overlays</li>
        <li>Designed frontend state handling for responsive, low-latency feedback</li>
        <li>Added fallbacks for image-processing and API failures</li>
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
