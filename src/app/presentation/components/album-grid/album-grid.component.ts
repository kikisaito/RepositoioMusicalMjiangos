import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-album-grid',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './album-grid.component.html',
  styleUrl: './album-grid.component.scss'
})
export class AlbumGridComponent {

}
