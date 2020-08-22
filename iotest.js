const io = require('socket.io-client');
const  openSocket = require('socket.io-client');




const socket = openSocket ("wss://localhost:3001",{

    transports:["websocket","polling"]
});


socket.on("connect", function () {
    console.log("clientsideworks")
  //   socket.emit("username", userName);
  });
