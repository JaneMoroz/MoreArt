class OptionsView {
  _parentEl = document.querySelector('.nav__btn--options');

  addHandlerOptions(handler) {
    this._parentEl.addEventListener('click', function (e) {
      handler();
    });
  }
}

export default new OptionsView();
