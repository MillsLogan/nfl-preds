import { Game } from '../game/game';

export class Team {
    city: string;
    name: string;
    schedule: Game[];
    wins: number;
    losses: number;
    ties: number;
    
    constructor(city: string, name: string, schedule: Game[], wins: number, losses: number, ties: number) {
        this.city = city;
        this.name = name;
        this.schedule = schedule;
        this.wins = wins;
        this.losses = losses;
        this.ties = ties;
    }
}
