const THEME_KEY = "maureen-theme";

function getPreferredTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateToggleLabel(theme) {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) {
    return;
  }

  themeToggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  updateToggleLabel(theme);
}

function wireThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) {
    return;
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });
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

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(getPreferredTheme());
  wireThemeToggle();
  wireActiveNavigation();
  wireImageFallback();
  wirePageTransitions();

  window.requestAnimationFrame(() => {
    document.body.classList.remove("preload");
  });
});
