
const express = require('express');
const quotes = require("./utility/quotes")
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server, {
  transports: ["websocket", "polling"]
})

const PORT = process.env.PORT || 3001 ;
// players with custom IDs
  const users ={}  
//   all of the players names in an array
  //player's turn
  var i= 0;
  //all of the sentences
  var sentences = [];





  io.on("connection", client => {
//    
    //the client is to receive a username
  client.on("username", username => {
    console.log("username received")
    console.log(username);
    user = {
      name: username,
      id: client.id
    };
    users[client.id] = user;
    io.emit("connected", user);
    io.emit("users", Object.values(users));
    // players.push(username)
    console.log("player1")
    var players = Object.values(users)
    if(players[0]){
    console.log(players[0].name)}
    
    //if there are more than one player in the room the game automatically starts
    if(Object.values(users).length>3){
        console.log("start");
        var players = Object.values(users)
      io.emit("start", players[i].name)
      i++
      if( i > users.length-1){
        i=0;    
      }
    }
  });
  //when a player emit a sentence, it is received here and is broadcasted to others
  client.on("sentence", sentence=>{
      console.log("received sentence")
      console.log(sentence)
      console.log(i)
    sentences.push(sentence);
    var players = Object.values(users)

    //broadcasted to otheres and also emit the next player in line to others
    io.emit("sentenceBroadcast",{
      text:sentence,
      player:players[i].name
    })
    console.log("server emitted")
    i++
    if(i>players.length-1){
        i=0
    }
})

//the server receives the message
  client.on("send", message => {
    //   console.log(message)
    //server emit the message to other players
    io.emit("message", {
      text: message.message,
      date: new Date().toISOString(),
      user: message.username
    });
  });

  client.on("disconnect", () => {
    var username = users[client.id];
    // username = username.username;
    console.log("loggedout")
    console.log(username)
    delete users[client.id];
    io.emit("disconnected", client.id);
  });

client.on("sendToGhost", (message)=>{
  console.log("ghost received")
  console.log(message);
  io.emit
  io.emit("message", {
    text: message.message,
    date: new Date().toISOString(),
    user: message.username
    
  });
  setTimeout(() => {
  var quoteLength = quotes.length-1;
  var randomNumber = Math.floor(Math.random() * quoteLength)
  var ghostMessage = quotes[randomNumber]
  io.emit("message",{
    text:ghostMessage.quote,
    date: new Date().toISOString(),
    user:ghostMessage.name

  })
    
  }, 100);
  
  
})
});

// users.filter((user) => user.id!==id);
  

server.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
  
  });