"use strict";

var Alexa = require("alexa-sdk");

//The board is split up into three arrays of values row1, row2, and row3. These will be
//made into a two dimensional array in a later version, but are broken up now for easier
//troubleshooting.
var row1 = ["blank", "blank", "blank"];
var row2 = row1;
var row3 = row1;

var handlers = {

  //Handler for app startup
  'LaunchRequest': function()
  {
  },

  //Handler for starting new game with blank board
  'NewGame': function () 
  {
  },

  //Handler for selecting Easy, Normal or Hard
  'SelectDifficulty': function()
  {
  },

  //Handler for adding X's and O's to the game board
  'MakeMove': function()
  {
  },

}

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};