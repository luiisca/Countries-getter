'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const getCountry = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const country = JSON.parse(this.responseText);
    console.log(country[0]);
    const html = `
			<article class="country">
				<img class="country__img" src="${country[0].flag}" />
				<div class="country__data">
					<h3 class="country__name">${country[0].name}</h3>
					<h4 class="country__region">${country[0].region}</h4>
					<p class="country__row"><span>👫</span>${(
            country[0].population / 1000000
          ).toFixed(1)}M people</p>
					<p class="country__row"><span>🗣️</span>${country[0].languages[0].name}</p>
					<p class="country__row"><span>💰</span>${country[0].currencies[0].name}</p>
				</div>
			</article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};
getCountry('peru');
getCountry('chile');
getCountry('argentina');
getCountry('usa');
getCountry('portugal');
getCountry('brasil');
getCountry('mexico');
getCountry('bolivia');
getCountry('germany');
getCountry('uganda');
getCountry('colombia');
getCountry('china');
getCountry('japan');
