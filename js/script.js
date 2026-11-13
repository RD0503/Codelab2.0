// =========================================
// 1. ELEMENTOS DEL DOM
// =========================================

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = document.querySelectorAll(".nav-link");

// =========================================
// 2. MENÚ RESPONSIVE
// =========================================

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");

  menuToggle.setAttribute("aria-expanded", isOpen);
});

// Cerrar menú al seleccionar cualquier enlace (incluye el botón "Contactanos")

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// =========================================
// 3. NAVEGACIÓN ACTIVA
// =========================================

const sections = document.querySelectorAll("main section[id]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.id;

        navItems.forEach((link) => {
          link.classList.remove("active");

          if (link.getAttribute("href") === `#${currentId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  },
  {
    rootMargin: "-25% 0px -60% 0px",
  },
);

sections.forEach((section) => {
  observer.observe(section);
});

// =========================================
// 4. DESPLEGABLES DE LOS PERFILES
// =========================================

const roleButtons = document.querySelectorAll(".role-toggle");

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const roleCard = button.closest(".role-card");

    roleCard.classList.toggle("open");

    const isOpen = roleCard.classList.contains("open");

    button.setAttribute("aria-expanded", isOpen);
  });
});

// =========================================
// 5. AÑO AUTOMÁTICO DEL FOOTER
// =========================================

const currentYear = document.getElementById("current-year");

currentYear.textContent = new Date().getFullYear();

// =========================================
// 6. ENLACES PENDIENTES
// =========================================

const pendingLinks = document.querySelectorAll(".pending-link");

pendingLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("href") === "#") {
      event.preventDefault();
    }
  });
});

// =========================================
// 7. SCROLL SUAVE PERSONALIZADO
// =========================================

const SCROLL_DURATION = 900; // milisegundos: más alto = más lento

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const header = document.querySelector(".header");

let scrollAnimationFrame = null;

// Arranca rápido y frena suave al llegar (como en las webs de Apple)
const easeOutCubic = (progress) => 1 - Math.pow(1 - progress, 3);

const cancelCustomScroll = () => {
  cancelAnimationFrame(scrollAnimationFrame);
  scrollAnimationFrame = null;
};

// Si la persona scrollea manualmente, se corta la animación
["wheel", "touchstart"].forEach((eventName) => {
  window.addEventListener(eventName, cancelCustomScroll, { passive: true });
});

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  const targetId = link?.getAttribute("href").slice(1);
  const target = targetId && document.getElementById(targetId);

  if (!target) return;

  event.preventDefault();
  cancelCustomScroll();
  history.pushState(null, "", `#${targetId}`);

  const startY = window.scrollY;
  const targetY =
    target.getBoundingClientRect().top + startY - header.offsetHeight;

  const startTime = performance.now();

  const animateScroll = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / SCROLL_DURATION, 1);
    const newY = startY + (targetY - startY) * easeOutCubic(progress);

    window.scrollTo({ top: newY, behavior: "instant" });

    scrollAnimationFrame =
      progress < 1 ? requestAnimationFrame(animateScroll) : null;
  };

  scrollAnimationFrame = requestAnimationFrame(animateScroll);
});

// =========================================
// 8. APARICIÓN AL HACER SCROLL
// =========================================

// Elementos que aparecen con fade + subida al entrar en pantalla.
// Para animar algo nuevo, solo agregá su selector a esta lista.
const REVEAL_SELECTORS = [
  ".hero-text",
  ".hero-image",
  ".section-intro",
  ".benefits-details h3",
  ".info-card",
  ".feature-card",
  ".system-heading",
  ".role-card",
  ".contact-heading",
  ".contact-banner .container > p",
  ".contact-options",
  ".team h2",
  ".team-members",
  ".footer-content > *",
];

const REVEAL_STAGGER = 0.1; // segundos de diferencia entre elementos que entran juntos

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, index) => {
          entry.target.style.setProperty(
            "--reveal-delay",
            `${index * REVEAL_STAGGER}s`,
          );
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
  );

  document.querySelectorAll(REVEAL_SELECTORS.join(",")).forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
}

// =========================================
// 9. EFECTO DEL HERO AL BAJAR
// =========================================

// Guarda en --hero-progress un valor de 0 a 1 según cuánto se bajó del hero.
// El CSS usa ese valor para achicar y desvanecer el contenido.
const hero = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");

let heroProgress = 0;
let heroUpdatePending = false;

const updateHeroProgress = () => {
  heroUpdatePending = false;

  const progress = Math.min(window.scrollY / hero.offsetHeight, 1);

  if (progress === heroProgress) return;

  heroProgress = progress;
  heroContent.style.setProperty("--hero-progress", progress.toFixed(3));
};

if (!prefersReducedMotion) {
  window.addEventListener(
    "scroll",
    () => {
      if (heroUpdatePending) return;

      heroUpdatePending = true;
      requestAnimationFrame(updateHeroProgress);
    },
    { passive: true },
  );
}
