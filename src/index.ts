/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import Country, { getCountriesData, getCountryData } from '../public/components/country.js';

function render(container: Element, template: string) {
  container.append(template, { html: true })
  container.setAttribute('style', 'opacity: 1;')
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    // will only run as a middleware for the home page and other non-asset paths
    const url = new URL(request.url);
    const countryParam = url.searchParams.get('country')

    let rewriter = new HTMLRewriter();
    let countryCode: string | null;
    let useCode = true;
    if (countryParam) {
      countryCode = countryParam;
      useCode = false;
    } else {
      countryCode = request.cf?.country as string | null;
      useCode = true
    }
    if (countryCode) {
      const countryData = await getCountryData(countryCode, useCode)

      rewriter
        .on('div.countries', {
          async element(el) {
            if (!countryCode) {
              return render(el, 'Please select a country');
            }

            if (typeof countryData === 'string') {
              const error = countryData;
              return render(el, error);
            }

            const borders = countryData.borders || [];
            let template = `
              ${Country(countryData, '')} 
            `
            let neighbour;
            if (borders.length > 0) {
              neighbour = await getCountryData(borders[0]);
              if (typeof neighbour !== 'string') {
                template += `
                  ${Country(neighbour, 'neighbour')}
                `;
              }
            }

            render(el, template);
          }
        })
        .on('script#global-vars', {
          element(el) {
            if (typeof countryData === 'string') {
              return;
            }

            el.setInnerContent(`const USER_COUNTRY = "${countryData.name.official}";`)
          }
        })
    }

    rewriter
      .on('select#country-selector', {
        async element(el) {
          const countries = await getCountriesData();
          if (typeof countries === 'string') {
            const error = countries;
            return render(el, error);
          }

          let template = '';
          countries.forEach(country => {
            const selected = country.name.official === countryParam ? 'selected' : '';
            template += `
              <option value="${country.name.official}" ${selected}>${country.name.common}</option>
            `;
          });

          render(el, template);
        }
      })

    return rewriter.transform(await env.ASSETS.fetch(request));
  },
} satisfies ExportedHandler<Env>;
