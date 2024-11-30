// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { CitiesComponent } from './pages/cities/cities.component';

export const routes: Routes = [
  { path: 'cities', component: CitiesComponent },
  { path: '', redirectTo: '/cities', pathMatch: 'full' }
];