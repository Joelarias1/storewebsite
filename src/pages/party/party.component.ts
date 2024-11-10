
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Game } from '../../app/models/game';
import { GameService } from '../../app/services/game.service';

@Component({
  selector: 'app-party',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './party.component.html',
  styleUrl: './party.component.css'
})


export class PartyComponent implements OnInit {
  partyGames: Game[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit() {
      this.partyGames = this.gameService.getGamesByCategory('party');
  }

}