import iconsUrl from '../../img/icons.svg';
const [icons] = iconsUrl.split('?');

class FavoritesView {
  _parentEl = document.querySelector('.favorites__list');
  _data;
  _errorMessage = 'No favorites yet. Find a nice image and like it :)';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  render(data) {
    // Check if data exists
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // Save data
    this._data = data;
    // Create markup
    const markup = this._generateMarkup();
    // Clear parent container first
    this._clear();
    // Insert markup
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  // Clear element
  _clear() {
    this._parentEl.innerHTML = '';
  }

  // Render loading spinner
  renderSpinner = function () {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-refresh"></use>
      </svg>
    </div>
  `;
    this._parentEl.innerHTML = '';
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  // Render error
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-caution"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup() {
    return this._data.map(this._generatePreviewMarkup).join('');
  }

  _generatePreviewMarkup(favorite) {
    return `
    <li class="favorites__list-item">
      <a class="favorites__list-item-link">
        <img src="${favorite.primaryImageSmall}" alt="${favorite.title}" />
      </a>
    </li>
    `;
  }
}

export default new FavoritesView();
