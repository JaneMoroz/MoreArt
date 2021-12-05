import * as model from './model.js';
import galleryView from './views/galleryView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Load and show gallery
const controlGallery = async function () {
  try {
    // 1. Render spinner
    galleryView.renderSpinner();

    // 2. Load gallery
    await model.loadGallery();

    // 3. Render gallery
    galleryView.renderGallery(model.state.currentDisplayCollection);
  } catch (err) {}
};

const init = function () {
  galleryView.addHandlerRender(controlGallery);
};

init();
