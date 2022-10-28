const navbarBurger = document.querySelector(".navbar-burger");
navbarBurger.addEventListener("click", (e) => {
  const targetName = e.currentTarget.dataset.targetName;
  const navbarMenu = document.getElementById(targetName);

  navbarBurger.classList.toggle("is-active");
  navbarMenu.classList.toggle("is-active");
});
