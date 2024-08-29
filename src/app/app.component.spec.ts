import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { server } from '../mocks/serve';
import { HttpResponse, http } from 'msw';

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

  it('should handle api errors', async () => {  
    server.use(http.get('https://pokeapi.co/api/v2/pokemon/:id', () => {
      return new HttpResponse(null, { status: 500 })
    }));
    component.fetchPokemon('0');

    const response = await firstValueFrom(component.pokemon$);

    expect(response.status).toBe(500);
  });
});
