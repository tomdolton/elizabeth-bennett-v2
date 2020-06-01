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
  activeImg: "",
  overlayIsOpen: false,

  init: function () {
    this.cacheDOM();
    this.generateGallery();
    this.bindEvents();
    this.generateCarousel();
  },

  cacheDOM: function () {
    this.gallery = document.querySelector(".gallery");
    this.galleryName = this.gallery.dataset.gallery;
    this.photoNum = parseInt(this.gallery.dataset.number);  //changed to parseInt
    this.photos;
    this.overlay = document.querySelector(".overlay");
    this.overlayInner = this.overlay.querySelector(".overlay__inner");
    this.overlayClose = this.overlay.querySelector(".overlay__close");
    this.nextBtn = this.overlay.querySelector(".overlay__next");
    this.prevBtn = this.overlay.querySelector(".overlay__prev");
  },

  bindEvents: function () {
    window.addEventListener("load", () => this.photos.forEach(photo => this.setOrientation(photo)));
    this.photos.forEach((photo) => photo.addEventListener("click", this.openOverlay.bind(this)));
    this.overlayClose.addEventListener("click", this.closeOverlay.bind(this));
    this.nextBtn.addEventListener("click", this.carouselNext.bind(this));
    this.prevBtn.addEventListener("click", this.carouselPrevious.bind(this));
    document.addEventListener("keydown", this.arrowKeys.bind(this));
    this.overlay.addEventListener("click", this.overlayClick.bind(this));

  },

  generateGalleryHTML: function ([name, number]) {
    return `
      <picture>
        <source type="image/jpeg" srcset="images/${name}_${number}.jpg">
        <img class="gallery__item" data-number="${number}" src="images/${name}_${number}.jpg" alt="">
      </picture>
    `;
  },

  generateGallery: function () {
    let inc = 1;
    const images = Array.from({ length: this.photoNum }, () => ([this.galleryName, inc++]));
    const html = images.map(this.generateGalleryHTML).join("");
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

  generateCarouselHTML: function ([name, number]) {
    return `
      <picture class="overlay__picture">
        <source type="image/jpeg" srcset="images/${name}_${number}.jpg">
        <img class="overlay__img" data-number="${number}" src="images/${name}_${number}.jpg">
      </picture>
    `;
  },

  generateCarousel: function () {
    let inc = 1;
    const images = Array.from({ length: this.photoNum }, () => ([this.galleryName, inc++]));
    const html = images.map(this.generateCarouselHTML).join("");
    this.overlayInner.insertAdjacentHTML('afterbegin', html);
  },

  openOverlay: function (e) {
    const index = e.target.dataset.number - 1;
    const pictureContainer = (this.overlayInner.children[index]);

    this.activeImg = pictureContainer.lastElementChild;
    this.activeImg.classList.add("overlay__img--active")
    this.overlay.classList.add("overlay--active");
    this.overlayIsOpen = true;

    this.timer = setInterval(() => {
      this.carouselNext();
    }, 4000);
  },

  closeOverlay: function (e) {
    if (e) e.stopPropagation();
    this.overlay.classList.remove("overlay--active");
    this.activeImg.classList.remove("overlay__img--active");
    this.overlayIsOpen = false;
    clearInterval(this.timer);
  },

  carouselNext: function () {
    const number = parseInt(this.activeImg.dataset.number);
    this.activeImg.classList.remove("overlay__img--active");
    // If last photo, loops back to first photo, else change to next photo
    if (number === this.photoNum) {
      const pictureContainer = (this.overlayInner.children[0]);
      this.activeImg = pictureContainer.lastElementChild;
    } else {
      const nextImg = this.activeImg.parentNode.nextElementSibling.lastElementChild;
      this.activeImg = nextImg;
    }
    this.activeImg.classList.add("overlay__img--active");
  },

  carouselPrevious: function () {
    const number = parseInt(this.activeImg.dataset.number);
    this.activeImg.classList.remove("overlay__img--active");
    // If first photo, loops back to last photo, else change to previous photo
    if (number === 1) {
      const pictureContainer = (this.overlayInner.children[this.photoNum - 1]);
      this.activeImg = pictureContainer.lastElementChild;
    } else {
      const prevImg = this.activeImg.parentNode.previousElementSibling.lastElementChild;
      this.activeImg = prevImg;
    }
    this.activeImg.classList.add("overlay__img--active");
  },

  arrowKeys: function (e) {
    if (!this.overlayIsOpen) return;
    const keyCode = e.keyCode;
    switch (keyCode) {
      case 37:
        this.carouselNext();
        break;
      case 39:
        this.carouselPrevious();
        break;
      case 27:
        this.closeOverlay();
        break;
      default:
        break;
    }
  },

  overlayClick: function (e) {
    if (e.target === this.overlay) {
      this.closeOverlay();
    } else {
      clearInterval(this.timer);
    }
  }

};
Gallery.init();
// click overlay not on inner closes overlay. //
// Landscape photos in grid next to portait stretch horixontally, fix //
// Use arrow keys to navigate carousel. //

// Set automatic timer for carousel. //
// timer starts on openOverlay //
// timer stops on click on overlay inner //
// ? timer restarts after 1 minute?
// on hover arrows are shown, not shown by default
// portrait overlay photos have same width as landscape, with white background //


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


