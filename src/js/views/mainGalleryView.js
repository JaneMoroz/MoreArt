import galleryView from './galleryView.js';
import iconsUrl from '../../img/icons.svg';
const [icons] = iconsUrl.split('?');

// Main Gallery View
class MainGalleryView extends galleryView {
  _parentEl = document.querySelector('.gallery--1');
  _errorMessage = 'Something went wrong! Try again later.';

  // On load
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  // Add handler to refresh gallery button
  addHandlerRefreshClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.gallery__refresh-btn');

      if (!btn) return;

      handler();
    });
  }

  // Position Refresh Button according to screen width
  positionButtons() {
    const refreshBtn = document.querySelector('.gallery__refresh-btn');
    const searchResults = document.querySelector('.search-results');

    var mediaQuery = window.matchMedia('(max-width: 1024px)');
    if (mediaQuery.matches) {
      // Intersection Observer API
      refreshBtn.classList.add('sticky');

      const fixRefreshBtn = function (entries) {
        const [entry] = entries;

        if (entry.isIntersecting) {
          refreshBtn.classList.add('hidden');
        } else {
          refreshBtn.classList.remove('hidden');
        }
      };

      const refreshBtnObserver = new IntersectionObserver(fixRefreshBtn, {
        root: null,
        threshold: 0,
        rootMargin: `-${0}px`,
      });
      refreshBtnObserver.observe(searchResults);
    }
  }

  _generateMarkup() {
    return `
    <button class="btn-icon btn-icon--refresh gallery__refresh-btn">
      <svg>
        <use href="${icons}#icon-refresh"></use>
      </svg>
    </button>
    ${this._data.map((cell, i) => this._generateCellMarkup(cell, i)).join('')}
    `;
  }
}

export default new MainGalleryView();
