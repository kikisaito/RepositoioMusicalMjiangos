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

  private playlistSubject = new BehaviorSubject<Track[]>([]);
  playlist$ = this.playlistSubject.asObservable();

  private currentIndex = -1;

  constructor() {
    this.loadFromStorage();

    this.audio.addEventListener('ended', () => {
      this.next();
    });
  }

  playTrack(track: Track): void {
    if (!track.preview_url) {
      alert('Esta canción no tiene preview disponible en Spotify.');
      return;
    }

    this.currentTrackSubject.next(track);
    this.saveToStorage();

    this.audio.src = track.preview_url;
    this.audio.load();
    this.play();
  }

  setPlaylist(tracks: Track[], startIndex: number = 0): void {
    this.playlistSubject.next(tracks);
    this.currentIndex = startIndex;
    this.playTrack(tracks[startIndex]);
  }

  playAtIndex(index: number): void {
    const playlist = this.playlistSubject.value;
    if (playlist && playlist[index]) {
      this.currentIndex = index;
      this.playTrack(playlist[index]);
    }
  }

  next(): void {
    const playlist = this.playlistSubject.value;
    if (this.currentIndex < playlist.length - 1) {
      this.currentIndex++;
      this.playTrack(playlist[this.currentIndex]);
    } else {
      this.isPlayingSubject.next(false);
    }
  }

  prev(): void {
    const playlist = this.playlistSubject.value;
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.playTrack(playlist[this.currentIndex]);
    }
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

  private saveToStorage(): void {
    const current = this.currentTrackSubject.value;
    const playlist = this.playlistSubject.value;

    if (playlist.length > 0) {
      localStorage.setItem('spotify_playlist', JSON.stringify(playlist));
    }
    if (current) {
      localStorage.setItem('spotify_current_track', JSON.stringify(current));
    }
  }

  private loadFromStorage(): void {
    const playlist = localStorage.getItem('spotify_playlist');
    const current = localStorage.getItem('spotify_current_track');

    if (playlist) {
      this.playlistSubject.next(JSON.parse(playlist));
    }

    if (current) {
      const track = JSON.parse(current);
      this.currentTrackSubject.next(track);
      // No auto-play on load, just restore state
      if (track.preview_url) {
        this.audio.src = track.preview_url;
      }
    }
  }
}
