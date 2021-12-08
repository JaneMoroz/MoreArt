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
      // Render details modal, pass (in addition to object) boolean (trie if the object is from search gallery)
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

// Render details from favorites
const controlFavoritesDetails = function (objectId) {
  let object = {};
  // 1. Find object by id in the favorites
  object = model.state.favorites.find(el => el.id === objectId);
  // 2. Render details
  detailsView.render(object);
};

// Add to favorites from the details modal
const controlDetailsAddFavorite = function (objectId, search = false) {
  let object = {};
  // Get object from the Search Gallery
  if (search) {
    object = model.state.search.resultsDisplayCollection.find(
      el => el.id === objectId
    );
  }

  // Get object from the Main Gallery
  if (!search) {
    object = model.state.currentDisplayCollection.find(
      el => el.id === objectId
    );
  }

  // If object is not on display in the main gallery or search gallery (means that 'like' manipulation are taken place from favorites drop down)
  // If object is in favorites
  if (!object) {
    object = model.state.favorites.find(el => el.id === objectId);
    // If object exists, means it is going to be removed => save it to the temporary variable
    if (object) {
      model.state.toRemoveFromFavorites = object;
    }
  }

  // If object is already removed from the favorites, but it is liked again (details modal is still opened)
  if (!object) {
    object = model.state.toRemoveFromFavorites;
    model.state.toRemoveFromFavorites = {};
  }

  // 1. Add/remove favorite from favorites, and toggle like button, update main or serach gallery view, render favorites
  toggleFavorite(object, search);

  // 2. Update details view
  detailsView.update(object);
};

// Add to favorites
const controlAddFavorite = function (cellNum, search = false) {
  let object = {};
  // Get object from the Search Gallery
  if (search) {
    object = model.state.search.resultsDisplayCollection[cellNum];
  }

  // Get object from the Search Gallery
  if (!search) {
    object = model.state.currentDisplayCollection[cellNum];
  }
  // 1. Add/remove favorite from favorites, and toggle like button, update main or serach gallery view, render favorites
  toggleFavorite(object, search);
};

// Toggle favorite
const toggleFavorite = function (object, search) {
  // 1. Add/remove favorite
  if (!object.favorite) model.addFavorite(object);
  else model.deleteFavorite(object);

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

// Load Favorites
const controlFavorites = function () {
  favoritesView.render(model.state.favorites);
};

const init = function () {
  favoritesView.addHandlerRender(controlFavorites);
  favoritesView.addHandlerObject(controlFavoritesDetails);
  mainGalleryView.addHandlerRender(controlGallery);
  mainGalleryView.addHandlerRefreshClick(controlUpdateGallery);
  mainGalleryView.addHandlerDetailsClick(controlDetails);
  mainGalleryView.addHandlerAddFavorite(controlAddFavorite);

  searchResultsGalleryView.addHandlerClick(controlPagination);
  searchResultsGalleryView.addHandlerDetailsClick(controlDetails);
  searchResultsGalleryView.addHandlerAddFavorite(controlAddFavorite);

  searchView.addHandlerSearch(controlSearchResults);
  detailsView.addHandlerAddFavorite(controlDetailsAddFavorite);
};

init();
