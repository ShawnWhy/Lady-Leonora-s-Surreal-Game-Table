# Lady-Leonora-s-Surreal-Game-Table
Play Surrealist Games Across the Internet with Friends!


the player goes on to the page and input their preferred name to connect.

the name cannot  be Leonora, Max, Marcel or Andre.

once connected, the user interface will change,  opens the curtain and photographs of Leonora, max, marcel and Andre Masson will appear in front. 

their names will appear on the list of players.

socket. emit ("username", Input)
and then the socket server will emit it to everyother player connected. 
once the user receives the "users" 
socket.on("users", ) the UI will put the name into the names awway and it 
will be displayed in the roster. 
the player chooses player photo and join in. 

the first in the roster will be the one 
on connect, if the players exceed 6 people, ( 2 people, )

socket.emit start and the game wll start.
server will emit "start"
upon receiving start, the first player in the roster will have their name emitted by the server. 
upon receiving the name, the player with the matching name 
will have their imput window appearing before them.

upon submit, the player will emit "sentence" upon receiving, the server will brodcast the sentence and the username of the next one in line.

upon receiving the sent sentence, all teh players will have the send sentence as a "displayed" in teh center of table. if username===sentenceBroadcast, writing window appear. 

once the player is done, clicks sent and emit another "sentence"

at anytime, the player can review unveil the whole text and download it

this is to be done useing data.url data: