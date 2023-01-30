'use strict';

const residentContent = document.querySelector('.resident-content');
const mapElement = document.getElementById('map');
const listViewContent = document.querySelector('.list-view-content');
const allResidents = [];

const Resident = class {
  constructor(
    name,
    popupName,
    backstory,
    latitude,
    longitude,
    headshotImg,
    iconImg,
    id
  ) {
    this.name = name;
    this.popupName = popupName;
    this.backstory = backstory;
    this.latitude = latitude;
    this.longitude = longitude;
    this.headshotImg = headshotImg;
    this.iconImg = iconImg;
    this.id = id;
    this.createCoords();
    this.addResidentToArray();
  }

  createCoords() {
    this.coords = [this.latitude, this.longitude];
  }

  addResidentToArray() {
    allResidents.push(this);
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
  #donnette_and_allen;

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
    // Show Current Resident Data On Icon Click
    // On Regular Javascript Click Event
    mapElement.addEventListener(
      'click',
      this._showCurrentResidentData.bind(this)
    );

    // On Map Event On Click
    this.#map.on('click', this._getMapClickCoords.bind(this));

    // Show List View Content On Click
    listViewContent.addEventListener(
      'click',
      this._showListResidentContent.bind(this)
    );
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
    const jakeIcon = this._createIcon(this.#jake.iconImg);
    const grandmaIcon = this._createIcon(this.#marylou.iconImg);
    const mikeIcon = this._createIcon(this.#mike.iconImg);
    const donnetteandallen = this._createIcon(this.#donnette_and_allen.iconImg);

    // Jake
    this._setMarker(this.#jake.coords, jakeIcon, 'Jake Smith');

    // Grandma
    this._setMarker(this.#marylou.coords, grandmaIcon, 'The Eagles Nest');

    // Mike
    this._setMarker(this.#mike.coords, mikeIcon, 'Mikes Weed Shop');

    // Allen
    this._setMarker(
      this.#donnette_and_allen.coords,
      donnetteandallen,
      'Donnette & Allens'
    );
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
    // Allen & Donnette
    this.#donnette_and_allen = new Resident(
      'donnette_and_allen',
      'Donnette & Allens',
      'Donnete & Allen are relatively new residents to the bay, even though they have been coming out here for over 20 years. They recently moved in & built a cabin. Allen Smith is the builder and is also the prould builder of John Joiners cabin up the street',
      33.05566230723349,
      -95.2463500509249,
      './img/donnette_and_allen_headshot.jpg',
      './img/donnette_and_allen.png',
      0
    );

    // Jake
    this.#jake = new Resident(
      'jake smith',
      'Jake Smith',
      'Jake Smith is a programmer and is currently employed at J&J Saftey Floor. He Has big dreams of one day becoming a real professional developer',
      33.055495388400004,
      -95.24646195841026,
      './img/jake-headshot.jpg',
      './img/jake.png',
      1
    );

    // Grandma
    this.#marylou = new Resident(
      'marylou leffler',
      'The Eagles Nest',
      'Marylou Leffler is the grandmother of Jake Smith and Josh Leffer. She is also the mother of Donnette & Allen Smith. Marry Lo has lived in the bay for over 20 years',
      33.055659303435746,
      -95.24678425841024,
      './img/marylou-headshot.jpg',
      './img/marylou.png',
      2
    );

    // Mike
    this.#mike = new Resident(
      'mike',
      'Mikes Weed Shop',
      'Mike is the weed dealer of the bay, anytime you need some good smoke, this is where you go. Good bud for good prices!!',
      33.05522028915729,
      -95.24670727375302,
      './img/mike-headshot.jpg',
      './img/mike.png',
      3
    );
  }

  _showCurrentResidentData(e) {
    if (!e.target.src) {
      residentContent.innerHTML = '';
      return;
    }

    // Jake
    this._showResidentContent('jake', e, this.#jake.id);

    // Grandma
    this._showResidentContent('marylou', e, this.#marylou.id);

    // Mike
    this._showResidentContent('mike', e, this.#mike.id);

    // Allen & Donnette
    this._showResidentContent(
      'donnette_and_allen',
      e,
      this.#donnette_and_allen.id
    );
  }

  _showResidentContent(name, e, id) {
    if (!e.target.src.includes(name)) return;

    // Remove List View Content
    listViewContent.classList.add('toggle-show');

    // Get Current Resident Being Clicked
    const currentResident = this._findCurrentResident(id);
    console.log(currentResident.name);

    // Scroll To Current Resident
    this._scrollToCurrentResident(currentResident.coords);

    // Show Current Resident Content
    this._showCurrentResidentContent(
      currentResident.headshotImg,
      this._fixName(currentResident.name),
      currentResident.backstory
    );
  }

  _showListResidentContent(e) {
    const currentId = +e.target.closest('.single-resident').dataset.id;

    const currentResident = this._findCurrentResident(currentId);

    if (currentId !== currentResident.id) return;

    // Close List View
    listViewContent.classList.add('toggle-show');

    // Show Current Resident Content
    this._showCurrentResidentContent(
      currentResident.headshotImg,
      this._fixName(currentResident.name),
      currentResident.backstory
    );

    // Set Popup Content
    L.popup({
      maxWidth: 250,
      minWidth: 100,
      className: 'resident-popup',
      offset: [10, 17],
    })
      .setLatLng(currentResident.coords)
      .setContent(currentResident.popupName)
      .openOn(this.#map);

    // Scroll To Current Resident
    this._scrollToCurrentResident(currentResident.coords);
  }

  _findCurrentResident(id) {
    return allResidents.find(resident => resident.id == id);
  }

  _scrollToCurrentResident(coords) {
    this.#map.setView(coords, 18, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _showCurrentResidentContent(img, name, backstory) {
    residentContent.innerHTML = `
        <img src="${img}" alt="${name}" class="resident-content__img">
        <h2 class="resident-content__name">${name}</h2>
        <h3 class="resident-content__backstory">Backstory</h3>
        <p class="resident-content__text">
          ${backstory}
        </p>
        `;
  }

  _fixName(name) {
    return name.replaceAll('_', ' ').replaceAll('and', '&');
  }

  _getMapClickCoords(mapE) {
    const { lat, lng } = mapE.latlng;
    console.log(lat, lng);
  }
};

const app = new App();

const listViewBtn = document.querySelector('.list-view-btn');
const copyrightElement = document.querySelector('.copyright');

allResidents.forEach(resident => {
  const html = `<li class="single-resident" data-id="${resident.id}">
  <div class="single-resident__content">
  <img src="${resident.headshotImg}" alt="${resident.name}" class="icon-img" />
  <h2 class="single-resident__title">${resident.name.replaceAll('_', ' ')}</h2>
  </div>
  <img src="${resident.iconImg}" alt="${resident.name}" />
  </li>`;
  listViewContent.insertAdjacentHTML('beforeend', html);
});

listViewBtn.addEventListener('click', function (e) {
  console.log(allResidents);
  residentContent.innerHTML = '';
  copyrightElement.style.display = 'none';
  listViewContent.classList.toggle('toggle-show');
});

listViewContent.addEventListener('click', function (e) {
  console.log(e.target.closest('.single-resident'));
});
