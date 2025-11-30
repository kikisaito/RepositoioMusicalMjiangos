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

  constructor(public playerService: PlayerService) { }

  togglePlay(): void {
    this.playerService.togglePlay();
  }
}
