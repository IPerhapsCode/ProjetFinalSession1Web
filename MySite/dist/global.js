/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/global.js":
/*!***********************!*\
  !*** ./src/global.js ***!
  \***********************/
/***/ (() => {

eval("introDelay = 0;\r\nslidePositionA = 0;\r\nslidePositionB = 100;\r\nmomentum = 0.008;\r\ndecreasingMomentum = 0.01192;\r\nspeed = 0.0001;\r\ndirection = \"\";\r\n\r\nwindow.addEventListener(\"load\", () => {\r\n    zoneInit = document.querySelector(\"#zone-init\");\r\n    zoneInit.style.background = \"#A7C7E7\";\r\n\r\n    zonePlanet = document.querySelector(\"#zone-planet\");\r\n    // zonePlanet.scrollLeft = zonePlanet.scrollWidth/8; /*To note*/\r\n    zonePlanet.style.background = \"#212121\";\r\n\r\n    intro();\r\n})\r\n\r\nconst intro = () =>{\r\n    text = [\"Hi\", \",\", \" I'm\", \" Paul\", \".\"];\r\n    counter = 0;\r\n\r\n    print(document.querySelector(\"#a1-\" + counter), text[counter++], 1000);\r\n    print(document.querySelector(\"#a1-\" + counter), text[counter++], 700);\r\n    print(document.querySelector(\"#a1-\" + counter), text[counter++], 1000);\r\n    print(document.querySelector(\"#a1-\" + counter), text[counter++], 300);\r\n    print(document.querySelector(\"#a1-\" + counter), text[counter++], 700);\r\n\r\n    setTimeout(() => {\r\n        //On ne peut présentement pas avoir de paramètre dans la fonction slideOut\r\n        direction = \"-\";\r\n        slideOut();\r\n    }, introDelay + 2000);\r\n}\r\n\r\nconst print = (node, text, time) =>{\r\n    introDelay += time;\r\n\r\n    setTimeout(() => {\r\n        node.innerText += text;\r\n    }, introDelay);\r\n};\r\n\r\nconst slideOut = () =>{\r\n    if(slidePositionB < 20)\r\n    {\r\n        speed -= decreasingMomentum;\r\n    }\r\n    else if(slidePositionB > 70){\r\n        speed += momentum;\r\n    }\r\n    slidePositionA += speed;\r\n    slidePositionB -= speed;\r\n\r\n    if(slidePositionB < 0)\r\n    {\r\n        slidePositionB = 0;\r\n    }\r\n\r\n    zoneInit.style.top = direction + slidePositionA + \"%\";\r\n    zonePlanet.style.top = slidePositionB + \"%\";\r\n    if(slidePositionB > 0)\r\n    {\r\n        window.requestAnimationFrame(slideOut);\r\n    }\r\n    else\r\n    {\r\n        //Reset variables (Have to since I can't use parameters for this function)\r\n        speed = 0.1;\r\n        slidePosition = 0;\r\n        direction = \"\";\r\n        zoneInit.remove();\r\n    }\r\n};\n\n//# sourceURL=webpack://mysite/./src/global.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/global.js"]();
/******/ 	
/******/ })()
;