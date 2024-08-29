import { bypass, http, HttpResponse, passthrough } from 'msw';

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon/:id', ({ params }) => {
    if (params['id'] === '0') {
        return HttpResponse.json({ mocked: true, id:0, name: 'msw' })
    }
    
    return passthrough();
  })
];