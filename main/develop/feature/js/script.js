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


// Cerrar menú al seleccionar una sección

navItems.forEach(link => {

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

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const currentId = entry.target.id;

            navItems.forEach(link => {

                link.classList.remove("active");

                if (link.getAttribute("href") === `#${currentId}`) {
                    link.classList.add("active");
                }

            });

        }

    });

}, {
    rootMargin: "-25% 0px -60% 0px"
});

sections.forEach(section => {
    observer.observe(section);
});


// =========================================
// 4. DESPLEGABLES DE LOS PERFILES
// =========================================

const roleButtons = document.querySelectorAll(".role-toggle");

roleButtons.forEach(button => {

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

pendingLinks.forEach(link => {

    link.addEventListener("click", (event) => {

        if (link.getAttribute("href") === "#") {
            event.preventDefault();
        }

    });

});
