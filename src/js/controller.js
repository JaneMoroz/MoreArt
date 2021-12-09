import * as model from './model.js';
import mainGalleryView from './views/mainGalleryView.js';
import searchView from './views/searchView.js';
import searchResultsGalleryView from './views/searchResultsGalleryView.js';
import detailsView from './views/detailsView.js';
import favoritesView from './views/favoritesView.js';
import optionsView from './views/optionsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

///////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////
// Refresh gallery without reloading, using refresh btn
const controlUpdateGallery = async function () {
  try {
    // 1. Render spinner
    mainGalleryView.renderSpinner();

    // 2. Load gallery
    await model.updateGallery();

    // 3. Render gallery
    mainGalleryView.render(model.state.currentDisplayCollection);
    // 4. Set optionMode to false in case it was activated before refresh btn was clicked
    model.state.inOptionsMode = false;
  } catch (err) {
    mainGalleryView.renderError();
  }
};

///////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////
// Go to another page => update search results gallery
const controlPagination = function (goToPage) {
  // Render NEW results
  searchResultsGalleryView.render(
    model.getSearchResultsPage(goToPage),
    model.state.search
  );
};

///////////////////////////////////////////////////////////////////
// Show details
const controlDetails = function (objectId, origin) {
  try {
    // Get object
    const object = getObject(objectId, origin);
    // Render details modal
    detailsView.render(object, origin);
    // Animate images
    detailsView.animateImgs();
  } catch (err) {
    detailsView.renderError();
  }
};

///////////////////////////////////////////////////////////////////
// Add/Remove to/from favorites
const controlAddFavorite = function (objectId, origin, details = false) {
  // Get object
  let object = getObject(objectId, origin);

  // If object is in favorites
  if (object && origin === 'favorites') {
    model.state.toRemoveFromFavorites = object;
  }

  // If object is already removed from the favorites, but it is liked again (details modal is still opened, never been closed)
  if (!object) {
    object = model.state.toRemoveFromFavorites;
    model.state.toRemoveFromFavorites = {};
  }

  // 1. Add/remove favorite from favorites, and toggle like button, update main or serach gallery view, render favorites
  toggleFavorite(object, origin, details);

  // 2. Update details view
  if (details) detailsView.update(object);
};

///////////////////////////////////////////////////////////////////
// Helpers
// Get object by its Id and origin(mainGallery, searchGallery or favoritesDropdown)
const getObject = function (objectId, origin) {
  let object = {};
  // Search Gallery
  if (origin === 'searchGallery') {
    object = model.state.search.resultsDisplayCollection.find(
      el => el.id === objectId
    );
  }

  // Main Gallery
  if (origin === 'mainGalley') {
    object = model.state.currentDisplayCollection.find(
      el => el.id === objectId
    );
  }

  // Favorites Dropdown
  if (origin === 'favorites') {
    object = model.state.favorites.find(el => el.id === objectId);
  }

  return object;
};

// Toggle favorite
const toggleFavorite = function (object, origin, details) {
  // 1. Add/remove favorite
  if (!object.favorite) model.addFavorite(object);
  else model.deleteFavorite(object);

  // 3. Update galley view
  // If object added to favorites in search gallery
  if (origin === 'searchGallery') {
    searchResultsGalleryView.update(
      model.getSearchResultsPage(),
      model.state.search
    );
  }

  // If object added to favorites in main gallery
  if (origin === 'mainGalley') {
    mainGalleryView.update(model.state.currentDisplayCollection);
  }

  // If object added to favorites in details modal, which in turn was clicked in favorites dropdown
  // => if this object is also displayed in search or main gallery need to update their views
  if (origin === 'favorites' && details) {
    // Check if object is in display in main gallery
    const isDisplayedInMain = model.state.currentDisplayCollection.some(
      el => el.id === object.id
    );
    // Check if object is in display in search gallery
    const isDisplayedInSearch =
      model.state.search.resultsDisplayCollection.some(
        el => el.id === object.id
      );

    // Update galleries views
    if (isDisplayedInMain)
      mainGalleryView.update(model.state.currentDisplayCollection);

    if (isDisplayedInSearch)
      searchResultsGalleryView.update(
        model.getSearchResultsPage(),
        model.state.search
      );
  }

  // 4. Render favorites
  favoritesView.render(model.state.favorites);
};

///////////////////////////////////////////////////////////////////
// Load Favorites
const controlFavorites = function () {
  favoritesView.render(model.state.favorites);
};

///////////////////////////////////////////////////////////////////
// Load options layer
const controlOptions = function () {
  if (model.state.inOptionsMode === false) {
    mainGalleryView.renderOptionsLayer();
    model.state.inOptionsMode = true;
  } else {
    mainGalleryView.render(model.state.currentDisplayCollection);
    model.state.inOptionsMode = false;
  }
};

// Load options change layer
const controlChangeOptions = function (cellNum) {
  // Get cell information
  const cells = Object.values(model.state.gallery);
  const cell = cells[cellNum];

  mainGalleryView.renderOptionsChangeLayer(cellNum, cell);

  mainGalleryView.renderHideCellOptions(cellNum);
};

const controlUpdateCellFilter = async function (cellNum, filterFamily, filter) {
  try {
    const cell = model.state.gallery[`cell${cellNum + 1}`];
    cell.filterFamily = filterFamily;
    cell.filter = filter;

    mainGalleryView.renderSpinner();
    await model.loadGallery();
    mainGalleryView.render(model.state.currentDisplayCollection);
    model.state.inOptionsMode = false;
  } catch (err) {
    mainGalleryView.renderError();
  }
};

const init = function () {
  favoritesView.addHandlerRender(controlFavorites);
  favoritesView.addHandlerItemClick(controlDetails);
  optionsView.addHandlerOptions(controlOptions);
  mainGalleryView.addHandlerRender(controlGallery);
  mainGalleryView.addHandlerRefreshClick(controlUpdateGallery);
  mainGalleryView.addHandlerDetailsClick(controlDetails);
  mainGalleryView.addHandlerAddFavorite(controlAddFavorite);
  mainGalleryView.addHandlerChangeClick(controlChangeOptions);
  mainGalleryView.addHandlerFormSubmit(controlUpdateCellFilter);

  searchResultsGalleryView.addHandlerClick(controlPagination);
  searchResultsGalleryView.addHandlerDetailsClick(controlDetails);
  searchResultsGalleryView.addHandlerAddFavorite(controlAddFavorite);

  searchView.addHandlerSearch(controlSearchResults);
  detailsView.addHandlerAddFavorite(controlAddFavorite);
};

init();
