/**
  * @returns {Promise<string | Array<{name: {common: string, official: string, nativaName: Record<string, {common: string, official: string}>}}>}
  */
export const getCountriesData = async function() {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/all?fields=name`);
    if (!res.ok) throw new Error('not found');

    const json = await res.json();
    return json;
  } catch (err) {
    return `Something went wrong: ${err.message}`;
  }
};
/**
  * @param {string} country
  * @param {boolean} useCode
  * @returns {Promise<string | Record<string,any> & {name: {common: string, official: string}, borders?: string[]}>}
  */
export const getCountryData = async function(country, useCode = true) {
  try {
    const res = await fetch(useCode ? `https://restcountries.com/v3.1/alpha/${country}` : `https://restcountries.com/v3.1/name/${country}`);
    if (!res.ok) throw new Error('Country not found');

    const json = await res.json();
    return json[0];
  } catch (err) {
    return `Something went wrong: ${err.message}`;
  }
};

/**
  * @param {Element | null} container
  * @param {string} country
  * @param {string | undefined} className
  */
export async function renderServer(container, country, className) {
  const data = await getCountryData(country)
}

/**
  * @param {Element | null} container
  * @param {string} template
  */
export function renderClient(container, template) {
  container.insertAdjacentHTML('beforeend', template);
  container.style.opacity = 1;
}

/**
  * @param {Record<string,any> & {name: {common: string, official: string}, borders?: string[]}} data
  * @param {string | undefined} className
  */
export default function Country(data, className) {
  const languages = Object.values(data.languages).join(', ');
  const currencies = Object.values(data.currencies)
    .map(c => c.name)
    .join(', ');

  return `
  <article class="country ${className}" id="${data.name.official}">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)} M people</p>
      <p class="country__row"><span>🗣️</span>${languages}</p>
      <p class="country__row"><span>💰</span>${currencies}</p>
    </div>
  </article>
  `;
}
