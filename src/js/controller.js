import * as model from './model.js';
import mainGalleryView from './views/mainGalleryView.js';
import searchView from './views/searchView.js';
import searchResultsGalleryView from './views/searchResultsGalleryView.js';
import detailsView from './views/detailsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Load and show gallery
const controlGallery = async function () {
  try {
    // 1. Render spinner
    mainGalleryView.renderSpinner();

    // 2. Load gallery
    await model.loadGallery();

    // 3. Render gallery
    mainGalleryView.render(model.state.currentDisplayCollection);
  } catch (err) {
    mainGalleryView.renderError();
  }
};

// Refresh gallery without reloading, using refresh btn
const controlUpdateGallery = async function () {
  try {
    // 1. Render spinner
    mainGalleryView.renderSpinner();

    // 2. Load gallery
    await model.updateGallery();

    // 3. Render gallery
    mainGalleryView.render(model.state.currentDisplayCollection);
  } catch (err) {
    mainGalleryView.renderError();
  }
};

// Load and show search results
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
    searchResultsGalleryView.render(
      model.getSearchResultsPage(),
      model.state.search
    );

    // 5. Add Event listener to pagination btns
    // searchResultsGalleryView.addHandlerClick(controlPagination);
  } catch (err) {
    searchResultsGalleryView.renderError();
  }
};

// Go to another page => update search results gallery
const controlPagination = function (goToPage) {
  // Render NEW results
  searchResultsGalleryView.render(
    model.getSearchResultsPage(goToPage),
    model.state.search
  );
};

// Show details
const controlDetails = function (cell, search = false) {
  let details = {};
  // Search Gallery
  if (search) {
    details = model.state.search.resultsDisplayCollection[cell];
  }

  // Main Gallery
  if (!search) {
    details = model.state.currentDisplayCollection[cell];
  }
  // Render details modal
  detailsView.render(details);
  // Animate images
  detailsView.animateImgs();
};

const init = function () {
  mainGalleryView.addHandlerRender(controlGallery);
  mainGalleryView.addHandlerRefreshClick(controlUpdateGallery);
  mainGalleryView.addHandlerDetailsClick(controlDetails);
  searchResultsGalleryView.addHandlerClick(controlPagination);
  searchResultsGalleryView.addHandlerDetailsClick(controlDetails);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
