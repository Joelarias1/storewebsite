
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Game } from '../../app/models/game';
import { GameService } from '../../app/services/game.service';

@Component({
  selector: 'app-classic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classic.component.html',
  styleUrl: './classic.component.css'
})
export class ClassicComponent {
  classicGames: Game[] = [];

  constructor(private gameService: GameService) {
    this.classicGames = this.gameService.getGamesByCategory('classic');
  }
}