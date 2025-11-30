import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../core/services/player.service';

@Component({
  selector: 'app-song-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-info.component.html',
  styleUrl: './song-info.component.scss'
})
export class SongInfoComponent {
  currentTrack$ = this.playerService.currentTrack$;

  constructor(public playerService: PlayerService) { }
}
