export class Background{
    constructor(type) {
        this.x = 0;
        this.speed = -0.05 * type * type;
        this.node = document.createElement("div");
        this.node.classList.add("background");
        this.node.style.backgroundImage = "url(./img/Background/" + type + ".png)";
        document.querySelector("#background-zone").append(this.node);
    }

    tick(){
        if(window.innerWidth <= 2400 && window.innerHeight <= 1500){
            this.node.style.backgroundSize = "cover";
        }
        else if(window.innerWidth <= 1180 && window.innerHeight <= 400){
            this.node.style.backgroundSize = "contain";
        }
        else{
            this.node.style.backgroundSize = "contain";
        }
        this.x += this.speed;
        this.node.style.backgroundPosition = this.x + "px"; 
    }
}