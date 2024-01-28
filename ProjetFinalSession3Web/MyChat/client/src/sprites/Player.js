import { TiledImage } from "../TiledImage.js";
import { tileSize } from "../page-index.js";

export const leftCharacterLimit = 46; //Actual boundrys of the player model
export const rightCharacterLimit = 100;
export const bottomCharacterLimit = 145;
export const topCharacterLimit = 40;
let colCount = 8; //Important info for tiledImage
let rowCount = 12;
let refreshDelay = 150;
let fastestRefreshDelay = 80;
let fastRefreshDelay = 100;
let slowRefreshDelay = 250;
let loopColumns = true;
let scale = 0.3;
let roof = -100; //Highest platform meeting the requirement to stop the player 

export class Player{
    constructor(model, level, levelLimits) {
        this.level = level; //Let's us keep track of which level were in 
        this.model = model; //Determines the model of the player, to be added later
        this.changeScreenSize = false; //Determines if the screen has been moved
        this.resetSpeed = 8; //Speed at which the reset occurs 
        this.resetRight = false; //Allows for a reset to happen
        this.resetLeft = false; //Allows for a reset to happen
        this.resetTop = false; //Allows for a reset to happen
        this.firstScrollTop = Date.now() //Makes sure everything is loaded in before scrolling (Helps a bit with performance)
        this.resetBottom = false; //Allows for a reset to happen
        this.canScrollBottom = true; //Makes sure we dont scroll further down then should be allowed 
        if(this.level == 0){ //Determines the boundrys of the level for the player and respawn points (boundrys are different depending on the level)
            this.leftLimit0 = levelLimits[0];
            this.leftLimit1 = levelLimits[1];
            this.leftLimit2 = levelLimits[2];
            this.rightLimit0 = levelLimits[5];
            this.respawn1 = null;
            this.respawn2 = null;
            this.respawn3 = null;
        }
        else if(this.level == 1){
            this.leftLimit0 = levelLimits[0];
            this.leftLimit1 = levelLimits[1]; //update
            this.leftLimit2 = levelLimits[2];
            this.rightLimit0 = levelLimits[7];
            this.respawn1 = levelLimits[5];
            this.respawn2 = levelLimits[2];
            this.respawn3 = levelLimits[6];
        }
        else if(this.level == 2){
            this.leftLimit0 = levelLimits[0];
            this.leftLimit1 = levelLimits[0];
            this.leftLimit2 = levelLimits[0];
            this.rightLimit0 = levelLimits[1];
            this.respawn1 = null;
            this.respawn2 = null;
            this.respawn3 = null;
        }
        this.moving = false; //Checks if the player is moving 
        this.falling = false; //Checks if the player is not on a platform
        this.fallingCheck = false; //Checks if the player is falling
        this.fallingMomentum = 0; //Represents the momentum of the player when falling 
        this.running = false; //Checks if the player is running
        this.runCheck = false; //Checks if the player is running
        this.jumping = false; //Checks if the player is jumping
        this.jumpCheck = false; //Checks if the player is jumping 
        this.doublejump = false; //Checks if the player is doing a double jump 
        this.doublejumpCheck = false; //Checks if the player is doing a double jump 
        this.punch = false; //Checks if the player is punching
        this.punchCheck = false; //Checks if the player is punching 
        this.punchRange = 30; //Range of the punch attack standing or running 
        this.punchDamage = 25; //Damage of the punch attack standing 
        this.punchRunningDamage = 50; //Damage of the punch attack running 
        this.punchOver = Date.now(); //Helps check if the players punch is over
        this.attackOne = false; //Checks if the player is using attackOne
        this.attackOneCheck = false; //Checks if the player is using attackOne
        this.attackOneRange = 30; //Range of the attack standing or running 
        this.attackOneDamage = 25; //Damage of the attack standing
        this.attackOneOver = Date.now(); //Helps check if the players attackOne is over
        this.attackTwo = false; //Checks if the player is using attackOne
        this.attackTwoCheck = false; //Checks if the player is using attackOne
        this.attackTwoRange = 50; //Range of the attack standing or walking
        this.attackTwoDamage = 100; //Damage of the attack standing or walking
        this.attackTwoOver = Date.now(); //Helps check if the players attackOne is over
        this.didDamage = { //Checks if the attack as already done its share of damage (Needs to be an object otherwise the values won't be modified by a function)
            punchDidDamage : false,
            attackOneDidDamage : false,
            attackTwoDidDamage : false
        }
        this.climbing = false; //Checks if the player is climbing
        this.climbingCheck = false; //Checks if the player is climbing
        this.tempFloorID; //Usefull to konw when were at the top of a ladder 
        this.floor = (window.innerHeight) / 1.2; //Highest platform meeting the requirement to stop the player 
        this.floorID = ""; //Contains the value of the block that serves as floor 
        this.moveRight = false; //Checks if the player is going right
        this.moveLeft = false; //Checks if the player is going left
        this.canMove = true; //Makes sure the player isnt trying to go inside a block 
        this.defaultX = -40; //Default X position of the player model
        this.x = this.defaultX + 20; //X position of the player model
        this.y = -300; //Y position of the player model
        this.alive = true; //Is the player alive
        this.health = 200; //Players health
        this.immune = false; //Determines if the player is immune to damage
        this.immuneTimer = ""; //Determines for how long the player is alive
        this.immuneDelay = 1000; //Time in millisecond for the which the player is immune 
        this.immuneSpeedXDefault = 2;
        this.immuneSpeedX = this.immuneSpeedXDefault; //Kickback the player takes when getting hit
        this.immuneSpeedYDefault = 5;
        this.immuneSpeedY = this.immuneSpeedYDefault; //Kickback the player takes when getting hit
        this.gravity = 0.1; //Characters gravity
        this.walkingSpeed = 2; //Walking speed
        this.runningSpeed = 3; //Running speed
        this.climbingSpeed = 1; //Climbing speed
        this.jumpHeightDefault = 6; //Jumping height
        this.jumpingHeight = this.jumpHeightDefault; //Current jump height addition
        this.node = document.createElement("div");
        document.querySelector("#game").append(this.node);
        this.node.style.zIndex = 2;
        
        this.tiledImage = new TiledImage(
			"./img/Player/" + this.model + "/Chart.png",
			colCount,
			rowCount,
			refreshDelay,
			loopColumns,
			scale,
			this.node
		);

        this.tiledImage.changeRow(0);
		this.tiledImage.changeMinMaxInterval(0,3);
    }

    changeTiledImage(moving, runCheck, refresh, row, intervalMin, intervalMax) {
        this.moving = moving; //Is the player moving
        this.runCheck = runCheck; //Is the player running
        this.tiledImage.tickRefreshInterval = refresh; //What is the animations desired refresh delay
        this.tiledImage.changeRow(row); //Where is the animation in the sprite sheet
        this.tiledImage.changeMinMaxInterval(intervalMin,intervalMax); //What amount of frames does the animation have
    }

    resetAnimation(){
        if(this.moveRight && this.moving){ //Puts the animation at what it needs to be after the jump or falling
            if(!this.runCheck){
                this.changeTiledImage(true, false, refreshDelay, 1, 0, 5);
            }
            else if(this.runCheck){
                this.changeTiledImage(true, true, fastRefreshDelay, 2, 0, 5);
            }
        }
        else if(this.moveLeft && this.moving){
            if(!this.runCheck){
                this.changeTiledImage(true, false, refreshDelay, 1, 0, 5);
            }
            else if(this.runCheck){
                this.changeTiledImage(true, true, fastRefreshDelay, 2, 0, 5);
            }
        }
    }

    death() {
        this.changeTiledImage(false, false, refreshDelay, 10, 0, 5);
    }

    takeDamage(damage, ennemiX, ennemiWidth){
        this.health -= damage;
        this.immune = true;

        if(this.x + leftCharacterLimit > ennemiX + ennemiWidth/2){
            this.immuneSpeedX = -this.immuneSpeedXDefault;
        }

        if(this.health <= 0){
            this.death();
        }
    }

    doDamage(ennemies, attackOver, refresh, beginning, end, didDamage, range, damage) {
        if(Date.now() - attackOver >= refresh * beginning //Determines the hitbox of the attack
        && Date.now() - attackOver < refresh * end){
            ennemies.forEach(e => {
                if(!didDamage.punchDidDamage //Find an ennemy to hit wheter the player is facing right or left
                    && !didDamage.attackOneDidDamage 
                    && !didDamage.attackTwoDidDamage
                    && !e.immune 
                    && e.alive
                    && ((!this.tiledImage.flipped 
                    && ((e.x >= this.x + leftCharacterLimit && e.x <= this.x + rightCharacterLimit + range) //Checks that the ennemy is within the x range of the attack on the right
                    || (e.x <= this.x + rightCharacterLimit + range && e.x + e.tileWidth >= this.x + rightCharacterLimit + range))) //Failsafe for bigger ennemi hitboxes
                    || (this.tiledImage.flipped 
                    && ((e.x + e.tileWidth <= this.x + rightCharacterLimit && e.x + e.tileWidth >= this.x + leftCharacterLimit - range)//Checks that the ennemy is within the x range of the attack on the left
                    || (e.x <= this.x + leftCharacterLimit - range && e.x + e.tileWidth >= this.x + leftCharacterLimit - range))))  
                    && ((e.y >= this.y + topCharacterLimit && e.y <= this.y + bottomCharacterLimit) //Checks that the ennemy is within the y range of the attack
                    || (e.y + e.tileHeight >= this.y + topCharacterLimit && e.y + e.tileHeight <= this.y + bottomCharacterLimit))){
                    e.takeDamage(damage);
                    if(this.punch){ //did that attack already do damage
                        didDamage.punchDidDamage = true;
                    }
                    else if(this.attackOne){
                        didDamage.attackOneDidDamage = true;
                    }
                    else if(this.attackTwo){
                        didDamage.attackTwoDidDamage = true;
                    }
                }
            });
        }
    }

    tick(tiles, ennemies, objects, gameState) {
        if(this.changeScreenSize && this.floorID != "" && !this.resetTop && !this.resetBottom){ //Changes the player y position if the screen changed size
            this.y = tiles[this.floorID].y - tiles[this.floorID].baseY - bottomCharacterLimit;
            this.changeScreenSize = false;
        }

        if(!this.resetRight && !this.resetLeft && !this.resetTop && !this.resetBottom){
            if(!this.climbing){
                this.falling = true; //Is the character falling, true until proven wrong
                let checkOnce = false; //If the tile where the player is standing is found there's no use in checking the others
                let checkOnce2 = false; //If the tile above the player is found there's no use in checking the others 
                tiles.forEach(e => {
                    if(e.walkable //Makes sure we're checking only walkable blocks and that we only find one candidate
                        && ((!checkOnce
                        && ((this.x + rightCharacterLimit >= e.x && this.x + rightCharacterLimit <= e.x + tileSize) //Makes sure at least the left or right side of the player is on the block
                        || (this.x + leftCharacterLimit >= e.x && this.x + leftCharacterLimit <= e.x + tileSize)) 
                        && e.y - e.baseY >= this.y + bottomCharacterLimit) //Makes sure the player is above the tile
                        || (e.y - e.baseY < this.floor //If a piece of ground is above the first one found still checks if it could be the floor
                        && ((this.x + rightCharacterLimit >= e.x && this.x + rightCharacterLimit <= e.x + tileSize) //Makes sure at least the left or right side of the player is on the block
                        || (this.x + leftCharacterLimit >= e.x && this.x + leftCharacterLimit <= e.x + tileSize))  
                        && this.y + bottomCharacterLimit <= e.y - e.baseY))){ //Makes sure the player is above the tile
                        this.floor = e.y - e.baseY;
                        this.floorID = e.id; 
                        checkOnce = true;

                        if(this.floorID == this.respawn1 && gameState.respawn == 0){ //Changes the players respawn point
                            ++gameState.respawn;
                        }
                        else if(this.floorID == this.respawn2 && gameState.respawn == 1){
                            ++gameState.respawn;
                        }
                        else if(this.floorID == this.respawn3 && (gameState.respawn == 2 || gameState.respawn == 1)){
                            gameState.respawn = 3;
                        }
                    }
                    if(e.walkable && e.model != 1 //Makes sure we're checking only walkable blocks except top of ladders and that we only find one candidate
                        && ((!checkOnce2 && this.y + topCharacterLimit >= e.y - e.baseY + tileSize 
                        && ((this.x + rightCharacterLimit >= e.x && this.x + rightCharacterLimit <= e.x + tileSize) //Makes sure at least the left or right side of the player is on the block
                        || (this.x + leftCharacterLimit >= e.x && this.x + leftCharacterLimit <= e.x + tileSize))) 
                        || ((this.y + topCharacterLimit > e.y - e.baseY + tileSize //Makes sure the closest roof is found 
                        && e.y - e.baseY + tileSize > roof)
                        && ((this.x + rightCharacterLimit >= e.x && this.x + rightCharacterLimit <= e.x + tileSize) //Makes sure at least the left or right side of the player is on the block
                        || (this.x + leftCharacterLimit >= e.x && this.x + leftCharacterLimit <= e.x + tileSize))))){
                        roof = e.y - e.baseY + tileSize;
                        checkOnce2 = true;
                    }
                });
    
                if(checkOnce == false){ //Makes sure that if the player isnt over ground he falls
                    this.floor = window.innerHeight + 200;
                }
    
                if(checkOnce2 == false){ //Makes sure that if the player doesnt have a roof above his head he can jump his full height
                    roof = -300;
                }
    
                if(this.y + bottomCharacterLimit == this.floor || this.jumping){ //Resets falling checks whenever the player is on the ground
                    this.falling = false;
                    this.fallingCheck = false;
                    this.fallingMomentum = 0;
                }

                if(!this.jumping && (this.falling || (this.y + bottomCharacterLimit < this.floor)) && !this.immune){
                    if(!this.fallingCheck){
                        this.fallingCheck = true;
                        this.changeTiledImage(true, false, slowRefreshDelay, 3, 0, 3);
                    }
    
                    if(this.y + bottomCharacterLimit + this.fallingMomentum + this.gravity <= this.floor && !this.immune){
                        this.fallingMomentum += this.gravity;
                        this.y += this.fallingMomentum;
                    }
                    else if(!this.immune){
                        this.y = this.floor - bottomCharacterLimit;
                        this.resetAnimation();
                    }
                }
            }

            if(this.moveRight && !this.immune){ //Lets the player walk to the right
                if((!this.moving && !this.running && !this.jumpCheck && !this.punchCheck && !this.attackOneCheck && !this.attackTwoCheck) 
                    || (this.moving && this.runCheck && !this.running && !this.jumpCheck && !this.falling)){ //Walking animation
                    this.changeTiledImage(true, false, refreshDelay, 1, 0, 5);
        
                }
                else if(!this.runCheck && this.running && !this.jumpCheck && !this.falling){ //Running animation
                    this.changeTiledImage(true, true, fastRefreshDelay, 2, 0, 5);
                }
    
                tiles.forEach(e => { //Makes sure the player can't move into a block
                    if(e.model != 1 && e.walkable
                        && (this.x + rightCharacterLimit + this.runningSpeed >= e.x //Checks 3 points on the y axis and one on the x axis of the player
                        && this.x + rightCharacterLimit + this.runningSpeed <= e.x + tileSize
                        && (this.y + 90 <= e.y - e.baseY + tileSize && this.y + 100 > e.y - e.baseY //Middle of the player model
                        || this.y + topCharacterLimit <= e.y - e.baseY + tileSize && this.y + topCharacterLimit > e.y - e.baseY //Top of the player model
                        || this.y + bottomCharacterLimit <= e.y - e.baseY + tileSize && this.y + bottomCharacterLimit > e.y - e.baseY))){ //Bottom of the player model 
                        this.canMove = false;
                    }
                });
    
                if(!this.running && this.x + rightCharacterLimit + this.walkingSpeed <= window.innerWidth && this.canMove){ //Visually moves the character
                    this.x += this.walkingSpeed;
                }
                else if(this.running && this.x + rightCharacterLimit + this.runningSpeed <= window.innerWidth && this.canMove){
                    this.x += this.runningSpeed;
                }

                this.canMove = true; //Resets the check 
            }
    
            if(this.moveLeft && !this.immune){//Lets the player move to the left
                if((!this.moving && !this.running && !this.jumpCheck && !this.punchCheck && !this.attackOneCheck && !this.attackTwoCheck) 
                    || (this.moving && this.runCheck && !this.running && !this.jumpCheck && !this.falling)){ //Walking animation
                    this.changeTiledImage(true, false, refreshDelay, 1, 0, 5);
                }
                else if(!this.runCheck && this.running && !this.jumpCheck && !this.falling){ //Running animation
                    this.changeTiledImage(true, true, fastRefreshDelay, 2, 0, 5);
                }
    
                tiles.forEach(e => { //Makes sure the player can't move into a block
                    if(e.model != 1 && e.walkable
                        && (this.x + leftCharacterLimit - this.runningSpeed <= e.x + tileSize //Checks 3 points on the y axis and one on the x axis of the player
                        && this.x + leftCharacterLimit - this.runningSpeed >= e.x
                        && (this.y + 90 <= e.y - e.baseY + tileSize && this.y + 90 > e.y - e.baseY //Middle of the player model
                        || this.y + topCharacterLimit <= e.y - e.baseY + tileSize && this.y + topCharacterLimit > e.y - e.baseY //Top of the player model
                        || this.y + bottomCharacterLimit <= e.y - e.baseY + tileSize && this.y + bottomCharacterLimit > e.y - e.baseY))){ //Bottom of the player model 
                        this.canMove = false;
                    }
                });
    
                if(!this.running && this.x - this.walkingSpeed + leftCharacterLimit >= 0 && this.canMove){ //Visually moves the character and makes sure he doesnt go out of the screen
                    this.x -= this.walkingSpeed;
                }
                else if(this.running && this.x - this.runningSpeed + leftCharacterLimit >= 0 && this.canMove){
                    this.x -= this.runningSpeed;
                }
                this.canMove = true; //Resets the check
            }
    
            if(this.jumping && !this.immune){ //Lets the player jump
                if(!this.jumpCheck){
                    this.jumpCheck = true;
                    this.punch = false; //Needs to stop any attack that may have been happening prior to the jump
                    this.punchCheck = false;
                    this.punchOver = false;
                    this.didDamage.punchDidDamage = false;
                    this.attackOne = false;
                    this.attackOneCheck = false;
                    this.attackOneOver = false;
                    this.didDamage.attackOneDidDamage = false;
                    this.changeTiledImage(true, false, slowRefreshDelay, 3, 0, 3);
                }
    
                if(this.doublejump && !this.doublejumpCheck){
                    this.doublejumpCheck = true;
                    this.changeTiledImage(true, false, slowRefreshDelay, 4, 0, 5);
                    this.jumpingHeight = this.jumpHeightDefault; //Resets the jump height to simulate a double jump 
                }
    
                if(!this.climbing){ //Need to make sure here that the player is not under a block and can in fact go the full height of his jump 
                    this.jumpingHeight -= this.gravity; //Calculations for the jump in itself
                    this.y -= this.jumpingHeight;
                    if(this.y + topCharacterLimit <= roof){
                        this.y = roof - topCharacterLimit; //Makes sure the player doesnt clip inside the roof 
                        this.jumpingHeight = 0; //Makes the player falls the moment he touches the roof   
                    }
                }
    
                if(!this.falling && (this.y >= this.floor - bottomCharacterLimit || this.climbing)){ //Resets the checks so that the player can jump oncemore
                    this.jumpCheck = false;
                    this.jumping = false;
                    this.doublejumpCheck = false;
                    this.doublejump = false;
                    this.jumpingHeight = this.jumpHeightDefault;

                    if(!this.climbing){
                        this.y = this.floor - bottomCharacterLimit; //Makes sure that the jump didnt put the character inside the block
                    }
    
                    if(!this.moving){ //Resets the animation to what it should be in this instant 
                        this.changeTiledImage(false, false, refreshDelay, 0, 0, 3);
                    }
                    else{
                        this.resetAnimation();
                    }
                }
            }
    
            if(this.punch && !this.immune){ //Lets the player punch (its actually a kick hihi)
                if(!this.punchCheck && !this.runCheck){
                    this.punchCheck = true;
                    this.tiledImage.tickRefreshInterval = fastestRefreshDelay; //What is the animations desired refresh delay
                    this.tiledImage.changeRow(7); //Where is the animation in the sprite sheet
                    this.tiledImage.changeMinMaxInterval(0, 5); //What amount of frames does the animation have
                    this.punchOver = Date.now(); //Times the animation
                }
                else if(!this.punchCheck && this.running && this.runCheck){
                    this.punchCheck = true;
                    this.tiledImage.tickRefreshInterval = fastestRefreshDelay; //What is the animations desired refresh delay
                    this.tiledImage.changeRow(6); //Where is the animation in the sprite sheet
                    this.tiledImage.changeMinMaxInterval(0, 5); //What amount of frames does the animation have
                    this.punchOver = Date.now(); //Times the animation
                }
    
                if(this.running && this.runCheck){
                    this.doDamage(ennemies, this.punchOver, fastestRefreshDelay, 1, 6, this.didDamage, this.punchRange, this.punchRunningDamage);
                }
                else{
                    this.doDamage(ennemies, this.punchOver, fastestRefreshDelay, 2, 6, this.didDamage, this.punchRange, this.punchDamage);
                }

                if(Date.now() - this.punchOver >= fastestRefreshDelay * 6){
                    this.punch = false;
                    this.punchCheck = false;
                    this.punchOver = false;
                    this.didDamage.punchDidDamage = false;
    
                    if(!this.moving){
                        this.changeTiledImage(false, false, refreshDelay, 0, 0, 3);
                    }
                    else if(!this.jumping){
                        this.resetAnimation();
                    }
                }
            }
            
            if(this.attackOne && !this.immune){ //Lets the player use the attack one
                if(!this.attackOneCheck){
                    this.attackOneCheck = true;
                    this.tiledImage.tickRefreshInterval = fastestRefreshDelay; //What is the animations desired refresh delay
                    this.tiledImage.changeRow(8); //Where is the animation in the sprite sheet
                    this.tiledImage.changeMinMaxInterval(0, 5); //What amount of frames does the animation have
                    this.attackOneOver = Date.now(); //Times the animation
                }
                
                this.doDamage(ennemies, this.attackOneOver, fastestRefreshDelay, 2, 6, this.didDamage, this.attackOneRange, this.attackOneDamage);
    
                if(Date.now() - this.attackOneOver >= fastestRefreshDelay * 6){ //The delay needs to be the same as the one preceding this one
                    this.attackOne = false;
                    this.attackOneCheck = false;
                    this.attackOneOver = false;
                    this.didDamage.attackOneDidDamage = false;
    
                    if(!this.moving){
                        this.changeTiledImage(false, false, refreshDelay, 0, 0, 3);
                    }
                    else if(!this.jumping){
                        this.resetAnimation();
                    }
                }
            }
    
            if(this.attackTwo && !this.immune){ //Lets the player use the attack one
                if(!this.attackTwoCheck){
                    this.attackTwoCheck = true;
                    this.tiledImage.tickRefreshInterval = refreshDelay; //What is the animations desired refresh delay
                    this.tiledImage.changeRow(9); //Where is the animation in the sprite sheet
                    this.tiledImage.changeMinMaxInterval(0, 7); //What amount of frames does the animation have
                    this.attackTwoOver = Date.now(); //Times the animation
                }
    
                this.doDamage(ennemies, this.attackTwoOver, refreshDelay, 3, 8, this.didDamage, this.attackTwoRange, this.attackTwoDamage);
    
                if(Date.now() - this.attackTwoOver >= refreshDelay * 8){ //The delay needs to be the same as the one preceding this one
                    this.attackTwo = false;
                    this.attackTwoCheck = false;
                    this.attackTwoOver = false;
                    this.didDamage.attackTwoDidDamage = false;
    
                    if(!this.moving){
                        this.changeTiledImage(false, false, refreshDelay, 0, 0, 3);
                    }
                    else{
                        this.resetAnimation();
                    }
                }
            }
    
            if(this.climbing && !this.immune){
                if(!this.climbingCheck){
                    this.climbingCheck = true;
                    this.tiledImage.tickRefreshInterval = refreshDelay; //What is the animations desired refresh delay
                    this.tiledImage.changeRow(5); //Where is the animation in the sprite sheet
                    this.tiledImage.changeMinMaxInterval(0, 5); //What amount of frames does the animation have
                    tiles.forEach(e => {
                        if(e.model == 1 
                            && ((this.x + rightCharacterLimit >= e.x && this.x + rightCharacterLimit <= e.x + tileSize) //Makes sure at least the left or right side of the player is on the block
                            || (this.x + leftCharacterLimit >= e.x && this.x + leftCharacterLimit <= e.x + tileSize))){
                                this.tempFloorID = e.id;
                            }
                    });   
                }
    
                if(!this.jumping){
                    this.y -= this.climbingSpeed;
                }
    
                if(this.y + bottomCharacterLimit <= tiles[this.tempFloorID].y - tiles[this.tempFloorID].baseY || this.jumping){
                    this.climbing = false;
                    this.climbingCheck = false;
                    if(!this.moving){
                        this.changeTiledImage(false, false, refreshDelay, 0, 0, 3);
                    }
                }
            }

            if(this.immune && this.health > 0){
                if(this.immuneTimer == ""){
                    this.changeTiledImage(true, false, fastRefreshDelay, 11, 0, 1);
                    this.immuneTimer = Date.now();
                    
                }
                if(Date.now() - this.immuneTimer <= this.immuneDelay){
                    tiles.forEach(e => { //Makes sure the player can't move into a block left or right or go out of the map
                        if(this.canMove && e.model != 1 && e.walkable
                            && (((this.x + leftCharacterLimit - this.immuneSpeedX <= e.x + tileSize //Checks 3 points on the y axis and one on the x axis of the player
                            && this.x + leftCharacterLimit - this.immuneSpeedX >= e.x) 
                            || (this.x + rightCharacterLimit + this.immuneSpeedX <= e.x + tileSize 
                            && this.x + rightCharacterLimit + this.immuneSpeedX >= e.x))
                            && (this.y + 90 <= e.y - e.baseY + tileSize && this.y + 90 > e.y - e.baseY //Middle of the player model
                            || this.y + topCharacterLimit <= e.y - e.baseY + tileSize && this.y + topCharacterLimit > e.y - e.baseY //Top of the player model
                            || this.y + bottomCharacterLimit <= e.y - e.baseY + tileSize && this.y + bottomCharacterLimit > e.y - e.baseY))){ //Bottom of the player model 
                            this.canMove = false;
                        }
                    });

                    if(this.canMove 
                        && this.x + leftCharacterLimit - this.immuneSpeedX >= tiles[this.leftLimit0].x 
                        && this.x + rightCharacterLimit + this.immuneSpeedX <= tiles[this.rightLimit0].x + tileSize){
                        this.x -= this.immuneSpeedX; //Knockback on x axis animation 
                    }

                    if(this.y - this.immuneSpeedY - this.gravity + bottomCharacterLimit < this.floor){
                        if(this.y - this.immuneSpeedY + topCharacterLimit > roof){
                            this.immuneSpeedY -= this.gravity;//Knockback on y axis animation    
                            this.y -= this.immuneSpeedY;   
                        }
                        else{
                            this.y = roof - topCharacterLimit + 1; //Makes sure the player doesnt clip inside the roof, also makes sure that this.canMove isn't turned to false
                            this.immuneSpeedY = 0; //Makes the player falls the moment he touches the roof 
                        }  
                    }
                }
                else if(Date.now() - this.immuneTimer > this.immuneDelay){
                    this.immune = false; //Resets the checks
                    this.immuneSpeedY = this.immuneSpeedYDefault;
                    this.immuneSpeedX = this.immuneSpeedXDefault;
                    this.immuneTimer = "";
                    this.canMove = true; 
                }
            }
            else if(this.immune && this.health <= 0 && this.tiledImage.imageCurrentCol == 5){
                this.tiledImage.changeMinMaxInterval(5,5);
                this.alive = false;
            }
    
            if(!this.moveLeft && !this.moveRight && this.moving && !this.jumpCheck && !this.punchCheck && !this.attackOneCheck && !this.climbing && !this.falling && !this.immune){ //Makes the character idle
                this.changeTiledImage(false, false, refreshDelay, 0, 0, 3);
            }
        }

        if(this.y + bottomCharacterLimit > tiles[this.floorID].y - tiles[this.floorID].baseY && this.canScrollBottom){ //Permet de faire tomber le joueur dans le vide sous les platformes, sans que le bottomScroll ne soit triggered
            this.canScrollBottom = false; 
        }
        else if(this.y + bottomCharacterLimit <= tiles[this.floorID].y - tiles[this.floorID].baseY && !this.canScrollBottom){
            this.canScrollBottom = true;
        }

        if(this.y + bottomCharacterLimit == this.floor && !this.canScrollBottom){ //Permet de faire tomber le joueur dans le vide sous les platformes
            this.death();
            this.immune = true;
            this.health = 0;
            this.alive = false;
        }

        if((this.x + rightCharacterLimit + this.runningSpeed >= window.innerWidth 
            && this.floorID != tiles[this.rightLimit0].id //Right most point of a level
            && !this.resetLeft) || this.resetRight){ //Scroll to the left
            this.resetRight = true;
            if(this.x - this.resetSpeed >= this.defaultX + 10){
                this.x -= this.resetSpeed;
                tiles.forEach(e => {
                    e.x -= this.resetSpeed;
                });
                ennemies.forEach(e => {
                    e.x -= this.resetSpeed;
                });
                objects.forEach(e => {
                    e.x -= this.resetSpeed;
                })
            } 
            else{
                this.x = this.defaultX + 30;
                this.resetRight = false;
            }

            if(tiles[this.rightLimit0].x + tileSize <= window.innerWidth){
                this.resetRight = false;
            }   
        }

        if((this.x - this.runningSpeed <= this.defaultX 
            && this.floorID != this.leftLimit0 && this.floorID != this.leftLimit1 && this.floorID != this.leftLimit2 //Left most limits of levels 
            && !this.resetRight) || this.resetLeft){ //Scroll to the right
            this.resetLeft = true;
            if(this.x + this.resetSpeed + rightCharacterLimit + 8.6 <= window.innerWidth){ //Le 8.6 est parce que eeeeueuuuuuhhhhhh euuuuheueeeeueuhuh, marche mal sinon point 
                this.x += this.resetSpeed;
                tiles.forEach(e => {
                    e.x += this.resetSpeed;
                });
                ennemies.forEach(e => {
                    e.x += this.resetSpeed;
                });
                objects.forEach(e => {
                    e.x += this.resetSpeed;
                })
            }
            else{
                this.x = window.innerWidth - 70 - leftCharacterLimit;
                this.resetLeft = false;
            }

            let tempLeft = tiles[this.leftLimit0].node.style.left; //Necessary to ensure that the scrolling stops at the left most point of the map
            let left = "";

            for(let i = 0; i < tempLeft.length; ++i){
                if(tempLeft[i] != "p" && tempLeft[i] != "x"){
                    left += tempLeft[i];
                }
            }

            if(left >= -10){ //Makes sure the scrolling stops if left most tile is @ left 0px
                this.resetLeft = false;
            }
        }

        if((this.y + topCharacterLimit < 0 && !this.resetBottom  && Date.now() - this.firstScrollTop > 1000) || this.resetTop){ //Scroll to the top
            this.resetTop = true;
            
            if(this.y + bottomCharacterLimit + this.resetSpeed <= window.innerHeight){
                this.y += this.resetSpeed;
                tiles.forEach(e => {
                    e.baseY -= this.resetSpeed;
                });
                ennemies.forEach(e => {
                    e.y += this.resetSpeed;
                });
                objects.forEach(e => {
                    e.baseY -= this.resetSpeed;
                })
            }
            else{
                this.y = window.innerHeight - bottomCharacterLimit - 40;
                this.resetTop = false;
            }
            
            if(tiles[this.floorID].y - tiles[this.floorID].baseY + tileSize >= window.innerHeight){ //Makes sure we dont go past the current roof
                this.resetTop = false;
            }
        }

        if((this.y + bottomCharacterLimit >= window.innerHeight && !this.resetTop && this.canScrollBottom) || this.resetBottom){ //Scroll to the bottom
            this.resetBottom = true;
            if(this.y + topCharacterLimit - this.resetSpeed > 0){
                this.y -= this.resetSpeed;
                tiles.forEach(e => {
                    e.baseY += this.resetSpeed;
                });
                ennemies.forEach(e => {
                    e.y -= this.resetSpeed;
                });
                objects.forEach(e => {
                    e.baseY += this.resetSpeed;
                })
            }
            else{
                this.y = topCharacterLimit + 20;
                this.resetBottom = false;
            }

            if(tiles[this.floorID].y - tiles[this.floorID].baseY + tileSize <= window.innerHeight){ //Makes sure we dont go past the floor
                this.resetBottom = false;
            }
        }

        this.tiledImage.tick(this.x, this.y);
    }
}