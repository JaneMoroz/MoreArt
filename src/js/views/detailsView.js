import iconsUrl from '../../img/icons.svg';
const [icons] = iconsUrl.split('?');
import metLogoSvg from '../../img/the-met.svg';

class DetailsView {
  #parentEl = document.querySelector('.details__container');
  #data;

  #window = document.querySelector('.details');
  #overlay = document.querySelector('.overlay');
  #btnClose = document.querySelector('.details-close');

  constructor() {
    this.#addHandlerHideWindow();
  }

  render(data) {
    console.log(metLogoSvg);
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);

    this.#overlay.classList.toggle('hidden');
    this.#window.classList.toggle('hidden');
  }

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

  #clear() {
    this.#parentEl.innerHTML = '';
  }

  toggleWindow() {
    this.#overlay.classList.toggle('hidden');
    this.#window.classList.toggle('hidden');
  }

  #addHandlerHideWindow() {
    this.#btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this.#overlay.addEventListener('click', this.toggleWindow.bind(this));
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
      <div class="details__container-images">
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

  #generateImagesMarkup(img) {
    return `
      <div class="details__container-image">
        <img src="${img}" alt="${this.#data.title}" />
      </div>
    `;
  }
}

export default new DetailsView();
