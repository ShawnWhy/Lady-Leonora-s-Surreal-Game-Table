/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from "react";
// import API from "../../utils/API";
import Style from "./chat.css"
// import Moment from "react-moment";
import reactDOM from "react-dom";
import moment from "moment";
import io from "socket.io-client";
// import { set } from "mongoose";
import openSocket from 'socket.io-client';


function Chat(){


  const socket = openSocket("http://localhost:3001", {
  transports: ["websocket", "polling"]
});
// // const socket = openSocket ("wss://shawnyulingolabsmaster.herokuapp.com/",{
//   const socket = openSocket ("wss://localhost:3001",{

//     transports:["websocket","polling"]
// });

//turn interior stuffs on 
  const [interior, setInterior]= useState("off")
//turn curtains on and off
  const [curtain, setCurtain] = useState ("off")
 //username
  const [userName, setUserName] = useState("");
//set if it's teh client's turn to play
  const [turn, setTurn] = useState("on")
//variable used to test and set username
  const [tempUsername, setTempUsername] = useState ("");
//is username is of the surrealists, then they cannot use it 
  const [nameWarning, setNameWarning] = useState("off")
//this is the sentence used to pass on and play the game
  const [sentence, SetSentence] = useState("")
//this is used to display the first sentence  
  const [currentdisplay, setCurrentDisplay]=useState("Write your first sentence please")
//the list of users
  const [users, setUsers] = useState([
    {name:"Marcel", id:0}, {name:"Leonora", id:1}, {name:"Max", id:2}, {name:"Andre", id:3},]);
//if the user wants to communicate
    const [message, setMessage] = useState("");
//all the messages goto the message window
    const [messages, setMessages] = useState([]);
// this is the repository of all of the written sentences during the game
  const [allsentences, setAllsentences]=useState([])

// this happens automatically and changes when the 
//username changes
  useEffect(() => {
    if(userName){
    socket.on("connect", function () {
      console.log("clientsideworks")
      socket.emit("username", userName);
    });}
    //set all the users in the chatroom 
    socket.on("users", (users) => {
      setUsers( users);
    });
    //when receiving messages
    socket.on("message", (message) => {
      console.log(message);
      // var id = message.id
      // console.log(users[id])
      //push the message into the messages array
      setMessages((messages) => [...messages, message]);
    });
    // as other players connect to the server, the player's name is pushed into the list of players
    socket.on("connected", (user) => {
      setUsers((users) => [...users, user]);
    });

    //once this client receives the broadcasted sentence
    //the sentence is set as the display
    //sentence.player is the prodcasted next player in line
    //the sentence is also sent to the allsentences variable
    //if this client's username == the prodcasted name, 
    // the turn ariable is turned on and the player can type into the input div

    socket.on("sentenceBroadcast", (sentence)=>{
      console.log("newsentence")
      console.log(sentence.text);
      console.log(sentence.player)
      setCurrentDisplay(sentence.text);
      setAllsentences((allsentences) => [...allsentences, sentence.text
      ])
      if (sentence.player===userName){
        setTurn("on")
      }
      else{setTurn("off")}
    });
    
    //on another player's disconnect, the cient gets the emit, and rids the player
    //from the list
    socket.on("disconnected", id => {
      setUsers((users) => {
        return users.filter((user) => user.id!==id);
      });
    });
  }, [userName]);

//on the exterior, sets the username for this session
 const handleNameInputChange = function(e){
   e.preventDefault();
   e.stopPropagation();
   setTempUsername(e.target.value);
   
 }
//opens the curtian and begins the game
 const opencurtain = () =>{
   //the player cannot choose any of the surrelists' names
  if(tempUsername==="Leonora"||tempUsername==="Max"||tempUsername==="Marcel"||tempUsername==="Andre")
  {
  //if so, the thing warns you and then turns off right after
   setNameWarning("on");
   setInterval(() => {
   setNameWarning("off")
    }, 2000);
  }
  //if the thing has any thing init, the curtain is turned on
  else if(tempUsername.length>0){
    setCurtain("on")
    setUserName(tempUsername)
      // console.log(userName);
  //turns on and connects to socket.io after two seconds
    setInterval(() => {
      setInterior("on")
      // console.log(userName); 
      const socket = openSocket("http://localhost:3001", {
      transports: ["websocket", "polling"]
        }); 
       }, 2000);
    }
  }

  //emits the messageout
  const handleMessageOut = (event) => {
    event.preventDefault();
    event.stopPropagation();
    var newMessage = {
      message: message,
      username: userName,
    };
    socket.emit("send", newMessage);
    //then set the message variable to blank
    setMessage("");
  };

  //the ghost of surrelists past will speak to you
  const handleMessagetoGhostOut = (event)=>{
    event.preventDefault();
    event.stopPropagation();
    var newMessage = {
      message: message,
      username: userName,
      };
      socket.emit("sendToghost", newMessage);
      //then set the message variable to blank
      setMessage("");
    };

  

  //takes the value from the sentence input and sets it as a variable ready to emit
  const TypeSentence = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    SetSentence(e.target.value);
  }

  //emits the sentence
  const submitSentence = ()=>{
    console.log("sending sentence")
    console.log(sentence)
    socket.emit("sentence",sentence )
  }
  // {"profileImage "+(imageDisplay==="invisible"? 'sleep':'activate' )}

return (
//everything
<div className="allContainer">
{/* the curtain and the name block */}
  <div className="exterior">
    <div className={"leftCurtain "+( curtain==="on"? "leftcurtainOn":"")}></div>
    <div className={"rightCurtain "+ (curtain==="on"? "rightCurtainOn":"")}></div>
    {/* name input section */}
    <div className={"nameInputDiv "+(curtain==="on"? " invisible":"")}>
        <div className="nameQuestion">
          Welcome dear visitor,
          what would you like to be called?
          </div>
          {/* input it self */}
          <input className="nameinput" type="text" onChange={handleNameInputChange}></input>
          <input type="submit" onClick = {opencurtain}></input>
          {/* the warning div */}
          <div className={"nameWarning "+(nameWarning==="on"? "visible":"invisible")}>Sorry {tempUsername} is already playing</div>

    </div>
  </div>

  {/* this is the room */}
  <div className="interior ">
    <div className="finalPoem">
    <ul id="users">
                
                {allsentences.map((sentence, index) => (
                  <li key={index}>{sentence}</li>
                ))}
              </ul>

    </div>
      <div className={"title "+(interior==="on"?"visible": "invisible")}>
        <div><h1>OPPOSITES!</h1></div>
        <div>welcome {userName}</div>
        {/* the game sentence display would go here */}
        <div className="display ">{currentdisplay}</div>
      </div>
    <div>
      {/* this is the input div for the sentence, will only be visible when turn is on */}
      <input  className = {"sentenceInput "+(turn==="on"?"visible": "invisible")} onChange={TypeSentence} type="text" placeholder="write your sentence please"></input>
      <button className={"submitbutton "+(turn==="on"?"visible": "invisible")} onClick={submitSentence}>broadcast Sentence</button>
      {/* this is the button to skip to the next player */}
      <button className="turnButtom" onClick={submitSentence}>submit Sentence</button>
    </div>
    
    {/* this is the window for chatting with either players or ghosts of the surrealists  */}
    <div className="sidenavchat"> 
      <div className="chatWindow">
          {!messages.length ? (
                <h1 className="chat-title">Speak Easy</h1>
                 ) : (
                 <div> 
                  {messages.map(({ user, date, text }, index) => (
                    <div
                      key={index}
                    
                      className={user === userName ? "toLeft" : "toRight"}
                    >
                      {user}: {text}{" "}
                    </div>
                  ))}
                </div>
              )}
            </div>
       <div>
         {/* the window to type in message */}
            <input className="chatBox"
              type="text"
              placeholder="message"
              value={message}
              onChange={(event) => setMessage(event.currentTarget.value)}
            />
            <button className="chatBtn" onClick={handleMessageOut}>speak</button>
            <button className="chatBtn" onClick={handleMessagetoGhostOut}>speak with ghost</button>
            
             <div className="roster">
               {/* the roster with ghost  */}
              <h3>players in the room</h3>
                <ul id="users">
                <li>Marcel</li>
                <li>Max</li>
                <li>Andre</li>
                {users.map(({ name, id }) => (
                  <li key={id}>{name}</li>
                ))}
              </ul>
          </div> 
        </div>
  </div>
</div>
</div>  
);
}

export default Chat;
