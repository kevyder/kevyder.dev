document.addEventListener("DOMContentLoaded", () => {
  const mobileButton = document.querySelector(".mobile-button");
  const menuOptions = document.querySelector(".container-options");
  const linesButton = document.querySelector(".lines-button");
  const menuLinks = document.querySelectorAll(".container-options .option a");
  const mobileMediaQuery = window.matchMedia("(max-width: 768px)");

  if (!mobileButton || !menuOptions || !linesButton) {
    return;
  }

  const closeMenu = ({ returnFocus = false } = {}) => {
    menuOptions.classList.remove("active");
    linesButton.classList.remove("close-lines");
    mobileButton.setAttribute("aria-expanded", "false");
    mobileButton.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";

    if (returnFocus) {
      mobileButton.focus();
    }
  };

  const openMenu = () => {
    menuOptions.classList.add("active");
    linesButton.classList.add("close-lines");
    mobileButton.setAttribute("aria-expanded", "true");
    mobileButton.setAttribute("aria-label", "Close menu");

    // Prevent scrolling when menu is open on small screens.
    document.body.style.overflow = mobileMediaQuery.matches ? "hidden" : "";

    if (mobileMediaQuery.matches) {
      menuLinks[0]?.focus();
    }
  };

  const syncMenuState = () => {
    if (!mobileMediaQuery.matches) {
      closeMenu();
    }
  };

  mobileButton.addEventListener("click", () => {
    if (menuOptions.classList.contains("active")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  // Close menu when clicking on a link
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".mobile-button") &&
      !event.target.closest(".container-options") &&
      menuOptions.classList.contains("active")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOptions.classList.contains("active")) {
      closeMenu({ returnFocus: true });
    }
  });

  mobileMediaQuery.addEventListener("change", syncMenuState);
  syncMenuState();
});
