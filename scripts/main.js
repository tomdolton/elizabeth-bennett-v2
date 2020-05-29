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
Nav.init();



// -----------------------------------------------------------------------------
// Generate Gallery Images
// -----------------------------------------------------------------------------
const Gallery = {

  photos: [],

  init: function () {
    this.cacheDOM();
    this.generateGallery();
    this.bindEvents();
    console.log("init")
  },

  cacheDOM: function () {
    this.gallery = document.querySelector(".gallery");
    this.photos;
    this.overlay = document.querySelector(".overlay");
    this.overlayPicture = this.overlay.querySelector(".overlay__picture");
    this.overlayClose = this.overlay.querySelector(".overlay__close");

  },

  bindEvents: function () {
    window.addEventListener("load", () => this.photos.forEach(photo => this.setOrientation(photo)));
    this.photos.forEach((photo) => photo.addEventListener("click", this.openOverlay.bind(this)));
    this.overlayClose.addEventListener("click", this.closeOverlay.bind(this));
  },

  generateHTML: function ([name, number]) {
    return `
      <picture>
        <source type="image/jpeg" srcset="images/${name}_${number}.jpg">
        <img class="gallery__item" src="images/${name}_${number}.jpg" alt="">
      </picture>
    `;
  },

  generateGallery: function () {
    const galleryName = this.gallery.dataset.gallery;
    const photoNum = this.gallery.dataset.number;
    let inc = 1;
    const images = Array.from({ length: photoNum }, () => ([galleryName, inc++]));
    const html = images.map(this.generateHTML).join("");
    this.gallery.innerHTML = html;
    this.photos = document.querySelectorAll(".gallery__item");
  },

  setOrientation: function (photo) {
    const height = photo.naturalHeight;
    const width = photo.naturalWidth;
    if (height > width) {
      photo.parentNode.classList.add("span-2")
    }
  },

  openOverlay: function (e) {
    const src = e.target.src;
    // if thumbnail img is showing jpg, use that
    // if thumbnail img is showing webp, use that
    // const webp = e.target.querySelector("source [type='image/webp']");
    // const jpeg = e.target.querySelector("source [type='image/jpeg']");
    this.overlayPicture.querySelector('source[type="image/jpeg"]').srcset = src;
    this.overlay.classList.add("overlay--active");
  },

  closeOverlay: function (e) {
    e.stopPropagation();
    this.overlay.classList.remove("overlay--active");
  }
};
Gallery.init();


// -----------------------------------------------------------------------------
// UnfixHeader
// Changes header sidebar from fixed to absolute at certain scroll position
// -----------------------------------------------------------------------------
const UnfixHeader = {

  init: function () {
    this.cacheDOM();
    this.bindEvents();
  },

  cacheDOM: function () {
    this.header = document.querySelector(".header");
  },

  bindEvents: function () {
    window.addEventListener("load", () => {
      this.getPosition();
    });
    window.addEventListener("scroll", () => {
      this.followTo(this.position);
    });
    window.addEventListener("resize", () => {
      this.getPosition();
      this.followTo(this.position);
    })
  },

  getPosition: function () {
    this.windowWidth = window.innerWidth;
    const docHeight = document.body.scrollHeight;
    const windowHeight = window.innerHeight;
    this.position = docHeight - (windowHeight * 2);
  },

  followTo: function (position) {
    let top = window.scrollY;

    if (this.windowWidth < 1024) {
      this.header.style.position = "static";
    } else if (top >= position) {
      this.header.style.position = "absolute";
      this.header.style.top = position + "px";
    } else {
      this.header.style.position = "fixed";
      this.header.style.top = 0;
    }
  }

};

UnfixHeader.init();


