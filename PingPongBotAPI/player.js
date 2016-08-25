module.exports = class Player{
    constructor(id, name, elo){
        this.elo = elo;
        this.name = name;
        this.id = id;
        this.matchPlayed = 0;
    }

    // GETTERS / SETTERS
    getId() { return this.id }
    getName(){ return this.name; }
    setName(name) { if(name != null)this.name = name; }
    getELO(){ return this.elo }
    setELO(elo) { if(typeof(elo) == "number" && elo != null)this.elo = elo;}
    updateMatchPlayed(){ this.matchPlayed++; }
}