// Import the THREE.js library
import * as THREE from "three";
// To allow for the camera to move around the scene
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// To allow for importing the .gltf file
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { pass } from "three/examples/jsm/nodes/Nodes.js";

//Variables
let mouseX;
let mouseY;
let defaultSpeed = 0.0001;
let speed = defaultSpeed;
let momentum = 0.08;
let decreasingMomentum = 0.245;

//Intro variables
let introDelay = 0;
let slidePositionA = 0;
let slidePositionB = 100;
let direction = "";
let zoneInit;

//Planet variables
let zonePlanet;
let clickingPlanet = false;
let differenceX;
let rotationSpeed = 0.5;
const fullRotation = 6.275;
let lastTime = Date.now();
let lastMouseX = 0;
let object;
const scene = new THREE.Scene(); //To note
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer({alpha: true});
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

window.addEventListener("load", () => {
    zoneInit = document.querySelector("#zone-init");

    zonePlanet = document.querySelector("#zone-planet");
    // zonePlanet.scrollLeft = zonePlanet.scrollWidth/8; /*To note*/
    
    //To note 3D model implementation
    loader.load(
        "./media/model/low_poly_planet_earth.glb",
        function(gltf){
            object = gltf.scene;
            scene.add(object);
            modelAnimation();
        },
        function(xhr){
            console.log("Loading: " + (xhr.loaded / xhr.total * 100) + "%")
        },
        function(error){
            console.error(error);
        }
    );
    //Renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector("#planet").appendChild(renderer.domElement);
    //Camera
    camera.position.z = 5;
    camera.position.y = 1;
    //Light
    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(500, 500, 500);
    topLight.castShadow = true;
    scene.add(topLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    //Events
    document.onmousemove = (e) =>{
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    window.onresize = (e) =>{ //To note
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    zonePlanet.addEventListener('mouseup', (e) =>{
        clickingPlanet = false;
    });

    zonePlanet.addEventListener('mouseleave', (e) =>{
        clickingPlanet = false;
    });

    zonePlanet.addEventListener('mousedown', (e) =>{
        clickingPlanet = true;
    });

    //intro();
    setTimeout(() => { //To note
        verticalSlide(window.scrollY, window.scrollY, zoneInit.getBoundingClientRect().top);
    }, 4500);
});

const intro = () =>{
    let text = ["Hi", ",", " I'm", " Paul", "."];
    let counter = 0;

    //Prints the first message
    print(document.querySelector("#a1-" + counter), text[counter++], 1000);
    print(document.querySelector("#a1-" + counter), text[counter++], 700);
    print(document.querySelector("#a1-" + counter), text[counter++], 1000);
    print(document.querySelector("#a1-" + counter), text[counter++], 300);
    print(document.querySelector("#a1-" + counter), text[counter++], 700);

    setTimeout(() => {
        //On ne peut présentement pas avoir de paramètre dans la fonction slideOut
        direction = "-";
        modelAnimation();
        slideOut();
    }, introDelay + 2000);
};

const print = (node, text, time) =>{
    introDelay += time;

    setTimeout(() => {
        node.innerText += text;
    }, introDelay);
};

const slideOut = () =>{
    //Change the momentum of our animation
    if(slidePositionB < 20)
    {
        speed -= decreasingMomentum;
    }
    else if(slidePositionB > 70){
        speed += momentum;
    }

    //Add the speed value to the position of our objects
    slidePositionA += speed;
    slidePositionB -= speed;

    //Makes sure the animation doesn't overshoot
    if(slidePositionB < 0)
    {
        slidePositionB = 0;
    }

    //Change the position of animation
    zoneInit.style.top = direction + slidePositionA + "%";
    zonePlanet.style.top = slidePositionB + "%";

    //Call this function once again if the animation is not over
    if(slidePositionB > 0)
    {
        window.requestAnimationFrame(slideOut);
    }
    else
    {
        //Reset variables (Have to since I can't use parameters for this function)
        speed = 0.1;
        slidePositionA = 0;
        slidePositionB = 100;
        direction = "";
        zoneInit.remove();
    }
};
let increase = false;
let decrease = false;
//This function needs to stop whenever the user starts scrolling 
//Moves the position of the scroll bar vertically
const verticalSlide = (pos, start, target) =>{ //To note
    if(!increase) //Calculates the point at which the momentum should decrease
    {
        increase = 1 - (1 - Math.abs(pos / (target + start))) / 4;
    }
    if(!decrease) //Need to figure how to reverse this thing 
    {
        decrease = 1 - (1 - Math.abs(pos / (100 + start * 2))) / 4;
        console.log(Math.abs(pos / (100 - start)), target - start, pos)
        console.log(decrease)
    }
    console.log(pos / (target - start))
    if(target + start > pos) //If we're scrolling down
    {   
        console.log(speed)
        //Depending how much scrolling there is left to do increase or decrease the speed of the scroll
        if(Math.abs(pos / (target + start)) <= increase)
        {
            speed += momentum;
        }
        else if(Math.abs(pos / (target + start)) > increase)
        {
            speed -= decreasingMomentum;
            if(speed < 0) //If the speed ever gets below zero makes sure it is still positive
            {
                speed = 0.1;
            }
        }

        pos += speed;

        if(pos > target + start) //If we reached close enough to the target
        {
            pos = target + start;
        }
    }
    else if(target + start < pos) //If we're scrolling up
    {
        speed += momentum; 
        //Depending how much scrolling there is left to do increase or decrease the speed of the scroll
        if(Math.abs(pos / (target - start)) >= decrease)
        {
            console.log("buhr")
            speed += momentum;
        }
        else if(Math.abs(pos / (target - start)) < decrease)
        {
            console.log("moment")
            speed -= decreasingMomentum;
            if(speed < 0) //If the speed ever gets below zero makes sure it is still positive
            {
                speed = 0.1;
            }
        }
        console.log(speed)
        pos -= speed;
    
        if(pos < target + start) //If we reached close enough to the target
        {
            pos = target + start;
        }
    }
    else if(target + start == pos)
    {
        pass
    }

    //Actually moves the scrollbar
    window.scrollTo(0, pos);
    
    if(start + target != pos) //Calls the next animation frame if we havent reached the finish line yet
    {//To note
        window.requestAnimationFrame(() => {
            verticalSlide(pos, start, target)
        });
    }
    else //Resets our variables whenever the animation is finished
    {
        speed = defaultSpeed;
        increase = false;
    }
}

const modelAnimation = () =>{ //Could be interesting if the planet keeps momentum after being interacted with
    let test = currentTopValue(zonePlanet); //I need to find a way to use an oberserver this doesnt make any sense
    //Could be nice if the opactiy grows when it comes into view as well 
    if(test < 70 && test > -70)
    {
        //Standardisation of the animation
        let now = Date.now();
        if(clickingPlanet)
        {
            //Lets the user play with the model
            differenceX = (mouseX - lastMouseX) / 750;
            object.rotation.y += differenceX;
        }
        else
        {
            //The model continues spinning in the last direction the user pulled the model in
            if(differenceX > 0 && Math.sign(rotationSpeed) == 1)
            {
                rotationSpeed = -rotationSpeed;
            }
            else if(differenceX <= 0 && Math.sign(rotationSpeed) == -1)
            {
                rotationSpeed = Math.abs(rotationSpeed);
            }

            //Spins the model
            object.rotation.y -= rotationSpeed * (now - lastTime) / 1000;
            object.rotation.y = object.rotation.y % fullRotation;
        }
        //Set variables for next call
        lastTime = Date.now();
        lastMouseX = mouseX;

        //Renders the scene
        renderer.render(scene, camera);    
    }
    window.requestAnimationFrame(modelAnimation);
};

//Extracts the value of the top variable of a node
const currentTopValue = (node) =>{
    let string = "";
    for(let i = 0; i < node.style.top.length; ++i)
    {
        if(node.style.top[i] != '%')
        {
            string += node.style.top[i];
        }
        else
        {
            break;
        }
    }
    return string;
}

const showPath = () => {
    let path = document.querySelector("path");
    let pathLength = path.getTotalLength();

    
    path.style.strokeDasharray = pathLength + ' ' + pathLength;
    path.style.strokeDashoffset = pathLength;


}