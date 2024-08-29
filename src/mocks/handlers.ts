import { http, HttpResponse } from 'msw';

export const handlers = [
  // http.get('https://pokeapi.co/api/v2/pokemon/:id', ({ params }) => {
  //   if (params['id'] === '0') {
  //       return HttpResponse.json({ mocked: true, id:0, name: 'msw' })
  //   }
    
  //   return passthrough();
  // })
];

export const scenarios = {
  success: [
    http.get('https://pokeapi.co/api/v2/pokemon/0', () => {
      return HttpResponse.json({ name: 'msw' }, { status: 200 })
    }),
  ],
  error: [
    http.get('https://pokeapi.co/api/v2/pokemon/0', () => {
      return new HttpResponse(null, { status: 500 })
    }),
  ],
}
