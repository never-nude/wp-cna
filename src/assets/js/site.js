const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");

if (navToggle && navMenu) {
  const closeNav = () => {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeNav();
    }
  });

  document.addEventListener("click", (event) => {
    if (!navMenu.classList.contains("is-open")) {
      return;
    }

    if (navMenu.contains(event.target) || navToggle.contains(event.target)) {
      return;
    }

    closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
      closeNav();
      navToggle.focus();
    }
  });
}

const filterForm = document.querySelector("[data-event-filters]");

if (filterForm) {
  const cards = Array.from(document.querySelectorAll("[data-event-card]"));
  const sections = Array.from(document.querySelectorAll("[data-event-section]"));

  const applyFilters = () => {
    const formData = new FormData(filterForm);
    const search = String(formData.get("search") || "").trim().toLowerCase();
    const category = String(formData.get("category") || "");
    const month = String(formData.get("month") || "");

    cards.forEach((card) => {
      const matchesSearch = !search || card.dataset.search.includes(search);
      const matchesCategory = !category || card.dataset.category === category;
      const matchesMonth = !month || card.dataset.month === month;
      const isVisible = matchesSearch && matchesCategory && matchesMonth;

      card.hidden = !isVisible;
    });

    sections.forEach((section) => {
      const visibleCards = section.querySelectorAll("[data-event-card]:not([hidden])").length;
      const countNode = section.querySelector("[data-event-count]");
      const emptyNode = section.querySelector("[data-filter-empty]");

      if (countNode) {
        countNode.textContent = `${visibleCards} event${visibleCards === 1 ? "" : "s"}`;
      }

      if (emptyNode) {
        emptyNode.hidden = visibleCards !== 0;
      }
    });
  };

  filterForm.addEventListener("input", applyFilters);
  filterForm.addEventListener("change", applyFilters);
  filterForm.addEventListener("reset", () => {
    window.requestAnimationFrame(applyFilters);
  });
}

const carousels = Array.from(document.querySelectorAll("[data-carousel]"));

carousels.forEach((carousel) => {
  const track = carousel.querySelector("[data-carousel-track]");
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");

  if (!track || !prev || !next) {
    return;
  }

  const getStep = () => {
    const firstCard = track.firstElementChild;
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");

    if (!firstCard) {
      return track.clientWidth * 0.9;
    }

    return firstCard.getBoundingClientRect().width + gap;
  };

  const updateControls = () => {
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth - 2);

    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maxScroll;
  };

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: getStep(), behavior: "smooth" });
  });

  track.addEventListener(
    "scroll",
    () => {
      window.requestAnimationFrame(updateControls);
    },
    { passive: true }
  );

  window.addEventListener("resize", updateControls);
  updateControls();
});
