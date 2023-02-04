'use strict';

const bayfinderIcon = document.querySelector('.bayfinder__icon');
const smallBayIcon = 'fa-3x';
const largeBayIcon = 'fa-5x';
const residentContent = document.querySelector('.resident-content');
const mapElement = document.getElementById('map');
const listViewContent = document.querySelector('.list-view-content');
const listViewBtn = document.querySelector('.list-view-btn');
const copyrightElement = document.querySelector('.copyright');
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
  #autum;
  #bobbySue;
  #dock;
  #donnette_Allen;
  #jake;
  #john;
  #marylou;
  #mike;
  #poolHouse;

  constructor() {
    // Load Map
    this._loadMap();

    // Get Position
    this._watchCurrentPostion();

    // Create Resident Objects
    this._createResidents();

    // Load Icons
    this._loadIcons();

    // Create List View
    this._createListView();

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

    // Toggle List View
    listViewBtn.addEventListener('click', this._toggleListView.bind(this));
  }

  _loadMap() {
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
  }

  _loadIcons() {
    const autumIcon = this._createIcon(this.#autum.iconImg);
    const bobbySueIcon = this._createIcon(this.#bobbySue.iconImg);
    const dockIcon = this._createIcon(this.#dock.iconImg);
    const donnetteandallen = this._createIcon(this.#donnette_Allen.iconImg);
    const grandmaIcon = this._createIcon(this.#marylou.iconImg);
    const jakeIcon = this._createIcon(this.#jake.iconImg);
    const johnIcon = this._createIcon(this.#john.iconImg);
    const mikeIcon = this._createIcon(this.#mike.iconImg);
    const poolhouseIcon = this._createIcon(this.#poolHouse.iconImg);

    // Autum Chree
    this._setMarker(this.#autum.coords, autumIcon, this.#autum.popupName);

    // Bobby Sue
    this._setMarker(
      this.#bobbySue.coords,
      bobbySueIcon,
      this.#bobbySue.popupName
    );

    // Dock
    this._setMarker(this.#dock.coords, dockIcon, this.#dock.popupName);

    // Allen & Donnette
    this._setMarker(
      this.#donnette_Allen.coords,
      donnetteandallen,
      this.#donnette_Allen.popupName
    );

    // Grandma
    this._setMarker(this.#marylou.coords, grandmaIcon, this.#marylou.popupName);

    // Jake
    this._setMarker(this.#jake.coords, jakeIcon, this.#jake.popupName);

    // John Joyner
    this._setMarker(this.#john.coords, johnIcon, this.#john.popupName);

    // Mike
    this._setMarker(this.#mike.coords, mikeIcon, this.#mike.popupName);

    // Pool House
    this._setMarker(
      this.#poolHouse.coords,
      poolhouseIcon,
      this.#poolHouse.popupName
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
    // Autum Chree
    this.#autum = new Resident(
      'autum',
      'Autum Chree',
      'Autum has been in the bay for quite some time, however she is proud to annouce the recent acquiring of her new place. Autum works as a caregiver, and has a big heart. She essentially is a life saver/medicine healer',
      33.054615,
      -95.247085,
      './img/autum-headshot.jpg',
      './img/autum.png',
      0
    );

    // Bobby Sue
    this.#bobbySue = new Resident(
      'bobby_sue',
      'Bobby Sue',
      'Bobby Sue, real name (Bobbie Carson) does not currently live in the bay, although she has a house here. When she is around watch out for Dan the man, he can get a little crazy with the booze sometimes! Bobby Sue has been coming to the bay for over 20+ years',
      33.0557962799739,
      -95.2458594025887,
      './img/bobby-sue-headshot.jpg',
      './img/bobby_sue.png',
      1
    );

    // Dock
    this.#dock = new Resident(
      'dock',
      'Dock / Boat Ramp',
      'This is the boat ramp/dock of Pelican Bay. You can come down here to put your boat into the lake, or to simply go for a swim. Some residents of enjoy fishing from the dock',
      33.04573731337109,
      -95.24452633142468,
      './img/dock-headshot.jpg',
      './img/dock.png',
      2
    );

    // Allen & Donnette
    this.#donnette_Allen = new Resident(
      'donnette_and_allen',
      'Donnette & Allen',
      'Donnete & Allen are relatively new residents to the bay, even though they have been coming out here for over 20 years. They recently moved in & built a cabin. Allen Smith is the builder and is also the prould builder of John Joiners cabin up the street',
      33.05566230723349,
      -95.2463500509249,
      './img/donnette_and_allen_headshot.jpg',
      './img/donnette_and_allen.png',
      3
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
      4
    );

    // John Joyner
    this.#john = new Resident(
      'john joyner',
      'John Joyner',
      'John Joyner is the proud owner of J&J Safety Floor. He is also proud to announce the coming of his new place, the Joyner Cabin.  John has lived in the bay for over 20 years.',
      33.05622434091173,
      -95.2470067467671,
      './img/john-joyner-headshot.jpg',
      './img/john.png',
      5
    );

    // Grandma
    this.#marylou = new Resident(
      'marylou leffler',
      'The Eagles Nest',
      'Marylou Leffler is a proud resident of the bay. Her place is called "The Eagles Nest" because it has a karaoke bar attached to it. She is proud mother of Donnette & Allen Smith. Marrylou has lived in the bay for over 20 years',
      33.055680272582414,
      -95.24690133142433,
      './img/marylou-headshot.jpg',
      './img/marylou.png',
      6
    );

    // Mike
    this.#mike = new Resident(
      'mike',
      'Mikes Weed Shop',
      'Mike is the weed dealer of the bay, anytime you need some good smoke, this is where you go. Good bud for good prices!!',
      33.05543531164023,
      -95.24683883142436,
      './img/mike-headshot.jpg',
      './img/mike.png',
      7
    );

    this.#poolHouse = new Resident(
      'pool_house',
      'The Pool House',
      'This is the bay pool house. It is open in the summer from May and Closes in September every year. Come here if you want to enjoy a nice swim, or maybe just to get a tan!',
      33.056714261926324,
      -95.24612013142432,
      './img/pool-house-headshot.jpg',
      './img/pool_house.png',
      8
    );
  }

  _createListView() {
    allResidents.forEach(resident => {
      const html = `<li class="single-resident" data-id="${resident.id}">
      <div class="single-resident__content">
      <img src="${resident.headshotImg}" alt="${
        resident.name
      }" class="icon-img" />
      <h2 class="single-resident__title">${this._fixName(resident.name)}</h2>
      </div>
      <img src="${resident.iconImg}" alt="${
        resident.name
      }" class="single-resident__icon-img" />
      </li>`;
      listViewContent.insertAdjacentHTML('beforeend', html);
    });
  }

  _toggleListView() {
    residentContent.innerHTML = '';
    copyrightElement.style.display = 'none';
    listViewContent.classList.toggle('toggle-show');

    // Toggle Bay Icon Size

    if (
      residentContent.innerHTML === '' ||
      listViewContent.classList.contains('toggle-show')
    ) {
      this._changeBayfinderIconSize(smallBayIcon, largeBayIcon);
    }
    if (
      residentContent.innerHTML !== '' ||
      !listViewContent.classList.contains('toggle-show')
    ) {
      this._changeBayfinderIconSize(largeBayIcon, smallBayIcon);
    }
  }

  _changeBayfinderIconSize(removeClass, addClass) {
    // Make Bay Finder Icon Smaller
    bayfinderIcon.classList.remove(removeClass);
    bayfinderIcon.classList.add(addClass);
  }

  _showCurrentResidentData(e) {
    if (!e.target.src) {
      residentContent.innerHTML = '';
      listViewContent.classList.add('toggle-show');

      // Make Bay Finder Icon Smaller
      this._changeBayfinderIconSize(smallBayIcon, largeBayIcon);
      return;
    }

    // Autum Chree
    this._showResidentContent('autum', e, this.#autum.id);

    // Bobby Sue
    this._showResidentContent('bobby_sue', e, this.#bobbySue.id);

    // Dock
    this._showResidentContent('dock', e, this.#dock.id);

    // Allen & Donnette
    this._showResidentContent('donnette_and_allen', e, this.#donnette_Allen.id);

    // Grandma
    this._showResidentContent('marylou', e, this.#marylou.id);

    // Jake
    this._showResidentContent('jake', e, this.#jake.id);

    // John Joyner
    this._showResidentContent('john', e, this.#john.id);

    // Mike
    this._showResidentContent('mike', e, this.#mike.id);

    // Pool House
    this._showResidentContent('pool_house', e, this.#poolHouse.id);
  }

  _showResidentContent(name, e, id) {
    if (!e.target.src.includes(name)) return;

    // Remove List View Content
    listViewContent.classList.add('toggle-show');

    // Make Bay Finder Icon Smaller
    this._changeBayfinderIconSize(largeBayIcon, smallBayIcon);

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
    const currentId = +e.target.closest('.single-resident')?.dataset.id;

    const currentResident = this._findCurrentResident(currentId);

    if (currentId !== currentResident?.id) return;

    // Close List View
    listViewContent.classList.add('toggle-show');

    // Make Bayfinder Icon Size Smaller
    this._changeBayfinderIconSize(largeBayIcon, smallBayIcon);

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
