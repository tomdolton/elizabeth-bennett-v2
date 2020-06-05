// -----------------------------------------------------------------------------
// Mobile dropdown nav
// -----------------------------------------------------------------------------
const Nav = {

  init: function () {
    this.cacheDOM();
    this.bindEvents();
  },

  cacheDOM: function () {
    this.hamburger = document.querySelector(".hamburger");
    this.mobileNav = document.querySelector(".mobile-nav");
    this.modal = document.querySelector(".modal");
  },

  bindEvents: function () {
    this.hamburger.addEventListener("click", this.toggleNav.bind(this));
    this.modal.addEventListener("click", this.toggleNav.bind(this));
    window.addEventListener("scroll", this.closeNav.bind(this));
    window.addEventListener("resize", this.closeNav.bind(this));
  },

  toggleNav: function () {
    this.mobileNav.classList.toggle("mobile-nav--active");
    this.hamburger.classList.toggle("hamburger--active");
    this.modal.classList.toggle("modal--active");
  },

  closeNav: function () {
    this.mobileNav.classList.remove("mobile-nav--active");
    this.hamburger.classList.remove("hamburger--active");
    this.modal.classList.remove("modal--active");
  }

};


export { Nav };