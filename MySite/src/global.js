introDelay = 0;
slidePositionA = 0;
slidePositionB = 100;
momentum = 0.008;
decreasingMomentum = 0.01192;
speed = 0.0001;
direction = "";

window.addEventListener("load", () => {
    zoneInit = document.querySelector("#zone-init");
    zoneInit.style.background = "#A7C7E7";

    zonePlanet = document.querySelector("#zone-planet");
    // zonePlanet.scrollLeft = zonePlanet.scrollWidth/8; /*To note*/
    zonePlanet.style.background = "#212121";

    intro();
})

const intro = () =>{
    text = ["Hi", ",", " I'm", " Paul", "."];
    counter = 0;

    print(document.querySelector("#a1-" + counter), text[counter++], 1000);
    print(document.querySelector("#a1-" + counter), text[counter++], 700);
    print(document.querySelector("#a1-" + counter), text[counter++], 1000);
    print(document.querySelector("#a1-" + counter), text[counter++], 300);
    print(document.querySelector("#a1-" + counter), text[counter++], 700);

    setTimeout(() => {
        //On ne peut présentement pas avoir de paramètre dans la fonction slideOut
        direction = "-";
        slideOut();
    }, introDelay + 2000);
}

const print = (node, text, time) =>{
    introDelay += time;

    setTimeout(() => {
        node.innerText += text;
    }, introDelay);
};

const slideOut = () =>{
    if(slidePositionB < 20)
    {
        speed -= decreasingMomentum;
    }
    else if(slidePositionB > 70){
        speed += momentum;
    }
    slidePositionA += speed;
    slidePositionB -= speed;

    if(slidePositionB < 0)
    {
        slidePositionB = 0;
    }

    zoneInit.style.top = direction + slidePositionA + "%";
    zonePlanet.style.top = slidePositionB + "%";
    if(slidePositionB > 0)
    {
        window.requestAnimationFrame(slideOut);
    }
    else
    {
        //Reset variables (Have to since I can't use parameters for this function)
        speed = 0.1;
        slidePosition = 0;
        direction = "";
        zoneInit.remove();
    }
};