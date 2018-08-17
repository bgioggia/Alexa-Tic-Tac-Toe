"use strict";

var Alexa = require("alexa-sdk");

//The board is split up into three arrays of values row1, row2, and row3. These will be
//made into a two dimensional array in a later version, but are broken up now for easier
//troubleshooting.
var row1 = ["blank", "blank", "blank"];
var row2 = row1;
var row3 = row1;

//
var requestedShape = "";
var requestedPosition = "";
    
//String that alexa uses to read the state of the board to the user. 
var boardState= ""

//boardToString prints out the board in a sentence for Alexa to read.
function boardToString()
{
  var x;
  for (x in row1)
  {
    boardState = boardState + row1[x] + " ";
  }
}

//changeBoard calls a helper function depending on if an X or O is being added.
function changeBoard(shape, position)
{
  if (shape == "o"){
    changeBoardO(position);
  }
  else{
    changeBoardX(position);
  }
}

//adds O's to the position that the user requested
function changeBoardO(position){
  if(position == "top right"){  
    row1[2] = "O";
  }
  else if(position == "top middle"){
    row1[1] = "O";
  }
  else if(position == "top left"){
    row1[0] = "O";
  }
}

//adds X's to the position that the user requested
function changeBoardX(position){
  if(position == "top right"){  
    row1[2] = "X";
  }
  else if(position == "top middle"){
    row1[1] = "X";
  }
  else if(position == "top left"){
    row1[0] = "X";
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
  },

  //Handler for selecting Easy, Normal or Hard
  'SelectDifficulty': function()
  {
  },

  //Handler for adding X's and O's to the board
  'MakeMove': function()
  {
    requestedShape = this.event.request.intent.slots.shape.value;
    requestedPosition = this.event.request.intent.slots.position.value;
    changeBoard(requestedShape, requestedPosition);
    this.response.speak("I have added an " + requestedShape + " to " + requestedPosition).listen("test");
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