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

    get textColor(): string {
        const [r, g, b] = this.color.slice(1).match(/.{1,2}/g)!.map(hex => parseInt(hex, 16));
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 125 ? "black" : "white";
    }
}
