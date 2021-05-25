'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const renderCountry = function (country, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${country.flag}" />
    <div class="country__data">
      <h3 class="country__name">${country.name}</h3>
      <h4 class="country__region">${country.region}</h4>
      <p class="country__row"><span>👫</span>${(
        country.population / 1000000
      ).toFixed(1)}M people</p>
      <p class="country__row"><span>🗣️</span>${country.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${country.currencies[0].name}</p>
    </div>
  </article>
`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};
const getError = function (error) {
  countriesContainer.insertAdjacentText(
    'afterbegin',
    `Something went wrong, ${error.message}. Please try it again.`
  );
  countriesContainer.style.opacity = 1;
};

// const getCountry = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [country] = JSON.parse(this.responseText);
//     renderCountry(country);
//     // console.log(country);
//     //new request
//     const [neighbour] = country.borders;
//     if (!neighbour) return;
//     // console.log(neighbour);
//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.eu/rest/v2/alpha/${neighbour}`);
//     request2.send();
//     request2.addEventListener('load', function () {
//       // console.log(this.responseText);
//       const country = JSON.parse(this.responseText);
//       if (!country) return;
//       renderCountry(country, 'neighbour');
//     });
//   });
// };

const getCountry = function (country) {
  const request2 = fetch(`https://restcountries.eu/rest/v2/name/${country}`);
  request2
    .then(response => {
      if (!response.ok) {
        throw new Error(`Country not found (${response.status})`); //explain the process
      }
      return response.json(); //why is necessary use return
    })
    .then(response => {
      renderCountry(response[0]);
      // const neighbour = response[0].borders[0];
      const neighbour = 'dfjdfd';
      if (!neighbour) return;
      return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`);
    })
    .then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error(`Country net found (${response.status})`);
      } //how works errors chain -- the first error attached is showed
      return response.json();
    })
    .then(response => renderCountry(response, 'neighbour'))
    .catch(err => getError(err));
};

btn.addEventListener('click', function () {
  getCountry('peru24');
});
// getCountry('chile');
// getCountry('argentina');
// getCountry('usa');
// getCountry('portugal');
// getCountry('brasil');
// getCountry('mexico');
// getCountry('bolivia');
// getCountry('germany');
// getCountry('uganda');
// getCountry('colombia');
// getCountry('china');
// getCountry('italy');
// getCountry('spain');
