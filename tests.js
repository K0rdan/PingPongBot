let PingPongBot = require('./pingpongbot');

let PPB = new PingPongBot();

// Register a new player into the API
PPB.addPlayer();                    // TEST : empty / missing param
PPB.addPlayer("player1");           // OK
PPB.addPlayer("player2");           // OK
PPB.addPlayer("player3");           // OK -> Used into the second test phase
PPB.addPlayer("player1");           // TEST : player already created

// Register a new match between 2 registered players into the API
//      Replace first param by current player's name.
PPB.addMatch();                     // TEST : empty / missing param
PPB.addMatch("1", "2");             // TEST : invalid player(s)
PPB.addMatch("player1", "player2"); // OK
PPB.addMatch("player1", "player2"); // TEST : match already created but not finished
PPB.addMatch("player1", "player3"); // TEST : player already involved in a match

// Accept a registered match
//      Replace param by current player's name.
PPB.acceptMatch();                  // TEST : empty / missing param
PPB.acceptMatch("1");               // TEST : invalid player
PPB.acceptMatch("player1");         // OK
PPB.acceptMatch("player2");         // OK
PPB.acceptMatch("player2");         // TEST : Already accept
PPB.acceptMatch("player3");         // TEST : No match found

// Refuse a registered match
//      Replace first param by current player's name.
/*PPB.ignoreMatch();                      // TEST : empty / missing param
PPB.ignoreMatch("1", "2");              // TEST : invalid player(s)
PPB.ignoreMatch("player1", "player2");  // OK
PPB.ignoreMatch("player1", "player2");  // TEST : No match to ignoreMatch*/

PPB.won();      // OK : No score provided
PPB.won(0,11);  // TEST : Invalid score.
PPB.won(11,0);  // OK : Score provided  -> First param > Second param
PPB.won();      // TEST : No match found
PPB.won(11,0);  // TEST : No match found-> First param > Second param

PPB.lost();     // Same as won()
PPB.lost(0,11); // Same as won(11,0)    -> First param < Second param
PPB.lost(11,0); // TEST : Invalid score.