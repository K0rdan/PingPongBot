module.exports = class Player{
    constructor(id, name, elo){
        this.elo = elo;
        this.name = name;
        this.id = id;
    }

    // GETTERS / SETTERS
    getId() { return this.id }
    getName(){ return this.name; }
    setName(name) { if(name != null)this.name = name; }
    getElo(){ return this.elo }
    setElo(elo) { if(typeof(elo) == "number" && elo != null)this.elo = elo;}
}