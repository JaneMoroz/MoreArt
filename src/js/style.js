const headerEl = document.querySelector('.header');
const gallery1El = document.querySelector('.gallery--1');

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];

    if (ent.isIntersecting === false) {
      headerEl.classList.add('sticky');
      gallery1El.classList.add('sticky');
    }

    if (ent.isIntersecting === true) {
      headerEl.classList.remove('sticky');
      gallery1El.classList.remove('sticky');
    }
  },
  {
    // In the viewport
    root: null,
    threshold: 0,
    rootMargin: '90px',
  }
);
// obs.observe(bodyEl);
obs.observe(gallery1El);
