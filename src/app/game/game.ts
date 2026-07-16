import moment from 'moment/moment';

export class Game {
    id: number;
    week: number;
    date: moment.Moment;
    away: string;
    home: string;
    winner: string | null;
    isInternational: boolean = false;
    internationalLocation: string | null = null;
    isTie: boolean = false;

    constructor(id: number, week: number, date: moment.Moment, away: string, home: string, winner: string | null, isInternational: boolean = false, internationalLocation: string | null = null) {
        this.id = id;
        this.week = week;
        this.date = date;
        this.away = away;
        this.home = home;
        this.winner = winner;
        this.isInternational = isInternational;
        this.internationalLocation = internationalLocation;
        this.isTie = winner === null && this.date.clone().add(moment.duration(12, 'hours')).isBefore(moment());
    }

    static fromSheetRow(row: [string, string, string, string, string, string, string, string, string]): Game {
        let id = parseInt(row[0]);
        let week = parseInt(row[1]);
        console.log(row[2]);
        let date = moment(row[2], "YYYY-MM-DDTHH:mm:ss.SSSZ");
        let away = row[3];
        let home = row[4];
        let winner: string | null = row[5];
        if(winner === ""){
            winner = null;
        }
        let isInternational = row[6] === "true";
        let internationalLocation: string | null = row[7] === "" ? null : row[7];
        return new Game(id, week, date, away, home, winner, isInternational, internationalLocation);
    }
}
