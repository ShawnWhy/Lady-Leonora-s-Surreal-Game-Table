
const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server, {
  transports: ["websocket", "polling"]
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("leonorasgamingtable/build"));


const PORT = process.env.PORT || 3001 ;
  const users ={}
  const players = []
  var i= 0;
  var sentences = [];

io.on("connection", client => {
  console.log("serverworks")
  

  client.on("username", username => {
    console.log("usernameworks")
    user = {
      name: username,
      id: client.id
    };
    users[client.id] = user;
    io.emit("connected", user);
    io.emit("users", Object.values(users));
    players.push(username)

    if(users.length>2){
      io.emit("start", users[i].username)
      i++
      if( i > users.length-1){
        i=0;
      }
    }
  });

  client.on("sentence", sentence=>{
    sentences.push(sentence);
    io.emit("SentenceBroadcast",{
      text:sentence,
      player:users[i].username

    })

  })

  

  client.on("send", message => {
    io.emit("message", {
      text: message.message,
      date: new Date().toISOString(),
      user: message.username
    });
  });

  client.on("disconnect", () => {
    const username = users[client.id];
    delete users[client.id];
    io.emit("disconnected", client.id);
    players.filter((player)=>player!==username);
  });
});

// users.filter((user) => user.id!==id);
  

server.listen(PORT, function() {
	console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
  });