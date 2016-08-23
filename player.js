module.exports = class Player{
    constructor(name, elo){
        this.CONSTS = {
            ELOBASE: elo
        };
        this.name = name;
    }

    // GETTERS / SETTERS
    getName(){ return this.name; }
    setName(name) { if(name != null)this.name = name; }
}