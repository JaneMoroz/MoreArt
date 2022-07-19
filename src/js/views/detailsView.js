import iconsUrl from '../../img/icons.svg';
const [icons] = iconsUrl.split('?');
import metLogoSvg from '../../img/the-met.svg';

class DetailsView {
  _parentEl = document.querySelector('.details__container');
  _data;
  _origin;

  _window = document.querySelector('.details');
  _overlay = document.querySelector('.overlay');
  _btnClose = document.querySelector('.details-close');

  ///////////////////////////////////////////////////////////////////
  // Constructor
  constructor() {
    this._addHandlerHideWindow();
  }

  ///////////////////////////////////////////////////////////////////
  // Render, pass data and origin (true if object is in search gallery)
  render(data, origin) {
    this._data = data;
    this._origin = origin;
    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);

    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  ///////////////////////////////////////////////////////////////////
  // Update cell (for like btn)
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  ///////////////////////////////////////////////////////////////////
  // Add expanding images effect to the gallery
  animateImgs() {
    // Details Modal: Expanding Images Effect
    const images = document.querySelectorAll('.details__container-image');

    images.forEach(img => {
      img.addEventListener('click', () => {
        removeActiveClasses();
        img.classList.add('details__container-image--active');
      });
    });

    function removeActiveClasses() {
      images.forEach(img => {
        img.classList.remove('details__container-image--active');
      });
    }
  }

  ///////////////////////////////////////////////////////////////////
  // Clear parent element
  _clear() {
    this._parentEl.innerHTML = '';
  }

  ///////////////////////////////////////////////////////////////////
  // Open/ close modal functionality
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  ///////////////////////////////////////////////////////////////////
  // Add handler to like button
  addHandlerAddFavorite(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.details__container-images-like');
      if (!btn) return;

      // Get objectId and origin
      const objectId = +btn.dataset.id;
      const objectOrigin = btn.dataset.origin;

      // Boolena = true, means add/remove favourite takes place in details modal
      handler(objectId, objectOrigin, true);
    });
  }

  ///////////////////////////////////////////////////////////////////
  // Generate markup
  _generateMarkup() {
    return `
      <div class="details__container-images">
        <button data-id=${this._data.id} data-origin="${
      this._origin
    }" class="btn-icon btn-icon--heart-outline details__container-images-like">
          <svg>
            <use href="${icons}#icon-heart${
      this._data.favorite === true ? '' : '-outlined'
    }"></use>
          </svg>
        </button>
        <div
          class="details__container-image details__container-image--active"
        >
          <img src="${this._data.primaryImage}" alt="${
      this._data.title
    }" onerror="this.onerror=null;this.src='https://i.ibb.co/sVT9jpt/cant-be-displayed-img-2.jpg';" />
        </div>
        ${this._data.additionalImages
          .map(img => this._generateImagesMarkup(img))
          .join('')}
      </div>
      <div class="details__container-text">
        <h1 class="heading-primary details__container-title">
          ${this._data.title}
        </h1>
        <p class="details__container-year">${this._data.year}</p>
        <ul class="details__container-list">
          <li class="details__container-list-item" style=${
            this._data.artistName === '' ? 'display:none' : 'display:flex'
          }>
            <svg>
              <use href="${icons}#icon-profile-${
      this._data.artistGender === '' || 'male' ? 'male' : 'female'
    }"></use>
            </svg>
            ${this._data.artistName}
          </li>
          <li class="details__container-list-item" style=${
            this._data.classification === '' ? 'display:none' : 'display:flex'
          }>
            <svg>
              <use href="${icons}#icon-picture"></use>
            </svg>
            ${this._data.classification}
          </li>
          <li class="details__container-list-item" style=${
            this._data.department === '' ? 'display:none' : 'display:flex'
          }>
            <svg>
              <use href="${icons}#icon-clipboard"></use>
            </svg>
            ${this._data.department}
          </li>
          <li class="details__container-list-item" style=${
            this._data.culture === '' ? 'display:none' : 'display:flex'
          }>
            <svg>
              <use href="${icons}#icon-globe"></use>
            </svg>
            ${this._data.culture}
          </li>
          <li
            class="
              details__container-list-item details__container-list-item--map
            " style=${
              this._data.repository === '' ? 'display:none' : 'display:flex'
            }
          >
            <svg>
              <use href="${icons}#icon-map"></use>
            </svg>
            ${this._data.repository}
          </li>
        </ul>
        <a href="https://www.metmuseum.org/art/collection/search/${
          this._data.id
        }" target="_blank" class="btn details__container-btn">
          Learn More on
          <img
            src="${metLogoSvg}"
            alt="The MET Website Logo"
          />
        </a>
      </div>
    `;
  }

  // Images gallery markup
  _generateImagesMarkup(img) {
    return `
      <div class="details__container-image">
        <img src="${img}" alt="${this._data.title}" onerror="this.onerror=null;this.src='https://i.ibb.co/sVT9jpt/cant-be-displayed-img-2.jpg';" />
      </div>
    `;
  }
}

export default new DetailsView();
