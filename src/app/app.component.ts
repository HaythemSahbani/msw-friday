import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  http = inject(HttpClient);
  pokemon$!: Observable<any>;

  fetchPokemon(value: string) {
    this.pokemon$ = this.http.get(`https://pokeapi.co/api/v2/pokemon/${value}`)
      .pipe(catchError(error => of(error)));
  }
}
