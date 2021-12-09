class OptionsView {
  #parentEl = document.querySelector('.nav__btn--options');

  addHandlerOptions(handler) {
    this.#parentEl.addEventListener('click', function (e) {
      handler();
    });
  }
}

export default new OptionsView();
