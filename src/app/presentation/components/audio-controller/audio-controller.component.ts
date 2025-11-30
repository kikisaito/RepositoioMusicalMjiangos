import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../core/services/player.service';

@Component({
  selector: 'app-audio-controller',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-controller.component.html',
  styleUrl: './audio-controller.component.scss'
})
export class AudioControllerComponent {
  isPlaying$ = this.playerService.isPlaying$;
  currentTrack$ = this.playerService.currentTrack$;
  currentTime$ = this.playerService.currentTime$;
  duration$ = this.playerService.duration$;

  constructor(public playerService: PlayerService) { }

  togglePlay(): void {
    this.playerService.togglePlay();
  }

  next(): void {
    this.playerService.next();
  }

  prev(): void {
    this.playerService.prev();
  }

  onSeek(event: any): void {
    const value = event.target.value;
    this.playerService.seek(value);
  }
}
