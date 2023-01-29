'use strict';

const residentContent = document.querySelector('.resident-content');
const mapElement = document.getElementById('map');
const allResidents = [];

const Resident = class {
  constructor(name, backstory, latitude, longitude) {
    this.name = name;
    this.backstory = backstory;
    // this.coords = coords;
    this.latitude = latitude;
    this.longitude = longitude;
    this.createCoords();
    this.addResidentToArray();
  }

  createCoords() {
    this.coords = [this.latitude, this.longitude];
  }

  addResidentToArray() {
    allResidents.push(this);
    console.log(allResidents);
  }
};

///////////////////////////////////////////////////
// APPLICATION ARCHITECHTURE
const App = class {
  #bayCoords = [33.0514234, -95.246532];
  #map = L.map('map').setView(this.#bayCoords, 15);
  #jake;
  #marylou;
  #mike;

  constructor() {
    // Load Map
    this._loadMap();

    // Get Position
    this._watchCurrentPostion();

    // Create Resident Objects
    this._createResidents();

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
    this.#map.on('click', this._getMapClickCoords.bind(this));
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
    const grandmaIcon = this._createIcon('./img/marylou.png');
    const mikeIcon = this._createIcon('./img/mike.png');

    // Jake
    this._setMarker(this.#jake.coords, jakeIcon, 'Jake Smith');

    // Grandma
    this._setMarker(this.#marylou.coords, grandmaIcon, 'The Eagles Nest');

    // Mike
    this._setMarker(this.#mike.coords, mikeIcon, 'Mikes Weed Shop');
  }

  _createIcon(iconSRC) {
    const residentIcon = L.Icon.extend({
      options: {
        iconSize: [35, 35],
        iconAnchor: [7, 0],
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

  _watchCurrentPostion() {
    if (navigator.geolocation)
      navigator.geolocation.watchPosition(
        this._addCurrentLocation.bind(this),
        function () {
          alert(`Could not get your position`);
        }
      );
  }

  _addCurrentLocation(position) {
    const { latitude, longitude } = position.coords;

    console.log(position);
    console.log(latitude);
    console.log(longitude);

    L.circle([33.0514234, -95.246532], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 6,
    })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          className: 'resident-popup',
        })
      )
      .setPopupContent(
        `You are within ${position.coords.accuracy.toFixed(
          1
        )} meters from this position`
      );
  }

  _createResidents() {
    // Jake
    this.#jake = new Resident(
      'Jake Smith',
      'Jake Smith is a programmer and is currently employed at J&J Saftey Floor. He Has big dreams of one day becoming a real professional developer',
      33.055495388400004,
      -95.24646195841026
    );

    // Grandma
    this.#marylou = new Resident(
      'Marylou Leffler',
      'Marylou Leffler is the grandmother of Jake Smith and Josh Leffer. She is also the mother of Donnette & Allen Smith. Marry Lo has lived in the bay for over 20 years',
      33.055659303435746,
      -95.24678425841024
    );

    // Mike
    this.#mike = new Resident(
      'Mike',
      'Mike is the weed dealer of the bay, anytime you need some good smoke, this is where you go. Good bud for good prices!!',
      33.05522028915729,
      -95.24670727375302
    );
  }

  _showCurrentResidentData(e) {
    if (!e.target.src) {
      residentContent.innerHTML = '';
      return;
    }

    // Jake
    this._showResidentContent(
      'jake',
      this.#jake.name,
      this.#jake.backstory,
      e,
      './img/jake-headshot.jpg'
    );

    // Grandma
    this._showResidentContent(
      'marylou',
      this.#marylou.name,
      this.#marylou.backstory,
      e,
      './img/marylou-headshot.jpg'
    );

    // Mike
    this._showResidentContent('mike', this.#mike.name, this.#mike.backstory, e);
  }

  _showResidentContent(iconName, name, backstory, e, img) {
    if (e.target.src.includes(iconName)) {
      // Get Current Resident Being Clicked
      const currentResident = allResidents.find(resident =>
        resident.name.toLowerCase().includes(iconName.toLowerCase())
      );

      // Scroll To Current Resident
      this.#map.setView(currentResident.coords, 18, {
        animate: true,
        pan: {
          duration: 1,
        },
      });

      // Show Current Resident Content
      residentContent.innerHTML = `
        <img src="${img}" alt="${iconName}" class="resident-content__img">
        <h2 class="resident-content__name">${name}</h2>
        <h3 class="resident-content__backstory">Backstory</h3>
        <p class="resident-content__text">
          ${backstory}
        </p>
        `;
    }
  }

  _getMapClickCoords(mapE) {
    const { lat, lng } = mapE.latlng;
    console.log(lat, lng);
  }
};

const app = new App();
