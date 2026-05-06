const THEME_KEY = "maureen-theme";

function getPreferredTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateToggleLabel(theme) {
  const label = theme === "dark" ? "Light Mode" : "Dark Mode";
  const headerToggle = document.getElementById("themeToggle");
  if (headerToggle) headerToggle.textContent = label;
  const sideToggle = document.getElementById("sideMenuThemeToggle");
  if (sideToggle) sideToggle.textContent = label;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  updateToggleLabel(theme);
}

function wireThemeToggle() {
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  }

  const headerToggle = document.getElementById("themeToggle");
  if (headerToggle) headerToggle.addEventListener("click", toggleTheme);

  const sideToggle = document.getElementById("sideMenuThemeToggle");
  if (sideToggle) sideToggle.addEventListener("click", toggleTheme);
}

function wireImageFallback() {
  const profileImages = document.querySelectorAll(".profile-image");

  profileImages.forEach((img) => {
    img.addEventListener("error", () => {
      const frame = img.closest(".profile-frame");
      if (frame) {
        frame.classList.add("no-image");
      }
    });

    if (img.complete && img.naturalWidth === 0) {
      const frame = img.closest(".profile-frame");
      if (frame) {
        frame.classList.add("no-image");
      }
    }
  });
}

function wirePageTransitions() {
  const links = document.querySelectorAll('a[href$=".html"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) {
        return;
      }

      event.preventDefault();
      document.body.classList.add("page-out");

      window.setTimeout(() => {
        window.location.href = url.href;
      }, 180);
    });
  });
}

function getPageNameFromPath(pathname) {
  const pageName = pathname.split("/").pop();
  return pageName ? pageName.toLowerCase() : "index.html";
}

function wireActiveNavigation() {
  const currentPage = getPageNameFromPath(window.location.pathname);
  const navSets = [
    { selector: ".home-main-nav a[href$='.html']", activeClass: "is-current" },
    { selector: ".side-menu-links a[href$='.html']", activeClass: "is-current" },
    { selector: ".sub-nav a[href$='.html']", activeClass: "current" },
  ];

  navSets.forEach(({ selector, activeClass }) => {
    const links = document.querySelectorAll(selector);
    if (!links.length) {
      return;
    }

    links.forEach((link) => {
      link.classList.remove(activeClass);

      const linkPage = getPageNameFromPath(new URL(link.getAttribute("href"), window.location.href).pathname);
      if (linkPage === currentPage) {
        link.classList.add(activeClass);
      }
    });
  });
}

function wireMobileSideMenu() {
  const menuToggle = document.getElementById("mobileMenuToggle");
  const menuClose = document.getElementById("mobileMenuClose");
  const sideMenu = document.getElementById("mobileSideMenu");
  const backdrop = document.getElementById("mobileSideMenuBackdrop");

  if (!menuToggle || !sideMenu || !backdrop) {
    return;
  }

  function openMenu() {
    document.body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    sideMenu.setAttribute("aria-hidden", "false");
    backdrop.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    sideMenu.setAttribute("aria-hidden", "true");
    backdrop.setAttribute("aria-hidden", "true");
  }

  menuToggle.addEventListener("click", () => {
    document.body.classList.contains("menu-open") ? closeMenu() : openMenu();
  });

  if (menuClose) menuClose.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);

  sideMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

function wireTypingAnimation() {
  const headline = document.querySelector(".typing-headline");
  const subheadline = document.querySelector(".typing-subheadline");
  if (!headline) return;

  const text = "Hi. I'm Maureen.";
  const typeSpeed = 80;
  const eraseSpeed = 45;
  const holdDelay = 2300;
  const pauseDelay = 600;

  function type(i) {
    headline.textContent = text.slice(0, i);
    if (i < text.length) {
      setTimeout(() => type(i + 1), typeSpeed);
    } else {
      if (subheadline) subheadline.classList.add("visible");
      setTimeout(erase, holdDelay);
    }
  }

  function erase() {
    if (subheadline) subheadline.classList.remove("visible");
    const len = headline.textContent.length;
    function step(i) {
      headline.textContent = text.slice(0, i);
      if (i > 0) {
        setTimeout(() => step(i - 1), eraseSpeed);
      } else {
        setTimeout(() => type(1), pauseDelay);
      }
    }
    setTimeout(() => step(len - 1), 400);
  }

  headline.textContent = "";
  setTimeout(() => type(1), 600);
}

function wireDropdowns() {
  document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
    const dropdown = toggle.closest(".dropdown");
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen);
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown.is-open").forEach((d) => {
      d.classList.remove("is-open");
      d.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".dropdown.is-open").forEach((d) => {
        d.classList.remove("is-open");
        d.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false");
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(getPreferredTheme());
  wireThemeToggle();
  wireActiveNavigation();
  wireMobileSideMenu();
  wireImageFallback();
  wirePageTransitions();
  wireTypingAnimation();
  wireDropdowns();

  window.requestAnimationFrame(() => {
    document.body.classList.remove("preload");
  });
});
