let _ = require('lodash');
let Player = require('./player');
let Match = require('./match');

module.exports = class PingPongBotAPI{
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

    // Check if players exist; return the player found or false.
    existPlayer(playerId) {
        for(let i=0;i<this.players.length;i++){
            if(this.players[i].getId() == playerId)
                return this.players[i];
        }
        return false;
    }

    // Check if match exist; 
    //  return :    the Match found if one player is already invovled in a not finished match.
    //              False (a new match can be create).
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

    findPlayerNameById(playerId) {
        for(let i=0; i<this.players.length;i++){
            if(this.players[i].getId() == playerId){
                return this.players[i].getName();
            }
        }
        return ''; // Empty string
    }
    
    // Find the awaiting match for the player(s) passed through parameter.
    //  info :      The second player's name is optional.
    //  return :    the Match found.
    //              null if no match found. 
    findAwaitingMatch(playerId1, playerId2) {
        for(let i=0;i<this.matchs.length;i++){
            if(!this.matchs[i].getInit()){
                let players = this.matchs[i].getPlayers();
                
                // 1) Retreive match for 1 player
                if(arguments.length == 1){ // If an non-initied match with the player is found.
                    if(typeof(_.find(players, function(p) { return p.getId() == playerId1; })) !== "undefined")
                        return this.matchs[i];
                }
                // 2) Retreive match for the 2 players
                if(arguments.length == 2) {
                    if( (players[0].getId() == playerId1 || players[1].getId() == playerId1) &&
                        (players[0].getId() == playerId2 || players[1].getId() == playerId2))
                        return this.matchs[i];
                }
            }
        }
        return null;
    }

    findOngoingMatch(player) {
        for(let i=0;i<this.matchs.length;i++){
            if(this.matchs[i].getInit()){
                let players = this.matchs[i].getPlayers();
                if(players[0] == player || players[1] == player){
                    return this.matchs[i];
                }
            }
        }
        return null;
    }

    addPlayer(id) {
        if(id){
            let existPlayer = this.existPlayer(id);
            if(!existPlayer){
                // TODO : replace the second parameter by the nickname used by the client.
                let player = new Player(id, id, this.CONSTS.ELOBASE);
                if(player != null){
                    this.players.push(player);
                    this.log("INFO", "addPlayer", "New player registered : "+player.getId()+"!");
                }
                else
                    this.log("ERRO", "addPlayer", "Error when creating the new player.");
            }
            else
                this.log("ERRO", "addPlayer", "Player ('"+existPlayer.getId()+"') already exist.")
        }
        else
            this.log("ERRO", "addPlayer", "The new player must be named.");
    }

    addMatch(playerId1, playerId2) {
        let p1 = this.existPlayer(playerId1);
        let p2 = this.existPlayer(playerId2);
        
        if(p1 != true && p2 != true && p1 && p2) {
            let match = new Match(p1,p2);
            if(match != null){
                let checkIn = this.existMatch(match);
                if(checkIn == true) {
                    this.matchs.push(match);
                    this.log("INFO", "addMatch", "Match between "+this.findPlayerNameById(playerId1)+" and "+this.findPlayerNameById(playerId2)+" created !");
                }
                else 
                    this.log("ERRO", "addMatch", "A match between "+checkIn.getPlayers()[0].getName()+" and "+checkIn.getPlayers()[1].getName()+" already exist and isn't finish.");
            }
            else
                this.log("ERRO", "addMatch", "Error when creating the new match.");
        }
        else {
            if(p1 == true)
                this.log("ERRO", "addMatch", "Player ('"+playerId1+"') not found");
            if(p2 == true)
                this.log("ERRO", "addMatch", "Player ('"+playerId2+"') not found");
        }     
    }

    acceptMatch(playerId) {
        if(playerId){
            let player = this.existPlayer(playerId);
            if(player != true) {
                let match = this.findAwaitingMatch(playerId);
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
                this.log("ERRO", "acceptMatch", "Player ('"+this.findPlayerNameById(playerId)+"') not found.");
        }
        else
            this.log("ERRO", "acceptMatch", "Missing parameter (player's name).");
    }

    ignoreMatch(playerId1, playerId2) {
        let p1 = this.existPlayer(playerId1);
        let p2 = this.existPlayer(playerName2);
        
        if(p1 != true && p2 != true && p1 && p2) {
            let match = this.findAwaitingMatch(playerId1, playerId2);
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
                this.log("ERRO", "ignoreMatch", "Player ('"+playerId1+"') not found");
            if(p2 == true)
                this.log("ERRO", "ignoreMatch", "Player ('"+playerId2+"') not found");
        }   

    }

    won(playerId, score1, score2) {
        let player = this.existPlayer(playerId);
        if(player) {
            if(typeof(score1) == "number" && typeof(score2) == "number") {
                if(score1 > score2)
                    this.finishMatch(player, score1, score2, true);
                else
                    this.log("ERRO", "won", "The first score provided ('"+score1+"') must be greater than the second ('"+score2+"').");
            }
            else
                this.log("ERRO", "won", "Invalid score ("+score1+","+score2+")");
        }
        else
            this.log("ERRO", "won", "Player ('"+playerId+"') not found.");
    }
    lost(playerId, score1, score2) {
        let player = this.existPlayer(playerId);
        if(player) {
            if(typeof(score1) == "number" && typeof(score2) == "number") {
                if(score1 < score2)
                    this.finishMatch(player, score1, score2, false);
                else
                    this.log("ERRO", "lost", "The first score provided ('"+score1+"') must be smaller than the second ('"+score2+"').");
            }
            else
                this.log("ERRO", "lost", "Invalid score ("+score1+","+score2+")");     
        }
        else
            this.log("ERRO", "lost", "Player ('"+playerId+"') not found.");
    }
    finishMatch(player, score1, score2, win) {
        let match = this.findOngoingMatch(player);
        if(match != null){
            match.getPlayers()[0].updateMatchPlayed();
            match.getPlayers()[1].updateMatchPlayed();
            this.calculateELO(match, player, score1, score2, win);
            _.remove(this.matchs, function(m) { return m == match; });
        }
        else
            this.log("ERRO", "finishMatch", "No ongoing match found.");
    }

    calculateELO(match, currentPlayer, score1, score2, win) {
        let players = match.getPlayers();

        // Setup opponent   
        let opponentPlayer = null;
        if(players[0].getId() == currentPlayer.getId())
            opponentPlayer = players[1];
        else
            opponentPlayer = players[0];
        
        // Setup scores
        let currentPlayerScore = null;
        if(win) score1 > score2 ? currentPlayerScore = score1 : currentPlayerScore = score2;
        else    score1 > score2 ? currentPlayerScore = score2 : currentPlayerScore = score1;
        let opponentPlayerScore = null;
        if(currentPlayerScore == score1) opponentPlayerScore = score2;
        else opponentPlayerScore = score1;

        // THE GIFT ! (If you don't know the film...)
        if(currentPlayerScore == 0)
            currentPlayerScore = 1;
        if(opponentPlayerScore == 0)
            opponentPlayerScore = 1;

        // Setup win probability
        let currentPlayerWinProb = this.getWinProb(currentPlayer, opponentPlayer);
        let opponentPlayerWinProb = this.getWinProb(currentPlayer, opponentPlayer);

        // ELOMove
        let currentPlayerELOMove = null;
        let opponentPlayerELOMove = null;
        // For the WINNER
        if(win) {
            let currentPlayerBaseELOMove = Math.trunc(opponentPlayerWinProb/2);
            currentPlayerELOMove = Math.ceil(currentPlayerBaseELOMove + currentPlayerBaseELOMove*this.getScoreInfluence(currentPlayerScore, opponentPlayerScore));
            let opponentPlayerBaseELOMove = Math.trunc(currentPlayerWinProb/2);
            opponentPlayerELOMove = Math.ceil(-(opponentPlayerBaseELOMove + opponentPlayerBaseELOMove*this.getScoreInfluence(opponentPlayerScore, currentPlayerScore)));
        }
        // For the LOOSER
        else {
            // TODO !
            let currentPlayerBaseELOMove = Math.trunc(currentPlayerWinProb/2);
            currentPlayerELOMove = Math.ceil(-(currentPlayerBaseELOMove + currentPlayerBaseELOMove*this.getScoreInfluence(currentPlayerScore, opponentPlayerScore)));            

            let opponentPlayerBaseELOMove = Math.trunc(opponentPlayerWinProb/2);
            opponentPlayerELOMove = Math.ceil(opponentPlayerBaseELOMove + opponentPlayerBaseELOMove*this.getScoreInfluence(opponentPlayerScore, currentPlayerScore));
        }

        // Overall ELOMove
        let currentPlayerELOOut = currentPlayer.getELO() + currentPlayerELOMove;
        let opponentPlayerELOOut = opponentPlayer.getELO() + opponentPlayerELOMove;

        // Update ELO scores
        currentPlayer.setELO(currentPlayerELOOut);
        opponentPlayer.setELO(opponentPlayerELOOut);

        this.log("INFO", "finishMatch", "The match between "+currentPlayer.getName()+" and "+ opponentPlayer.getName()+
            " ended on the score of : "+currentPlayerScore+"-"+opponentPlayerScore+
            " ! (Their ELO is now : "+currentPlayerELOOut+" ; "+opponentPlayerELOOut+")");
    }

    getWinProb(currentPlayer, opponentPlayer) {
        return Math.round(Math.abs(currentPlayer.getELO()/opponentPlayer.getELO()/2*100));
    }

    getScoreInfluence(currentPlayerScore, opponentPlayerScore) {
        return _.round(currentPlayerScore/opponentPlayerScore,2)/400;
    }

    getLadderBoard() {
        console.log(_.orderBy(this.players, ['elo', 'matchPlayed'], ['desc', 'asc']));
        //return _.orderBy(this.players, []);
    }
};