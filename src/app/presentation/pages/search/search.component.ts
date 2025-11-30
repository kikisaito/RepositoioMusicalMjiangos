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

  onSearch(): void {
    if (!this.query.trim()) return;

    this.isLoading = true;
    this.spotifyService.search(this.query).subscribe({
      next: (res) => {
        this.results = res;
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
