import iconsUrl from '../../img/icons.svg';
const [icons] = iconsUrl.split('?');

class GalleryView {
  #parentEl = document.querySelector('.gallery--1');
  #data;
  #errorMessage = 'Something went wrong! Try again later.';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerClick(handler) {
    this.#parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.gallery__refresh-btn');

      if (!btn) return;

      handler();
    });
  }

  addHandlerDetailsClick(handler) {
    this.#parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.gallery__item-caption-btn');

      if (!btn) return;

      const cellNum = +btn.dataset.cell;

      handler(cellNum);
    });
  }

  renderGallery(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() {
    this.#parentEl.innerHTML = '';
  }

  renderSpinner = function () {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-refresh"></use>
      </svg>
    </div>
  `;
    this.#parentEl.innerHTML = '';
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  #generateMarkup() {
    return `
    <button class="btn-icon btn-icon--refresh gallery__refresh-btn">
      <svg>
        <use href="${icons}#icon-refresh"></use>
      </svg>
    </button>
    ${this.#data.map((cell, i) => this.#generateCellMarkup(cell, i)).join('')}
    `;
  }

  #generateCellMarkup(cell, i) {
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

  renderError(message = this.#errorMessage) {
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
    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}

export default new GalleryView();
