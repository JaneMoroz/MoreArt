export const state = {
  gallery: {
    cell1: {
      collection: [], // 10 objects, randomly chosen from the array, using filter
      currentDisplay: {},
      filterType: '', // department, era or geolocation
      filterText: '',
    },
  },
};

const loadCell1 = async function () {
  try {
    const collection = [];

    // Get all objects from department 11
    const res = await fetch(
      'https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11'
    );
    const data = await res.json();

    // Add two objects to the collection
    for (let index = 0; index < 2; index++) {
      // Get random index
      const randomNum = Math.floor(Math.random() * data.total + 1);
      // Get objectId using the random index
      const objectId = data.objectIDs[randomNum];
      // Get object by id
      const res = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
      );
      const object = await res.json();
      // Create cell object and add to the array
      cellObject = {
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
      };

      collection.push(cellObject);
      console.log(collection);
    }
  } catch (err) {
    alert(err);
  }
};

loadCell1();
