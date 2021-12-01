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
