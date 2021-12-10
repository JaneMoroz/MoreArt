import iconsUrl from '../../img/icons.svg';
const [icons] = iconsUrl.split('?');
import metLogoSvg from '../../img/the-met.svg';

class DetailsView {
  #parentEl = document.querySelector('.details__container');
  #data;
  #origin;

  #window = document.querySelector('.details');
  #overlay = document.querySelector('.overlay');
  #btnClose = document.querySelector('.details-close');

  ///////////////////////////////////////////////////////////////////
  // Constructor
  constructor() {
    this.#addHandlerHideWindow();
  }

  ///////////////////////////////////////////////////////////////////
  // Render, pass data and origin (true if object is in search gallery)
  render(data, origin) {
    this.#data = data;
    this.#origin = origin;
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);

    this.#overlay.classList.toggle('hidden');
    this.#window.classList.toggle('hidden');
  }

  ///////////////////////////////////////////////////////////////////
  // Update cell (for like btn)
  update(data) {
    this.#data = data;
    const newMarkup = this.#generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this.#parentEl.querySelectorAll('*'));

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
  #clear() {
    this.#parentEl.innerHTML = '';
  }

  ///////////////////////////////////////////////////////////////////
  // Open/ close modal functionality
  #addHandlerHideWindow() {
    this.#btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this.#overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  toggleWindow() {
    this.#overlay.classList.toggle('hidden');
    this.#window.classList.toggle('hidden');
  }

  ///////////////////////////////////////////////////////////////////
  // Add handler to like button
  addHandlerAddFavorite(handler) {
    this.#parentEl.addEventListener('click', function (e) {
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
  #generateMarkup() {
    return `
      <div class="details__container-images">
        <button data-id=${this.#data.id} data-origin="${
      this.#origin
    }" class="btn-icon btn-icon--heart-outline details__container-images-like">
          <svg>
            <use href="${icons}#icon-heart${
      this.#data.favorite === true ? '' : '-outlined'
    }"></use>
          </svg>
        </button>
        <div
          class="details__container-image details__container-image--active"
        >
          <img src="${this.#data.primaryImage}" alt="${this.#data.title}" />
        </div>
        ${this.#data.additionalImages
          .map(img => this.#generateImagesMarkup(img))
          .join('')}
      </div>
      <div class="details__container-text">
        <h1 class="heading-primary details__container-title">
          ${this.#data.title}
        </h1>
        <p class="details__container-year">${this.#data.year}</p>
        <ul class="details__container-list">
          <li class="details__container-list-item" style=${
            this.#data.artistName === '' ? 'display:none' : 'display:flex'
          }>
            <svg>
              <use href="${icons}#icon-profile-${
      this.#data.artistGender === '' || 'male' ? 'male' : 'female'
    }"></use>
            </svg>
            ${this.#data.artistName}
          </li>
          <li class="details__container-list-item" style=${
            this.#data.classification === '' ? 'display:none' : 'display:flex'
          }>
            <svg>
              <use href="${icons}#icon-picture"></use>
            </svg>
            ${this.#data.classification}
          </li>
          <li class="details__container-list-item" style=${
            this.#data.department === '' ? 'display:none' : 'display:flex'
          }>
            <svg>
              <use href="${icons}#icon-clipboard"></use>
            </svg>
            ${this.#data.department}
          </li>
          <li class="details__container-list-item" style=${
            this.#data.culture === '' ? 'display:none' : 'display:flex'
          }>
            <svg>
              <use href="${icons}#icon-globe"></use>
            </svg>
            ${this.#data.culture}
          </li>
          <li
            class="
              details__container-list-item details__container-list-item--map
            " style=${
              this.#data.repository === '' ? 'display:none' : 'display:flex'
            }
          >
            <svg>
              <use href="${icons}#icon-map"></use>
            </svg>
            ${this.#data.repository}
          </li>
        </ul>
        <a href="https://www.metmuseum.org/art/collection/search/${
          this.#data.id
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
  #generateImagesMarkup(img) {
    return `
      <div class="details__container-image">
        <img src="${img}" alt="${this.#data.title}" />
      </div>
    `;
  }
}

export default new DetailsView();
