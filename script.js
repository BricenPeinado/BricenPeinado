const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ===== Theme ===== */
const themeToggle = $("#themeToggle");
const setTheme = (t) => {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("theme", t);
  $(".icon", themeToggle).textContent = t === "light" ? "☼" : "☾";
};
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);

themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
});

/* ===== Mobile menu ===== */
const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");
const toggleMobile = (open) => {
  const isOpen = open ?? !mobileMenu.classList.contains("is-open");
  mobileMenu.classList.toggle("is-open", isOpen);
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
};
menuBtn?.addEventListener("click", () => toggleMobile());
$$(".mobile__panel a").forEach((a) => a.addEventListener("click", () => toggleMobile(false)));

/* ===== Footer year ===== */
$("#year").textContent = new Date().getFullYear();

/* ===== Copy email ===== */
$$("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = btn.getAttribute("data-copy");
    try {
      await navigator.clipboard.writeText(text);
      const old = btn.textContent;
      btn.textContent = "Copied ✓";
      setTimeout(() => (btn.textContent = old), 1200);
    } catch {
      alert("Copy failed — you can manually select and copy.");
    }
  });
});

/* ===== Project filter ===== */
const filters = $$(".filter");
const cards = $$("#projectGrid .card");

filters.forEach((f) => {
  f.addEventListener("click", () => {
    filters.forEach((x) => x.classList.remove("is-active"));
    f.classList.add("is-active");
    const tag = f.dataset.filter;

    cards.forEach((c) => {
      const tags = (c.dataset.tags || "").split(/\s+/).filter(Boolean);
      const show = tag === "all" ? true : tags.includes(tag);
      c.style.display = show ? "block" : "none";
    });
  });
});

/* ===== Modal / Case studies ===== */
const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalBody = $("#modalBody");
const modalClose = $("#modalClose");
const modalOk = $("#modalOk");

const CASE_STUDIES = {
  "speak-bridge": {
    title: "Speak-Bridge — Real-Time ASL → Speech",
    body: `
      <p><strong>Goal:</strong> translate sign language into spoken output in real time, with a usable demo experience.</p>
      <p><strong>How it works:</strong> camera input → hand landmark tracking → classification loop → streaming updates to UI.</p>
      <p><strong>Engineering highlights:</strong></p>
      <ul>
        <li>Designed for low-latency feedback so users can correct signs quickly</li>
        <li>Built the UI around clarity: live state, confidence, and next-step prompts</li>
        <li>Modular pipeline so models/logic can be swapped without rewriting the frontend</li>
      </ul>
      <p><strong>Next upgrades:</strong> accuracy benchmarks, more gestures, and a clean hosted demo.</p>
    `,
  },
  "outfit-oracle": {
    title: "Outfit Oracle — Resale Search Aggregator",
    body: `
      <p><strong>Goal:</strong> unify fashion resale search results into one clean interface with useful filters and sorting.</p>
      <p><strong>What I built:</strong> multi-provider search that normalizes results into a single card format for fast scanning.</p>
      <p><strong>Product decisions:</strong></p>
      <ul>
        <li>UI emphasizes readability and speed (title, price, source, image)</li>
        <li>Filters to match buyer intent: auctions vs buyouts, sort by price/end date</li>
        <li>Provider-agnostic structure so new marketplaces plug in cleanly</li>
      </ul>
      <p><strong>Next upgrades:</strong> better ranking, saved searches, and “For You” personalization.</p>
    `,
  },
};

const openModal = (key) => {
  const data = CASE_STUDIES[key];
  if (!data) return;

  modalTitle.textContent = data.title;
  modalBody.innerHTML = data.body;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

$$("[data-open]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(btn.getAttribute("data-open"));
  });
});

modalClose?.addEventListener("click", closeModal);
modalOk?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => {
  if (e.target?.getAttribute?.("data-close") === "true") closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

/* ===== Placeholder buttons ===== */
$("#downloadSource")?.addEventListener("click", (e) => {
  e.preventDefault();
  alert("To customize: update links + email in index.html. Then host on GitHub Pages (steps below).");
});

const resumeLinks = ["#resumeLink", "#resumeLink2"].map((s) => $(s)).filter(Boolean);
resumeLinks.forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Replace this with your actual resume PDF link (Google Drive direct link, GitHub, or /resume.pdf).");
  });
});
