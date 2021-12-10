import galleryView from './galleryView.js';
import iconsUrl from '../../img/icons.svg';
const [icons] = iconsUrl.split('?');

// Main Gallery View
class MainGalleryView extends galleryView {
  _parentEl = document.querySelector('.gallery--1');
  _errorMessage = 'Something went wrong! Try again later.';

  ///////////////////////////////////////////////////////////////////
  // On load
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  ///////////////////////////////////////////////////////////////////
  // Add handler to refresh gallery button
  addHandlerRefreshClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.gallery__refresh-btn');

      if (!btn) return;

      handler();
    });
  }

  ///////////////////////////////////////////////////////////////////
  // Add handler to change filter cell button (pencil btn)
  addHandlerChangeClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.gallery__item-display-options-btn');

      if (!btn) return;

      const cellNum = +btn.dataset.cell;

      handler(cellNum);
    });
  }

  ///////////////////////////////////////////////////////////////////
  // Add handler to submit button on change cell's filter form
  addHandlerFormSubmit(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      // Prevent default form behavior
      e.preventDefault();

      // Get form el
      const formEl = document.querySelector('.form');

      if (!formEl) return;

      // Get selected options
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

  ///////////////////////////////////////////////////////////////////
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

  ///////////////////////////////////////////////////////////////////
  // Generate gallery markup
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

  ///////////////////////////////////////////////////////////////////
  // Render Options layer
  renderOptionsLayer() {
    // 1. Get all cells
    const allCells = this._parentEl.querySelectorAll('.gallery__item');

    // 2. Create and add markup to each
    allCells.forEach((cell, i) => {
      const markup = this._genereteOptionsLayoutMarkup(cell, i);
      // Disactivate hover effect on each cell
      cell.classList.add('disactivated');
      cell.insertAdjacentHTML('afterbegin', markup);
    });
  }

  // Option layer markup
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

  ///////////////////////////////////////////////////////////////////
  // Render Change Filter layer for selected cell
  renderChangeCellFilterLayer(cellNum, cell) {
    const cellEl = document.querySelector(`.gallery__item--${cellNum + 1}`);
    const pencilEl = cellEl.querySelector('.gallery__item-display-options-btn');
    const optionsEl = cellEl.querySelector('.gallery__item-display-options');

    // Hide pencil
    pencilEl.style.display = 'none';

    // Create change filter markup
    const markup = this._generateChangeCellFillterLayoutMarkup(cellNum, cell);
    optionsEl.insertAdjacentHTML('afterbegin', markup);
    // Activate input fields toggling
    this._wireUpInputFields();
  }

  // Create layout
  _generateChangeCellFillterLayoutMarkup(cellNum, cell) {
    return `
      <form class="form" data-cell=${cellNum}>
        <div class="form__row">
          <label class="form__label">Search By</label>
          <select class="form__input form__input--search-by">
            <option value="Department" ${
              cell.filterFamily === 'Department' ? 'selected' : ''
            }>Department</option>>
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

  // Activate toggling on form fiends
  _wireUpInputFields() {
    // Get input el
    const inputSearchBy = document.querySelector('.form__input--search-by');

    // Add event listener which calls for toggle form fiends function
    inputSearchBy.addEventListener('change', this._toggleFormFields);
  }

  // Toggle form fields function
  _toggleFormFields() {
    const departmentEl = document.querySelector('.form__input--department');
    const geoEl = document.querySelector('.form__input--geo');

    if (this.value === 'Department') {
      departmentEl.closest('.form__row').classList.remove('form__row--hidden');
      geoEl.closest('.form__row').classList.add('form__row--hidden');
    } else if (this.value === 'Geo') {
      departmentEl.closest('.form__row').classList.add('form__row--hidden');
      geoEl.closest('.form__row').classList.remove('form__row--hidden');
    }
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
