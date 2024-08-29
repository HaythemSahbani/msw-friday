# Mock Service worker

## Create angualar project 
Generate a simple angular cli project

```sh
ng g msw-friday
```

## Load pokemons

### Add some UI
```html
<!-- app.component.html -->

<h1>Load pokemon</h1>

<label for="input">
    type in the pokemon id <br /> choose a number greater than 1
</label>
<br/>  
<input #input (input)="fetchPokemon(input.value)" />

<pre>{{ pokemon$ | async | json }}</pre>
```
### Add the component logic
```ts
// app.component.ts

export class AppComponent {
  http = inject(HttpClient);
  pokemon$!: Observable<any>;

  fetchPokemon(value: string) {
    this.pokemon$ = this.http.get(`https://pokeapi.co/api/v2/pokemon/${value}`);
  }
}
```
### Add `provideHttpClient` in the app config
```ts
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [...otherProvideers, provideHttpClient()]
};
```

## Add Mock service worker

### Init mock service worker
```sh
npm i -D msw graphql
npx msw init public --save
```

### Add request handlers and setup the worker

```ts
// mocks/handlers.ts

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
```

```ts
// mocks/browser.ts

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers);

```
### Use Mock service worker in development
```ts
// main.ts

async function prepareApp() {
  if (isDevMode()) {
    const { worker } = await import('./mocks/browser');
    return worker.start();
  }

  return Promise.resolve();
}

prepareApp().then(() =>
  bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err)
  )
);
```


## Jest testing
### setup jest
```sh
npm i -D jest jest-preset-angular @types/jest ts-node
```

```ts
// jest.config.ts

module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironmentOptions: {
      customExportConditions: [''],
    },
    globals: {
      Request,
      Response,
      TextEncoder,
      TextDecoder
    },
  }
```
```ts
// jest.setup.ts

import 'jest-preset-angular/setup-jest';
import { server } from './src/mocks/server'

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
```
### Add node handler
```ts
// mocks/server.ts

import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

### Add unit test
> Instead of asserting that a particular request was made, test how your application reacts to that request.
```ts
// app.component.spec.ts

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should load the pokemon', async () => {    
    component.fetchPokemon('0');

    const response = await firstValueFrom(component.pokemon$);

    expect(response).toEqual({id: 0, name: 'msw'});
  });
});
```
## More mocking techniques
### Bybass
```ts
// mocks/handlers.ts
const handlers = [
    // .. previous handler,
    http.get('https://pokeapi.co/api/v2/pokemon/:id', async ({ request }) => {
    const pokemon = await fetch(bypass(request)).then((response) =>
        response.json()
    )

    const { id, name, types } = pokemon;

    return HttpResponse.json({ id, name, types, legendary: name === 'mew'  })
    })
]
```
### Passthrough
```ts
// mocks/handlers.ts
const handlers = [
    http.get('https://pokeapi.co/api/v2/pokemon/:id', ({ params }) => {
        if (params['id'] === '0') {
            return HttpResponse.json({ mocked: true, id:0, name: 'msw' })
        }
        
        return passthrough();
    })
]
```
### Scenarios

```ts
// mocks/handlers.ts

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
```

```ts
// mocks/browser.ts

const scenarioName = new URLSearchParams(window.location.search).get('scenario')

// @ts-ignore
const runtimeScenarios = scenarios[scenarioName] || []
 
export const worker = setupWorker(...runtimeScenarios, ...handlers)
```

```ts
// app.component.ts

fetchPokemon(value: string) {
    this.pokemon$ = this.http.get(`https://pokeapi.co/api/v2/pokemon/${value}`)
    .pipe(catchError(error => of(error)));
  }
```

### overide handlers
```ts
// app.component.spec.ts
  it('should handle api errors', async () => {  
    server.use(http.get('https://pokeapi.co/api/v2/pokemon/:id', () => {
      return new HttpResponse(null, { status: 500 })
    }));
    component.fetchPokemon('0');

    const response = await firstValueFrom(component.pokemon$);

    expect(response.status).toBe(500);
  });
```