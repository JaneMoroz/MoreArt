import iconsUrl from '../../img/icons.svg';
const [icons] = iconsUrl.split('?');

class GalleryView {
  #parentEl = document.querySelector('.gallery--1');
  #data;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
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
          src="${cell.primaryImage}"
          alt="${cell.title}"
          class="gallery__item-img"
        />
        <figcaption class="gallery__item-caption">
          <p class="gallery__item-caption-title">${cell.title}</p>
          <p class="gallery__item-caption-artist">${cell.artistName}</p>
          <button class="btn gallery__item-caption-btn">Details</button>
        </figcaption>
    </figure>
    `;
  }
}

export default new GalleryView();
