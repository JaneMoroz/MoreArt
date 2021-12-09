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

  // Add handler to change options cell button
  addHandlerChangeClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.gallery__item-display-options-btn');

      if (!btn) return;

      const cellNum = +btn.dataset.cell;

      handler(cellNum);
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

  renderOptionsLayer() {
    const allCells = document.querySelectorAll('.gallery__item');

    allCells.forEach((cell, i) => {
      const markup = this._genereteOptionsLayoutMarkup(cell, i);
      cell.classList.add('disactivated');
      cell.insertAdjacentHTML('afterbegin', markup);
    });
  }

  _genereteOptionsLayoutMarkup(cell, i) {
    return `
    <div class="gallery__item-display-options">
      <button data-cell = ${i}
        class="
          btn-icon btn-icon--pencil
          gallery__item-display-options-btn
        "
      >
        <svg>
          <use href="${icons}#icon-pencil"></use>
        </svg>
      </button>
    </div>
    `;
  }

  renderOptionsChangeLayer(cellNum, cell) {
    const cellEl = document.querySelector(`.gallery__item--${cellNum + 1}`);
    const pencilEl = cellEl.querySelector('.gallery__item-display-options-btn');
    const optionsEl = cellEl.querySelector('.gallery__item-display-options');
    pencilEl.style.display = 'none';

    const markup = this._genereteOptionsChangeLayoutMarkup(cellNum, cell);

    optionsEl.insertAdjacentHTML('afterbegin', markup);
    this.wireUpInputFields();
  }

  _genereteOptionsChangeLayoutMarkup(cellNum, cell) {
    return `
      <form class="form" data-cell=${cellNum}>
        <div class="form__row">
          <label class="form__label">Search By</label>
          <select class="form__input form__input--search-by">
            <option value="Department" ${
              cell.filterFamily === 'Department' ? 'selected' : ''
            }>Department</option>
            <option value="Date" ${
              cell.filterFamily === 'Date' ? 'selected' : ''
            }>Date/Era</option>
            <option value="Geo" ${
              cell.filterFamily === 'Geo' ? 'selected' : ''
            }>Geographic Location</option>
          </select>
        </div>
        <div class="form__row ${
          cell.filterFamily === 'Department' ? '' : 'form__row--hidden'
        }">
          <label class="form__label">Department</label>
          <select class="form__input form__input--department">
            <option value="Greek And Roman Art" ${
              cell.filter === 'Greek And Roman Art' ? 'selected' : ''
            }>Greek And Roman Art</option>
            <option value="European Paintings" ${
              cell.filter === 'European Paintings' ? 'selected' : ''
            }>European Paintings</option>
            <option value="Egyption Art" ${
              cell.filter === 'Egyption Art' ? 'selected' : ''
            }>Egyption Art</option>
            <option value="The American Wing" ${
              cell.filter === 'The American Wing' ? 'selected' : ''
            }>The American Wing</option>
            <option value="Ancient Near Eastern Art" ${
              cell.filter === 'Ancient Near Eastern Art' ? 'selected' : ''
            }>Ancient Near Eastern Art</option>
            <option value="Arms And Armor" ${
              cell.filter === 'Arms And Armor' ? 'selected' : ''
            }>Arms And Armor</option>
            <option value="Photographs" ${
              cell.filter === 'Photographs' ? 'selected' : ''
            }>Photographs</option>
          </select>
        </div>
        <div class="form__row ${
          cell.filterFamily === 'Date' ? '' : 'form__row--hidden'
        }">
          <label class="form__label">Date/Era</label>
          <select class="form__input form__input--date">
            <option value="AD1800_1900">a.d. 1800-1900</option>
            <option value="AD1600_1800">a.d. 1600-1800</option>
            <option value="AD1400_1600">a.d. 1400-1600</option>
            <option value="1000BC-AD1">1000 b.c.-a.d.1</option>
            <option value="AD1000_1400">a.d. 1000-1400</option>
            <option value="2000_1000BC">2000-1000 b.c.</option>
            <option value="AD500_100">a.d. 500-100</option>
            <option value="AD1_500">a.d. 1-500</option>
            <option value="8000_2000BC">8000-2000 b.c.</option>
            <option value="AD1900_PRESENT">a.d. 1900-present</option>
          </select>
        </div>
        <div class="form__row ${
          cell.filterFamily === 'Geo' ? '' : 'form__row--hidden'
        }">
          <label class="form__label">Geographic Location</label>
          <select class="form__input form__input--geo">
            <option value="Africa" ${
              cell.filter === 'Africa' ? 'selected' : ''
            }>Africa</option>
            <option value="Asia" ${
              cell.filter === 'Asia' ? 'selected' : ''
            }>Asia</option>
            <option value="Egypt" ${
              cell.filter === 'Egypt' ? 'selected' : ''
            }>Egypt</option>
            <option value="Europe" ${
              cell.filter === 'Europe' ? 'selected' : ''
            }>Europe</option>
            <option value="France" ${
              cell.filter === 'France' ? 'selected' : ''
            }>France</option>
            <option value="Germany" ${
              cell.filter === 'Germany' ? 'selected' : ''
            }>Germany</option>
            <option value="Greece" ${
              cell.filter === 'Greece' ? 'selected' : ''
            }>Greece</option>
            <option value="Iran" ${
              cell.filter === 'Iran' ? 'selected' : ''
            }>Iran</option>
            <option value="Italy" ${
              cell.filter === 'Italy' ? 'selected' : ''
            }>Italy</option>
            <option value="Netherlands" ${
              cell.filter === 'Netherlands' ? 'selected' : ''
            }>Netherlands</option>
            <option value="North And Central America" ${
              cell.filter === 'North And Central America' ? 'selected' : ''
            }>North And Central America</option>
            <option value="United States" ${
              cell.filter === 'United States' ? 'selected' : ''
            }>United States</option>
          </select>
        </div>
        <button class="btn form__btn">Save</button>
      </form>
    `;
  }

  wireUpInputFields() {
    // const formEl = document.querySelector('.form');
    const inputSearchBy = document.querySelector('.form__input--search-by');

    // formEl.addEventListener('submit', this._saveChanges);
    inputSearchBy.addEventListener('change', this._toggleFormFields);
  }

  _toggleFormFields() {
    const departmentEl = document.querySelector('.form__input--department');
    const dateEl = document.querySelector('.form__input--date');
    const geoEl = document.querySelector('.form__input--geo');

    if (this.value === 'Department') {
      departmentEl.closest('.form__row').classList.remove('form__row--hidden');
      dateEl.closest('.form__row').classList.add('form__row--hidden');
      geoEl.closest('.form__row').classList.add('form__row--hidden');
    } else if (this.value === 'Date') {
      departmentEl.closest('.form__row').classList.add('form__row--hidden');
      dateEl.closest('.form__row').classList.remove('form__row--hidden');
      geoEl.closest('.form__row').classList.add('form__row--hidden');
    } else if (this.value === 'Geo') {
      departmentEl.closest('.form__row').classList.add('form__row--hidden');
      dateEl.closest('.form__row').classList.add('form__row--hidden');
      geoEl.closest('.form__row').classList.remove('form__row--hidden');
    }
  }

  addHandlerFormSubmit(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      // Prevent default form behavior
      e.preventDefault();
      const formEl = document.querySelector('.form');

      if (!formEl) return;

      // Get variables
      const allInputsRows = formEl.querySelectorAll('.form__row');
      const visibleInputs = [];
      allInputsRows.forEach(element => {
        if (!element.classList.contains('form__row--hidden')) {
          const visibleInput = element.querySelector('.form__input');
          visibleInputs.push(visibleInput);
        }
      });

      const [filterFamily, filter] = [
        visibleInputs[0].value,
        visibleInputs[1].value,
      ];

      const cellNum = +formEl.dataset.cell;

      handler(cellNum, filterFamily, filter);
    });
  }

  renderHideCellOptions(cellNum) {
    const pencils = document.querySelectorAll(
      '.gallery__item-display-options-btn'
    );

    pencils.forEach(element => {
      if (+element.dataset.cell !== cellNum) {
        element.style.display = 'none';
      }
    });
  }
}

export default new MainGalleryView();
