import { Injectable } from '@angular/core';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private games: Game[] = [
    // Strategy Games
    {
      id: 1,
      title: "Terraforming Mars",
      description: "Compete to make Mars habitable in this science-driven strategy game of resource management.",
      price: 69.99,
      discount: 15,
      image: "/assets/img/terraforming.jpg",
      category: "strategy"
    },
    {
      id: 2,
      title: "Pandemic",
      description: "Work together as a team to save humanity from four deadly diseases in this cooperative strategy game.",
      price: 39.99,
      discount: 20,
      image: "assets/img/pandemic.jpg",
      category: "strategy"
    },
    {
      id: 3,
      title: "Scythe",
      description: "Lead your faction to dominance in an alternate-history 1920s Eastern Europe with mechs and resource management.",
      price: 79.99,
      discount: 10,
      image: "assets/img/scythe.jpg",
      category: "strategy"
    },
    // Party Games
    {
      id: 4,
      title: "Cards Against Humanity",
      description: "A party game for horrible people. Fill in the blank with outrageous answers.",
      price: 25.99,
      discount: 20,
      image: "assets/img/cardagainst.jpg",
      category: "party"
    },
    {
      id: 5,
      title: "Pictionary",
      description: "Draw and guess words in this classic party game of quick sketches and hilarious guesses.",
      price: 19.99,
      discount: 15,
      image: "assets/img/pictionary.jpg",
      category: "party"
    },
    {
      id: 6,
      title: "Dixit",
      description: "A visually stunning game of storytelling and guesswork with beautiful, surreal artwork.",
      price: 29.99,
      discount: 10,
      image: "assets/img/dixit.jpg",
      category: "party"
    },
    // Family Games
    {
      id: 7,
      title: "Catan",
      description: "Build settlements, cities, and roads to dominate the island of Catan in this classic strategy game.",
      price: 49.99,
      discount: 10,
      image: "assets/img/catan.png",
      category: "family"
    },
    {
      id: 8,
      title: "Ticket to Ride",
      description: "Cross-country train adventure where players collect cards to build railway routes connecting cities.",
      price: 22.99,
      discount: 15,
      image: "assets/img/ticket2ride.png",
      category: "family"
    },
    {
      id: 9,
      title: "Codenames",
      description: "Fun word-guessing party game where two teams compete to identify secret agents using one-word clues.",
      price: 16.99,
      discount: 5,
      image: "assets/img/codenames.webp",
      category: "family"
    },
    // Classic Games
    {
      id: 10,
      title: "Chess",
      description: "Strategic board game for two players, each commanding an army of pieces.",
      price: 29.99,
      discount: 10,
      image: "assets/img/chess.jpg",
      category: "classic"
    },
    {
      id: 11,
      title: "Monopoly",
      description: "Real estate trading game where players buy, sell, and develop properties.",
      price: 24.99,
      discount: 15,
      image: "assets/img/monopoly.jpg",
      category: "classic"
    },
    {
      id: 12,
      title: "Scrabble",
      description: "Word game where players score points by placing tiles to form words.",
      price: 19.99,
      discount: 5,
      image: "assets/img/scrabble.jpg",
      category: "classic"
    }
  ];

  getAllGames(): Game[] {
    return this.games;
  }

  getGamesByCategory(category: string): Game[] {
    return this.games.filter(game => game.category === category);
  }

  getGameById(id: number): Game | undefined {
    return this.games.find(game => game.id === id);
  }
}