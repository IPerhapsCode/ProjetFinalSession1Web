// Import the THREE.js library
import * as THREE from "three";
// To allow for the camera to move around the scene
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// To allow for importing the .gltf file
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

//Variables
let mouseX;
let mouseY;

//Intro variables
let introDelay = 0;
let slidePositionA = 0;
let slidePositionB = 100;
let momentum = 0.008;
let decreasingMomentum = 0.01192;
let speed = 0.0001;
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
    zoneInit.style.background = "#A7C7E7";

    zonePlanet = document.querySelector("#zone-planet");
    // zonePlanet.scrollLeft = zonePlanet.scrollWidth/8; /*To note*/
    zonePlanet.style.background = "#212121";
    
    //To note 3D model implementation
    loader.load(
        "./media/model/low_poly_planet_earth.glb",
        function(gltf){
            object = gltf.scene;
            let boundingBox = new THREE.Box3().setFromObject(object);
            let center = new THREE.Vector3();
            boundingBox.getCenter(center);
            let offset = new THREE.Vector3();
            offset.subVectors(object.position, center);
            object.position.sub(offset);
            scene.add(object);
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
    camera.position.y = 2.2;
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

    zonePlanet.addEventListener('mouseup', (e) =>{
        clickingPlanet = false;
    });

    zonePlanet.addEventListener('mouseleave', (e) =>{
        clickingPlanet = false;
    });

    zonePlanet.addEventListener('mousedown', (e) =>{
        clickingPlanet = true;
    });

    intro();
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

const modelAnimation = () =>{ //Could be interesting if the planet keeps momentum after being interacted with
    let test = currentTopValue(zonePlanet);
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