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


function Chat(props){


  const socket = openSocket("http://localhost:3001", {
  transports: ["websocket", "polling"]
});
// // const socket = openSocket ("wss://shawnyulingolabsmaster.herokuapp.com/",{
//   const socket = openSocket ("wss://localhost:3001",{

//     transports:["websocket","polling"]
// });
  const [interior, setInterior]= useState("off")
  const [curtain, setCurtain] = useState ("off")
  const [userName, setUserName] = useState("");
  const [turn, setTurn] = useState("on")
  const [tempUsername, setTempUsername] = useState ("");
  const [nameWarning, setNameWarning] = useState("off")

  const [users, setUsers] = useState([
    {name:"Marcel", id:0}, {name:"Leonora", id:1}, {name:"Max", id:2}, {name:"Andre", id:3},]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentdisplay, setCurrentDisplay]=useState("Write your first sentence please")
  const [allsentences, setAllsentences]=useState("")


  useEffect(() => {
    if(userName){}
    socket.on("connect", function () {
      console.log("clientsideworks")
    //   socket.emit("username", userName);
    });


    socket.on("users", (users) => {
      setUsers([...users, users]);
    });

    socket.on("message", (message) => {
      console.log(message);
      // var id = message.id
      // console.log(users[id])
      setMessages((messages) => [...messages, message]);
    });
    socket.on("connected", (user) => {
      setUsers((users) => [...users, user]);
    });

    socket.on("sentenceBroadcast", (sentence)=>{
      setCurrentDisplay(sentence.text);
      setAllsentences((allsentences) => [...allsentences, sentence.text
      ])
    });
    

    socket.on("disconnected", id => {
      setUsers((users) => {
        return users.filter((user) => user.id!==id);
      });
    });
  }, []);

 const handleNameInputChange = function(e){
   e.preventDefault();
   e.stopPropagation();
   setTempUsername(e.target.value);
   
 }

  const opencurtain = () =>{
    if(tempUsername==="Leonora"||tempUsername==="Max"||tempUsername==="Marcel"||tempUsername==="Andre"){
   setNameWarning("on");
   setInterval(() => {
     setNameWarning("off")
        
  }, 2000);
    }
    else if(tempUsername.length>0){
    setCurtain("on")
  setUserName(tempUsername)
  console.log(userName);
      setInterval(() => {
        setInterior("on")
        // console.log(userName);  
        socket.emit("username", userName);

        
      }, 2000);
  }
  }

  const handleMessageOut = (event) => {
    event.preventDefault();
    var newMessage = {
      message: message,
      username: userName,
    };
    socket.emit("send", newMessage);
    setMessage("");
  };
  // {"profileImage "+(imageDisplay==="invisible"? 'sleep':'activate' )}

  return (
    <div className="allContainer">
      <div className="exterior">
     <div className={"leftCurtain "+( curtain==="on"? "leftcurtainOn":"")}></div>
    <div className={"rightCurtain "+ (curtain==="on"? "rightCurtainOn":"")}></div>
      <div className={"nameInputDiv "+(curtain==="on"? " invisible":"")}>
        <div className="nameQuestion">
          Welcome dear visitor,
          what would you like to be called?
          </div>
        
          <input className="nameinput" type="text" onChange={handleNameInputChange}></input>
          <input type="submit" onClick = {opencurtain}></input>
          <div className={"nameWarning "+(nameWarning==="on"? "visible":"invisible")}>Sorry {tempUsername} is already playing</div>

          </div>
      </div>


      <div className="interior ">
      <div className={"title "+(interior==="on"?"visible": "invisible")}>
        <div><h1>OPPOSITES!</h1></div>
        <div>welcome {userName}</div>
        <div className="display ">{currentdisplay}</div>
      </div>
      <div className="result">
        
      </div>
    <input  className = "sentenceInput" type="text" placeholder="write your sentence please"></input>
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

            <input className="chatBox"
              type="text"
              placeholder="message"
              value={message}
              onChange={(event) => setMessage(event.currentTarget.value)}
            />
            <button className="chatBtn" onClick={handleMessageOut}>submit</button>

            <div className="remove">
              <h3>players in the room</h3>
              <ul id="users">
                {users.map(({ name, id }) => (
                  <li key={id}>{name}</li>
                ))}
              </ul>
            </div> 
        
         </div>
        </div>
        </div>  

     
   
  );
}

export default Chat;
