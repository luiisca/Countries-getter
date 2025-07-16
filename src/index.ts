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

import Country, { getCountryData } from '../public/components/country.js';

function render(container: Element, template: string) {
  container.append(template, { html: true })
  container.setAttribute('style', 'opacity: 1;')
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    // will only run as a middleware for the home page and other non-asset paths
    const url = new URL(request.url);
    const countryParam = url.searchParams.get('country')

    let country: string | null;
    if (countryParam) {
      country = countryParam;
    } else {
      country = request.cf?.country as string | null;
    }

    const response = await env.ASSETS.fetch(request)

    return new HTMLRewriter()
      .on('script#global-vars', {
        element(el) {
          const id = Object.fromEntries([...el.attributes]).id
          el.setInnerContent(`const USER_COUNTRY = "${country}";`)
        }
      })
      .on('div.countries', {
        async element(el) {
          if (!country) {
            return render(el, 'Please select a country');
          }

          const data = await getCountryData(country)
          if (typeof data === 'string') {
            return render(el, data);
          }

          const borders = data.borders || [];
          let template = `
            ${Country(data)} 
          `
          let neighbour;
          if (borders.length > 0) {
            neighbour = await getCountryData(borders[0]);
            template += `
              ${Country(neighbour, 'neighbour')}
            `;
          }

          render(el, template);
        }
      })
      .transform(response)
  },
} satisfies ExportedHandler<Env>;
