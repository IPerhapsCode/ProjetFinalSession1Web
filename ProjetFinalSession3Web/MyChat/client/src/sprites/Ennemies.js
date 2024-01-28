import { TiledImage } from "../TiledImage.js";
import { tileSize } from "../page-index.js";
import { bottomCharacterLimit, leftCharacterLimit, rightCharacterLimit, topCharacterLimit } from "./Player.js";

export class Barrel{
    constructor(id, x, y, flipped){
        this.tileHeight = 72; //Change these values if you change the this.scale value
        this.tileWidth = 50;
        this.type = "Barrel"; //What is this ennemie
        this.path = "./img/Ennemies/Barrel/Barrel2.png"; //Image paths
        this.deadPath = "./img/Ennemies/Barrel/Barrel3.png";
        this.alive = true; //Is the ennemi alive
        this.health = 200; //What's the ennemies health
        this.immune = false; //Can't be damaged while true
        this.immuneTimer = Date.now(); //Let's us know for how long the barrel is immune;
        this.immuneDelay = 1000; //The ennemi is immune for 1 second
        this.id = id; //Id of the barrel
        this.x = x + (Math.random() * 20); //X position 
        this.y = y; //Y position 
        this.leftValue = ""; //Useful to despawn the ennemi when out of sight 
        this.topValue = "";
        this.floor = y; //Makes sure the ennemie stays on the floor 
        this.barrelAngle = 0; //Let's us change the angle of the barrel once it is hit
        this.barrelAngleRight = 5;
        this.barrelAngleLeft= -5;
        this.colCount = 1;
        this.rowCount = 1;
        this.refreshDelay = 10000;
        this.loopColumns = false;
        this.scale = 0.4;
        this.flipped = flipped;
        this.node = document.createElement("div");
        document.querySelector("#game").append(this.node);

        this.tiledImage = new TiledImage(
            this.path,
			this.colCount,
			this.rowCount,
			this.refreshDelay,
			this.loopColumns,
			this.scale,
			this.node
        )

        this.tiledImage.flipped = this.flipped;
    }

    takeDamage(damage) { //Makes sure the barrel takes damage
        this.health -= damage;
        if(this.alive){
            this.immuneTimer = Date.now();
            this.immune = true;
        }
    }

    dies() { //Makes sure the barrel dies
        this.alive = false;
        this.tiledImage = new TiledImage(
            this.deadPath,
			this.colCount,
			this.rowCount,
			this.refreshDelay,
			this.loopColumns,
			this.scale,
			this.node
        )
        this.tiledImage.flipped = this.flipped;
    }

    tick(tiles, player) {
        this.y = tiles[this.floor].y - tiles[this.floor].baseY - tileSize - 5; //Makes sure the barrel stays at its intented height

        if(this.immune){ //Does a little animation to the tell player the barrel is immune
            if(this.tiledImage.angle != this.barrelAngleLeft 
                && (Date.now() - this.immuneTimer <= 100 
                || (Date.now() - this.immuneTimer <= 400 && Date.now() - this.immuneTimer > 300) 
                || (Date.now() - this.immuneTimer <= 700 && Date.now() - this.immuneTimer > 600) 
                || (Date.now() - this.immuneTimer <= 1000 && Date.now() - this.immuneTimer > 900))){
                this.tiledImage.angle = this.barrelAngleLeft;
            }
            else if(this.tiledImage.angle != this.barrelAngle 
                && (Date.now() - this.immuneTimer <= 200 
                || (Date.now() - this.immuneTimer <= 500 && Date.now() - this.immuneTimer > 300) 
                || (Date.now() - this.immuneTimer <= 800 && Date.now() - this.immuneTimer > 600))){
                this.tiledImage.angle = this.barrelAngleLeft;
            }
            else if(this.tiledImage.angle != this.barrelAngleRight){
                this.tiledImage.angle = this.barrelAngleRight;
            }

            if(Date.now() - this.immuneTimer >= this.immuneDelay){
                this.immune = false;
                this.tiledImage.angle = this.barrelAngle;
                if(this.health <= 0){
                    this.dies();
                }
            }
        }

        if(player.length > 0){
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

        this.tiledImage.tick(this.x, this.y);
    }
}

export class Hammer{
    constructor(id, x, y){
        this.tileHeight = 340; //Change these values if you change the this.scale value
        this.tileWidth = 168;
        this.type = "Hammer"; //What is this ennemie
        this.delay = 600; //Adds a delay between hammer swings
        this.timer = ""; //Calculates the time between hammer swings 
        this.path = "./img/Ennemies/Hammer/Hammer.png"; //Determines the model of the ennemi
        this.alive = false; //Is the ennemie alive  
        this.health = 0; //Health the ennemie
        this.didDamage = false; //Did the ennemi already do damage
        this.damage = 100; //Amount of damage an attack does 
        this.id = id; //Ennemi id
        this.x = x; //X position
        this.y = y; //Y position 
        this.roof = y; //Makes sure the ennemie stays on its roof 
        this.leftValue = ""; //Useful to despawn the ennemi when out of sight 
        this.topValue = "";
        this.colCount = 8;
        this.rowCount = 1;
        this.refreshDelay = 150;
        this.loopColumns = true;
        this.scale = 0.75;
        this.node = document.createElement("div");
        document.querySelector("#game").append(this.node);
        this.beginAnimation = Date.now() - this.refreshDelay; //Puts a delay between the platforms animation
        this.spawnDelay = 2025 //Time in millisecond until the first animation begins 
        this.animationBegan = false; //Has its animation already begun

        this.tiledImage = new TiledImage(
            this.path,
			this.colCount,
			this.rowCount,
			this.refreshDelay,
			this.loopColumns,
			this.scale,
			this.node
        )

        this.tiledImage.changeRow(0);
        this.tiledImage.changeMinMaxInterval(0,0);
    }

    tick(tiles, player) {
        if(Date.now() - this.beginAnimation >= this.spawnDelay && !this.animationBegan){ //Makes sure the animations are properly timed
            this.animationBegan = true;
            this.tiledImage.changeMinMaxInterval(0,7);
        }

        this.y = tiles[this.roof].y - tiles[this.roof].baseY + tileSize; //Makes sure the hammer stays at its intented height

        if(player.length > 0){
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

            if((this.leftValue > window.innerWidth || this.leftValue < -this.tileWidth 
                || this.topValue > window.innerHeight || this.topValue < -this.tileHeight) 
                && !player[0].changeScreenSize){
                this.node.style.display = "none";
            }
            else{
                this.node.style.display = "block";
            }

            if((((player[0].x + rightCharacterLimit >= this.x && player[0].x + rightCharacterLimit <= this.x + this.tileWidth) //Makes sure at least the left or right side of the player is on the block
            || (player[0].x + leftCharacterLimit >= this.x && player[0].x + leftCharacterLimit <= this.x + this.tileWidth))) 
            && player[0].y + topCharacterLimit > this.y && player[0].y + topCharacterLimit < this.y + this.tileHeight 
            && this.tiledImage.imageCurrentCol >= 1 && this.tiledImage.imageCurrentCol <= 4 
            && !player[0].immune && player[0].health > 0 
            && !player[0].resetRight && !player[0].resetLeft && !player[0].resetTop && !player[0].resetBottom){ //Makes the surte the screen is not scrolling when dealing damage
                this.didDamage = true;
                player[0].takeDamage(this.damage, this.x, this.tileWidth); //Makes the player take damage when under a hammer
            }

            
            if(this.tiledImage.imageCurrentCol == 0 && this.timer == ""){
                this.tiledImage.changeMinMaxInterval(0,0);
                this.timer = Date.now();
            }

            if(Date.now() - this.timer >= this.delay && this.timer != ""){ 
                this.tiledImage.changeMinMaxInterval(0,7);
                this.timer = "";
                this.didDamage = false;
                this.tiledImage.imageCurrentCol = 1;
            }
        }
        
        this.tiledImage.tick(this.x, this.y);
    }
}

export class Boss{
    constructor(id, x, y, level, levelLimits){
        this.level = level //Current level
        this.id = id; //Boss id
        this.type = "Boss";
        this.in = true; //Is the boss in his car or no
        this.out = false; //Let's boss get out of his car
        this.colCount = 6; //TiledImage info
        this.rowCount = 5;
        this.refreshDelay = 150;
        this.loopColumns = true;
        this.scale = 0.4;
        this.pathIn = "./img/Ennemies/CarBoss/ChartIn.png"; //Sprite sheet for the boss in the car
        this.pathOut = "./img/Ennemies/CarBoss/ChartOut.png"; //Sprite sheet for the boss out of the car
        this.tileHeightIn = 196; //Change these values if you change the this.scale value
        this.tileWidthIn = 280; 
        this.tileHeightOut = 200; 
        this.tileWidthOut = 170;
        this.tileHeight = this.tileHeightIn;
        this.tileWidth = this.tileWidthIn;
        if(this.level == 1){
            this.leftLimit0 = levelLimits[6]; //update
            this.rightLimit0 = levelLimits[7];
        }
        else if(this.level == 2){
            this.leftLimit0 = levelLimits[0];
            this.rightLimit0 = levelLimits[1];
        }
        this.x = x; //X position
        this.y = y; //Y position 
        this.floor = y; //Floor position
        this.speedInDefault = 4; //Speed of the boss when in the car
        this.speedIn = this.speedInDefault; 
        this.speedOutDefault = 2;//Speed of the boss when out of the car
        this.speedOut = this.speedOutDefault;
        this.overDriveBuffer = 500; //If the boss passes the player while in his car he'll keep driving a bit
        this.immune = false; //Is the ennemi immune to damage
        this.immuneCheck = false; //Enables the hurt animation 
        this.immuneTimer = ""; //Let's us know for how long the ennemi is immune
        this.immuneDelay = 1200; //Delay during which the ennemi is immune
        this.alive = true; //Is he alive
        this.deathTimer = ""; //How long has the boss been unalived
        this.deathDelay = 5000; //Time between the first and second phase
        this.healthIn = 500; //Health in the car
        this.healthOut = 500; //Health out of the car
        this.attacking = true; //Is the boss attacking the player
        this.attackingCheck = false; //Has the animation for the attack started 
        this.attackTimer = ""; //Delay between attacks
        this.attackDelay = 2000; //Duration of the delay between attacks
        this.rollingDamage = 50; //Amount of damage the rolling attack does 
        this.batDamage = 100; //Amount of damage the bat attack does
        this.batRange = 50; //Range of the bat attack when the boss is out of his car
        this.walking = false; //Is the boss walking towards the player
        this.walkingCheck = false; //Has the animation for walking started
        this.walkingTimer = ""; //Delay between walking
        this.walkingDelay = 2000; //Duration of the delay between walking
        this.node = document.createElement("div"); //Node of the boss
        this.secondNode = document.createElement("div"); //Necessary to avoid a visual glitch
        document.querySelector("#game").append(this.node);

        this.tiledImage = new TiledImage(
            this.pathIn,
			this.colCount,
			this.rowCount,
			this.refreshDelay,
			this.loopColumns,
			this.scale,
			this.node
        )

        this.tiledImage.changeRow(0);
        this.tiledImage.changeMinMaxInterval(0,3);
    }

    takeDamage(damage) { //Makes sure the boss takes damage
        if(this.in){
            this.healthIn -= damage;
        }
        else{
            this.healthOut -= damage;
        }
        
        if(this.alive){
            this.immuneTimer = Date.now();
            this.immune = true;
        }
    }

    tick(tiles, player, ennemies, gameState){

        if(this.in){
            this.y = tiles[this.floor].y - tiles[this.floor].baseY - this.tileHeightIn; //Makes sure the boss stays at its intented height
        }
        else{
            this.y = tiles[this.floor].y - tiles[this.floor].baseY - this.tileHeightOut; //Makes sure the boss stays at its intented height
        }

        if(!this.attacking && Date.now() - this.attackTimer > this.attackDelay && this.in && gameState.playing){ //Makes the boss attacks once the delay is over
            this.attacking = true;
        }
        else if(!this.walking && this.out && Date.now() - this.walkingTimer > this.walkingDelay && gameState.playing){ //Makes the boss walks once the delay is over
            this.walking = true;
        }

        if(this.walking && player.length > 0 && this.alive){ //Makes the boss walk towards the player
            if(!player[0].resetBottom && !player[0].resetTop && !player[0].resetLeft && !player[0].resetRight){ //Makes sure the boss doesnt move while the screen is scrolling
                if(!this.walkingCheck && player[0].x >= this.x){
                    this.walkingCheck = true;
                    this.tiledImage.flipped = false;
                    this.tiledImage.changeRow(1);
                    this.tiledImage.changeMinMaxInterval(0,5);
                    this.speedOut = this.speedOutDefault;
                }
                else if(!this.walkingCheck && player[0].x < this.x){
                    this.walkingCheck = true;
                    this.tiledImage.flipped = true;
                    this.tiledImage.changeRow(1);
                    this.tiledImage.changeMinMaxInterval(0,5);
                    this.speedOut = -this.speedOutDefault;
                }
    
                if((this.speedOut == this.speedOutDefault && this.x + this.tileWidth > player[0].x + leftCharacterLimit) //If the player is close enough, try and attack him
                    || (this.speedOut == -this.speedOutDefault && this.x <= player[0].x + rightCharacterLimit / 2)){
                    this.walking = false;
                    this.walkingCheck = false;
                    this.walkingTimer = Date.now();
                    this.attacking = true;
                    this.attackingCheck = false;
                }
                else{ //Makes the boss visually move
                    this.x += this.speedOut;
                }
            }
        }

        if(this.attacking && player.length > 0 && this.alive && !this.immune){
            if(!player[0].resetBottom && !player[0].resetTop && !player[0].resetLeft && !player[0].resetRight){ //Makes sure the boss doesnt move while the screen is scrolling 
                if(!this.attackingCheck){ //Starts the animation for the attack
                    this.attackingCheck = true;
                    if(this.in){
                        this.tiledImage.changeRow(1);
                        this.tiledImage.changeMinMaxInterval(0,3);
                    }
                    else{
                        this.tiledImage.changeRow(2);
                        this.tiledImage.changeMinMaxInterval(0,5);
                    }
                }
    
                if(this.in  //Changes the direction of the boss for his next attack when he is in the car
                    && (player[0].x >= this.x + this.overDriveBuffer 
                    || this.x <= tiles[this.leftLimit0].x 
                    || this.x <= 0)                
                    && this.speedIn != this.speedInDefault){
                    this.speedIn = this.speedInDefault;
                    this.tiledImage.flipped = false;
                    this.attackTimer = Date.now();
                    this.attacking = false;
                    this.attackingCheck = false;

                    if(!this.immune){
                        this.tiledImage.changeRow(0);
                        this.tiledImage.changeMinMaxInterval(0,3);
                    }
                }
                else if(this.in //Changes the direction of the boss for his next attack when he is in the car
                    && (player[0].x < this.x - this.overDriveBuffer 
                    || this.x + this.tileWidthIn >= tiles[this.rightLimit0].x + tileSize
                    || this.x + this.tileWidthIn >= window.innerWidth) 
                    && this.speedIn != -this.speedInDefault){
                    this.speedIn = -this.speedInDefault;
                    this.tiledImage.flipped = true;
                    this.attackTimer = Date.now();
                    this.attacking = false;
                    this.attackingCheck = false;
                    if(!this.immune){
                        this.tiledImage.changeRow(0);
                        this.tiledImage.changeMinMaxInterval(0,3);
                    }
                }
                
                if(this.in){ //While in his car, the boss will charge towards the player
                    this.x += this.speedIn; 
    
                    if(((player[0].x + rightCharacterLimit >= this.x && player[0].x + leftCharacterLimit < this.x) //Whenever the player is hit by car while it is rolling deal damage to him
                        || (player[0].x + leftCharacterLimit <= this.x + this.tileWidth && player[0].x + rightCharacterLimit > this.x + this.tileWidth)) 
                        && player[0].y + bottomCharacterLimit > this.y + 100 && player[0].y + topCharacterLimit < this.y + this.tileHeight 
                        && !player[0].immune){
                        if(this.tiledImage.flipped){
                            player[0].takeDamage(this.rollingDamage, this.x, -this.tileWidth);
                        }
                        else{
                            player[0].takeDamage(this.rollingDamage, this.x * 100, this.tileWidth * 100); //Let's us send the player in the opposite direction that the boss is heading 
                        }
                    }
                }
                else if(this.tiledImage.imageCurrentCol >= 3 && this.tiledImage.imageCurrentCol <= 5 //Lets the boss do damage with the bat attack
                        && ((player[0].x + rightCharacterLimit > this.x && player[0].x + leftCharacterLimit < this.x) 
                        || (player[0].x + leftCharacterLimit < this.x + this.tileWidth && player[0].x + rightCharacterLimit > this.x + this.tileWidth) 
                        || (player[0].x + rightCharacterLimit < this.x + this.tileWidth && player[0].x + rightCharacterLimit > this.x)) 
                        && player[0].y + bottomCharacterLimit > this.y + 100 && player[0].y + topCharacterLimit < this.y + this.tileHeight 
                        && !player[0].immune && !this.walking){
                    player[0].takeDamage(this.batDamage, this.x, this.tileWidth);
                }
    
                if(this.out && this.tiledImage.imageCurrentCol == 5 && this.attackingCheck){
                    this.attacking = false;
                    this.attackingCheck = false;
                    if(this.walking){
                        this.tiledImage.changeRow(1);
                        this.tiledImage.changeMinMaxInterval(0,5);
                    }
                    else{
                        this.tiledImage.changeRow(0);
                        this.tiledImage.changeMinMaxInterval(0,3);
                    }
                }
            }
        }

        if(this.immune){ //Plays an animation when the boss is immune and in his car
            if(!this.immuneCheck && this.in){
                this.immuneCheck = true;
                this.tiledImage.changeRow(2);
                this.tiledImage.changeMinMaxInterval(0,1);
            }
            else if(!this.immuneCheck && !this.in){
                this.immuneCheck = true;
                this.walkingTimer = Date.now();
                this.tiledImage.changeRow(3);
                this.tiledImage.changeMinMaxInterval(0,1);
            }
            
            if(Date.now() - this.immuneTimer > this.immuneDelay && this.healthIn > 0){
                this.immune = false;
                this.immuneCheck = false;
                this.immuneTimer = "";
                if(this.attackingCheck){ //Puts the boss back in the animation it should be in rn once the immune delay is over
                    this.tiledImage.changeRow(1);
                    this.tiledImage.changeMinMaxInterval(0,3);
                }
                else{
                    this.tiledImage.changeRow(0);
                    this.tiledImage.changeMinMaxInterval(0,3);
                }
            }
            else if(Date.now() - this.immuneTimer > this.immuneDelay && this.healthOut > 0 && !this.in){ //Cancels the boss immunity once the timer has run out
                this.immune = false;
                this.immuneCheck = false;
                this.immuneTimer = "";
            }
            else if((this.healthIn <= 0 && this.in) || (this.healthOut <= 0 && !this.in)){ //If the boss has died for the first time 
                this.alive = false;
            }
        }
        
        if(this.in && !this.alive || (this.healthOut > 0 && Date.now() - this.deathTimer <= this.deathDelay && this.deathTimer != "")){
            if(this.in){ //Plays an animation once the boss dies for the first time 
                this.in = false;
                this.deathTimer = Date.now();
                this.tiledImage.changeRow(3);
                this.tiledImage.changeMinMaxInterval(0,5);
            }

            if(this.tiledImage.imageCurrentCol == 5){ //Stops the animation when it has ended for the first time
                this.tiledImage.changeMinMaxInterval(5,5);
            }
        }
        else if(!this.in && !this.alive && Date.now() - this.deathTimer > this.deathDelay && this.healthOut > 0){
            if(!this.out){ //Takes the boss out of his car
                this.out = true;
                this.tiledImage.changeRow(4);
                this.tiledImage.changeMinMaxInterval(0,5);
            }

            if(this.tiledImage.imageCurrentCol == 5){ //Whenever the get out animation has ended do the next actions 
                let flippedValue = this.tiledImage.flipped;
                this.node.remove(); //Necessary to avoid a visual glitch
                document.querySelector("#game").append(this.secondNode); //Necessary to avoid a visual glitch
                this.tiledImage = new TiledImage( //Creates a new TiledImage for the boss once he is out of his car
                    this.pathOut,
                    this.colCount,
                    this.rowCount,
                    this.refreshDelay,
                    this.loopColumns,
                    this.scale,
                    this.secondNode
                )
                this.alive = true;
                this.attackTimer = "";
                this.attacking = true;
                this.attackingCheck = true;
                this.walkingTimer = Date.now();
                this.tiledImage.flipped = flippedValue;
                this.tileHeight = this.tileHeightOut;
                this.tileWidth = this.tileWidthOut;
                this.tiledImage.changeRow(0);
                this.tiledImage.changeMinMaxInterval(0,3);
                this.deathTimer = "";
            }
        }
        else if((this.out && !this.alive) || (!this.in && !this.out)){
            if(this.out){ //Plays an animation once the boss dies for the second time 
                this.out = false;
                this.tiledImage.changeRow(4);
                this.tiledImage.changeMinMaxInterval(0,3);
            }
            
            if(this.tiledImage.imageCurrentCol == 3){ //Stops the animation when it has ended and removes the boss has it is dead
                this.tiledImage.changeMinMaxInterval(3,3);
                if(this.level == 2){ //Deletes the mobs corps if we're on the chat page
                    this.secondNode.remove();
                    ennemies.splice(this.id, 1);
                    ennemies.forEach(e => {
                       if(e.id > this.id){
                        --e.id;
                       } 
                    });
                }
            }
        }
        
        this.tiledImage.tick(this.x, this.y);
    }
}

export class Mob{
    constructor(id, x, y, model, level, levelLimits, flipped){
        this.id = id; //Id of the mob
        this.type = "Mob"; //Type of ennemie
        this.x = x; //X position of the mob
        this.y = y; //Y position of the mob
        this.floor = y; //Floor position
        this.initialDirection = flipped; //Determines the initial facing direction of the mob 
        this.health = 200; //What is the mobs health
        this.alive = true; //Is the mob alive
        this.immune = false; //is the mob immune
        this.immuneCheck = false; //Is the immune animation playing
        this.immuneTimer = ""; //Counts how long the mob has been immune
        this.immuneDelay = 500; //Time the mob shall be immune 
        this.range = 50; //Range of the mobs attack
        this.speedDefault = 1.5 + Math.random(); //Speed of the mob
        this.speed = this.speedDefault;
        this.walking = false; //Is the chracter walking 
        this.walkingCheck = false; //Is the walking animation on
        this.walkingTimer = Date.now(); //Has the minimum delay been reached
        this.walkingDelay = 2000; //Minimum delay between walking animations
        this.idleCheck = false; //Is the idle animation on 
        this.attacking = false; //Is the mob trying to attack the player
        this.attackingCheck = false; //Is the attack animation playing
        this.attackDamage = 25; //Damage of the attack
        this.attackDidDamage = false; //Has the attack already done its share of damage
        this.level = level; //Current level
        this.tileHeight = 150; //Change these values if the scale is changed
        this.tileWidth = 110;
        this.tileMinWidth = 20;
        if(this.level == 1){ //Max and min x position the mob can travel to 
            this.leftLimit0 = levelLimits[4]; //update
            this.rightLimit0 = levelLimits[5];
        }
        else if(this.level == 2){
            this.leftLimit0 = levelLimits[0];
            this.rightLimit0 = levelLimits[1];
        }
        this.colCount = 6; //TiledImage info
        this.rowCount = 5;
        this.refreshDelay = 200;
        this.loopColumns = true;
        this.scale = 0.3;
        if(model > 0.5){
            this.model = 0;
        }
        else{
            this.model = 1;
        }
        this.path = "./img/Ennemies/Mob" + this.model + "/Chart.png"; //Sprite sheet for the boss in the car
        this.node = document.createElement("div");
        document.querySelector("#game").append(this.node);

        this.tiledImage = new TiledImage(
            this.path,
			this.colCount,
			this.rowCount,
			this.refreshDelay,
			this.loopColumns,
			this.scale,
			this.node
        )

        this.tiledImage.changeRow(0);
        this.tiledImage.changeMinMaxInterval(0,3);
        this.tiledImage.flipped = this.initialDirection;
    }

    takeDamage(damage) { //Makes sure the mob takes damage
        this.health -= damage;
        this.immune = true;
        this.immuneCheck = false;
        this.immuneTimer = Date.now();

        if(this.health <= 0){
            this.alive = false;
            this.death();
        }
    }

    death() { //Plays the death animation 
        this.tiledImage.changeRow(4);
        this.tiledImage.changeMinMaxInterval(0,5);
    }

    tick(tiles, player, ennemies, gameState) {
        this.y = tiles[this.floor].y - tiles[this.floor].baseY - this.tileHeight; //Keeps the mob at its intended height

        if(!this.alive && player.length > 0){
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

            if((this.leftValue > window.innerWidth || this.leftValue < -this.tileWidth 
                || this.topValue > window.innerHeight || this.topValue < -this.tileHeight) 
                && !player[0].changeScreenSize){
                this.node.style.display = "none";
            }
            else{
                this.node.style.display = "block";
            }
        }

        if(!this.walking && Date.now() - this.walkingTimer > this.walkingDelay //Makes the mob walk towards the player if the player is within its range
        && player[0].y + topCharacterLimit <= this.y + this.tileHeight 
        && player[0].y + bottomCharacterLimit >= this.y - 90 
        && player[0].x + leftCharacterLimit <= tiles[this.rightLimit0].x + tileSize 
        && player[0].x + rightCharacterLimit >= tiles[this.leftLimit0].x 
        && gameState.playing){
            this.walking = true;
            this.walkingCheck = false;
        }

        if(player.length > 0 && this.alive && this.walking && !this.attacking){
            if(!player[0].resetBottom && !player[0].resetTop && !player[0].resetLeft && !player[0].resetRight){ //Makes sure the mob doesnt move while the screen is scrolling
                if(player[0].x + rightCharacterLimit < this.x + this.tileMinWidth && !this.walkingCheck){ //Plays the left facing walking animation
                    this.walkingCheck = true;
                    this.speed = -this.speedDefault;
                    this.tiledImage.flipped = true;
                    this.tiledImage.changeRow(1);
                    this.tiledImage.changeMinMaxInterval(0,5);
                }
    
                if(player[0].x + leftCharacterLimit > this.x + this.tileWidth && !this.walkingCheck){ //Plays the right facing walking animation 
                    this.walkingCheck = true;
                    this.speed = this.speedDefault;
                    this.tiledImage.flipped = false;
                    this.tiledImage.changeRow(1);
                    this.tiledImage.changeMinMaxInterval(0,5);
                }
    
                if((this.speed == this.speedDefault 
                    && this.x + this.tileWidth >= player[0].x + leftCharacterLimit) 
                    || (this.speed == -this.speedDefault 
                    && this.x + this.tileMinWidth <= player[0].x + rightCharacterLimit)){ //If the mob is close enough to the player then try to attack him
                    this.walking = false;
                    this.walkingCheck = false;
                    this.walkingTimer = Date.now();
                    this.attacking = true;
                    this.attackingCheck = false;
                }

                if(!(player[0].x + leftCharacterLimit <= tiles[this.rightLimit0].x 
                    && player[0].x + rightCharacterLimit >= tiles[this.leftLimit0].x)){ //If the player is no longer within the creeps range, stop moving and start the idle animation 
                    this.walking = false;
                    this.walkingCheck = false;
                    this.walkingTimer = Date.now();
                    this.attacking = false;
                    this.attackingCheck = false;
                    this.tiledImage.changeRow(0);
                    this.tiledImage.changeMinMaxInterval(0,3);
                }
    
                this.x += this.speed; //Makes the mob visiually move
            }
        }

        if(this.attacking && player.length > 0){
            if(!this.attackingCheck){ //Plays the attack animation 
                this.attackingCheck = true;
                this.tiledImage.changeRow(2);
                this.tiledImage.changeMinMaxInterval(0,5);
            }

            if(((player[0].x + rightCharacterLimit < this.x + this.tileWidth //Makes sure that the player takes damage whenever he is within the range of an attack, isnt immune and is alive
                && player[0].x + rightCharacterLimit > this.x + this.tileMinWidth - this.range 
                && this.tiledImage.flipped) 
                || (player[0].x + leftCharacterLimit > this.x + this.tileMinWidth 
                && player[0].x + leftCharacterLimit < this.x + this.tileWidth + this.range 
                && !this.tiledImage.flipped)) 
                && player[0].y + topCharacterLimit <= this.y + this.tileHeight 
                && player[0].y + bottomCharacterLimit >= this.y + 90
                && this.tiledImage.imageCurrentCol >= 2 && this.tiledImage.imageCurrentCol <= 5 
                && !this.attackDidDamage && this.alive && !player[0].immune && player[0].alive){
                player[0].takeDamage(this.attackDamage, this.x, this.tileWidth);
                this.attackDidDamage = true;
            }

            if(this.tiledImage.imageCurrentCol == 5 && this.alive){ //Makes sure the attack animation is only played once per attack cycle
                this.attacking = false;
                this.attackingCheck = false;
                this.attackDidDamage = false;
                this.tiledImage.changeRow(0);
                this.tiledImage.changeMinMaxInterval(0,3);
            }
        }

        if(this.immune){
            if(!this.immuneCheck && this.alive){ //If the mob is immune to damage, plays the immune animation 
                this.immuneCheck = true;
                this.walking = false;
                this.walkingCheck = false;
                this.walkingTimer = Date.now() - this.immuneDelay * 2.8;
                this.attacking = false;
                this.attackingCheck = false;
                this.attackDidDamage = false;
                this.tiledImage.changeRow(3);
                this.tiledImage.changeMinMaxInterval(0,1);
            }

            if(Date.now() - this.immuneTimer >= this.immuneDelay && this.alive){ //Once the immune delay is over, cancel the mobs immunity
                this.immune = false;
                this.tiledImage.changeRow(0);
                this.tiledImage.changeMinMaxInterval(0,3);
            }

            if(!this.alive && this.tiledImage.imageCurrentCol == 5){ //Stops the death animation once it has reach the end of its first cycle
                this.tiledImage.changeMinMaxInterval(5,5);
                this.tiledImage.setLooped(false);
                this.immune = false;
                if(this.level == 2){ //Deletes the mobs corps if we're on the chat page
                    this.node.remove();
                    ennemies.splice(this.id, 1);
                    ennemies.forEach(e => {
                       if(e.id > this.id){
                        --e.id;
                       } 
                    });
                }
            }
        }

        this.tiledImage.tick(this.x, this.y); 
    }
}