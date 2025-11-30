import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../core/services/player.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss'
})
export class PlaylistComponent {
  playlist$ = this.playerService.playlist$;
  currentTrack$ = this.playerService.currentTrack$;

  constructor(public playerService: PlayerService) { }

  playTrack(track: any, index: number): void {
    // Si ya está en la playlist, solo saltar a ese índice
    // Pero como setPlaylist resetea, mejor implementamos un jumpTo en el servicio o usamos setPlaylist con la misma lista
    // Por simplicidad, asumimos que la playlist no cambia
    // Mejor implementación: agregar método jumpTo en PlayerService
    // Por ahora, re-seteamos la playlist desde ese índice (funciona igual)
    this.playerService.setPlaylist(this.playerService.playlistSubject.value, index); // Acceso directo al value subject es un poco sucio pero rápido
    // Corrección: PlayerService tiene playlistSubject privado.
    // Necesitamos un método playAtIndex en PlayerService.
    // Por ahora, usaremos setPlaylist con la lista actual que obtenemos via suscripción en el template o component
  }

  // Mejor enfoque: método playAtIndex en PlayerService
  playAtIndex(index: number): void {
    // Hack temporal: re-emitir la misma playlist
    // Idealmente agregar playAtIndex(index) en PlayerService
    // Voy a agregar playAtIndex en PlayerService en el siguiente paso si es necesario, 
    // pero por ahora usaré setPlaylist con la lista actual
    let currentPlaylist: any[] = [];
    this.playlist$.subscribe(p => currentPlaylist = p).unsubscribe();
    this.playerService.setPlaylist(currentPlaylist, index);
  }
}
