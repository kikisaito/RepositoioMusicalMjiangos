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

  private durationSubject = new BehaviorSubject<number>(0);
  duration$ = this.durationSubject.asObservable();

  private currentTimeSubject = new BehaviorSubject<number>(0);
  currentTime$ = this.currentTimeSubject.asObservable();

  private isSimulating = false;
  private simulationInterval: any;
  private simulatedTime = 0;
  private readonly SIMULATED_DURATION = 30; // 30 seconds for consistency with previews

  constructor() {
    this.loadFromStorage();

    this.audio.addEventListener('ended', () => {
      this.next();
    });

    this.audio.addEventListener('timeupdate', () => {
      if (!this.isSimulating) {
        this.currentTimeSubject.next(this.audio.currentTime);
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      if (!this.isSimulating) {
        this.durationSubject.next(this.audio.duration);
      }
    });
  }

  playTrack(track: Track): void {
    // Stop previous playback/simulation
    this.stop();

    this.currentTrackSubject.next(track);
    this.saveToStorage();

    if (!track.preview_url) {
      // Start Simulation Mode
      this.isSimulating = true;
      this.simulatedTime = 0;
      this.durationSubject.next(this.SIMULATED_DURATION);
      this.currentTimeSubject.next(0);
      this.play(); // Start simulation loop
    } else {
      // Normal Audio Mode
      this.isSimulating = false;
      this.audio.src = track.preview_url;
      this.audio.load();
      this.play();
    }
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
      this.stop();
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
    this.isPlayingSubject.next(true);

    if (this.isSimulating) {
      this.startSimulationLoop();
    } else {
      this.audio.play().catch(err => console.error('Error playing audio:', err));
    }
  }

  pause(): void {
    this.isPlayingSubject.next(false);

    if (this.isSimulating) {
      this.clearSimulation();
    } else {
      this.audio.pause();
    }
  }

  stop(): void {
    this.pause();
    this.currentTimeSubject.next(0);
    if (this.isSimulating) {
      this.simulatedTime = 0;
      this.clearSimulation();
    } else {
      this.audio.currentTime = 0;
    }
  }

  togglePlay(): void {
    if (this.isPlayingSubject.value) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(seconds: number): void {
    if (this.isSimulating) {
      this.simulatedTime = seconds;
      this.currentTimeSubject.next(seconds);
    } else {
      this.audio.currentTime = seconds;
    }
  }

  private startSimulationLoop(): void {
    this.clearSimulation();
    this.simulationInterval = setInterval(() => {
      this.simulatedTime += 1; // Increment by 1 second
      this.currentTimeSubject.next(this.simulatedTime);

      if (this.simulatedTime >= this.SIMULATED_DURATION) {
        this.next(); // Auto-advance when done
      }
    }, 1000);
  }

  private clearSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
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
      // Restore state but don't auto-play
      if (track.preview_url) {
        this.audio.src = track.preview_url;
        this.isSimulating = false;
      } else {
        this.isSimulating = true;
        this.durationSubject.next(this.SIMULATED_DURATION);
      }
    }
  }
}
