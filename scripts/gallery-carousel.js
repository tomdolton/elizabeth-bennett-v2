// -----------------------------------------------------------------------------
// Generate Gallery Images
// -----------------------------------------------------------------------------
const Gallery = {
  photos: [],
  photoNum: "",

  init: function () {
    this.cacheDOM();
    this.generateGallery();
    this.bindEvents();
  },

  cacheDOM: function () {
    this.gallery = document.querySelector(".gallery");
    this.galleryName = this.gallery.dataset.gallery;
    this.photoNum = parseInt(this.gallery.dataset.number);
  },

  bindEvents: function () {
    window.addEventListener("load", () => this.photos.forEach(photo => this.setOrientation(photo)));
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
  }
};





// -----------------------------------------------------------------------------
// Overlay Image Carousel
// -----------------------------------------------------------------------------
const Carousel = {
  activeImg: "",
  overlayIsOpen: false,

  init: function () {
    this.cacheDOM();
    this.bindEvents();
    this.generateCarousel();
  },

  cacheDOM: function () {
    this.overlay = document.querySelector(".overlay");
    this.overlayInner = this.overlay.querySelector(".overlay__inner");
    this.overlayClose = this.overlay.querySelector(".overlay__close");
    this.nextBtn = this.overlay.querySelector(".overlay__next");
    this.prevBtn = this.overlay.querySelector(".overlay__prev");
  },

  bindEvents: function () {
    Gallery.photos.forEach((photo) => photo.addEventListener("click", (e) => {
      this.openOverlay(e);
      this.setCarouselDimensions();
    }));
    this.overlayClose.addEventListener("click", this.closeOverlay.bind(this));
    this.nextBtn.addEventListener("click", this.carouselNext.bind(this));
    this.prevBtn.addEventListener("click", this.carouselPrevious.bind(this));
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.overlay.addEventListener("click", this.overlayClick.bind(this));
    window.addEventListener("resize", this.setCarouselDimensions.bind(this))
  },

  handleKeyDown: function (e) {
    if (!this.overlayIsOpen) return;
    clearInterval(this.timer);
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
    const images = Array.from({ length: Gallery.photoNum }, () => ([Gallery.galleryName, inc++]));
    const html = images.map(this.generateCarouselHTML).join("");
    this.overlayInner.insertAdjacentHTML('afterbegin', html);
    // gets array of carousel img nodes
    const carouselChildren = Array.from(this.overlayInner.children)
    const carouselPictures = carouselChildren.filter(el => el.nodeName === "PICTURE");
    this.carouselSlides = carouselPictures.map(picture => picture.lastElementChild);
  },

  setCarouselDimensions: function () {
    if (!this.overlayIsOpen) return;
    // gets open image dimensions
    const dimensions = this.activeImg.getBoundingClientRect();
    const height = dimensions.height;
    const width = dimensions.width;
    // sets .carousel_inner to open image dimensions
    this.overlayInner.style.height = height + "px";
    this.overlayInner.style.width = width + "px";
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
    this.activeImg.classList.remove("overlay__img--active"); ``
    // If last photo, loops back to first photo, else change to next photo
    if (number === Gallery.photoNum) {
      const pictureContainer = (this.overlayInner.children[0]);
      this.activeImg = pictureContainer.lastElementChild;
    } else {
      const nextImg = this.activeImg.parentNode.nextElementSibling.lastElementChild;
      this.activeImg = nextImg;
    }
    this.activeImg.classList.add("overlay__img--active");
    this.setCarouselDimensions();
  },

  carouselPrevious: function () {
    const number = parseInt(this.activeImg.dataset.number);
    this.activeImg.classList.remove("overlay__img--active");
    // If first photo, loops back to last photo, else change to previous photo
    if (number === 1) {
      const pictureContainer = (this.overlayInner.children[Gallery.photoNum - 1]);
      this.activeImg = pictureContainer.lastElementChild;
    } else {
      const prevImg = this.activeImg.parentNode.previousElementSibling.lastElementChild;
      this.activeImg = prevImg;
    }
    this.activeImg.classList.add("overlay__img--active");
    this.setCarouselDimensions();
  },

  overlayClick: function (e) {
    if (e.target === this.overlay) {
      this.closeOverlay();
    } else {
      clearInterval(this.timer);
    }
  }
};


export { Gallery, Carousel };