import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../../data/services/spotify.service';
import { PlayerService } from '../../../core/services/player.service';
import { Album, Track } from '../../../domain/spotify.models';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-detail.component.html',
  styleUrl: './album-detail.component.scss'
})
export class AlbumDetailComponent implements OnInit {
  album: Album | null = null;
  tracks: Track[] = [];

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadAlbum(id);
      }
    });
  }

  loadAlbum(id: string): void {
    this.spotifyService.getAlbum(id).subscribe(album => {
      this.album = album;
    });

    this.spotifyService.getAlbumTracks(id).subscribe(res => {
      this.tracks = res.items;
      // Asignar álbum a cada track para tener la imagen
      if (this.album) {
        this.tracks.forEach(t => t.album = this.album!);
      }
    });
  }

  playTrack(index: number): void {
    // Actualizar tracks con la info del álbum si falta
    const tracksToPlay = this.tracks.map(t => ({
      ...t,
      album: t.album || this.album
    })) as Track[];

    this.playerService.setPlaylist(tracksToPlay, index);
  }
}
