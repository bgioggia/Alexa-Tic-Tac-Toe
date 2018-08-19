"use strict";

var Alexa = require("alexa-sdk");

//The board is split up into three arrays of values row1, row2, and row3. These will be
//made into a two dimensional array in a later version, but are broken up now for easier
//troubleshooting.
var row1 = ["blank", "blank", "blank"];
var row2 = ["blank", "blank", "blank"];
var row3 = ["blank", "blank", "blank"];

var currentPlayer = "Player 1";
var currentShape = "o";
var requestedPosition = "";
    

//String to be read describing where shapes are on the board   
var boardState= ""

//boardToString prints out the board in a sentence for Alexa to read.
function boardToString()
{
  var x;
  boardState = "Row 1. "
  for (x in row1)
  {
    boardState = boardState + row1[x] + ". ";
  }
  boardState = boardState +". Row 2. "
  for (x in row2)
  {
    boardState = boardState + row2[x] + ". ";
  }
  boardState = boardState + ". Row 3. "
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
  if(position == "top right"){  
    row1[2] = currentShape;
  }
  else if(position == "top middle"){
    row1[1] = currentShape;
  }
  else if(position == "top left"){
    row1[0] = currentShape;
  }
  else if(position == "middle right"){  
    row2[2] = currentShape;
  }
  else if(position == "middle"){
    row2[1] = currentShape;
  }
  else if(position == "middle left"){
    row2[0] = currentShape;
  }
  else if(position == "bottom right"){  
    row3[2] = currentShape;
  }
  else if(position == "bottom middle"){
    row3[1] = currentShape;
  }
  else if(position == "bottom left"){
    row3[0] = currentShape;
  }
}


function
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
    this.response.speak("The board is clear. Player one starts with X").listen("Player 1 Please go.");
    this.emit(":responseReady");
  },

  //Handler for adding X's and O's to the board
  'MakeMove': function()
  {
    updatePlayer();
    requestedPosition = this.event.request.intent.slots.position.value;
    changeBoard(requestedPosition);
    this.response.speak("I have added an " + currentShape + " to " + requestedPosition + ". " + currentPlayer + " please make your move.").listen("test").listen(currentPlayer + " please make your move.");
    this.emit(":responseReady");
  },
  
  //Handler for reading out the current contents of the board
  'ReadBoard': function()
  {
    boardToString();
    this.response.speak(boardState);
    this.emit(":responseReady");
  },
}

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};