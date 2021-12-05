import { API_URL } from './config.js';
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
      filter: 'Egyptian Art',
    },
    cell6: {
      collection: [],
      currentDisplayId: 0,
      currentDisplay: {},
      filter: 'Photographs',
    },
  },

  currentDisplayCollection: [],
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
    for (let index = 0; index < 2; index++) {
      // Get random index
      const randomNum = Math.floor(Math.random() * data.total + 1);
      // Get objectId using the random index
      const objectId = data.objectIDs[randomNum];
      // Get object by id
      const object = await loadObejectById(objectId);
      console.log(object);
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

export const loadGallery = async function () {
  try {
    console.log(state);
    console.log(state.currentDisplayCollection);
    await loadCell(state.gallery.cell1);
    await loadCell(state.gallery.cell2);
    await loadCell(state.gallery.cell3);
    await loadCell(state.gallery.cell4);
    await loadCell(state.gallery.cell5);
    await loadCell(state.gallery.cell6);
  } catch (err) {
    throw err;
  }
};
