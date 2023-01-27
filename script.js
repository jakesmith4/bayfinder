'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const mapElement = document.getElementById('map');
// const form = document.querySelector('.form');
// const containerWorkouts = document.querySelector('.workouts');
// const inputType = document.querySelector('.form__input--type');
// const inputDistance = document.querySelector('.form__input--distance');
// const inputDuration = document.querySelector('.form__input--duration');
// const inputCadence = document.querySelector('.form__input--cadence');
// const inputElevation = document.querySelector('.form__input--elevation');

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
const latitude = 33.0514234;
const longitude = -95.246532;
const coords = [latitude, longitude];
const map = L.map('map').setView(coords, 15);

const loadMap = function () {
  // L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  //   attribution:
  //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  // }).addTo(map);

  L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // L.marker(coords)
  //   .addTo(map)
  //   .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
  //   .openPopup();
};
loadMap();

const loadIcons = function () {
  const jakeLatitude = 33.055495388400004;
  const jakeLongitude = -95.24646195841026;
  const jakeCoords = [jakeLatitude, jakeLongitude];

  const grandmaLatitude = 33.055659303435746;
  const grandmaLongitude = -95.24678425841024;
  const grandmaCoords = [grandmaLatitude, grandmaLongitude];

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

  const jakeIcon = new residentIcon({ iconUrl: './img/jake.png' });

  console.log(jakeIcon);

  const mikeIcon = new residentIcon({ iconUrl: './img/weed.png' });

  const grandmaIcon = new residentIcon({ iconUrl: './img/eagle.png' });

  L.marker(jakeCoords, { icon: jakeIcon }).addTo(map).bindPopup('Jake Smith');
  // .openPopup();

  L.marker(grandmaCoords, { icon: grandmaIcon })
    .addTo(map)
    .bindPopup('The Eagles Nest');
};
loadIcons();

const residentContent = document.querySelector('.resident-content');

const jake = {
  name: 'Jake Smith',
  backstory:
    'Jake Smith is a programmer and is currently employed at J&J Saftey Floor. He Has big dreams of one day becoming a real professional developer',
};

const grandma = {
  name: 'Mary Lo Leffler',
  backstory:
    'Mary Lo Leffler is the grandmother of Jake Smith and Josh Leffer. She is also the mother of Donnette & Allen Smith. Marry Lo has lived in the bay for over 20 years',
};

const showCurrentResident = function () {
  // On Map
  map.on('click', function (mapE) {
    const { lat, lng } = mapE.latlng;
    console.log(lat, lng);
  });

  // On Map Element
  mapElement.addEventListener('click', function (e) {
    if (!e.target.src) {
      residentContent.innerHTML = `<p class="copyright">
        &copy; Copyright by
        <a
          class="twitter-link"
          target="_blank"
          href="https://www.facebook.com/profile.php?id=100000047980515"
          >Jacob Smith</a
        >. Use for searching the residents of Pelican Bay. DO NOT use this
        application to stalk people!!
      </p>`;
      return;
    }

    console.log(e.target.src);

    const showResidentContent = function (iconName, name, backstory) {
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
    };

    showResidentContent('jake', jake.name, jake.backstory);
    showResidentContent('eagle', grandma.name, grandma.backstory);
  });
};
showCurrentResident();
