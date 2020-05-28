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
  },

  bindEvents: function () {
    this.hamburger.addEventListener("click", this.toggleNav.bind(this));
  },

  toggleNav: function () {
    this.mobileNav.classList.toggle("mobile-nav--active");
    this.hamburger.classList.toggle("hamburger--active");
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
      <picture class="gallery__item">
        <source type="image/jpeg" srcset="images/${name}_${number}.jpg">
        <img src="images/${name}_${number}.jpg" alt="">
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
    const img = photo.querySelector("img");
    const height = img.clientHeight;
    const width = img.naturalWidth;
    if (height > width) {
      photo.classList.add("span-2")
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

    if (this.windowWidth < 768) {
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


