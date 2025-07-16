import Country, { getCountryData, renderClient as render } from './components/country.js';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// btn.addEventListener('click', function() {
//   countriesContainer.innerHTML = ''; // Clear previous results
//   getCountryData(USER_COUNTRY);
// });

// (async function App() {
//   if (!USER_COUNTRY) {
//     return;
//   }
//
//   const data = await getCountryData(USER_COUNTRY)
//   if (typeof data === 'string') {
//     return render(countriesContainer, data);
//   }
//
//   const borders = data.borders || [];
//   let template = `
//     ${Country(data)} 
//   `
//   let neighbour;
//   if (borders.length > 0) {
//     neighbour = await getCountryData(borders[0]);
//     template += `
//       ${Country(neighbour, 'neighbour')}
//     `;
//   }
//
//   render(countriesContainer, template);
// })()
