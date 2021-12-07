import iconsUrl from '../../img/icons.svg';
const [icons] = iconsUrl.split('?');

export default class GalleryView {
  _data;
  _search;

  render(data, search = {}) {
    // Check if data exists
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // Save data
    this._data = data;
    // Save search data (searchResult Gallery)
    this._search = search;
    // Create markup
    const markup = this._generateMarkup();
    // Clear parent container first
    this._clear();
    // Insert markup
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
    // Position buttons according to screen width
    this.positionButtons();
  }

  // Add handler to details button
  addHandlerDetailsClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.gallery__item-caption-btn');

      if (!btn) return;

      // Get cell number where the button was clicked
      const cellNum = +btn.dataset.cell;
      console.log(this);

      // Search Gallery => pass boolean = true
      if (this.classList.contains('search-results')) {
        handler(cellNum, true);
      }
      // Main Gallery
      else {
        handler(cellNum);
      }
    });
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

  // Cell markup
  _generateCellMarkup(cell, i) {
    return `
    <figure class="gallery__item gallery__item--${i + 1}">
      <button class="btn-icon btn-icon--heart-outline gallery__item-like">
          <svg>
            <use href="${icons}#icon-heart-outlined"></use>
          </svg>
        </button>
        <img
          src="${cell.primaryImageSmall}"
          alt="${cell.title}"
          class="gallery__item-img"
        />
        <figcaption class="gallery__item-caption">
          <p class="gallery__item-caption-title">${cell.title}</p>
          <p class="gallery__item-caption-artist">${cell.artistName}</p>
          <button data-cell=${i} class="btn gallery__item-caption-btn">Details</button>
        </figcaption>
    </figure>
    `;
  }
}
