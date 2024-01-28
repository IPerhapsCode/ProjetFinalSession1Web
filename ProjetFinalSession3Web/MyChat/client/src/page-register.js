import { register } from './chat-api';
import { Background } from './sprites/Background.js';
import { tileSize, gameLoop, mouseAttack, keyboardInputs } from './page-index.js';
import { Ground } from './sprites/Foreground.js';
import { Board, Entry, Ladder, Platform, Treadmill } from './sprites/Objects.js';
import { Barrel, Boss, Hammer, Mob } from './sprites/Ennemies.js';

const nbTiles = 75;
let background = []; //Let's us handle the moving background
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
let level = 1; //Current level
let doOnce = false; //Makes sure that we only spawn the boss once
let formNode; //Contains the node for the form 
let game; //Node for the game div
let backgroundZone; //Node for the background zone div
let inputMatricule; //Node for the input matricule field
let inputPrenom; //Node for the input prenom field
let inputNomFamille; //Node for the input nomFamille field
let inputNomUsager; //Node for the input nomUsager field
let inputMdp; //Node for the input mdp field
let inputBienvenue; //Node for the input bienvenue field

window.addEventListener("load", () => {
    document.querySelector("form").onsubmit = function () {
        return register(this);
    }

    formNode = document.querySelector("#register-form");
    game = document.querySelector("#game");
    backgroundZone = document.querySelector("#background-zone");
    inputMatricule = document.querySelector("#matricule");
    inputPrenom = document.querySelector("#prenom");
    inputNomFamille = document.querySelector("#nomFamille");
    inputNomUsager = document.querySelector("#nomUsager");
    inputMdp = document.querySelector("#mdp");
    inputBienvenue = document.querySelector("#bienvenue");

    for(let i = 1; i <= 5; ++i){ //Creates the moving background
        background.push(new Background(i));
    }

    for(let i = 0; i < nbTiles; ++i){ //Creates the level
        if(i == 0){
            levelLimits.push(tiles.length); //0
            tiles.push(new Ground(tiles.length, 24, tileSize * i, tileSize * -2, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * -1, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 0, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 1, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 2, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 3, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 4, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 5, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 6, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 7, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 8, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 9, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 10, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 11, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 12, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 13, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 14, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 15, true));
            tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * 16, true));
        }

        if(i == 1){
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * -3, true));
            tiles.push(new Ground(tiles.length, 4, tileSize * i, tileSize * -2, true));
            tiles.push(new Ground(tiles.length, 22, tileSize * i, tileSize * 9, true));
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 10, true));
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 11, true));
            levelLimits.push(tiles.length); //1
            tiles.push(new Ground(tiles.length, 4, tileSize * i, tileSize * 12, true));
            tiles.push(new Ground(tiles.length, 22, tileSize * i, tileSize * 17, true));
            tiles.push(new Ground(tiles.length, 4, tileSize * i, tileSize * 18, true));
            objects.push(new Ladder(objects.length, 2, tileSize * i, tileSize * -1, true));
            objects.push(new Ladder(objects.length, 1, tileSize * i, tileSize * 0, true));
            objects.push(new Ladder(objects.length, 1, tileSize * i, tileSize * 1, true));
            objects.push(new Ladder(objects.length, 2, tileSize * i, tileSize * 2, true));
            objects.push(new Ladder(objects.length, 1, tileSize * i, tileSize * 3, true));
            objects.push(new Ladder(objects.length, 2, tileSize * i, tileSize * 4, true));
            objects.push(new Ladder(objects.length, 3, tileSize * i, tileSize * 5, true));
            levelLimits.push(tiles.length); //2
            tiles.push(new Ground(tiles.length, 1, tileSize * i, tileSize * 5, true));
        }

        if(i > 1 && i < 33){
            tiles.push(new Ground(tiles.length, 23, tileSize * i, tileSize * 9, true));
            tiles.push(new Ground(tiles.length, 5, tileSize * i, tileSize * 12, true));
        }

        if(i > 1 && i < 37){
            if((i > 1 && i < 22) || i > 30){
                if(i == 33){
                    levelLimits.push(tiles.length); //5
                    objects.push(new Board(objects.length, 3, tileSize * i, tileSize * 0, "<div>If you haven't defeated all the <b>Mobs</b> on the first floor, might as well <b>Reset</b> the level <b>:/</b></div>", "", ""));
                }
                tiles.push(new Ground(tiles.length, 5, tileSize * i, tileSize * -2, true));
            }
            else{
                tiles.push(new Ground(tiles.length, 2, tileSize * i, tileSize * -2, true));
                objects.push(new Platform(objects.length, tileSize * i, tileSize * -2, i - 36, tiles[tiles.length - 1].id));
            }
            tiles.push(new Ground(tiles.length, 23, tileSize * i, tileSize * 17, true));
            tiles.push(new Ground(tiles.length, 5, tileSize * i, tileSize * 18, true));
        }

        if(i > 4 && i < 33){
            tiles.push(new Ground(tiles.length, 23, tileSize * i, tileSize * 4, true));
            tiles.push(new Ground(tiles.length, 5, tileSize * i, tileSize * 5, true));
            if(i < 18){
                objects.push(new Treadmill(objects.length, 2, tileSize * i, tileSize * -2, true));
            }
        }

        if(i > 1 && i < 33){
            let model = Math.random();
            model > 0.5 ? model = 25 : model = 14;
            tiles.push(new Ground(tiles.length, model, tileSize * i, tileSize * 11, true));

            model = Math.random();
            model > 0.5 ? model = 25 : model = 14;
            tiles.push(new Ground(tiles.length, model, tileSize * i, tileSize * 10, true));
        }

        if(i == 4){
            levelLimits.push(tiles.length); //3
            tiles.push(new Ground(tiles.length, 22, tileSize * i, tileSize * 4, true));
            levelLimits.push(tiles.length); //4
            tiles.push(new Ground(tiles.length, 4, tileSize * i, tileSize * 5, true));
            ennemies.push(new Hammer(ennemies.length, tileSize * i * 1.025, levelLimits[3])) //Needs the y position of said tile in levelLimits
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 1), tileSize * 3, true)); //The next few blocks makes it so you cant clip in the hammer 
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 1), tileSize * 2, true));
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 2), tileSize * 3, true));
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 2), tileSize * 2, true));
            objects.push(new Treadmill(objects.length, 3, tileSize * i, tileSize * -2, true));
        }

        if(i == 8){
            ennemies.push(new Barrel(ennemies.length, tileSize * i, levelLimits[1], true));
            ennemies.push(new Hammer(ennemies.length, tileSize * i * 1.025, levelLimits[3])) //Needs the y position of said tile in levelLimits
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 1), tileSize * 3, true)); //The next few blocks makes it so you cant clip in the hammer 
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 1), tileSize * 2, true));
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 2), tileSize * 3, true));
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 2), tileSize * 2, true));
        }

        if(i == 9){
            ennemies.push(new Barrel(ennemies.length, tileSize * i, levelLimits[4], true));
        }
        if(i == 11){
            ennemies.push(new Barrel(ennemies.length, tileSize * i, levelLimits[1], false));
        }

        if(i == 12){
            ennemies.push(new Barrel(ennemies.length, tileSize * i, levelLimits[1], false));
            ennemies.push(new Hammer(ennemies.length, tileSize * i * 1.025, levelLimits[3])) //Needs the y position of said tile in levelLimits
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 1), tileSize * 3, true)); //The next few blocks makes it so you cant clip in the hammer 
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 1), tileSize * 2, true));
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 2), tileSize * 3, true));
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 2), tileSize * 2, true));
        }

        if(i == 16){
            ennemies.push(new Barrel(ennemies.length, tileSize * i, levelLimits[1], false));
            ennemies.push(new Hammer(ennemies.length, tileSize * i * 1.025, levelLimits[3])) //Needs the y position of said tile in levelLimits
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 1), tileSize * 3, true)); //The next few blocks makes it so you cant clip in the hammer 
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 1), tileSize * 2, true));
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 2), tileSize * 3, true));
            tiles.push(new Ground(tiles.length, 2, tileSize * (i + 2), tileSize * 2, true));
        }

        if(i == 17){
            ennemies.push(new Barrel(ennemies.length, tileSize * i, levelLimits[1], true));
        }

        if(i == 18){
            objects.push(new Treadmill(objects.length, 1, tileSize * i, tileSize * -2, true));
        }

        if(i == 21){
            ennemies.push(new Barrel(ennemies.length, tileSize * i, levelLimits[4], true));
        }
        if(i == 24){
            ennemies.push(new Barrel(ennemies.length, tileSize * i, levelLimits[1], false));
        }

        if(i == 29){
            ennemies.push(new Barrel(ennemies.length, tileSize * i, levelLimits[1], false));
        }

        if(i == 33){
            tiles.push(new Ground(tiles.length, 24, tileSize * i, tileSize * 4, true));
            tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * 5, true));
            tiles.push(new Ground(tiles.length, 2, tileSize * i, tileSize * 6, true));
            tiles.push(new Ground(tiles.length, 2, tileSize * i, tileSize * 7, true));
            tiles.push(new Ground(tiles.length, 2, tileSize * i, tileSize * 8, true));
            objects.push(new Entry(objects.length, tileSize * (i - 0.5), tileSize * 8, tiles.length - 1)); //Needs at least the last block blocking it 
            tiles.push(new Ground(tiles.length, 24, tileSize * i, tileSize * 9, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 10, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 11, true));
            tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * 12, true));
        }

        if(i == 34){
            ennemies.push(new Barrel(ennemies.length, tileSize * i, levelLimits[5], false));
        }

        if(i == 36){
            ennemies.push(new Barrel(ennemies.length, tileSize * i, levelLimits[5], true));
        }

        if(i == 37){
            tiles.push(new Ground(tiles.length, 24, tileSize * i, tileSize * 17, true));
            tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * 18, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * -3, true));
            tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * -2, true));
        }

        if(i == 38){
            tiles.push(new Ground(tiles.length, 22, tileSize * i, tileSize * -1, true));
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 0, true));
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 1, true));
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 2, true));
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 3, true));
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 4, true));
            tiles.push(new Ground(tiles.length, 4, tileSize * i, tileSize * 5, true));
            tiles.push(new Ground(tiles.length, 2, tileSize * i, tileSize * 6, true));
            tiles.push(new Ground(tiles.length, 2, tileSize * i, tileSize * 7, true));
            tiles.push(new Ground(tiles.length, 2, tileSize * i, tileSize * 8, true));
            objects.push(new Entry(objects.length, tileSize * i, tileSize * 8, tiles[tiles.length - 1].id)); //Needs at least the last block blocking it 
            tiles.push(new Ground(tiles.length, 22, tileSize * i, tileSize * 9, true));
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 10, true));
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 11, true));
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 12, true));
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 13, true));
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 14, true));
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * 15, true));
            tiles.push(new Ground(tiles.length, 4, tileSize * i, tileSize * 16, true));
        }

        if(i > 38 && i < 43){
            tiles.push(new Ground(tiles.length, 5, tileSize * i, tileSize * 16, true));

            for(let j = 15; j >= 10; --j){
                let model = Math.random();
                model > 0.5 ? model = 25 : model = 14;
                tiles.push(new Ground(tiles.length, model, tileSize * i, tileSize * j, true));
            }

            tiles.push(new Ground(tiles.length, 23, tileSize * i, tileSize * 9, true));
            tiles.push(new Ground(tiles.length, 5, tileSize * i, tileSize * 5, true));

            for(let j = 4; j >= 0; --j){
                let model = Math.random();
                model > 0.5 ? model = 25 : model = 14;
                tiles.push(new Ground(tiles.length, model, tileSize * i, tileSize * j, true));
            }

            tiles.push(new Ground(tiles.length, 23, tileSize * i, tileSize * -1, true));
        }

        if(i == 43){
            tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * 16, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 15, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 14, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 13, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 12, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 11, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 10, true));
            tiles.push(new Ground(tiles.length, 24, tileSize * i, tileSize * 9, true));
            tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * 5, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 4, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 3, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 2, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 1, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * 0, true));
            tiles.push(new Ground(tiles.length, 24, tileSize * i, tileSize * -1, true));
        }

        if(i > 44 && i < 74){
            tiles.push(new Ground(tiles.length, 5, tileSize * i, tileSize * -2, true));
        }

        if(i == 44){
            levelLimits.push(tiles.length); //6
            tiles.push(new Ground(tiles.length, 4, tileSize * i, tileSize * -2, true));
            tiles.push(new Ground(tiles.length, 13, tileSize * i, tileSize * -3, true));
        }

        if(i == 74){
            levelLimits.push(tiles.length); //7
            tiles.push(new Ground(tiles.length, 6, tileSize * i, tileSize * -2, true));
            tiles.push(new Ground(tiles.length, 15, tileSize * i, tileSize * -3, true));
        }
    }
    
    objects.push(new Board(objects.length, 4, tileSize * -2, tileSize, "<div>Defeat all the <b>Mobs</b> to unlock the <b>Doors</b>!</div>", "<div>Defeat the <b>Boss</b> to make the <b>Register Form</b> appear!", ""))
    ennemies.push(new Mob(ennemies.length, tileSize * 9, levelLimits[1], Math.random(), level, levelLimits, false)); //Need to be spawned after all the level limits are determined
    ennemies.push(new Mob(ennemies.length, tileSize * 17, levelLimits[1], Math.random(), level, levelLimits, true));
    ennemies.push(new Mob(ennemies.length, tileSize * 6, levelLimits[2], Math.random(), level, levelLimits, false)); 
    ennemies.push(new Mob(ennemies.length, tileSize * 12, levelLimits[2], Math.random(), level, levelLimits, false));
    ennemies.push(new Mob(ennemies.length, tileSize * 25, levelLimits[2], Math.random(), level, levelLimits, true));

    formNode.onmouseover = () =>{
        if(formNode.style.display == "inline" && player.length > 0){
            gameState.playing = false;
            game.style.filter = "blur(3px)";
            backgroundZone.style.filter = "blur(3px)";
            player[0].moveRight = false;
            player[0].moveLeft = false;
            player[0].moveRunning = false;
        }
    }
    formNode.onmouseout = () =>{
        if(formNode.style.display == "inline" && player.length > 0){
            gameState.playing = true;   
            game.style.filter = "none";
            backgroundZone.style.filter = "none";
            inputMatricule.blur();
            inputPrenom.blur();
            inputNomFamille.blur();
            inputNomUsager.blur();
            inputMdp.blur();
            inputBienvenue.blur();
        }
    }

    mouseAttack(gameState, player);
    keyboardInputs(gameState, player, objects);

    tick();
})

const tick = () => {
    gameLoop(level, background, player, tiles, objects, ennemies, levelLimits, gameState);

    if(gameState.respawn == 3 && !doOnce){ //Makes the boss spawn and show a message to the player 
        ennemies.push(new Boss(ennemies.length, tiles[levelLimits[7]].x + tileSize * 2, levelLimits[7], level, levelLimits)) //update
        objects.forEach(e => {
            if(e.type == "Board" && e.model == 4){
                e.print();
            }
        });
        doOnce = true;
    }

    if(formNode.style.display == ""){
        ennemies.forEach(e => { //Once the boss is beat, make the form appear
            if(e.healthOut <= 0){
                formNode.style.display = "inline";
            }
        });
    }
    if(formNode.style.display == "inline"){
        formNode.style.left = (player[0].x - 150) + "px"; //Keeps the form above the players head once the boss has been beaten
        formNode.style.top = (player[0].y - 400) + "px";
    }

    window.requestAnimationFrame(tick);
}
