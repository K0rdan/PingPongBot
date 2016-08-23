let _ = require('lodash');
let Player = require('./player');
let Match = require('./match');

module.exports = class PingPongBot{
    constructor() {
        this.CONSTS = {
            ELOBASE: 1000,
            DEFAULT_SCORE: {WINNER: 11,LOOSER: 5}
        };
        this.players = [];
        this.matchs = [];
    }

    log(type,method, msg) {
        console.log("[PPB]["+type+"]["+method+"] -", msg);
    }

    // Check if players exist; return the player found or true.
    existPlayer(playerName) {
        for(let i=0;i<this.players.length;i++){
            if(this.players[i].getName() == playerName)
                return this.players[i];
        }
        return true;
    }

    // Check if match exist; 
    //  return :    the Match found if one player is already invovled in a not finished match.
    //              True (a new match can be create).
    existMatch(match) {
        for(let i=0;i<this.matchs.length;i++){
            if(!this.matchs[i].getInit()){
                let intersect = _.intersection(match.getPlayers(), this.matchs[i].getPlayers());
                if(intersect.length == 1 || intersect.length == 2)
                    return this.matchs[i];
            }
        }
        return true;
    }

    // Find the awaiting match for the player(s) passed through parameter.
    //  info :      The second player's name is optional.
    //  return :    the Match found.
    //              null if no match found. 
    findAwaitingMatch(playerName1, playerName2) {
        for(let i=0;i<this.matchs.length;i++){
            if(!this.matchs[i].getInit()){
                let players = this.matchs[i].getPlayers();
                
                // 1) Retreive match for 1 player
                if(arguments.length == 1){ // If an non-initied match with the player is found.
                    if(typeof(_.find(players, function(p) { return p.getName() == playerName1; })) !== "undefined")
                        return this.matchs[i];
                }
                // 2) Retreive match for the 2 players
                if(arguments.length == 2) {
                    if( (players[0].getName() == playerName1 || players[1].getName() == playerName1) &&
                        (players[0].getName() == playerName2 || players[1].getName() == playerName2))
                        return this.matchs[i];
                }
            }
        }
        return null;
    }

    addPlayer(name) {
        if(name){
            let checkIn = this.existPlayer(name);
            if(checkIn == true){
                let player = new Player(name, this.CONSTS.ELOBASE);
                if(player != null){
                    this.players.push(player);
                    this.log("INFO", "addPlayer", "New player registered : "+player.getName()+"!");
                }
                else
                    this.log("ERRO", "addPlayer", "Error when creating the new player.");
            }
            else
                this.log("ERRO", "addPlayer", "Player ('"+checkIn.getName()+"') already exist.")
        }
        else
            this.log("ERRO", "addPlayer", "The new player must be named.");
    }

    addMatch(playerName1, playerName2) {
        let p1 = this.existPlayer(playerName1);
        let p2 = this.existPlayer(playerName2);
        
        if(p1 != true && p2 != true && p1 && p2) {
            let match = new Match(p1,p2);
            if(match != null){
                let checkIn = this.existMatch(match);
                if(checkIn == true) {
                    this.matchs.push(match);
                    this.log("INFO", "addMatch", "Match between "+playerName1+" and "+playerName2+" created !");
                }
                else 
                    this.log("ERRO", "addMatch", "A match between "+checkIn.getPlayers()[0].name+" and "+checkIn.getPlayers()[1].name+" already exist and isn't finish.");
            }
            else
                this.log("ERRO", "addMatch", "Error when creating the new match.");
        }
        else {
            if(p1 == true)
                this.log("ERRO", "addMatch", "Player ('"+playerName1+"') not found");
            if(p2 == true)
                this.log("ERRO", "addMatch", "Player ('"+playerName2+"') not found");
        }     
    }

    acceptMatch(playerName) {
        if(playerName){
            let player = this.existPlayer(playerName);
            if(player != true) {
                let match = this.findAwaitingMatch(playerName);
                if(match != null) {
                    if(match.acceptMatch(player))
                        this.log("INFO", "acceptMatch", "You have accept the match !");
                    else
                        this.log("ERRO", "acceptMatch", "Something went wrong with the match.");
                }
                else
                    this.log("ERRO", "acceptMatch", "No awaiting match found.");
            }
            else
                this.log("ERRO", "acceptMatch", "Player ('"+playerName+"') not found.");
        }
        else
            this.log("ERRO", "acceptMatch", "Missing parameter (player's name).");
    }

    ignoreMatch(playerName1, playerName2) {
        let p1 = this.existPlayer(playerName1);
        let p2 = this.existPlayer(playerName2);
        
        if(p1 != true && p2 != true && p1 && p2) {
            let match = this.findAwaitingMatch(playerName1, playerName2);
            if(match != null) {
                // Delete the match
                _.remove(this.matchs, function(m) { return m == match; });
                this.log("INFO", "ignoreMatch", "The match between "+match.getPlayers()[0].getName()+" and "+match.getPlayers()[1].getName()+" has been deleted.");
            }
            else
                this.log("ERRO", "ignoreMatch", "No awaiting match found.");
        }
        else {
            if(p1 == true)
                this.log("ERRO", "ignoreMatch", "Player ('"+playerName1+"') not found");
            if(p2 == true)
                this.log("ERRO", "ignoreMatch", "Player ('"+playerName2+"') not found");
        }   

    }

    won(score1, score2) {
        if(arguments.length == 2){
            if(score1 > score2)
                this.finishMatch(score1, score2);
            else
                this.log("ERRO", "won", "The first score provided must be greater than the second");
        }
        else
            this.finishMatch(this.CONSTS.DEFAULT_SCORE.WINNER,this.CONSTS.DEFAULT_SCORE.LOOSER);
    }
    lost(score1, score2) {
        if(arguments.length == 2)
            if(score1 < score2)
                this.finishMatch(score1, score2);
            else
                this.log("ERRO", "lost", "The first score provided must be worse than the second");
        else
            this.finishMatch(this.CONSTS.DEFAULT_SCORE.LOOSER,this.CONSTS.DEFAULT_SCORE.WINNER);
    }
    finishMatch(score1, score2) {
        if(arguments.length == 2 && typeof(score1) == "number" && typeof(score2) == "number") {
            this.log("INFO", "finishMatch", "Will be implement soon.");
        }
        else
            this.log("ERRO", "finishMatch", "Invalid score ("+score1+","+score2+")");
    }
};