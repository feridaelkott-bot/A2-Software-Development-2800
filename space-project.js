// // //this is the basic template that every game object can use

// // Step 1: Create base behavior objects
// const gameObject = {
//   x: 0,
//   y: 0,
//   type: ''
// };

// //this struct is for the object to be able to move
// const movable = {
//   moveTo(x, y) {
//     this.x = x;
//     this.y = y;
//   }
// };

// //step 2: compose objects by combining behaviours: 
// const movableObject = {...gameObject, ...movable}; 

// //step 3: Create factory functions for different object types
// function createHero(x, y){

//   return {
//     ...movableObject, 
//     x, 
//     y, 
//     type: 'Hero'

//   };
// }

// function createStatic (x, y, type) {
//   return {
//     ...gameObject, 
//     x,
//     y,
//     type
//   };
// }

// //step 4: create and use your composed objects
// const hero = createHero(10,10); 
// hero.moveTo(5,5); 

// const tree = createStatic(0,0,'Tree'); 
// //tree.moveTo() is currently undefined since we did not define movemenet behaviour

// //So here, we have composed objects to incorporate both behaviours without inheritance
// //this provides more flexibility than rigid inheritance hierarchies. 
// //allows objects tto have exactly the features they need rather tan several inherited things
// //use composition when you want max flexibiilty

// //pub/sub is the publish/subscribe pattern
// //--> basically a phenomenon that makes parts of your code connected, without being dependent on each other. 
// //the key players in pub sub are 4, and each with their own funcitonality. 

// //todo: below, we will connect the canvas to this javascript file, so that we can draw to it

// //here, we access the canvas element
// const canvas = document.getElementById("myCanvas"); 

// //then we create a context of the canvas, which is the object we will use to add stuff to the canvas:
// const ctx = canvas.getContext("2d"); //this 2d rendering contxt proides us wth all the drawing mthods we'll need for adding things to our v=canvas such as images, and shapes

// //then we'll actually design the canvas with colors below; 
// ctx.fillStyle = 'red'; //this tells the canvas to fill everything we add with the colour red 
// ctx.fillRect(0, 0, 200, 200); //tehse parameters are x, y, width, height, and similar to Java swing, we have just drawna rectabngle to the canvas

// //--> On a side note, we can also draw 3d shapes to the cavnas, but this is not our objective for this assignment

// //ater we wil be using filRect(), fillSTyle(), beginPath(), arc()


// //now, we will load an image: 

// //1. create an image object, referencing the path to the image
// //2. then we must create a listener to listen for the event that we load the image, so that the program can display it on the canvas

// //here is the code: 

// function loadImage(path){ //take a path object to the desired image: 


//   //in JavaScript, we have a "Promise", whcih takes two possible events: failure, success

//   //this will return one of two things;
//   // --> 1. successful uploading of the image, if the image is found from path
//   // --> 2. we will return/print an error message if the image failed to load, which could be for a number of reasons
//   //-------------On a side note, I remmeber from bash scripting, that the backticks and ${} will allow for the actual valule of what i in the brackets ot be printed out. Similar to an f-string in Python
//   return new Promise((resolve, reject) => {


//     const img = new Image(); //create a new image object
//     img.src = path; //set the source of that image objec tto the path we have been given
//     img.onload = () => {//once the image is loaded (i.e when this function is called osmehwere else in the program), 
//       resolve(img);  //resolve the image, whcih means to prepare access to it for when it's needed later
//     }; 
//     img.onerror = () => { //if thee was an error in finding the image, we need to reject the image we're trying to be give: 
//       reject(new Error(`Failed to load image: ${path}`));//then the Promise will reject what it is given (the path), and this will show on screen
//     }; 

//   }); 


// }


// //let's try to create the images of our sprites to add them to the screen
// //--> From my understanding of this part of the assignment, we will have to encompass the loadImage funciton into a ..
// // a try block so that the Promise can return success/failure, accordingly, and so that we have a try block to catch the error

// async function initializeGame(){
//   try{
//     const heroImage = await loadImage('hero.png'); 
//     const monsterImage = await loadImage('monster.png'); 
//     //if this try block works, then the images will be ready to use later in the code
//     //however, if they don't work, we need to catch the error that is returned by the Promise declared above: 



//     //NOTE: these image vairables exist only within thi stry-block's scope, so we must work with them here only. 
//     //if the above operations were successful, we can access the earlier declared canvas, and print them to it

//     ctx.drawImage(heroImage, canvas.width/2, canvas.height/2); 
//     ctx.drawImage(monsterImage, 0, 0); 


    


//   }catch(error){
//     console.error('Failed to load game assets: ', error); 
//     //the error parameter will be what we have declared within the Promise function
//   }
// };


// //IMPORTANT NOTE: async and await work hand in hand when we're programming using a js Promise
// //--> Basically, async is a function tha twil pause its execution, when await keyword is encountered
// //--> so the await keyword is used here when loading images, because we want to wait for the Promise function to do its job and return a result, before continuing exeectuion of the rest of our async funciton 
// //--> This is useful here, because when loading two images, we want to wait for both images' results, and then enter the catch block is it wokred or not. 
// //--> it's a cleaner code design, and easier to work with, as the instructor has mentioned. 


//---------Below is the code that statrs up my server, which was the provided starter code for the project ----------------
function loadTexture(path) { //this is a function that will return a promise: either success or failure
  return new Promise((resolve) => {
    const img = new Image() //create an image object
    img.src = path //make this new image object point to the image of the path we will provide as a parameter
    img.onload = () => { //once the src has been provided, 
      resolve(img) //we will prepare the image for showing to screen
    }


  })
}

function createEnemies(ctx, canvas, enemyImg) {
  // TODO draw enemies

  //1. we have to use the loadTexture funciton to access the image path, and load it up: 
  const enemy_image = loadTexture(enemyImg); 

  //2. draw the image onto the canvas context that is passed here: 
  ctx.drawImage(enemy_image, canvas.width/2, canvas.height/2); 
}



// IMPORTANT NOTE : in js the interpreter automatically inserts semicolons, so we don't need to keep inserting them ourselves .







window.onload = async () => { //this is an async function which means that we will be utilizing the keyword 'await' to wait for the response of teh promise function that will be loading up our images :
  
  
  //this allows us access to the canvas of our program, whcih si defined in the html file
  canvas = document.getElementById('canvas');
  //make the ctx of the canvas for 2D operations, so this opens up a wide variety of methods for us to use
  ctx = canvas.getContext('2d') 
  // TODO load textures
  const hero_image = await loadTexture(/assets/player.png)
  const enemy_image = await loadTexture(/assets/enemyShip.png); 

  // TODO draw black background
  ctx.fillStyle = 'black'; //this tells the canvas to fill everything we add with the colour black
  ctx.fillRect(0,0)
  // TODO draw hero
  ctx.drawImage(hero_image, canvas.width/2 - 45, canvas.height - canvas.height/4)
  
  // TODO uncomment the next line when you add enemies to screen
  createEnemies(ctx, canvas, enemyImg);
}


