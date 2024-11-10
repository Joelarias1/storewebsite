

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Game } from '../../app/models/game';
import { GameService } from '../../app/services/game.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent {
  categories = [
    { id: 'strategy', title: 'Strategy Games' },
    { id: 'party', title: 'Party Games' },
    { id: 'classic', title: 'Classic Board Games' },
    { id: 'family', title: 'Family Games' }
  ];

  constructor(public gameService: GameService) {} 
}