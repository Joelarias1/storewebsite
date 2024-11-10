
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Game } from '../../app/models/game';
import { GameService } from '../../app/services/game.service';

@Component({
  selector: 'app-family',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './family.component.html',
  styleUrl: './family.component.css'
})
export class FamilyComponent {
  familyGames: Game[] = [];

  constructor(private gameService: GameService) {
    this.familyGames = this.gameService.getGamesByCategory('family');
  }
}