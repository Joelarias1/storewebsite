import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../app/models/game';
import { GameService } from '../../app/services/game.service';

@Component({
  selector: 'app-strategy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './strategy.component.html',
  styleUrl: './strategy.component.css'
})
export class StrategyComponent implements OnInit {
  strategyGames: Game[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.strategyGames = this.gameService.getGamesByCategory('strategy');
  }
}