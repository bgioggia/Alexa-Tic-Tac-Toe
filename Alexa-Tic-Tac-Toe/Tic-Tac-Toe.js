"use strict";

var Alexa = require("alexa-sdk");

//board variable represent the board as a 2D array. 
var board = [["blank", "blank", "blank"],
            ["blank", "blank", "blank"],
            ["blank", "blank", "blank"]];


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
  boardState = "";
  for(var i = 0; i < 3; i++)
  {
    boardState = boardState + "Row " + (i+1) + ". "
    for(var k = 0; k < 3; k++)
    {
      boardState = boardState + board[i][k] + ". "
    }
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
  if((position == "top_right") && (board[0][2] == "blank")) {  
    board[0][2] = currentShape;
  }
  else if((position == "top_middle") && (board[0][1] == "blank")){
    board[0][1] = currentShape;
  }
  else if((position == "top_left") && (board[0][0] == "blank")){
    board[0][0] = currentShape;
  }
  else if((position == "middle_right") && (board[1][2] == "blank")){  
    board[1][2] = currentShape;
  }
  else if((position == "middle") && (board[1][1] == "blank")){
    board[1][1] = currentShape;
  }
  else if((position == "middle_left") && (board[1][0] == "blank")){
    board[1][0] = currentShape;
  }
  else if((position == "bottom_right") && (board[2][2] == "blank")){  
    board[2][2] = currentShape;
  }
  else if((position == "bottom_middle") && (board[2][1] == "blank")){
    board[2][1] = currentShape;
  }
  else if((position == "bottom_left") && (board[2][0] == "blank")){
    board[2][0] = currentShape;
  }
  else
  {
    isConflict = true;
  }
}

//testIfWin checks if there is a winning row on the board.
function testIfWin()
{

  if((board[0][0] == board[0][1]) && (board[0][1] ==board[0][2]) && (board[0][0] != "blank"))
  {
    testIfWinHelper(board[0][0], "on the top row.");
  }
  else if((board[0][0] == board[1][0]) && (board[1][0] == board[2][0]) && (board[0][0] != "blank"))
  {
    testIfWinHelper(board[0][0], "on the left column.");
  }
  else if((board[0][0] == board[1][1]) && (board[1][1] == board[2][2]) && (board[0][0] != "blank"))
  {
    testIfWinHelper(board[0][0], "on the diagonal from the top left to the bottom right.");
  }
  else if((board[0][1] == board[1][1]) && (board[1][1] == board[2][1]) && (board[0][1] != "blank"))
  {
    testIfWinHelper(board[0][1], "on the middle column.");
  }
  else if((board[0][2] == board[1][2]) && (board[1][2] == board[2][2]) && (board[0][2] != "blank"))
  {
    testIfWinHelper(board[0][2], "on the right column.");
  }
  else if((board[1][0] == board[1][1]) && (board[1][1] == board[1][2]) && (board[2][0] != "blank"))
  {
    testIfWinHelper(board[1][0], "on the middle row.");
  }
  else if((board[2][0] == board[2][1]) && (board[2][1] == board[2][2]) && (board[2][0] != "blank"))
  {
    testIfWinHelper(board[2][0], "on the bottom row.");
  }
  else if((board[2][0] == board[1][1]) && (board[1][1] ==board[0][2]) && (board[2][0] != "blank"))
  {
    testIfWinHelper(board[2][0], "on the diagonal from the top right to bottom left.");
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
  'AMAZON.FallbackIntent': function(){
    this.response.speak("I didn't understand that, please try again.").listen("Please try again").listen("");
    this.emit(':responseReady');
  },
  
  'LaunchRequest': function() {
    this.response.speak("Welcome to Tic Tac Toe! Would you like to start a new game?").listen("What would you like to do?");
    this.emit(':responseReady');
  },

  //Handler for starting new game with blank board
  'NewGame': function () 
  {
    currentPlayer = "Player 1";
    currentShape = "o";
    board = [["blank", "blank", "blank"],
            ["blank", "blank", "blank"],
            ["blank", "blank", "blank"]];
    this.response.speak("New game started. Player one starts with X").listen("Player 1 Please go.");
    this.emit(":responseReady");
  },

  //Handler for adding X's and O's to the board
  'MakeMove': function()
  {
    if (this.event.request.intent.slots.position.value == null){
      this.response.speak("Please choose a valid board position.").listen("Say a board position. ");
      this.emit(":responseReady");
    }
    updatePlayer();
    requestedPosition = this.event.request.intent.slots.position.resolutions.resolutionsPerAuthority[0].values[0].value.id;
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
      requestedPosition = requestedPosition.replace("_", " ");
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
    this.response.speak(boardState).listen("").listen("");
    this.emit(":responseReady");
  },
};

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};