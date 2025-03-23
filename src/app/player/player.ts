export class Player {
    name: string;
    color: string;
    correct: number;
    incorrect: number;
    
    constructor(name: string, color: string, correct: number=0, incorrect: number=0) {
        this.name = name;
        this.color = color;
        this.correct = correct;
        this.incorrect = incorrect;
    }
}
