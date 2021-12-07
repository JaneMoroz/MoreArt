import galleryView from './galleryView.js';
import iconsUrl from '../../img/icons.svg';
const [icons] = iconsUrl.split('?');

class SearchResultsGalleryView extends galleryView {
  _parentEl = document.querySelector('.search-results');
  _errorMessage = 'Nothing found. Please try again!';

  // Add handler to next/previous page buttons
  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.search-results__gallery-btn');

      if (!btn) return;

      // Get page number
      const goToPage = +btn.dataset.goto;

      // Pass page number
      handler(goToPage);
    });
  }

  // Position previous/next page buttons according to screen width
  positionButtons() {
    const previousBtn = document.querySelector(
      '.search-results__gallery-btn--previous'
    );
    const nextBtn = document.querySelector(
      '.search-results__gallery-btn--next'
    );
    const footer = document.querySelector('.footer');
    const searchGallery = document.querySelector('.gallery--2');

    var mediaQuery = window.matchMedia('(max-width: 1024px)');
    if (mediaQuery.matches) {
      // Fixed Position Buttons: Intersection Observer API
      // Previous button
      if (previousBtn) {
        previousBtn.classList.add('sticky');
        const fixPreviousBtn = function (entries) {
          const [entry] = entries;

          if (!entry.isIntersecting) {
            previousBtn.classList.add('hidden');
          } else {
            previousBtn.classList.remove('hidden');
          }
        };

        const previousBtnObserver = new IntersectionObserver(fixPreviousBtn, {
          root: null,
          threshold: 0,
          rootMargin: `-${0}px`,
        });
        previousBtnObserver.observe(searchGallery);
      }

      // Next Button
      if (nextBtn) {
        nextBtn.classList.add('sticky');
        const fixNextBtn = function (entries) {
          const [entry] = entries;

          if (!entry.isIntersecting) {
            nextBtn.classList.add('hidden');
          } else {
            nextBtn.classList.remove('hidden');
          }
        };

        const nextBtnObserver = new IntersectionObserver(fixNextBtn, {
          root: null,
          threshold: 0,
          rootMargin: `-${0}px`,
        });
        nextBtnObserver.observe(searchGallery);
      }

      // Hide Buttons When The Footer Appears
      const hideBtns = function (entries) {
        const [entry] = entries;

        if (entry.isIntersecting) {
          previousBtn?.classList.add('hidden');
          nextBtn?.classList.add('hidden');
        } else {
          previousBtn?.classList.remove('hidden');
          nextBtn?.classList.remove('hidden');
        }
      };

      const btnsObserver = new IntersectionObserver(hideBtns, {
        root: null,
        threshold: 0,
        rootMargin: `-${0}px`,
      });
      btnsObserver.observe(footer);
    }
  }

  _generateMarkup() {
    return `
    <p class="search-results__text">
      Search Results for <span>“${this._search.query}”</span>
    </p>

    <div class="gallery gallery--2 search-results__gallery">
      ${this._generatePaginationMarkup()}
      ${this._data.map((cell, i) => this._generateCellMarkup(cell, i)).join('')}
    </div>
    `;
  }

  // Pagination Buttons Markup
  _generatePaginationMarkup() {
    const currentPage = this._search.page;
    const numPages = Math.ceil(
      this._search.resultsCollection.length / this._search.resultsPerPage
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

    // Page 1, and there are NO pages
    return '';
  }
}

export default new SearchResultsGalleryView();
