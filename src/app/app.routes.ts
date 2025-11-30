import { Routes } from '@angular/router';
import { HomeComponent } from './presentation/pages/home/home.component';
import { SearchComponent } from './presentation/pages/search/search.component';
import { AlbumDetailComponent } from './presentation/pages/album-detail/album-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'search', component: SearchComponent },
    { path: 'album/:id', component: AlbumDetailComponent },
    { path: '**', redirectTo: '' }
];
