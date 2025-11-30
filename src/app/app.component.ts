import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NavbarComponent } from './presentation/components/navbar/navbar.component';
import { AlbumGridComponent } from './presentation/components/album-grid/album-grid.component';
import { SongInfoComponent } from './presentation/components/song-info/song-info.component';
import { AudioControllerComponent } from './presentation/components/audio-controller/audio-controller.component';
import { PlaylistComponent } from './presentation/components/playlist/playlist.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    AlbumGridComponent,
    SongInfoComponent,
    AudioControllerComponent,
    PlaylistComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'music-player';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['access_token'];
      if (accessToken) {
        this.authService.setToken(accessToken);
        // Limpiar URL
        this.router.navigate([], {
          queryParams: {
            access_token: null,
            refresh_token: null,
            expires_in: null
          },
          queryParamsHandling: 'merge'
        });
      }
    });
  }
}
