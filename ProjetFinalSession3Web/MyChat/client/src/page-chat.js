import {registerCallbacks, sendMessage, signout, chatMessageLoop} from './chat-api';
import { Background } from './sprites/Background.js';
import { tileSize, gameLoop, mouseAttack, keyboardInputs } from './page-index.js';
import { Ground } from './sprites/Foreground.js';
import { Barrel, Boss, Mob } from './sprites/Ennemies.js';
import { Board } from './sprites/Objects.js';

const nbTiles = 38;
let background = []; //Let's us handle the moving background
let currentMembers = []; //Contains the list of connected users
let shownMembersNode = []; //Containes the list of all members node
let shownMembers = []; //Refreshes the members list
let levelLimits = []; //Contains a list of borders and such
let player = []; //Contains the player
let tiles = []; //Contains all the tiles 
let ennemies = []; //Contains a list of all ennemies
let objects = []; //Contains a list of all objects
let gameState = { //Can the player play (Needs to be an object, as otherwise it is not modified within the function using it)
    playing : true,
    delay : "",
    respawn : 0 //Determines the players respawn point 
}
let userMessage = null; //Contains the message of the user as it was written
let modifiedUserMessage = ""; //Contains the modified message with the name of the user highlighted
let user = null; //Contains the name of the user which typed a message
let userHighlight = false; //Let's us highlight the name of users in message
let userToBeHighlighted = ""; //Let's us highlight the name of the user in question 
let command = false; //Let's us know if a command has been inputed
let commandLine = ""; //Let's us determine which command
let possibleCommands = ["barrel", "Barrel", "boss", "Boss", "mob", "Mob"]; //Possible lines of commands to be inputed
let charAfter = null; //Let's us not lose the next char in the process of highlighting the user
let messageNode = null; //Let's us manipulate the dom to print the message on screen 
let chatZone; //Node for the writable chat space
let chat; //Contains the node of the entire chat including the buttons and such 
let membersZone; //Contains the node of the active members zone
let textarea; //Contains the node of the text area
let showMembersBtn; //Contains the node of the show members button>
let level = 2; //Current level

window.addEventListener("load", () => {
    document.querySelector("textarea").onkeyup = function (evt) {
        sendMessage(evt, this);
    };
    document.querySelector("#send-msg-btn").onclick = function (evt) {
        sendMessage(evt, document.querySelector("textarea"));
        // this.blur(); Can't use that for some reason makes other buttons glitch out 
    };
    document.querySelector("#sign-out-btn").onclick = signout;
    registerCallbacks(newMessage, memberListUpdate);
    chatMessageLoop();

    for(let i = 1; i <= 5; ++i){ //Creates the moving background
        background.push(new Background(i));
    }

    for(let i = 0; i <= nbTiles; ++i){
        if(i == 0){
            levelLimits.push(tiles.length);
            tiles.push(new Ground(tiles.length, 4, tileSize * i, tileSize * -2, true));
        }

        if(i > 0 && i < nbTiles){
            tiles.push(new Ground(tiles.length, 5, tileSize * i, tileSize * -2, true))
        }

        if(i == nbTiles){
            levelLimits.push(tiles.length);
            tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * -2, true));
        }
    }

    objects.push(new Board(objects.length, 4, tileSize * -2, tileSize, "<div>List of <b>Possible Commands :</b> <div> -<b>/" + possibleCommands[1] +"</b> or <b>/" + possibleCommands[0] + "</b> </div> <div> -<b>/" + possibleCommands[3] +"</b> or <b>/" + possibleCommands[2] + "</b> </div> <div> -<b>/" + possibleCommands[5] +"</b> or <b>/" + possibleCommands[4] + "</b> </div>", "", ""));

    chatZone = document.querySelector("#vue-container"); //Obtention of all the nodes 
    chat = document.querySelector("#chat");
    membersZone = document.querySelector("#show-members");
    textarea = document.querySelector("textarea");
    showMembersBtn = document.querySelector("#show-members-btn");

    textarea.onfocus = () =>{ //The character can't move if the player is typing 
        gameState.playing = false;
        player[0].moveRight = false;
        player[0].moveLeft = false;
        player[0].moveRunning = false;
    }
    textarea.onblur = () =>{
        gameState.playing = true;
        textarea.blur();
    }

    showMembersBtn.onmousedown = () =>{
        if(membersZone.style.display == "none"){
            textarea.style.width = "45vw";
            membersZone.style.display = "block";
            showMembersBtn.innerHTML = "Hide members";
        }
        else{
            membersZone.style.display = "none";
            textarea.style.width = "60vw";
            showMembersBtn.innerHTML = "Show members";
        }
    }

    mouseAttack(gameState, player);
    keyboardInputs(gameState, player, objects);

    tick();
})

// Lorsqu'un nouveau message doit être affiché à l'écran, cette fonction est appelée
const newMessage = (fromUser, message, isPrivate) => {
    user = fromUser;
    userMessage = message;
}

// À chaque 2-3 secondes, cette fonction est appelée. Il faudra donc mettre à jour la liste des membres
// connectés dans votre interface.
const memberListUpdate = members => {
    currentMembers = members; 
}

const tick = () =>{
    chat.style.left = window.innerWidth/5 + "px"; //Makes sure that the chat stays centered 

    gameLoop(level, background, player, tiles, objects, ennemies, levelLimits, gameState);

    if(userMessage != null && user != null){ //Prints the users message in the chatZone
        messageNode = document.createElement("div");
        for(let i = 0; i < userMessage.length; ++i){
            if(!userHighlight && !command){ //Adds the message letter by letter to a new string 
                modifiedUserMessage += userMessage[i];
            }

            if(userHighlight && userMessage[i] != " " && userMessage[i] != "\t"){ //As long as we're adding the username keep going 
                userToBeHighlighted += userMessage[i];
            }

            if(userHighlight && (userMessage[i] == " " || userMessage[i] == "\t" || i == userMessage.length - 1)){ //Adds the highlighted username to the message
                charAfter = userMessage[i]; //Makes sure that the char after the user name is added to the final message

                currentMembers.forEach(e => {
                    if(userHighlight && (e == userToBeHighlighted || userToBeHighlighted == "all" || userToBeHighlighted == "tous")){
                        modifiedUserMessage += "<div class='highlighted-user'> " + userToBeHighlighted + "</div>";
                        userHighlight = false;
                        userToBeHighlighted = "";
                    }
                });

                if(userHighlight){ //If it wasnt a username after the @
                    modifiedUserMessage += userToBeHighlighted;
                    userHighlight = false;
                    userToBeHighlighted = "";
                }
            }

            if(command && userMessage[i] != " " && userMessage[i] != "\t"){
                commandLine += userMessage[i];
            }

            if(command && (userMessage[i] == " " || userMessage[i] == "\t" || i == userMessage.length - 1)){
                charAfter = userMessage[i]; //Makes sure that the char after the command is added to the final message

                if(commandLine == possibleCommands[0] || commandLine == possibleCommands[1]){ //Spawns barrels
                    let flippedValue = Math.random();
                    if(flippedValue > 0.5){
                        flippedValue = true;
                    }
                    else{
                        flippedValue = false;
                    }
                    ennemies.push(new Barrel(ennemies.length, (Math.random() * tileSize) * (Math.random() * nbTiles), 0, flippedValue));
                }
                else if(commandLine == possibleCommands[2] || commandLine == possibleCommands[3]){ //Let's us spawn a boss
                    let bossCounter = 0;
                    ennemies.forEach(e => {
                        if(e.type == "Boss"){ 
                            ++bossCounter;
                        }
                    });
                    if(bossCounter < 1){ //Spawns a boss if one is not already spawned in 
                        ennemies.push(new Boss(ennemies.length, (Math.random() * tileSize) * Math.random() * nbTiles, levelLimits[0], level, levelLimits));
                    }
                }
                else if(commandLine == possibleCommands[4] || commandLine == possibleCommands[5]){
                    let mobCounter = 0;
                    ennemies.forEach(e => {
                        if(e.type == "Mob"){
                            ++mobCounter;
                        }
                    })
                    if(mobCounter < 5){
                        let flipped = Math.random();
                        flipped > 0.5 ? flipped = true : flipped = false;
                        ennemies.push(new Mob(ennemies.length, (Math.random() * tileSize) * Math.random() * nbTiles, levelLimits[0], Math.random(), level, levelLimits, flipped));
                    }
                }

                modifiedUserMessage += commandLine;
                command = false;
                commandLine = "";
            }

            if(charAfter != null && i != userMessage.length - 1){ //Adds the char after the username or command
                modifiedUserMessage += userMessage[i];
                charAfter = null;
            }

            if(userMessage[i] == "@"){ //Starts the check for the username
                userHighlight = true;
            }

            if(userMessage[i] == "/"){
                command = true;
            }
        }

        messageNode.innerHTML = "<i>" + user + "</i>: " + modifiedUserMessage;
        messageNode.classList.add("message");
        chatZone.append(messageNode);

        chatZone.scrollTop = chatZone.scrollHeight; //Permet de scroll à la fin du div quand un nouveau message aparait

        userMessage = null; //Resets everything to their orginal value to get ready for the next message
        user = null;
        messageNode = null;
        charAfter = null;
        modifiedUserMessage = "";
        userToBeHighlighted = "";
    }

    if(shownMembers != currentMembers || shownMembersNode.length != shownMembers){
        shownMembersNode.forEach(e => {
            e.remove();
        });

        shownMembersNode = [];
        shownMembers = currentMembers;

        for(let i = 0; i < shownMembers.length; ++i){
            shownMembersNode[i] = document.createElement("div");
            shownMembersNode[i].classList.add("members");
            shownMembersNode[i].append(shownMembers[i]);
            membersZone.append(shownMembersNode[i]);
        }
    }
    
    window.requestAnimationFrame(tick);
}
