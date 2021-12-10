import { API_URL, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers';

///////////////////////////////////////////////////////////////////
// State
export const state = {
  gallery: {
    cell1: {
      collection: [], // 10 objects, randomly chosen from the array, using filter (use only 2 for testing for now)
      currentDisplayId: 0, // id of object from collection array to display
      currentDisplay: {},
      filterFamily: 'Department',
      filter: 'European Paintings',
    },
    cell2: {
      collection: [],
      currentDisplayId: 0,
      currentDisplay: {},
      filterFamily: 'Geo',
      filter: 'France',
    },
    cell3: {
      collection: [],
      currentDisplayId: 0,
      currentDisplay: {},
      filterFamily: 'Geo',
      filter: 'American',
    },
    cell4: {
      collection: [],
      currentDisplayId: 0,
      currentDisplay: {},
      filterFamily: 'Department',
      filter: 'Medieval Art',
    },
    cell5: {
      collection: [],
      currentDisplayId: 0,
      currentDisplay: {},
      filterFamily: 'Department',
      filter: 'European Paintings',
    },
    cell6: {
      collection: [],
      currentDisplayId: 0,
      currentDisplay: {},
      filterFamily: 'Department',
      filter: 'Photographs',
    },
  },
  currentDisplayCollection: [],
  search: {
    query: '',
    resultsCollection: [],
    resultsDisplayCollection: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  favorites: [],
  toRemoveFromFavorites: {},
  inChangeFilterMode: false,
};

///////////////////////////////////////////////////////////////////
// Create object with needed property
const createCellObject = function (object) {
  // Limit addtional images to max of 3 images
  let updatedAdditionalImages = [];
  if (object.additionalImages.length >= 3) {
    for (let i = 0; i < 3; i++) {
      const image = object.additionalImages[i];
      updatedAdditionalImages.push(image);
    }
  } else {
    updatedAdditionalImages = object.additionalImages;
  }
  return (cellObject = {
    id: object.objectID,
    primaryImage: object.primaryImage,
    primaryImageSmall: object.primaryImageSmall,
    additionalImages: updatedAdditionalImages,
    title: object.title,
    artistName: object.artistDisplayName,
    artistGender: object.artistGender,
    year: object.objectDate,
    classification: object.classification,
    department: object.department,
    culture: object.culture,
    repository: object.repository,
  });
};

///////////////////////////////////////////////////////////////////
// Load object by id
export const loadObejectById = async function (id) {
  try {
    const data = await AJAX(`${API_URL}objects/${id}`);
    return createCellObject(data);
  } catch (err) {
    throw err;
  }
};

///////////////////////////////////////////////////////////////////
// Load each cell data according to its filter
const loadCell = async function (cell) {
  try {
    // 0. Empty cell
    cell.collection = [];
    cell.currentDisplayId = 0;
    cell.currentDisplay = {};
    // 1. Load ids corresponding to filter
    const data = await AJAX(`${API_URL}search?hasImages=true&q=${cell.filter}`);
    // 2. Get two random objects
    for (let index = 0; index < 2; index++) {
      // Get random index
      const randomNum = Math.floor(Math.random() * data.total);
      // Get objectId using the random index
      const objectId = data.objectIDs[randomNum];
      // Get object by id
      const object = await loadObejectById(objectId);
      // Check if the object is in favorites
      const isFavorite = state.favorites.some(el => el.id === object.id);
      if (isFavorite) object.favorite = true;
      // Save object to cell collection array
      cell.collection.push(object);
    }
    // 3. Set cell's current display object
    cell.currentDisplay = cell.collection[+cell.currentDisplayId];
    // 4. Add object to current display collection array
    state.currentDisplayCollection.push(
      cell.collection[+cell.currentDisplayId]
    );
  } catch (err) {
    throw err;
  }
};

///////////////////////////////////////////////////////////////////
// Update each cell display object to the next from cell's collection
const updateCell = async function (cell) {
  try {
    // 2. Get cell's collection array length
    const numberOfObjects = cell.collection.length;
    // 3. Update current display object
    if (cell.currentDisplayId >= numberOfObjects - 1) {
      cell.currentDisplayId = 0;
    } else {
      cell.currentDisplayId++;
    }
    cell.currentDisplay = cell.collection[cell.currentDisplayId];

    // 4. Update current display collection
    state.currentDisplayCollection.push(cell.currentDisplay);
  } catch (err) {
    throw err;
  }
};

///////////////////////////////////////////////////////////////////
// Load gallery by loading each cell
export const loadGallery = async function () {
  try {
    // 1. Clear current display collection array(needed for when the cell filter is changed)
    state.currentDisplayCollection = [];

    // const cells = Object.values(state.gallery);

    // for (const cell of cells) {
    //   await loadCell(cell);
    // }

    await loadCell(state.gallery.cell1);
    await loadCell(state.gallery.cell2);
  } catch (err) {
    throw err;
  }
};

///////////////////////////////////////////////////////////////////
// Update gallery by updating each cell
export const updateGallery = async function () {
  try {
    // 1. Clear current display collection array
    state.currentDisplayCollection = [];

    await updateCell(state.gallery.cell1);
    await updateCell(state.gallery.cell2);
    // const cells = Object.values(state.gallery);

    // for (const cell of cells) {
    //   await updateCell(cell);
    // }
  } catch (err) {
    throw err;
  }
};

///////////////////////////////////////////////////////////////////
// Load search results by query
export const loadSearchResults = async function (query) {
  try {
    // 0. Clear results collection
    state.search.resultsCollection = [];
    // 1. Set page to default And save the query
    state.search.page = 1;
    state.search.query = query;

    // 2. Get ids
    const data = await AJAX(`${API_URL}search?hasImages=true&q=${query}`);
    if (data.length === 0) throw new Error();
    // 2. Get 12 objects
    for (let index = 0; index < 7; index++) {
      // Get objectId
      const objectId = data.objectIDs[index];
      // Get object by id
      const object = await loadObejectById(objectId);
      // Check if the object is in favorites
      const isFavorite = state.favorites.some(el => el.id === object.id);
      if (isFavorite) object.favorite = true;
      // Save object to search collection array
      state.search.resultsCollection.push(object);
      if (state.search.resultsDisplayCollection.length < 7) {
        state.search.resultsDisplayCollection.push(object);
      }
    }
  } catch (error) {
    throw error;
  }
};

///////////////////////////////////////////////////////////////////
// Function that returns an array of 6 results according to the page
// (display per one page = 6)
// If page = 1, returns obg1-obj6, if page = 2 returns obj7-obj12
export const getSearchResultsPage = function (page = state.search.page) {
  // 1. Empty Results Display Collection array
  state.search.resultsDisplayCollection = [];
  // 2. Set page in the state to the provided value
  state.search.page = page;

  // 3. Calculate start and end indexes to be displayed according to the page
  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 6;

  // 4. Update resulrs display collection according to these indexes
  state.search.resultsDisplayCollection = state.search.resultsCollection.slice(
    start,
    end
  );

  return state.search.resultsDisplayCollection;
};

///////////////////////////////////////////////////////////////////
// Add object to favorites
export const addFavorite = function (object) {
  // Add favorite to the array
  state.favorites.push(object);

  // Mark object as favorite
  object.favorite = true;

  // Update local storage
  localStorage.setItem('favorites', JSON.stringify(state.favorites));
};

///////////////////////////////////////////////////////////////////
// Delete object from favorites
export const deleteFavorite = function (object) {
  // Delete favorite from the array
  const index = state.favorites.findIndex(el => el.id === object.id);
  state.favorites.splice(index, 1);

  // Mark object as NOT favorite
  object.favorite = false;

  // Update local storage
  localStorage.setItem('favorites', JSON.stringify(state.favorites));
};

///////////////////////////////////////////////////////////////////
// Update cell's filter family and filter itself
export const updateFilter = function () {
  // 2.Get values needed to be saved in the local storage
  const cellsFilters = [];
  const cells = Object.values(state.gallery);
  cells.forEach(cell => {
    const newCell = {
      filterFamily: cell.filterFamily,
      filter: cell.filter,
    };
    cellsFilters.push(newCell);
  });

  // 3. Save cell's filter family and filter values to the local storage
  localStorage.setItem('cells-filters', JSON.stringify(cellsFilters));
};

///////////////////////////////////////////////////////////////////
// Get favorites and cellsFilters from the local storage
const init = function () {
  const favorites = localStorage.getItem('favorites');
  if (favorites) state.favorites = JSON.parse(favorites);

  const filters = localStorage.getItem('cells-filters');
  if (filters) {
    const cells = Object.values(state.gallery);
    const cellsFilters = JSON.parse(filters);
    cells.forEach((cell, i) => {
      cell.filterFamily = cellsFilters[i].filterFamily;
      cell.filter = cellsFilters[i].filter;
    });
  }
};

init();

///////////////////////////////////////////////////////////////////
// Clear storage (for future use)
const clearFavorites = function () {
  localStorage.clear('favorites');
};
