import { TiledImage } from "../TiledImage.js";
import { tileSize} from "../page-index.js";
import { bottomCharacterLimit, leftCharacterLimit, rightCharacterLimit, topCharacterLimit } from "./Player.js";

export class Ladder{
    constructor(id, model, x, y, flipped){
        this.id = id; //Id of the ladder
        this.model = model; //Model of the ladder
        this.path = "./img/Objects/Ladder" + this.model + ".png"; //Location of the ladder model 
        this.x = x; //X position 
        this.y = y; //Y position 
        this.baseY = y; //Y relative position 
        this.leftValue = ""; //Useful to despawn the sprite when out of sight  
        this.topValue = ""; //Useful to despawn the sprite when out of sight  
        if(this.model == 3){ //Determines the type of the object 
            this.type = "LadderTop"; 
        }
        else{
            this.type = "Ladder";
        }
        this.colCount = 1; //Important values for tiledImage
        this.rowCount = 1;
        this.refreshDelay = 10000;
        this.loopColumns = false;
        this.scale = 0.3;
        this.node = document.createElement("div"); //Creates the object in the page 
        document.querySelector("#game").append(this.node);

        this.tiledImage = new TiledImage(
            this.path,
			this.colCount,
			this.rowCount,
			this.refreshDelay,
			this.loopColumns,
			this.scale,
			this.node
        );
        this.tiledImage.flipped = flipped; //Flips the image if needed 
    }

    tick(player) {
        if(player.length > 0){
            if((window.innerHeight / 1.2) != this.y && !player[0].resetTop && !player[0].resetBottom){ //If the window is redimenssionned character should stay in the right spot
                this.y = window.innerHeight / 1.2; 
            }

            let tempLeft = this.node.style.left; //Let's us despawn sprites when they're not in sight (helps performance a lot)
            let tempTop = this.node.style.top;
            this.leftValue = "";
            this.topValue = "";
            for(let i = 0; i < tempLeft.length; ++i){
                if(tempLeft[i] != "p" && tempLeft[i] != "x"){
                    this.leftValue += tempLeft[i];
                }
            }
            for(let i = 0; i < tempTop.length; ++i){
                if(tempTop[i] != "p" && tempTop[i] != "x"){
                    this.topValue += tempTop[i];
                }
            }
            if((this.leftValue > window.innerWidth || this.leftValue < -tileSize 
                || this.topValue > window.innerHeight || this.topValue < -tileSize) 
                && !player[0].changeScreenSize){
                this.node.style.display = "none";
            }
            else{
                this.node.style.display = "block";
            }
        }

        this.tiledImage.tick(this.x, this.y - this.baseY);
    }
}

export class Board{
    constructor(id, model, x, y, message0, message1, message2){
        this.id = id; //Id of the model 
        this.model = model; //Determines the model of our object 
        this.path = "./img/Objects/Board" + this.model + ".png"; //Determines the location of the model 
        this.talkingPath = "./img/Objects/Talking" + this.model + ".png"; //Lets us show who is speaking
        this.messageCheck = 0; //Determines the message to be shown 
        this.message = [message0, message1, message2, ""]; //Message to be shown by the object when interacted with 
        this.showMessage = false; //Lets us know if the object is showing a message 
        this.messageTimer = ""; //Usefull to know how long we want to message to be shown
        this.messageShowTime = 5000; //The message will be shown for the amount of time in milliseconds  
        this.messageSpeed = 10; //Speed at which the message shows up 
        this.messageSpeedDefault = 10; //Makes resets easier 
        this.messageBaseLineDefault = -300;  //Default y position of the message 
        this.messageBaseLine = this.messageBaseLineDefault; //Y position of the message
        this.messageMaxDefault = 0; 
        this.messageMax = this.messageMaxDefault; //Max top position of the message
        this.firstTickMessage = true; //Does something on the first tik only of printing the message 
        this.type = "Board"; //Type of the object 
        this.x = x; //X position of the object
        this.y = y; //Y position of the object
        this.baseY = y; //Relative Y position 
        this.leftValue = ""; //Useful to despawn the object when out of sight 
        this.topValue = "";
        this.colCount = 1; //Important data for the tiledImage 
        this.rowCount = 1;
        this.refreshDelay = 10000;
        this.loopColumns = false;
        this.scale = 0.3;
        this.node = document.createElement("div"); //Actual model node
        document.querySelector("#game").append(this.node);
        this.tempNode = document.createElement("div"); //Message node
        this.tempNode.classList.add("message-box");
        this.tempTalkingNode = document.createElement("div"); //Talking node
        this.tempTalkingNode.classList.add("talking");
        this.tempTalkingNode.style.backgroundImage = "url(" + this.talkingPath + ")";

        if(this.model == 4 || this.model == 5){
            this.colCount = 4;
            this.rowCount = 1;
            this.refreshDelay = 150;
            this.loopColumns = true;
            this.scale = 0.5; 
        }

        this.tiledImage = new TiledImage(
            this.path,
			this.colCount,
			this.rowCount,
			this.refreshDelay,
			this.loopColumns,
			this.scale,
			this.node
        );
        
        if(this.model == 4){
            this.print();
        }

        if(this.model == 5){
            this.tiledImage.flipped = true;
        }

        if(this.model == 4 || this.model == 5){
            this.tiledImage.changeRow(0);
            this.tiledImage.changeMinMaxInterval(0,3);
        }
    }

    print() { //Lets us print the message  
        this.tempNode.innerHTML = this.message[this.messageCheck];
        document.querySelector("#game").append(this.tempNode);
        document.querySelector("#game").append(this.tempTalkingNode);
        this.showMessage = true;
        this.messageTimer = Date.now();
        if(this.model == 4){
            this.tempNode.style.marginTop = "50px";
        }
    }

    tick(player) {
        if(player.length > 0){
            if((window.innerHeight / 1.2) != this.y && !player[0].resetTop && !player[0].resetBottom){ //If the window is redimenssionned character should stay in the right spot
                this.y = window.innerHeight / 1.2; 
            }

            let tempLeft = this.node.style.left; //Let's us despawn sprites when they're not in sight (helps performance a lot)
            let tempTop = this.node.style.top;
            this.leftValue = "";
            this.topValue = "";
            for(let i = 0; i < tempLeft.length; ++i){
                if(tempLeft[i] != "p" && tempLeft[i] != "x"){
                    this.leftValue += tempLeft[i];
                }
            }
            for(let i = 0; i < tempTop.length; ++i){
                if(tempTop[i] != "p" && tempTop[i] != "x"){
                    this.topValue += tempTop[i];
                }
            }

            if((this.leftValue > window.innerWidth || this.leftValue < -tileSize 
                || this.topValue > window.innerHeight || this.topValue < -tileSize) 
                && !player[0].changeScreenSize){
                this.node.style.display = "none";
            }
            else{
                this.node.style.display = "block";
            }
        }

        if(this.showMessage){
            if(player.length > 0){
                if(player[0].y + topCharacterLimit < window.innerHeight / 2 && this.firstTickMessage){ //Prints the message in the lower half of the screen if the player is above the middle
                    this.messageBaseLine = window.innerHeight * 1.25;
                    this.messageSpeed = -this.messageSpeedDefault;
                    this.messageMax = window.innerHeight * 0.75; 
                    this.firstTickMessage = false;
                }
                else{
                    this.firstTickMessage = false;
                }
            }

            if(((this.messageSpeed != this.messageSpeedDefault && this.messageBaseLine > this.messageMax) //Plays an animation to print the message
                || (this.messageSpeed == this.messageSpeedDefault && this.messageBaseLine < this.messageMax))
                && Date.now() - this.messageTimer < this.messageShowTime){
                if(this.messageBaseLine + this.messageSpeed < this.messageMax 
                    && this.messageSpeed != this.messageSpeedDefault 
                    || this.messageBaseLine + this.messageSpeed > this.messageMax 
                    && this.messageSpeed == this.messageSpeedDefault){
                    this.messageBaseLine = this.messageMax;
                }
                else{
                    this.messageBaseLine += this.messageSpeed;
                }
                this.tempNode.style.top = this.messageBaseLine + "px";
                this.tempTalkingNode.style.top = this.messageBaseLine + "px";
            }
            else if(Date.now() - this.messageTimer < this.messageShowTime //Makes sure that the message stays at its intended position when in the lower half of the scren 
                    && this.messageBaseLine == this.messageMax 
                    && this.messageSpeed != this.messageSpeedDefault 
                    && this.messageMax != window.innerHeight * 0.75){
                    this.messageMax = window.innerHeight * 0.75;
                    this.messageBaseLine = this.messageMax;
                    this.tempNode.style.top = this.messageBaseLine + "px";
                    this.tempTalkingNode.style.top = this.messageBaseLine + "px";
            }
            else if(this.messageShowTime <= Date.now() - this.messageTimer){ //When the time has come, take the message out of the screen 
                    this.messageBaseLine -= this.messageSpeed;
                    this.tempNode.style.top = this.messageBaseLine + "px";
                    this.tempTalkingNode.style.top = this.messageBaseLine + "px";
            }

            if(this.messageShowTime <= Date.now() - this.messageTimer //Once the message is out of the screen, removes the message entirely from the game 
                && ((this.messageSpeed != this.messageSpeedDefault && this.messageBaseLine > window.innerHeight * 1.25) 
                || (this.messageSpeed == this.messageSpeedDefault && this.messageBaseLine <= this.messageBaseLineDefault))){
                this.tempNode.remove(); //Resets and clear game space
                this.tempTalkingNode.remove();
                this.messageTimer = "";
                this.showMessage = false;
                this.firstTickMessage = true;
                this.messageBaseLine = this.messageBaseLineDefault;
                this.messageSpeed = this.messageSpeedDefault;
                this.messageMax = this.messageMaxDefault;
                if(this.message[this.messageCheck + 1] != ""){
                    ++this.messageCheck;
                }
            }
        }

        this.tiledImage.tick(this.x, this.y - this.baseY);
    }
}

export class Treadmill{
    constructor(id, model, x, y, flipped) {
        this.id = id; //Determines the id of the treadmill 
        this.model = model; //Determines the model of the treadmill
        this.path = "./img/Objects/Treadmill" + this.model + ".png"; //Determines the location of the model 
        this.flipped = flipped; //Determines if the image is flipped of not 
        this.type = "Treadmill"; //Type of the object 
        this.x = x; //X position of the object
        this.y = y; //Y position of the object
        this.baseY = y; //Relative Y position 
        if(this.flipped){
            this.speed = -0.9; //Determines the speed at which the treadmill pushes the player
        }
        else{
            this.speed = 0.9; //Determines the speed at which the treadmill pushes the player
        }
        this.leftValue = ""; //Useful to despawn the object when out of sight 
        this.topValue = "";
        this.colCount = 4; //Important data for the tiledImage 
        this.rowCount = 1;
        this.refreshDelay = 150;
        this.loopColumns = true;
        this.scale = 0.3;
        this.node = document.createElement("div"); //Actual model node
        document.querySelector("#game").append(this.node);

        this.tiledImage = new TiledImage(
            this.path,
			this.colCount,
			this.rowCount,
			this.refreshDelay,
			this.loopColumns,
			this.scale,
			this.node
        );

        this.tiledImage.changeRow(0);
        this.tiledImage.changeMinMaxInterval(0,3);
        this.tiledImage.flipped = this.flipped;
    }

    tick(player) {
        if(player.length > 0){
            if((window.innerHeight / 1.2) != this.y && !player[0].resetTop && !player[0].resetBottom){ //If the window is redimenssionned character should stay in the right spot
                this.y = window.innerHeight / 1.2; 
            }

            let tempLeft = this.node.style.left; //Let's us despawn sprites when they're not in sight (helps performance a lot)
            let tempTop = this.node.style.top;
            this.leftValue = "";
            this.topValue = "";
            for(let i = 0; i < tempLeft.length; ++i){
                if(tempLeft[i] != "p" && tempLeft[i] != "x"){
                    this.leftValue += tempLeft[i];
                }
            }
            for(let i = 0; i < tempTop.length; ++i){
                if(tempTop[i] != "p" && tempTop[i] != "x"){
                    this.topValue += tempTop[i];
                }
            }

            if((this.leftValue > window.innerWidth || this.leftValue < -tileSize 
                || this.topValue > window.innerHeight || this.topValue < -tileSize) 
                && !player[0].changeScreenSize){
                this.node.style.display = "none";
            }
            else{
                this.node.style.display = "block";
            }

            if(((player[0].x + rightCharacterLimit >= this.x && player[0].x + rightCharacterLimit <= this.x + tileSize) //Makes sure at least the left or right side of the player is on the block
                && (player[0].x + leftCharacterLimit >= this.x || player[0].x + leftCharacterLimit <= this.x + tileSize)) 
                && player[0].y + bottomCharacterLimit == this.y - this.baseY){
                    player[0].x += this.speed; //Pushes the player if he is on the treadmill
            }
        }

        this.tiledImage.tick(this.x, this.y - this.baseY);
    }
}

export class Platform{
    constructor(id, x, y, order, groundId) {
        this.id = id; //Id of the object
        this.groundId = groundId; //Id of the ground where it stands
        this.x = x; //X position of the object
        this.y = y; //Y position of the object
        this.baseY = y; //Relative Y position 
        this.path = "./img/Objects/Platform.png"; //Determines the location of the model
        this.type = "Platform"; //type of the object
        this.leftValue = ""; //Useful to despawn the object when out of sight 
        this.topValue = "";
        this.colCount = 8; //Important data for the tiledImage 
        this.rowCount = 1;
        this.refreshDelay = 150;
        this.loopColumns = true;
        this.scale = 0.3;
        this.node = document.createElement("div"); //Actual model node
        document.querySelector("#game").append(this.node);
        this.beginAnimation = Date.now() - this.refreshDelay * order; //Puts a delay between the platforms animation
        this.spawnDelay = 2025 //Time in millisecond until the first animation begins 
        this.animationBegan = false; 

        this.tiledImage = new TiledImage(
            this.path,
			this.colCount,
			this.rowCount,
			this.refreshDelay,
			this.loopColumns,
			this.scale,
			this.node
        );

        this.tiledImage.changeRow(0);
        this.tiledImage.changeMinMaxInterval(0,0);
    }

    tick(player, tiles) {
        if(Date.now() - this.beginAnimation >= this.spawnDelay && !this.animationBegan){
            this.animationBegan = true;
            this.tiledImage.changeMinMaxInterval(0,7);
        }

        if(player.length > 0){
            if((window.innerHeight / 1.2) != this.y && !player[0].resetTop && !player[0].resetBottom){ //If the window is redimenssionned character should stay in the right spot
                this.y = window.innerHeight / 1.2; 
            }

            let tempLeft = this.node.style.left; //Let's us despawn sprites when they're not in sight (helps performance a lot)
            let tempTop = this.node.style.top;
            this.leftValue = "";
            this.topValue = "";
            for(let i = 0; i < tempLeft.length; ++i){
                if(tempLeft[i] != "p" && tempLeft[i] != "x"){
                    this.leftValue += tempLeft[i];
                }
            }
            for(let i = 0; i < tempTop.length; ++i){
                if(tempTop[i] != "p" && tempTop[i] != "x"){
                    this.topValue += tempTop[i];
                }
            }

            if((this.leftValue > window.innerWidth || this.leftValue < -tileSize 
                || this.topValue > window.innerHeight || this.topValue < -tileSize) 
                && !player[0].changeScreenSize){
                this.node.style.display = "none";
            }
            else{
                this.node.style.display = "block";
            }
        }

        if(this.tiledImage.imageCurrentCol >= 2 && this.tiledImage.imageCurrentCol <= 6){
            tiles[this.groundId].walkable = false;
        }
        else{
            tiles[this.groundId].walkable = true;
        }

        this.tiledImage.tick(this.x, this.y - this.baseY);
    }
}

export class Entry{
    constructor(id, x, y, groundId){
        this.id = id; //Id of the object
        this.groundId = [groundId, groundId - 1, groundId - 2]; //Id of the ground where it stands
        this.x = x; //X position of the object
        this.y = y; //Y position of the object
        this.baseY = y; //Relative Y position 
        this.tileHeight = 205; //Change this value if the scale of the image is changed
        this.path = "./img/Objects/Entry.png"; //Determines the location of the model
        this.type = "Entry"; //type of the object
        this.opened = false;
        this.leftValue = ""; //Useful to despawn the object when out of sight 
        this.topValue = "";
        this.colCount = 8; //Important data for the tiledImage 
        this.rowCount = 1;
        this.refreshDelay = 150;
        this.loopColumns = true;
        this.scale = 0.45;
        this.node = document.createElement("div"); //Actual model node
        document.querySelector("#game").append(this.node);

        this.tiledImage = new TiledImage(
            this.path,
			this.colCount,
			this.rowCount,
			this.refreshDelay,
			this.loopColumns,
			this.scale,
			this.node
        );

        this.tiledImage.changeRow(0);
        this.tiledImage.changeMinMaxInterval(0,0);
    }

    tick(player, tiles, condition){
        if(player.length > 0){
            if((window.innerHeight / 1.2) != this.y && !player[0].resetTop && !player[0].resetBottom){ //If the window is redimenssionned character should stay in the right spot
                this.y = window.innerHeight / 1.2; 
            }

            let tempLeft = this.node.style.left; //Let's us despawn sprites when they're not in sight (helps performance a lot)
            let tempTop = this.node.style.top;
            this.leftValue = "";
            this.topValue = "";
            for(let i = 0; i < tempLeft.length; ++i){
                if(tempLeft[i] != "p" && tempLeft[i] != "x"){
                    this.leftValue += tempLeft[i];
                }
            }
            for(let i = 0; i < tempTop.length; ++i){
                if(tempTop[i] != "p" && tempTop[i] != "x"){
                    this.topValue += tempTop[i];
                }
            }

            if((this.leftValue > window.innerWidth || this.leftValue < -tileSize 
                || this.topValue > window.innerHeight || this.topValue < -tileSize) 
                && !player[0].changeScreenSize){
                this.node.style.display = "none";
            }
            else{
                this.node.style.display = "block";
            }

            if(player[0].x + rightCharacterLimit <= this.x //Opens the door when the player is near it and the condition is met
                && player[0].x + leftCharacterLimit >= this.x - tileSize 
                && player[0].y + topCharacterLimit >= this.y - this.baseY 
                && player[0].y + topCharacterLimit <= this.y - this.baseY + this.tileHeight 
                && !this.opened && condition){
                    tiles[this.groundId[0]].walkable = false;
                    tiles[this.groundId[1]].walkable = false;
                    tiles[this.groundId[2]].walkable = false;
                    this.tiledImage.changeMinMaxInterval(0,4);
                    this.opened = true;
            }
            else if((player[0].x + leftCharacterLimit > this.x + tileSize * 2 //Closes the door when the player moves away from it 
                        || (player[0].x + rightCharacterLimit < this.x 
                        && player[0].x + leftCharacterLimit < this.x - tileSize)) 
                        && this.opened){
                            tiles[this.groundId[0]].walkable = true;
                            tiles[this.groundId[1]].walkable = true;
                            tiles[this.groundId[2]].walkable = true;
                            this.tiledImage.changeMinMaxInterval(4,7);
                            this.opened = false;
            }
            
            if(this.opened && this.tiledImage.imageCurrentCol == 4){ //Door opening animation
                this.tiledImage.changeMinMaxInterval(4,4);
            }

            if(!this.opened && this.tiledImage.imageCurrentCol == 7){ //Door closing animation 
                this.tiledImage.changeMinMaxInterval(0,0);
            }
        }

        this.tiledImage.tick(this.x, this.y - this.baseY);
    }
}