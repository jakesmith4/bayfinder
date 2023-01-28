'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const jake = {
  name: 'Jake Smith',
  backstory:
    'Jake Smith is a programmer and is currently employed at J&J Saftey Floor. He Has big dreams of one day becoming a real professional developer',

  coords: [33.055495388400004, -95.24646195841026],
};

const grandma = {
  name: 'Mary Lo Leffler',
  backstory:
    'Mary Lo Leffler is the grandmother of Jake Smith and Josh Leffer. She is also the mother of Donnette & Allen Smith. Marry Lo has lived in the bay for over 20 years',

  coords: [33.055659303435746, -95.24678425841024],
};

const residentContent = document.querySelector('.resident-content');

const mapElement = document.getElementById('map');

const App = class {
  #bayCoords = [33.0514234, -95.246532];
  #map = L.map('map').setView(this.#bayCoords, 15);

  constructor() {
    // Load Map
    this._loadMap();

    // Load Icons
    this._loadIcons();

    // EVENT LISTENERS
    // Show Current Resident Data
    // On Regular Javascript Click Event
    mapElement.addEventListener(
      'click',
      this._showCurrentResidentData.bind(this)
    );

    // On Map Event
    this.#map.on('click', this._getCurrentPosition.bind(this));
  }

  _loadMap() {
    L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
  }

  _loadIcons() {
    const jakeIcon = this._createIcon('./img/jake.png');
    const grandmaIcon = this._createIcon('./img/eagle.png');
    const mikeIcon = this._createIcon('./img/weed.png');

    this._setMarker(jake.coords, jakeIcon, 'Jake Smith');
    this._setMarker(grandma.coords, grandmaIcon, 'The Eagles Nest');
  }

  _createIcon(iconSRC) {
    const residentIcon = L.Icon.extend({
      options: {
        // shadowUrl: 'leaf-shadow.png',
        iconSize: [20, 30],
        // shadowSize: [50, 64],
        iconAnchor: [0, 0],
        // shadowAnchor: [4, 62],
        popupAnchor: [10, 10],
        className: 'resident-icon',
      },
    });

    return new residentIcon({ iconUrl: iconSRC });
  }

  _setMarker(coords, residentIcon, residentName) {
    L.marker(coords, { icon: residentIcon })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          className: 'resident-popup',
        })
      )
      .setPopupContent(residentName);
  }

  _showCurrentResidentData(e) {
    if (!e.target.src) {
      residentContent.innerHTML = '';
      return;
    }

    this._showResidentContent('jake', jake.name, jake.backstory, e);
    this._showResidentContent('eagle', grandma.name, grandma.backstory, e);
  }

  _showResidentContent(iconName, name, backstory, e) {
    if (e.target.src.includes(iconName)) {
      console.log(iconName);
      residentContent.innerHTML = `
        <h2>Resident: ${name}</h2>
        <h3>Residents Backstory</h3>
        <p class="resident-content__text">
          ${backstory}
        </p>
        `;
    }
  }

  _getCurrentPosition(mapE) {
    const { lat, lng } = mapE.latlng;
    console.log(lat, lng);
  }
};

const app = new App();

// if (navigator.geolocation)
//   navigator.geolocation.getCurrentPosition(
//     function (position) {
//       // const { latitude, longitude } = position.coords;
//       const latitude = 33.0514234;
//       const longitude = -95.246532;
//       console.log(latitude);
//       console.log(longitude);
//       console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
//     },
//     function () {
//       alert(`Could not get your position`);
//     }
//   );
