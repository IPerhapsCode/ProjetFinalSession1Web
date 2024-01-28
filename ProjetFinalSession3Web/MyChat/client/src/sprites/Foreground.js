import { TiledImage } from "../TiledImage.js";
import { tileSize } from "../page-index.js";

let colCount = 1;
let rowCount = 1;
let refreshDelay = 10000;
let loopColumns = false;
let scale = 0.3;

export class Ground{
    constructor(id, model, x, y, walkable){
        this.id = id; //Keeps the position of the model in the array containning it 
        this.model = model; //Helps determine which tile will be used
        if(this.model < 10){ //Determines which tile will be used 
            this.path = "./img/Tiles/IndustrialTile_0" + this.model + ".png"
        }
        else{
            this.path = "./img/Tiles/IndustrialTile_" + this.model + ".png"
        }
        this.x = x; //X position of the object
        this.leftValue; //Let's us despawn objects when out of sight
        this.topValue; //Let's us despawn objects when out of sight
        this.y = y; //Y position of the object
        this.baseY = y; //Keeps the base Y position of the object;
        this.shift = 0; //Maybe usefull
        this.walkable = walkable;
        this.node = document.createElement("div");
        document.querySelector("#game").prepend(this.node); //Puts the object in the page 
        this.tiledImage = new TiledImage(
            this.path,
			colCount,
			rowCount,
			refreshDelay,
			loopColumns,
			scale,
			this.node
        );
    }

    tick(player, levelLimits) {
        if(player.length > 0){ //Makes sure the player stays on a platform when the screen size is changed (most of the time lol)
            if((window.innerHeight / 1.2) != this.y && !player[0].resetTop && !player[0].resetBottom){ //If the window is redimenssionned character should stay in the right spot
                this.y = (window.innerHeight / 1.2);

                if(!player[0].changeScreenSize){
                    player[0].changeScreenSize = true;
                }
            }
        }

        if(this.id == levelLimits[4] && player[0].level == 0){ //Let us move the form to the desired position (also needs to know which level we're in)
            let tempLeft = this.node.style.left
            let tempTop = this.node.style.top
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

            this.leftValue -= 40;
            this.topValue -= 20;

            document.querySelector("#login-form").style.top = this.topValue + "px";
            document.querySelector("#login-form").style.left  = this.leftValue + "px";
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

        this.tiledImage.tick(this.x, this.y - this.baseY);
    }
}