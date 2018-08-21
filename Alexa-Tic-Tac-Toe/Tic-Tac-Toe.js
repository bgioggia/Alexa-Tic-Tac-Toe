"use strict";

var Alexa = require("alexa-sdk");

//The board is split up into three arrays of values row1, row2, and row3. These will be
//made into a two dimensional array in a later version, but are broken up now for easier
//troubleshooting.
var row1 = ["blank", "blank", "blank"];
var row2 = ["blank", "blank", "blank"];
var row3 = ["blank", "blank", "blank"];

var isConflict = false;
var isWin = "";
var currentPlayer = "Player 1";
var currentShape = "o";
var requestedPosition = "";
    

//String to be read describing where shapes are on the board   
var boardState= "";

//boardToString prints out the board in a sentence for Alexa to read.
function boardToString()
{
  var x;
  boardState = "Row 1. ";
  for (x in row1)
  {
    boardState = boardState + row1[x] + ". ";
  }
  boardState = boardState +". Row 2. ";
  for (x in row2)
  {
    boardState = boardState + row2[x] + ". ";
  }
  boardState = boardState + ". Row 3. ";
  for (x in row3)
  {
    boardState = boardState + row3[x] + ". ";
  }
}
function updatePlayer(){
  if(currentPlayer == "Player 1")
   {  
     currentPlayer = "Player 2";
   }
  else if(currentPlayer == "Player 2")
   {
     currentPlayer = "Player 1";
   }

  if(currentShape == "x")
   {
     currentShape = "o";
   }
  else if(currentShape == "o")
   {
     currentShape = "x";
   }
}
//changeBoard calls a helper function depending on if an X or O is being added.
function changeBoard(position)
{
  isConflict = false;
  if((position == "top right") && (row1[2] == "blank")) {  
    row1[2] = currentShape;
  }
  else if((position == "top middle") && (row1[1] == "blank")){
    row1[1] = currentShape;
  }
  else if((position == "top left") && (row1[0] == "blank")){
    row1[0] = currentShape;
  }
  else if((position == "middle right") && (row2[2] == "blank")){  
    row2[2] = currentShape;
  }
  else if((position == "middle") && (row2[1] == "blank")){
    row2[1] = currentShape;
  }
  else if((position == "middle left") && (row2[0] == "blank")){
    row2[0] = currentShape;
  }
  else if((position == "bottom right") && (row3[2] == "blank")){  
    row3[2] = currentShape;
  }
  else if((position == "bottom middle") && (row3[1] == "blank")){
    row3[1] = currentShape;
  }
  else if((position == "bottom left") && (row3[0] == "blank")){
    row3[0] = currentShape;
  }
  else
  {
    isConflict = true;
  }
}

//testIfWin checks if there is a winning row on the board.
function testIfWin()
{

  if((row1[0] == row1[1]) && (row1[1] == row1[2]) && (row1[0] != "blank"))
  {
    testIfWinHelper(row1[0], "on the top row.");
  }
  else if((row1[0] == row2[0]) && (row2[0] == row3[0]) && (row1[0] != "blank") )
  {
    testIfWinHelper(row1[0], "on the left column.");
  }
  else if((row1[0] == row2[1]) && (row2[1] == row3[2]) && (row1[0] != "blank"))
  {
    testIfWinHelper(row1[0], "on the diagonal from the top left to the bottom right.");
  }
  else if((row1[1] == row2[1]) && (row2[1] == row3[1]) && (row1[1] != "blank"))
  {
    testIfWinHelper(row1[1], "on the middle column.");
  }
  else if((row1[2] == row2[2]) && (row2[2] == row3[2]) && (row1[2] != "blank"))
  {
    testIfWinHelper(row1[2], "on the right column.");
  }
  else if((row2[0] == row2[1]) && (row2[1] == row2[2]) && (row3[0] != "blank"))
  {
    testIfWinHelper(row2[0], "on the middle row.");
  }
  else if((row3[0] == row3[1]) && (row3[1] == row3[2]) && (row3[0] != "blank"))
  {
    testIfWinHelper(row3[0], "on the bottom row.");
  }
  else if((row3[0] == row2[1]) && (row2[1] == row1[2]) && (row3[0] != "blank"))
  {
    testIfWinHelper(row3[0], "on the diagonal from the top right to bottom left.");
  }
  else
  {
    isWin = "no wins";
  }

}

//checks to see if a winning combination is made of O's or X's 
function testIfWinHelper(shape, line)
{
  if (shape == "o")
  {
    isWin = "Player 2 wins with with three o's " + line;
  }
  else if (shape == "x")
  {
    isWin = "Player 1 wins with with three x's " + line;
  }
}

var handlers = {
  //Handler for app startup
  'LaunchRequest': function() {
    this.response.speak("Welcome to Tic Tac Toe! Would you like to start a new game?").listen("What would you like to do?");
    this.emit(':responseReady');
  },

  //Handler for starting new game with blank board
  'NewGame': function () 
  {
    currentPlayer = "Player 1";
    currentShape = "o";
    row1 = ["blank", "blank", "blank"];
    row2 = ["blank", "blank", "blank"];
    row3 = ["blank", "blank", "blank"];
    this.response.speak("New game started. Player one starts with X").listen("Player 1 Please go.");
    this.emit(":responseReady");
  },

  //Handler for adding X's and O's to the board
  'MakeMove': function()
  {
    updatePlayer();
    requestedPosition = this.event.request.intent.slots.position.value;
    changeBoard(requestedPosition);
    testIfWin();
    if(isConflict)
    {
      updatePlayer();
      this.response.speak("There is already a shape there. Please choose another board position.").listen();
      this.emit(":responseReady");
    }
    if(isWin == "no wins")
    {
      this.response.speak("I have added an " + currentShape + " to " + requestedPosition + ". " + currentPlayer + " please make your move.").listen("test").listen(currentPlayer + " please make your move.");
      this.emit(":responseReady");
    }
    else if (isWin != "no wins")
    {
      this.response.speak(isWin).listen("Would you like to start a new game?");
      this.emit(":responseReady");
    }
  },
  
  //Handler for reading out the current contents of the board
  'ReadBoard': function()
  {
    boardToString();
    this.response.speak(boardState);
    this.emit(":responseReady");
    this.shouldEndSession = false;
  },
};

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};