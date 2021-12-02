console.log('Hello! Roger, roger!');

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

// Fixed Position Buttons: Intersection Observer API
const refreshBtn = document.querySelector('.gallery__refresh-btn');
const searchResults = document.querySelector('.search-results');
const previousBtn = document.querySelector(
  '.search-results__gallery-btn--previous'
);
const nextBtn = document.querySelector('.search-results__gallery-btn--next');
const footer = document.querySelector('.footer');
const searchGallery = document.querySelector('.gallery--2');

var mediaQuery = window.matchMedia('(max-width: 1024px)');
if (mediaQuery.matches) {
  console.log('Query runs');
  // Refresh Button
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

  // Previous Button
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

  // Next Button
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

  // Hide Buttons When The Footer Apears
  const hideBtns = function (entries) {
    const [entry] = entries;

    if (entry.isIntersecting) {
      previousBtn.classList.add('hidden');
      nextBtn.classList.add('hidden');
    } else {
      previousBtn.classList.remove('hidden');
      nextBtn.classList.remove('hidden');
    }
  };

  const btnsObserver = new IntersectionObserver(hideBtns, {
    root: null,
    threshold: 0,
    rootMargin: `-${0}px`,
  });
  btnsObserver.observe(footer);
}
