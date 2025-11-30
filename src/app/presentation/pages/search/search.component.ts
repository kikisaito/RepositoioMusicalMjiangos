import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpotifyService } from '../../../data/services/spotify.service';
import { SearchResponse } from '../../../domain/spotify.models';
import { PlayerService } from '../../../core/services/player.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  query: string = '';
  results: SearchResponse | null = null;
  isLoading: boolean = false;

  constructor(
    private spotifyService: SpotifyService,
    private playerService: PlayerService
  ) { }

  topResult: any = null;

  onSearch(): void {
    if (!this.query.trim()) return;

    this.isLoading = true;
    this.results = null;
    this.topResult = null;

    this.spotifyService.search(this.query).subscribe({
      next: (res) => {
        this.results = res;
        // Determinar Top Result (prioridad: artista > canción)
        if (res.artists?.items?.length) {
          this.topResult = { ...res.artists.items[0], type: 'artist' };
        } else if (res.tracks?.items?.length) {
          this.topResult = { ...res.tracks.items[0], type: 'track' };
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error searching:', err);
        this.isLoading = false;
      }
    });
  }

  playTrack(track: any): void {
    this.playerService.playTrack(track);
  }
}
