import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { SearchResponse, Album, Track } from '../../domain/spotify.models';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private apiUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  search(query: string, type: string = 'track,album'): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(`${this.apiUrl}/search?q=${query}&type=${type}`, {
      headers: this.getHeaders()
    });
  }

  getAlbum(id: string): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/albums/${id}`, {
      headers: this.getHeaders()
    });
  }

  getAlbumTracks(id: string): Observable<{ items: Track[] }> {
    return this.http.get<{ items: Track[] }>(`${this.apiUrl}/albums/${id}/tracks`, {
      headers: this.getHeaders()
    });
  }
}
