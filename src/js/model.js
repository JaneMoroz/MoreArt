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
      filter: 'Greek and Roman Art',
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
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
};

const createCellObject = function (object) {
  return (cellObject = {
    id: object.objectID,
    primaryImage: object.primaryImage,
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

const loadObejectById = async function (id) {
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
    for (let index = 0; index < 4; index++) {
      // Get random index
      const randomNum = Math.floor(Math.random() * data.total);
      // Get objectId using the random index
      const objectId = data.objectIDs[randomNum];
      // Get object by id
      const object = await loadObejectById(objectId);
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
  console.log(cell.collection);
  // 1. Get array length
  const numberOfObjects = cell.collection.length;

  // 2. Get random index
  const randomIndex = Math.floor(Math.random() * numberOfObjects);
  console.log(randomIndex);

  // 3. Update current dislay object
  const nextObject = cell.collection[randomIndex];
  cell.currentDisplay = nextObject;
  console.log(nextObject);
  // 4. Update current display collection
  state.currentDisplayCollection.push(nextObject);
};

export const loadGallery = async function () {
  try {
    await loadCell(state.gallery.cell1);
    await loadCell(state.gallery.cell2);
    await loadCell(state.gallery.cell3);
    // await loadCell(state.gallery.cell4);
    // await loadCell(state.gallery.cell5);
    // await loadCell(state.gallery.cell6);
  } catch (err) {
    throw err;
  }
};

export const updateGallery = async function () {
  try {
    state.currentDisplayCollection = [];
    await updateCell(state.gallery.cell1);
    await updateCell(state.gallery.cell2);
    await updateCell(state.gallery.cell3);
    // await loadCell(state.gallery.cell4);
    // await loadCell(state.gallery.cell5);
    // await loadCell(state.gallery.cell6);
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
    // 2. Get 12 objects
    for (let index = 0; index < 7; index++) {
      // Get objectId
      const objectId = data.objectIDs[index];
      // Get object by id
      const object = await loadObejectById(objectId);
      console.log(object);
      // Save object to search collection array
      state.search.resultsCollection.push(object);
    }
  } catch (error) {}
};

// Function that returns an array of 6 results according to the page
// (display per one page = 6)
// If page = 1, returns obg1-obj6, if page = 2 returns obj7-obj12
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 6;

  return state.search.resultsCollection.slice(start, end);
};
