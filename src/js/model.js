import { API_URL, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers';

export const state = {
  gallery: {
    cell1: {
      collection: [], // 10 objects, randomly chosen from the array, using filter (use only 2 for testing for now)
      currentDisplayId: 0, // id of object from collection array to display
      currentDisplay: {},
      filter: 'European Paintings',
    },
    cell2: {
      collection: [],
      currentDisplayId: 0,
      currentDisplay: {},
      filter: 'France',
    },
    cell3: {
      collection: [],
      currentDisplayId: 0,
      currentDisplay: {},
      filter: 'American',
    },
    cell4: {
      collection: [],
      currentDisplayId: 0,
      currentDisplay: {},
      filter: 'Medieval Art',
    },
    cell5: {
      collection: [],
      currentDisplayId: 0,
      currentDisplay: {},
      filter: 'European Paintings',
    },
    cell6: {
      collection: [],
      currentDisplayId: 0,
      currentDisplay: {},
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
};

const createCellObject = function (object) {
  return (cellObject = {
    id: object.objectID,
    primaryImage: object.primaryImage,
    primaryImageSmall: object.primaryImageSmall,
    additionalImages: object.additionalImages,
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

export const loadObejectById = async function (id) {
  try {
    const data = await AJAX(`${API_URL}objects/${id}`);
    return createCellObject(data);
  } catch (err) {
    throw err;
  }
};

const loadCell = async function (cell) {
  try {
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
    // 3. Set cell current display object
    cell.currentDisplay = cell.collection[+cell.currentDisplayId];
    state.currentDisplayCollection.push(
      cell.collection[+cell.currentDisplayId]
    );
  } catch (err) {
    throw err;
  }
};

const updateCell = async function (cell) {
  try {
    // 1. Get array length
    const numberOfObjects = cell.collection.length;

    // 2. Get random index
    const randomIndex = Math.floor(Math.random() * numberOfObjects);

    // 3. Update current dislay object
    const nextObject = cell.collection[randomIndex];
    cell.currentDisplay = nextObject;
    // 4. Update current display collection
    state.currentDisplayCollection.push(nextObject);
  } catch (err) {
    throw err;
  }
};

export const loadGallery = async function () {
  try {
    // const cells = Object.values(state.gallery);

    // for (const cell of cells) {
    //   await loadCell(cell);
    // }

    await loadCell(state.gallery.cell3);
  } catch (err) {
    throw err;
  }
};

export const updateGallery = async function () {
  try {
    // 1. Clear current display collection array
    state.currentDisplayCollection = [];

    await updateCell(state.gallery.cell3);
    // const cells = Object.values(state.gallery);

    // for (const cell of cells) {
    //   await updateCell(cell);
    // }
  } catch (err) {
    throw err;
  }
};

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

// Function that returns an array of 6 results according to the page
// (display per one page = 6)
// If page = 1, returns obg1-obj6, if page = 2 returns obj7-obj12
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.resultsDisplayCollection = [];
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 6;

  state.search.resultsDisplayCollection = state.search.resultsCollection.slice(
    start,
    end
  );

  return state.search.resultsDisplayCollection;
};

// Add object to favorites
export const addFavorite = function (object) {
  // Add favorite to the array
  state.favorites.push(object);

  // Mark object as favorite
  object.favorite = true;

  // Update local storage
  localStorage.setItem('favorites', JSON.stringify(state.favorites));
};

// Delete object from favorite
export const deleteFavorite = function (object) {
  // Delete favorite from the array
  const index = state.favorites.findIndex(el => el.id === object.id);
  state.favorites.splice(index, 1);

  // Mark object as NOT favorite
  object.favorite = false;

  // Update local storage
  localStorage.setItem('favorites', JSON.stringify(state.favorites));
};

// Get favorites from the local storage
const init = function () {
  const storage = localStorage.getItem('favorites');
  if (storage) state.favorites = JSON.parse(storage);
};

init();

const clearFavorites = function () {
  localStorage.clear('favorites');
};
