import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../../domain/spotify.models';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audio = new Audio();

  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  currentTrack$ = this.currentTrackSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  constructor() {
    this.audio.addEventListener('ended', () => {
      this.isPlayingSubject.next(false);
    });
  }

  playTrack(track: Track): void {
    if (!track.preview_url) {
      alert('Esta canción no tiene preview disponible en Spotify.');
      return;
    }

    this.currentTrackSubject.next(track);
    this.audio.src = track.preview_url;
    this.audio.load();
    this.play();
  }

  play(): void {
    this.audio.play().then(() => {
      this.isPlayingSubject.next(true);
    }).catch(err => console.error('Error playing audio:', err));
  }

  pause(): void {
    this.audio.pause();
    this.isPlayingSubject.next(false);
  }

  togglePlay(): void {
    if (this.isPlayingSubject.value) {
      this.pause();
    } else {
      this.play();
    }
  }
}
