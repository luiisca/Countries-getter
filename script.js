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
const showError = function (error) {
  countriesContainer.insertAdjacentText(
    'afterbegin',
    `Something went wrong, ${error.message}. Please try it again.`
  );
  countriesContainer.style.opacity = 1;
};
const verifyError = function (url, errMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    //what if i dont return?
    if (!response.ok) {
      throw new Error(`${errMsg} (${response.status})`); //explain the process
    }
    return response.json(); //why is necessary use return
  });
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
  verifyError(
    `https://restcountries.eu/rest/v2/name/${country}`,
    'Country not found'
  ) //what happens if this returns a rejected promise? ignore then and goes directly for catch
    .then(response => {
      renderCountry(response[0]);
      const neighbour = response[0].borders[0];
      // if (!neighbour) return;
      if (!neighbour)
        throw new Error(`There is no neighbours for ${response[0].name}`); //why we do this? create error messages where it could be errors and make the user know what was wrong.
      return verifyError(
        `https://restcountries.eu/rest/v2/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(response => renderCountry(response, 'neighbour'))
    .catch(err => showError(err));
};

// btn.addEventListener('click', function () {
//   getCountry('australia');
// });
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

const whereAmI = function (lat, long) {
  fetch(`https://geocode.xyz/${lat},${long}?geoit=json`)
    .then(response => {
      if (!response.ok)
        throw new Error(`You can only make 3 requests at a time (403)`);
      return response.json();
    })
    .then(data => {
      if (data.matches === null)
        throw new Error(`Your coordinates doesn't match any country(404)`);

      console.log(`You are in ${data.city}, ${data.country}`);

      return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`);
    })
    .then(response => response.json())
    .then(data => {
      if (!data[0])
        throw new Error(`Your coordinates doesn't match any country(404)`);
      return renderCountry(data[0]);
    })
    .catch(err => showError(err));
};
btn.addEventListener('click', function () {
  whereAmI(52.508, 13.381);
  whereAmI(19.037, 72.873);
  whereAmI(-33.933, 18.474);
});
