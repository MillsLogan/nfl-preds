export class Prediction {
    playerName: string;
    gameId: number;
    winner: string;

    constructor(playerName: string, gameId: number, winner: string) {
        this.playerName = playerName;
        this.gameId = gameId;
        this.winner = winner;
    }
}
