import * as model from './model.js';
import mainGalleryView from './views/mainGalleryView.js';
import searchView from './views/searchView.js';
import searchResultsGalleryView from './views/searchResultsGalleryView.js';
import detailsView from './views/detailsView.js';
import favoritesView from './views/favoritesView.js';

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
const controlDetails = function (cellNum, search = false) {
  try {
    let cell = {};
    // Search Gallery
    if (search) {
      cell = model.state.search.resultsDisplayCollection[cellNum];
      // Render details modal, pass (in aadition to object) boolean (object is from search gallery)
      detailsView.render(cell, true);
    }

    // Main Gallery
    if (!search) {
      cell = model.state.currentDisplayCollection[cellNum];
      // Render details modal
      detailsView.render(cell);
    }
    // Animate images
    detailsView.animateImgs();
  } catch (err) {
    detailsView.renderError();
  }
};

const controlDetailsAddToFavorites = function (objectId, search = false) {
  let object = {};
  // Search Gallery
  if (search) {
    object = model.state.search.resultsDisplayCollection.find(
      el => el.id === objectId
    );
    console.log(object);
  }

  // Main Gallery
  if (!search) {
    object = model.state.currentDisplayCollection.find(
      el => el.id === objectId
    );
    console.log(object);
  }
  // 1. Add/remove favorite
  if (!object.favorite) model.addFavorite(object);
  else model.deleteFavorite(object);

  // 2. Update details view
  detailsView.update(object);

  // 3. Update galley view
  // If object added to favorites in search gallery
  if (search) {
    searchResultsGalleryView.update(
      model.getSearchResultsPage(),
      model.state.search
    );
  }

  // If object added to favorites in main gallery
  if (!search) {
    mainGalleryView.update(model.state.currentDisplayCollection);
  }

  // 4. Render favorites
  favoritesView.render(model.state.favorites);
};

// Add to favorites
const controlAddFavorite = function (cellNum, search = false) {
  let object = {};
  // Search Gallery
  if (search) {
    object = model.state.search.resultsDisplayCollection[cellNum];
    console.log(object);
  }

  // Main Gallery
  if (!search) {
    object = model.state.currentDisplayCollection[cellNum];
    console.log(object);
  }
  // 1. Add/remove favorite
  if (!object.favorite) model.addFavorite(object);
  else model.deleteFavorite(object);

  // 2. Update galley view
  // If object added to favorites in search gallery
  if (search) {
    searchResultsGalleryView.update(
      model.getSearchResultsPage(),
      model.state.search
    );
  }

  // If object added to favorites in main gallery
  if (!search) {
    mainGalleryView.update(model.state.currentDisplayCollection);
  }

  // 3. Render favorites
  favoritesView.render(model.state.favorites);
};

// Load Favorites
const controlFavorites = function () {
  favoritesView.render(model.state.favorites);
};

const init = function () {
  favoritesView.addHandlerRender(controlFavorites);
  mainGalleryView.addHandlerRender(controlGallery);
  mainGalleryView.addHandlerRefreshClick(controlUpdateGallery);
  mainGalleryView.addHandlerDetailsClick(controlDetails);
  mainGalleryView.addHandlerAddFavorite(controlAddFavorite);

  searchResultsGalleryView.addHandlerClick(controlPagination);
  searchResultsGalleryView.addHandlerDetailsClick(controlDetails);
  searchResultsGalleryView.addHandlerAddFavorite(controlAddFavorite);

  searchView.addHandlerSearch(controlSearchResults);
  detailsView.addHandlerAddFavorite(controlDetailsAddToFavorites);
};

init();
