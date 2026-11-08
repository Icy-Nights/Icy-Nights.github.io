const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#primary-menu");

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    menu.classList.toggle("is-open", !isOpen);
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      menu.classList.remove("is-open");
    }
  });
}

const year = document.querySelector("#current-year");
if (year) year.textContent = new Date().getFullYear();
