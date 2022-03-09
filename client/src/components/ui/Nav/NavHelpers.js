//Opens full width menu when menu button is clicked in mobile mode
export const openMenu = () => {
  document.body.classList += " menu--open";
};

//Closes full width menu when menu button is clicked in mobile mode
export const closeMenu = () => {
  document.body.classList.remove("menu--open");
};


