import { bypass, http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon/0', () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      id: 0,
      name: 'msw',
    });
  }),

  http.get('https://pokeapi.co/api/v2/pokemon/:id', async ({ request }) => {
    const pokemon = await fetch(bypass(request)).then((response) =>
      response.json()
    )
 
    const { id, name, types } = pokemon;

    return HttpResponse.json({ id, name, types, legendary: name === 'mew'  })
  }),
];