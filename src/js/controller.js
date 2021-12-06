import * as model from './model.js';
import galleryView from './views/galleryView.js';
import searchView from './views/searchView.js';
import searchResultsGalleryView from './views/searchResultsGalleryView.js';

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
  } catch (err) {
    galleryView.renderError();
  }
};

const controlUpdateGallery = async function () {
  try {
    // 1. Render spinner
    galleryView.renderSpinner();

    // 2. Load gallery
    await model.updateGallery();

    // 3. Render gallery
    galleryView.renderGallery(model.state.currentDisplayCollection);
  } catch (err) {
    galleryView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1. Render spinner
    searchResultsGalleryView.renderSpinner();

    // 2. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 3. Load search results
    await model.loadSearchResults(query);

    // 4. Render results
    searchResultsGalleryView.renderResults(
      model.getSearchResultsPage(),
      model.state.search
    );

    // 5. Add Event listener to pagination btns
    searchResultsGalleryView.addHandlerClick(controlPagination);
  } catch (err) {
    searchResultsGalleryView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // Render NEW results
  searchResultsGalleryView.renderResults(
    model.getSearchResultsPage(goToPage),
    model.state.search
  );
};

const init = function () {
  galleryView.addHandlerRender(controlGallery);
  galleryView.addHandlerClick(controlUpdateGallery);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
