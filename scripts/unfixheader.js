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
    if (this.position < 950) this.position = 950;
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

export { UnfixHeader };