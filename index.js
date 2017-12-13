/*SHADOWRUN ANARCHY DICE ROLLER
Progressiva web app that rolls Shadowrun Anarchy dice without hassle or unnecessary clicks.

Shadowrun Anarchy is a rules-light tabletop role-playing game. It often involves rolling large handfuls of dice and
tallying results, so I made this little app to speed things up when gaming at the computer.

When a user clicks a button, the app rolls the specified number of dice, applies min and max roll, and tallies the results for each die side.
Then it sums the results.

The wild die doesn't contribute to successes; it's a six-sided die that causes a Bad Luck result on a 1, and Good Luck on 6.
*/

var diceTally = 0; //will eventually use closures for this
       
function handleRollClick(numDice) {
    diceTally = rollDice(numDice);
    outputReplace("rollTotal", "Total Roll: " + diceTally[7])
    outputReplace("wildDie", "Wild Die Result: " + diceTally[8])

}
      
    function rollDice(numDice, minRoll, maxRoll) {
      if (minRoll == null) {minRoll = 1}; //sets default if nothing entered for minroll
      if( maxRoll == null) {maxRoll = 6}; //sets default if nothing entered for maxRoll
            
      //minRoll sets a minimum result per die; anything below that will be upgraded to the minimum, not rerolled
      //maxRoll sets a maximum result per die; anything above that will be dowgraded to the maximum, not rerolled
      //defaults to minRoll 1 and maxRoll 6


        var currentRoll = 0;
        var wildRoll = 0
        var tempResultsStorage = [0, 0, 0, 0, 0, 0, 0, 0, ""]; //stores results for 1, 2, 3, 4, 5, and 6, respectively, ignoring index 0
        //index 7 stores sum of all
        //index 8 stores the results of the wild die
    
        if (numDice < 1 || numDice > 50) {numDice = 1} //prevents bad inputs; number of dice must be between 1 and 50, otherwise becomes 1
        
        wildRoll = Math.floor(Math.random() * 6) + 1;
        switch (wildRoll){
          case 1:
            tempResultsStorage[8] = wildRoll.toString() + " (Bad Luck)";
            break;
          
          case 6:
          tempResultsStorage[8] = wildRoll.toString() + " (Good Luck)";
            break;
    
          default:
            tempResultsStorage[8] = wildRoll.toString() + " (---)";
            break;
        }
    
    
        for (var i = 1; i <= numDice; i++){
            //roll dice here, tally results, do some other stuff
            currentRoll = Math.floor(Math.random() * 6) + 1;
            if(currentRoll < minRoll) {currentRoll = minRoll}; //applies minimum roll
            if(currentRoll > maxRoll) {currentRoll = maxRoll}; //applies maximum roll

            tempResultsStorage[currentRoll] += 1;
          }
    

        for (var i = 1; i <= 6; i++) {  //adds results
          tempResultsStorage[7] += tempResultsStorage[i]*i;
        }
            
        return tempResultsStorage; 
    
     };


//OUTPUT FUNCTIONS
//Outputs data stored in "content" to HTML element with id matching "target."

function outputReplace (target, content) {  //Replaces existing target content with new content
  document.getElementById(target).innerHTML = content;  
}

function outputAdd (target, content) {  //Adds new content to existing target content
  document.getElementById(target).innerHTML += content;  
}

function outputAddLine (target, content) {  //Adds new content to existing target content, in a new line
  document.getElementById(target).innerHTML += "<br\>" + content;  
}