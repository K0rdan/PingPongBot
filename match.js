module.exports = class Match {
    constructor(player1, player2) {
        this.init = false;
        this.player1 = player1;
        this.player1HasAccepted = false;
        this.player2 = player2;
        this.player2HasAccepted = false;
    }

    acceptMatch(player) {
        if(player == this.player1)
            this.player1HasAccepted = true;
        else if(player == this.player2)
            this.player2HasAccepted = true;
        else {
            console.log("[MATCH]","[acceptMatch]"," - Player ('"+player.getName()+"') not found.");
            return null;
        }

        if(this.player1HasAccepted && this.player2HasAccepted)
            this.init = true;
        
        return true;
    }

    // Getters / Setters
    getInit() { return this.init; }
    getPlayers() { return [this.player1, this.player2]; }
}