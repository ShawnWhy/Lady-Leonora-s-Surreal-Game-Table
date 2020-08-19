// require("dotenv").config();
// const compression = require("compression");
// const mongoose = require('mongoose')
// var session = require("express-session");
// mongoose.set('useCreateIndex', true)
// const passportControl = require('./lib/passport-control');
// const routes = require("./routes")
// const db= require("./db")
const express = require('express');
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io").listen(server, {
  transports: ["websocket", "polling"]
})

const PORT = process.env.PORT || 3001 ;


//  if (process.env.NODE_ENV === "production") {

  app.use(express.static("LingoLabsClient/build"));


  app.get("/", (req, res) => {
       res.sendFile(path.join(__dirname,  "LingoLabsClient/build", "index.html"));
   });

  // }

// app.use(express.static("LingoLabsClient/build"));
// app.get('/', function(req, res,next) {
//     res.sendFile(path.join(__dirname,  "LingoLabsClient/build", "index.html"));
// });
// app.get('/', function (req, res) {
//   console.log("Homepage");
//   res.sendFile(__dirname + '/LingoLabsClient/build/index.html');
// });
// app.use('/static', express.static('node_modules'));



app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(compression());

// app.use(
// 	session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
//   );
//   app.use(passportControl.initialize());
//   app.use(passportControl.session());
  
// Routers

// app.use(routes)



// app.use(function(err, req, res, next) {
// 	console.log('====== ERROR =======')
// 	console.error(err.stack)
// 	res.status(500)
// })
// app.use(function(req, res, next) {
// 		console.log('===== passport user =======')
// 		console.log(req.session)
// 		console.log(req.user)
// 		console.log('===== END =======')
// })










// Run server
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/LingoLabs", { useCreateIndex: true,
// useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify:false},);
// var mongooseConnectString = mongodbUri.formatMongoose(uri);
// mongoose.connect(mongooseConnectString,  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
// var cluster = mongoose.connection;
// cluster.on('error', console.error.bind(console, 'Connection error: '));
// cluster.once('open', function callback () {
//     console.log('Successfully connected to MongoDB');
// });

// db.UserInfo.create({username:"nobody", email:"somethng@smoething.com"},
// function(){db.Item.create({itemname:"Niko Site #1", price:1200.00})
// .then(({_id}) => db.UserInfo.findOneAndUpdate({username:"nobody"}, { $push: { shoppingcart: _id } }, { new: true },
// function(){db.Item.create({itemname:"Niko Site #2", price:1250.00, purchased:true,downloadlink:"https://github.com/ShawnWhy/movie-magic-Shawn/archive/master.zip" })
// .then(({_id}) => db.UserInfo.findOneAndUpdate({username:"nobody"}, { $push: { purchase: _id } }, { new: true },
// function(){db.Item.create({itemname:"Niko Site #5", price:1350.00, purchased:true,downloadlink:"https://github.com/ShawnWhy/movie-magic-Shawn/archive/master.zip" })
// .then(({_id}) => db.UserInfo.findOneAndUpdate({username:"nobody"}, { $push: { purchase: _id } }, { new: true },
// function(){db.Item.create({itemname:"Niko Site #6", price:1240.00})
// .then(({_id}) => db.UserInfo.findOneAndUpdate({username:"nobody"}, { $push: { shoppingcart: _id } }, { new: true },
// function(){db.Item.create({itemname:"Niko Site #7", price:1340.00})
// .then(({_id}) => db.UserInfo.findOneAndUpdate({username:"nobody"}, { $push: { shoppingcart: _id } }, { new: true },
// ))}
// ))}
// ))}
// ))}
// ))})

  



  
const users = {};
io.on("connection", client => {
  var i= 0;
  var sentences = [];
  client.on("username", username => {
    console.log(username)
    const user = {
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