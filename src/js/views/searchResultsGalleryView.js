import iconsUrl from '../../img/icons.svg';
const [icons] = iconsUrl.split('?');

class SearchResultsGalleryView {
  #parentEl = document.querySelector('.search-results');
  #data;
  #search;
  #errorMessage = 'Nothing found. Please try again!';

  addHandlerClick(handler) {
    this.#parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.search-results__gallery-btn');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  renderResults(data, search) {
    this.#data = data;
    this.#search = search;
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
    <p class="search-results__text">
      Search Results for <span>“${this.#search.query}”</span>
    </p>

    <div class="gallery gallery--2 search-results__gallery">
      ${this.#generatePaginationMarkup()}
      ${this.#data.map((cell, i) => this.#generateCellMarkup(cell, i)).join('')}
    </div>
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
          <button class="btn gallery__item-caption-btn">Details</button>
        </figcaption>
    </figure>
    `;
  }

  #generatePaginationMarkup() {
    const currentPage = this.#search.page;
    const numPages = Math.ceil(
      this.#search.resultsCollection.length / this.#search.resultsPerPage
    );
    // Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
        <button data-goto="${currentPage + 1}" 
            class="
              btn
              search-results__gallery-btn search-results__gallery-btn--next
            "
          >
            Page ${currentPage + 1}
            <svg>
              <use href="${icons}#icon-arrow-long-right"></use>
            </svg>
          </button>
      `;
    }
    // Last Page
    if (currentPage === numPages && numPages > 1) {
      return `
        <button data-goto="${currentPage - 1}"
            class="
              btn
              search-results__gallery-btn search-results__gallery-btn--previous
            "
          >
            <svg>
              <use href="${icons}#icon-arrow-long-left"></use>
            </svg>
            Page ${currentPage - 1}
          </button>
      `;
    }
    // Other Page
    if (currentPage < numPages) {
      return `
        <button "${currentPage - 1}"
            class="
              btn
              search-results__gallery-btn search-results__gallery-btn--previous
            "
          >
            <svg>
              <use href="${icons}#icon-arrow-long-left"></use>
            </svg>
            Page ${currentPage - 1}
          </button>
          <button "${currentPage + 1}"
            class="
              btn
              search-results__gallery-btn search-results__gallery-btn--next
            "
          >
            Page ${currentPage + 1}
            <svg>
              <use href="${icons}#icon-arrow-long-right"></use>
            </svg>
          </button>
      `;
    }

    // Page 1, and there are NO pages
    return '';
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

export default new SearchResultsGalleryView();
