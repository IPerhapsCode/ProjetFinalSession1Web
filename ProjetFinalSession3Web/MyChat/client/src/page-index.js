import { signin } from './chat-api';
import { Background } from './sprites/Background.js';
import { Player, bottomCharacterLimit, topCharacterLimit, leftCharacterLimit, rightCharacterLimit } from './sprites/Player.js';
import { Ground } from './sprites/Foreground.js';
import { Board, Ladder, Treadmill, Platform } from './sprites/Objects.js';
import { Barrel, Hammer } from './sprites/Ennemies.js';
//On peut fill in certaines section de la page index durant le prochain cours, autrement congrats ta enfin fini:)
//J'ai besoin que le player soit devant le message, que le message soit devant le hammer, mais que le hammer soit devant le player, semblerait qu'il va falloir demander au prof parce que j'ai aucune idée
const backgroundElements = 5;
export const tileSize = 67;
let titleOpacity = 1; //Let's us change the opacity of the title of the form
let titleOpacitySpeed = 0.005;
let background = []; //Contains the moving background
let tiles = []; //Contains all the tiles 
let player = []; //Contains the player
let objects = []; //Contains a list of all objects
let ennemies = []; //Contains a list of all ennemies
let levelLimits = []; //Contains a list of borders and such
let gameState = { //Can the player play, player death timer, players respawn point (Needs to be an object otherwise it is not passed via reference inside the function and the value is then not modified by the function)
    playing : true,
    delay : "",
    respawn : 0 
}
let windowWidth; //Current window width
let windowHeight; //Current window height
let form; //Node for the login form
let game; //Node for the game div
let inputUsername; //Node for the username input
let inputPassword; //Node for the password input
let backgroundZone; //Node for the background zone div
let title; //Node for the title of the form 
let level = 0; //Current level

window.addEventListener("load", () => {
    windowWidth = window.innerWidth; //Important data
    windowHeight = window.innerHeight;
    if(document.querySelector("#index-main")){
        document.querySelector("form").onsubmit = function () {
            localStorage.setItem("username", inputUsername.value);
            return signin(this);
        }

        form = document.querySelector("#login-form"); 
        game = document.querySelector("#game");
        inputUsername = document.querySelector("#username");
        inputUsername.value = localStorage["username"]; //Permet d'afficher le nom de l'usager qui a été rentré préalablement quand on revient sur la page index
        inputPassword = document.querySelector("#password");
        backgroundZone = document.querySelector("#background-zone");
        title = document.querySelector(".input-zone-title");
    
        for(let i = 1; i <= backgroundElements; ++i){ //Creates the moving background
            background.push(new Background(i));
        }
    
    
        for(let i = 0; i <= 66; ++i){ //Creates the level Ground and tiles(position in array, model, x position, y position, walkable), Objects(position in array, model, x position, y position)
            if(i == 0){
                levelLimits.push(tiles.length);
                tiles.push(new Ground(tiles.length, 4, i, tileSize * 13, true)); 
                tiles.push(new Ground(tiles.length, 22, i, tileSize * 12, true));
                objects.push(new Board(objects.length, 4, tileSize * i, bottomCharacterLimit * 7.15, "<div>Use <b>A</b> and <b>D</b> to move, <b>Shift</b> to run, <b>E</b> to interact with objects and <b>SpaceBar</b> to jump!</div>", "<div>Hey there friendo, how you doing?</div>", "<div>Hope you have fun playing!</div>"));
                levelLimits.push(tiles.length);
                tiles.push(new Ground(tiles.length, 4, i, tileSize * 6, true)); 
                tiles.push(new Ground(tiles.length, 22, i, tileSize * 5, true)); 
                levelLimits.push(tiles.length);
                tiles.push(new Ground(tiles.length, 4, i, tileSize * -1, true));
                tiles.push(new Ground(tiles.length, 13, i, tileSize * -2, false));
                tiles.push(new Ground(tiles.length, 13, i, tileSize * -3, false));
            }
    
            if(i > 0 && i <= 27){
                tiles.push(new Ground(tiles.length, 5, tileSize * i, tileSize * 13, true));
                tiles.push(new Ground(tiles.length, 23, tileSize * i, tileSize * 12, true));
            }
    
            if(i == 2){
                ennemies.push(new Barrel(ennemies.length, tileSize * i, 4, true)); //Y value needs to be 0 2 or 4
            }
    
            if(i == 4){
                ennemies.push(new Barrel(ennemies.length, tileSize * i, 4, false)); //Y value needs to be 0 2 or 4
            }
    
            if(i == 5){
                objects.push(new Board(objects.length, 2, tileSize * i, tileSize * 8, "<div>Try pressing the <b>SpaceBar</b> in mid air to do a double jump!</div>", "", ""));
                ennemies.push(new Barrel(ennemies.length, tileSize * i, 4, false)); //Y value needs to be 0 2 or 4
            }
    
            if(i <= 6 && i > 0){
                tiles.push(new Ground(tiles.length, 5, tileSize * i, tileSize * 6, true));
                tiles.push(new Ground(tiles.length, 23, tileSize * i, tileSize * 5, true));
            }
    
            if(i == 7){
                objects.push(new Board(objects.length, 1, tileSize * i, tileSize * 1, "<div>Use <b>Q</b>, <b>MouseButton1</b> or <b>MouseButton2</b> to attack ennemies!</div>", "", ""));
                tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * 6, true));
                tiles.push(new Ground(tiles.length, 24, tileSize * i, tileSize * 5, true));
            }
    
            if(i <= 15 && i > 0){
                tiles.push(new Ground(tiles.length, 5, tileSize * i, tileSize * -1, true));
            }
    
            if(i == 16){
                tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * -1, true));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * -2, false));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * -3, false));
                objects.push(new Ladder(objects.length, 2, tileSize * i, 0, false));
                objects.push(new Ladder(objects.length, 1, tileSize * i, tileSize, false));
                objects.push(new Ladder(objects.length, 1, tileSize * i, tileSize * 2, false));
                objects.push(new Ladder(objects.length, 2, tileSize * i, tileSize * 3, false));
                objects.push(new Ladder(objects.length, 1, tileSize * i, tileSize * 4, false));
                objects.push(new Ladder(objects.length, 2, tileSize * i, tileSize * 5, false));
                objects.push(new Ladder(objects.length, 3, tileSize * i, tileSize * 6, false));
                tiles.push(new Ground(tiles.length, 1, tileSize * i, tileSize * 6, true));
            }
    
            if(i == 17){
                tiles.push(new Ground(tiles.length, 14, tileSize * i, tileSize * -1, false));
                tiles.push(new Ground(tiles.length, 22, tileSize * i, 0, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 1, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 2, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 3, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 4, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 5, true));
                tiles.push(new Ground(tiles.length, 4, tileSize * i, tileSize * 6, true));
            }
    
            if(i >= 18 && i <= 44){
                tiles.push(new Ground(tiles.length, 5, tileSize * i, tileSize * 6, true));
            }
    
            if(i == 26){
                objects.push(new Board(objects.length, 3, tileSize * i, tileSize * 8, "<div>Be cautious of <b>Environmental Hazards</b>!</div>", "", ""));
            }
    
            if(i == 28){
                tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * 13, true));
                tiles.push(new Ground(tiles.length, 24, tileSize * i, tileSize * 12, true));
            }
    
            if(i == 29){
                objects.push(new Ladder(objects.length, 2, tileSize * i, tileSize * 7, true));
                objects.push(new Ladder(objects.length, 1, tileSize * i, tileSize * 8, true));
                objects.push(new Ladder(objects.length, 1, tileSize * i, tileSize * 9, true));
                objects.push(new Ladder(objects.length, 2, tileSize * i, tileSize * 10, true));
                objects.push(new Ladder(objects.length, 1, tileSize * i, tileSize * 11, true));
                objects.push(new Ladder(objects.length, 2, tileSize * i, tileSize * 12, true));
                objects.push(new Ladder(objects.length, 3, tileSize * i, tileSize * 13, true));
                tiles.push(new Ground(tiles.length, 1, tileSize * i, tileSize * 13, true));
            }
    
            if(i == 32){
                levelLimits.push(tiles.length);
                tiles.push(new Ground(tiles.length, 22, tileSize * i, tileSize * 12, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 13, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 14, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 15, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 16, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 17, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 18, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 19, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 20, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 21, true));
                tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 22, true));
                tiles.push(new Ground(tiles.length, 4, tileSize * i, tileSize * 23, true));
            }
    
            if(i >= 33 && i <= 50){
                tiles.push(new Ground(tiles.length, 5, tileSize * i, tileSize * 23, true))
                tiles.push(new Ground(tiles.length, 23, tileSize * i, tileSize * 12, true));
            }
    
            if(i == 32){
                ennemies.push(new Hammer(ennemies.length, tileSize * i * 1.025, levelLimits[3])) //Needs the y position of said tile in levelLimits
                tiles.push(new Ground(tiles.length, 2, tileSize * (i + 1), tileSize * 11, true)); //The next few blocks makes it so you cant clip in the hammer 
                tiles.push(new Ground(tiles.length, 2, tileSize * (i + 1), tileSize * 10, true));
                tiles.push(new Ground(tiles.length, 2, tileSize * (i + 2), tileSize * 11, true));
                tiles.push(new Ground(tiles.length, 2, tileSize * (i + 2), tileSize * 10, true));
                objects.push(new Treadmill(objects.length, 1, tileSize * i, tileSize * 6, false));
            }
    
            if(i == 36 || i == 40){
                ennemies.push(new Hammer(ennemies.length, tileSize * i * 1.025, levelLimits[3])) //Needs the y position of said tile in levelLimits
                tiles.push(new Ground(tiles.length, 2, tileSize * (i + 1), tileSize * 11, true)); //The next few blocks makes it so you cant clip in the hammer 
                tiles.push(new Ground(tiles.length, 2, tileSize * (i + 1), tileSize * 10, true));
                tiles.push(new Ground(tiles.length, 2, tileSize * (i + 2), tileSize * 11, true));
                tiles.push(new Ground(tiles.length, 2, tileSize * (i + 2), tileSize * 10, true));
            }
    
            if(i > 32 && i < 43){
                objects.push(new Treadmill(objects.length, 2, tileSize * i, tileSize * 6, false));
            }
    
            if(i == 43){
                objects.push(new Treadmill(objects.length, 3, tileSize * i, tileSize * 6, false));
            }
    
            if(i >= 45 && i <= 50){
                tiles.push(new Ground(tiles.length, 2, tileSize * i, tileSize * 6, true));
                objects.push(new Platform(objects.length, tileSize * i, tileSize * 6, Math.abs(i - 50), tiles[tiles.length - 1].id));
            }
    
            if(i == 51){
                tiles.push(new Ground(tiles.length, 24, tileSize * i, tileSize * 12, true));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 13, true));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 14, true));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 15, true));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 16, true));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 17, true));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 18, true));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 19, true));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 20, true));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 21, true));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 22, true));
                tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * 23, true));
                tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * 6, true));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 5, true));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 4, true));
                tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 3, true));
                tiles.push(new Ground(tiles.length, 24, tileSize * i, tileSize * 2, true));
                tiles.push(new Ground(tiles.length, 14, tileSize * i, tileSize * 1, false));
            }
    
            if(i == 52){
                tiles.push(new Ground(tiles.length, 4, tileSize * i, tileSize * 1, true));
                objects.push(new Ladder(objects.length, 1, tileSize * i, tileSize * 2, true));
                objects.push(new Ladder(objects.length, 2, tileSize * i, tileSize * 3, true));
                objects.push(new Ladder(objects.length, 2, tileSize * i, tileSize * 4, true));
                objects.push(new Ladder(objects.length, 1, tileSize * i, tileSize * 5, true));
                objects.push(new Ladder(objects.length, 3, tileSize * i, tileSize * 6, true));
                tiles.push(new Ground(tiles.length, 1, tileSize * i, tileSize * 6, true));
            }
    
            if(i > 52 && i < 66){
                tiles.push(new Ground(tiles.length, 5, tileSize * i, tileSize * 1, true));
            }
    
            if(i == 57){
                levelLimits.push(tiles.length);
                tiles.push(new Ground(tiles.length, 2, tileSize * i, tileSize * 10, false));
            }
    
            if(i == 64){
                objects.push(new Board(objects.length, 5, tileSize * i, bottomCharacterLimit * 1.6, "<div>The <b>Holy Form</b> has been awating you!</div>", "<div>Try and put your <b>Mouse Cursor</b> over it...</div>", "<div>I am so <b>Old</b> :(</div>"));
            }
    
            if(i == 66){
                levelLimits.push(tiles.length);
                tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * 1, true));
            }
        }
    
        form.onmouseover = () => { //When the user touches the form with his mouse, the player caracter is static, and the background blurs
            gameState.playing = false;
            game.style.filter = "blur(3px)";
            backgroundZone.style.filter = "blur(3px)";
            player[0].moveRight = false;
            player[0].moveLeft = false;
            player[0].moveRunning = false;
        }
        form.onmouseout = () => { //When the users mouse mooves out of the form, the player caracter can move, there's no more focus on a an input field and the background unblurs
            gameState.playing = true;
            game.style.filter = "none";
            backgroundZone.style.filter = "none";
            inputUsername.blur();
            inputPassword.blur();
        }
    
        mouseAttack(gameState, player);
        keyboardInputs(gameState, player, objects);
        
        tick();
    }
});

export const mouseAttack = (gameState, player) =>{
    document.querySelector("body").onmousedown = (e) =>{
        if(gameState.playing){
            if(e.button == 0){ 
                if(!player[0].running && !player[0].jumping && !player[0].punch && !player[0].attackTwo && !player[0].climbing){
                    player[0].attackOne = true;
                }
                else if(player[0].running && !player[0].jumping && !player[0].punch && !player[0].attackTwo && !player[0].climbing){
                    player[0].punch = true;
                }
            }
            else if(e.button == 2){
                if(!player[0].running && !player[0].jumping && !player[0].punch && !player[0].attackOne && !player[0].climbing){ 
                    player[0].moveRight = false;//Makes sure that the animation plays witouth the player moving as this is a channeling attack
                    player[0].moveLeft = false;
                    player[0].running = false;
                    player[0].moving = false;
                    player[0].attackTwo = true;
                }
            }
        }
    }
}

export const keyboardInputs = (gameState, player, objects) => {
    window.addEventListener("keydown", (e) => {
        if(!e.repeat && gameState.playing){
            if((e.key == "d" || e.key == "D")  && !player[0].moveLeft && !player[0].climbing && !player[0].attackTwo){
                player[0].moveRight = true;
                player[0].tiledImage.setFlipped(false);
            }

            if((e.key == "a" || e.key == "A") && !player[0].moveRight && !player[0].climbing && !player[0].attackTwo){
                player[0].moveLeft = true;
                player[0].tiledImage.setFlipped(true);
            }

            if(e.key == "Shift"){
                if(!player[0].jumping && !player[0].falling && !player[0].attackTwo){
                    player[0].running = true;
                }
            }

            if(e.key == " " && !player[0].doublejump){
                if(player[0].jumping || player[0].falling){
                    player[0].jumping = true;
                    player[0].doublejump = true;
                }
                if(!player[0].jumping && !player[0].attackTwo){
                    player[0].jumping = true;
                    player[0].climbing = false;
                    player[0].climbingCheck = false;
                }
            }

            if(e.key == "q" || e.key == "Q"){
                if(!player[0].jumping && !player[0].attackOne && !player[0].attackTwo && !player[0].climbing){
                    player[0].punch = true;
                }
            }

            if(e.key == "e" || e.key == "E"){
                let checkOnce = false; //If we found the interractible object no need to check twice 
                objects.forEach(e => { //Makes sure the player is on the ladder before climbing 
                    if(!checkOnce 
                        && e.type == "LadderTop" 
                        && e.y - e.baseY < player[0].y + topCharacterLimit
                        && ((player[0].x + rightCharacterLimit >= e.x && player[0].x + rightCharacterLimit <= e.x + tileSize) //Makes sure at least the left or right side of the player is on the block
                        || (player[0].x + leftCharacterLimit >= e.x && player[0].x + leftCharacterLimit <= e.x + tileSize))){
                        checkOnce = true;
                        player[0].moveRight = false; //Player is not supposed to move while on the ladder
                        player[0].moveLeft = false;
                        player[0].climbing = true; 

                        if(!e.tiledImage.flipped){
                            player[0].x = e.x - tileSize / 1.33; //Makes sure the player looks to be on the ladder when climbing
                        }
                        else{
                            player[0].x = e.x - tileSize / 1.9; //Makes sure the player looks to be on the ladder when climbing 
                        }
                    }
                    else if(!checkOnce 
                        && e.type == "Board" 
                        && e.y - e.baseY < player[0].y + bottomCharacterLimit && player[0]. y + bottomCharacterLimit < e.y - e.baseY + tileSize * 3
                        && ((player[0].x + rightCharacterLimit >= e.x - tileSize / 2 && player[0].x + rightCharacterLimit <= e.x + tileSize * 1.5) //Makes sure at least the left or right side of the player is on the block
                        || (player[0].x + leftCharacterLimit >= e.x - tileSize / 2 && player[0].x + leftCharacterLimit <= e.x + tileSize * 1.5))){
                            let oneMessage = true; //S'assure qu'un seul message à la fois peut être affiché 
                            objects.forEach(e => {
                                if(e.type == "Board" && e.showMessage){
                                    oneMessage = false;
                                }
                            });

                            if(oneMessage){
                                e.print();
                            }
                        }
                });
            }
        }
    })
    
    window.addEventListener("keyup", (e) => {
        if(e.key == "d" || e.key == "D"){
            player[0].moveRight = false;
        }

        if(e.key == "a" || e.key == "A"){
            player[0].moveLeft = false;
        }

        if(e.key == "Shift"){
            player[0].running = false;
        }
    })
}

export const choosePlayerModel = () =>{ //This function has unfortunately never been usefull it is a memorial to what could have been
    let model = Math.random(); //Chooses the player model, since there are no other player models, always chooses the same one
    if(model <= 1 && model > 0.66){
        model = 1;
    }
    else if(model <= 0.66 && model > 0.33){
        model = 1;
    }
    else if(model <= 0.33){
        model = 1;
    }

    return model;
}

export const gameLoop = (level, background, player, tiles, objects, ennemies, levelLimits, gameState) =>{
    for(let i = 0; i < background.length; ++i){ //Moves the background
        background[i].tick();
    }

    if(player.length > 0){
        for(let i = 0; i < tiles.length; ++i){ //Makes sure the player or ennemies doesnt fall of the map and that tiles stay in check
            if(i == 10){
                console.log(tiles[i].x, tiles[i].node.style.left);
            }
            if(player[0].resetLeft 
                || player[0].resetRight 
                || player[0].resetTop
                || player[0].resetBottom 
                || windowWidth != window.innerWidth 
                || windowHeight != window.innerHeight
                || (((tiles[i].x < 0 || tiles[i].x > window.innerWidth) //For some reason, some tiles weren't dispawning properly but this should fix it  
                || (tiles[i].y < 0 || tiles[i].y - tiles[i].baseY > window.innerHeight)) 
                && tiles[i].node.style.display != "none")
                || ((tiles[i].node.style.left != tiles[i].x + "px" //Not sure that this is the best solution but still helps performance greatly 
                || tiles[i].node.style.top != (tiles[i].y - tiles[i].baseY).toFixed(3) + "px") 
                && tiles[i].node.style.display != "none")
                || (i == levelLimits[4] && level == 0)){ //Makes sure the form is always at the right spot no matter what in the index page
                tiles[i].tick(player, levelLimits);
            }
        }

        if(windowWidth != window.innerWidth //Gets the current values of the windows height and width
            || windowHeight != window.innerHeight){
            windowWidth = window.innerWidth;
            windowHeight = window.innerHeight;
        }
        
        if(player[0].y == -300 && gameState.respawn == 0){ //Sets the y position of the player to the correct spawn value, needs to be done after the first tick of tiles but before the first tick of player
            player[0].y = tiles[levelLimits[1]].y - tiles[levelLimits[1]].baseY - bottomCharacterLimit;

            if(level == 1){
                player[0].x = tiles[levelLimits[1]].x;
            }
        }
        else if(player[0].y == -300 && gameState.respawn == 1 && level == 1){ //Second respawn point for level 1
            player[0].y = tiles[levelLimits[5]].y - tiles[levelLimits[5]].baseY - bottomCharacterLimit; //update
            player[0].x = tiles[levelLimits[5]].x;
            player[0].tiledImage.flipped = true;
        }
        else if(player[0].y == -300 && gameState.respawn == 2 && level == 1){
            player[0].y = tiles[levelLimits[2]].y - tiles[levelLimits[2]].baseY - bottomCharacterLimit; //update
            player[0].x = tiles[levelLimits[2]].x - leftCharacterLimit;
        }
        else if(player[0].y == -300 && gameState.respawn == 3 && level == 1){
            player[0].y = tiles[levelLimits[6]].y - tiles[levelLimits[6]].baseY - bottomCharacterLimit; //update
            player[0].x = tiles[levelLimits[6]].x - leftCharacterLimit;
        }
    }
    
    if(windowWidth != window.innerWidth //Gets the current values of the windows height and width
        || windowHeight != window.innerHeight){
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
    }
    
    for(let i = 0; i < objects.length; ++i){ //Makes sure the objects stay in their respective position
        if(level == 1 && objects[i].type == "Entry"){
            let allDead = true;

            ennemies.forEach(e => {
                if(e.type == "Mob" && e.alive && allDead){
                    allDead = false;
                }
            });

            objects[i].tick(player, tiles, allDead); //Third value is a condition, if it is met the door can now open
        }
        else{
            objects[i].tick(player, tiles);
        }
    }

    for(let i = 0; i < ennemies.length; ++i){
        if(ennemies[i].type == "Boss" || ennemies[i].type == "Mob"){
            ennemies[i].tick(tiles, player, ennemies, gameState);
        }
        else{
            ennemies[i].tick(tiles, player);
        }
    }

    if(player.length > 0){
        player[0].tick(tiles, ennemies, objects, gameState);

        if(!player[0].alive && gameState.delay == ""){ //Checks if the player unalived himself
            gameState.delay = Date.now();
            gameState.playing = false;
        }
    }

    if((Date.now() - gameState.delay >= 1000 && gameState.delay != "") || (gameState.playing && player.length == 0)){
        if(player.length > 0){ //If the player died, remove him 
            player[0].node.remove();
            player.pop();
        }

        player.push(new Player(choosePlayerModel(), level, levelLimits)); //Creates a new player if the player decided to yeet himself or die in any other way
        gameState.playing = true;
        gameState.delay = "";
    }
}

const tick = () => {
    title.style.opacity = titleOpacity; //Makes the login logo breath

    if(titleOpacity <= 0.20 || titleOpacity >= 1){
        titleOpacitySpeed = -titleOpacitySpeed;
    }
    
    titleOpacity += titleOpacitySpeed;

    gameLoop(level, background, player, tiles, objects, ennemies, levelLimits, gameState);

    window.requestAnimationFrame(tick);
}



