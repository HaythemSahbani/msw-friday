import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon/0', () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      id: 0,
      name: 'msw',
    });
  }),
];