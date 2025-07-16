/**
  * @param {string} country
  * @returns {Promise<string | Record<any,any>>}
  */
export const getCountryData = async function(country) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${country}`);
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

export default function Country(data, className) {
  const languages = Object.values(data.languages).join(', ');
  const currencies = Object.values(data.currencies)
    .map(c => c.name)
    .join(', ');

  return `
  <article class="country ${className}">
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
