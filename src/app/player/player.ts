export class Player {
    name: string;
    correct: number;
    incorrect: number;
    
    constructor(name: string, id: number, score: number) {
        this.name = name;
        this.incorrect = id;
        this.correct = score;
    }
}
