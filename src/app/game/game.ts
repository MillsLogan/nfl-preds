import moment from 'moment/moment';

export class Game {
    id: number;
    week: number;
    date: moment.Moment;
    time: string;
    away: string;
    home: string;
    winner: string | null;

    constructor(id: number, week: number, date: moment.Moment, time: string, away: string, home: string, winner: string | null) {
        this.id = id;
        this.week = week;
        this.date = date;
        this.time = time;
        this.away = away;
        this.home = home;
        this.winner = winner;
    }

    static fromSheetRow(id: number, row: any): Game {
        let week = parseInt(row[0]);
        let date = moment(row[1], "MM/DD/YYYY");
        let time = row[2];
        let home = row[3];
        let away = row[4];
        let winner = row[5];
        if(winner === undefined){
            winner = null;
        }
        return new Game(id, week, date, time, home, away, winner);
    }
}
