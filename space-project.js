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

  //--> We want to draw more than ust one enemy, so here ar eth evariables that will allow us to do that: 
  const ENEMY_TOTAL = 5; 
  const ENEMY_SPACING = 98;
  const FORMATION_WIDTH = ENEMY_TOTAL * ENEMY_SPACING;
  const START_X = (canvas.width - FORMATION_WIDTH) / 2;
  const STOP_X = START_X + FORMATION_WIDTH;

  //we will set up 5 enemies per row and column , which will creat e a5x5 grid for us: 
  //--> we will be specifying how much space needs to be in between the enemies, and how big the whole table should be

  //we will use the above constants for the following nested fo rloop: 
  for (let x = START_X; x < STOP_X; x += ENEMY_SPACING){
    for (let y = 0; y < 50*5; y += 50){
      ctx.drawImage(enemyImg, x, y); 
    }
  }

  //the outer for loop creates the rows, and the inner for loop creates the columsn




}



// IMPORTANT NOTE : in js the interpreter automatically inserts semicolons, so we don't need to keep inserting them ourselves .






//once the window (browser) has been loaded, the following executions will take place: 
window.onload = async () => { //this is an async function which means that we will be utilizing the keyword 'await' to wait for the response of teh promise function that will be loading up our images :
  
  
  //this allows us access to the canvas of our program, whcih si defined in the html file
  canvas = document.getElementById('canvas');
  //make the ctx of the canvas for 2D operations, so this opens up a wide variety of methods for us to use
  ctx = canvas.getContext('2d') 
  // TODO load textures

  //NOTE that all file paths must be strings, otherwise they will be treated as regualr expressions
  const hero_image = await loadTexture("/assets/player.png") 
  const enemy_image = await loadTexture("/assets/enemyShip.png"); 

  // TODO draw black background
  ctx.fillStyle = 'black'; //this tells the canvas to fill everything we add to canvas (aside from images) with the colour black
  ctx.fillRect(0,0, 4000, 4000)//make sthe black rectagnle fill a large poriton of the screen
  // TODO draw hero
  ctx.drawImage(hero_image, canvas.width/2 - 45, canvas.height - canvas.height/4) //these dimentsions given by teh intructor, allows the image of the hero to be right at the middle of the screen 
  
  // TODO uncomment the next line when you add enemies to screen
  createEnemies(ctx, canvas, enemy_image); //then we pass in the enemy image that we intialized above, using the Promise funciton and await, 
  //--> our create Enemies function will take our current canvas ctx that allows for 2d operations, and our canvas, and our enemy image, to draw the enemy on teh screen

}




//Now, we need to create 5x5 of the enemies. 
//this is why we have a separate create enemies function, because we're gonna want ot incldue more than just one image of the enemy
//we will accomplish this using a for loop (look at the function above)









//NOW, we need to add motion for all teh players/enemies

//HERE ARE THE STEPS: 
//you need to use a key press(es) to update the x,y position fo your sprite
//then you need to erase the old frame, because updating the positon is not enought to get rid of its old position
//draw the new frame with the new coordinates: 
//--> All of this erasing and moving is done in a very short amount of time, so it's not a long pause that the player has to see of the screen being cleared, and then the robot moving

//BELOW IS A BASIC EXAMPLE ON WHAT THE CHANGE IN MOVEMENT IS SUPPOSED TO LOOK LIKE: 
// hero.x += 5; 
// ctx.clearRect(0,0,canvas.width, canvas.height); 
// ctx.fillRect(0,0,canvas.width, canvas.height); 
// ctx.fillStyle = 'black'
// ctx.drawImage(heroImg, hero.x, hero.y); 





//to allow thte user to be the one to change the position of the game object, we need to give them the option of using key presses: 
//much like in Java, we have event listeners in js, 

//example: 
// window.addEventListener('keyup', (evt) => {

//   if (evt.key == 'ArrowUp'){
//     //do something
//   }
// })


//the 'evt' above is basically a context object for the movement: it checks for specific key events that are represented by built in library constants

//also worth noting, that we add this event listener to the WINDOW, so the event listener is working on all elements of the window itself. 

//practically speaking,we have a key, and a keyCode, 
//the 'key' is the constant for the specific ksy that you are coding for
//the key code si teh built in number of that key. for example, the down key is represented by the number 37


//IMPORTANT NOTE: Sometimes, certain keypresses have their own implementations within the browser, and in order fo royur game to be successful, you
//need to override the ones you need to have a specific implementation for: 

//in teh code below, basically we set a listener for which key is down, and each case corresponds to a different key press
//therein we can provide a specific implementation for each one
//example: 
// const onKeyDown = function (e) {
//   console.log(e.keyCode); 
//   switch (e.keyCode){
//     case 37:
//     case 39:
//     case 38:
//     case 40:
//     case 32:
//       e.preventDefault(); 
//       break; 
//     default: 
//       break; 
//   }
// }

// //add an eventlistener to teh window, and this event listener has been defined by the cases above
// //so now, each time a key is pressed, this code implementation is referred to by the compiler
// window.addEventListener('keydown', onKeyDown); 






// //the above ey pressing events is only applicable to the player who wants to avoid the spaceships

// //for the enemies, we want to give them automatic movement: 

// //example: 
// const id = setInterval(() => {
//   //move the enemy on teh y-axis: 
//   enemy.y += 10; 
// }, 100)
// //so basically, the enemy's movement must be controlled automatically, (maybe I'm thinking with a while loop throuhgtout the whoel duration of the game)


// //NEVERMIND to the comment above, I just read that the , 100 in teh code example above is a time that runs every 100 milliseconds
// //so the enemy's movement is on a timer basis. 
// //--> IN hindsight this is much cleaner than having a while loop: it's cleaner and easier to read

// //HOWEVER I was correct about A LOOP, the entire game must be kept in a loop in order for the frame to keep being redrawn and updated

// //here's an example: 
// const gameLoopID = setInterval(() => {
//   function gameLoop() {
//     ctx.clearRect(0,0,canvas.width, canvas.height); //clear the entire canvas to remove the previous frame
//     ctx.fillStyle = "black"; //reset the screen background to black
//     ctx.fillRect(0,0, canvas.width, canvas.height); //fille the recatngle where the objects are placed
//     drawHero(); //redraw the elements: 
//     drawEnemies(); 
//     drawStaticObjects(); 
//   }
//   gameLoop(); //reloop
// }, 200) //interval timing takes place every 200 milliseconds --> so basically, the game becomes so smooth, that the user does not notice any clearing of the screen 







//NOW THAT THE LESSON IS OVE FOR PART3: WE WILL IMPLEMENT THIS TO OUR ACTUAL GAME: 

//1. hero controls
//enemy (automatic) movement


//--> to start program it's always "npm start"


//step 1 --> we need to create game objects for the enemies and the player
//these game objects will be used for us ot program the movement of the sprites on teh screen

//each object will contain x and y fields to allow for the movement of the object around the screen 

class GameObject {

  //each game object that is created will have a contructor that constructs several fields
  //these fields will be customized based on teh object that encompasses them 
  //for examples, the type field will be labelled as enemy or player
  //if the enemy or the player is dead will be different boolean value for each spearate game object
  //the image will obviously be the same for the enemies, but only one object iwll have the player image
  constructor(x, y){
    this.x = x; 
    this.y = y; 
    this.dead = false; 
    this.type = ""; 
    this.width = 0; 
    this.height = 0; 
    this.img = undefined; 
  }


  //now, define a draw method that will draw this specific obejct to the screen: 
  draw(ctx){
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); 
  }
}





//NOw, we will use the notion of inheritance which is very useful for not having to repeat code: 
//create a hero class and a enemy class that both extend the gameObject class and initialize thier own specific fields

class Hero extends GameObject {
  constructor(x, y){
    super(x, y); //call the parent class first, and construc tthe game object. Only then can we override/change some of the fields
    
    //set the values of the player object 
    //--> I need to note something important here: each game object will appear (from what I remmebr from other coding projects), will appear as a dot on the screen
    //it is then our responsibility to "correlate" that dot/object to the specific image
    //that's why here we have width and height variables
    //bu thte images will be coordinated with the mathematical movement values here
    this.width = 98; 
    this.height = 75; 
    this.type = "Hero"; 
    this.speed = 5; 
  }
}

class Enemy extends GameObject {
  constructor (x, y){
    super(x, y); 
    this.width = 98; 
    this.height = 50; 
    this.type = "Enemy"; 


    //this interval setup is crucial to making the enemies move automatically
    //this makes sure that the enemeies stay within the bounds of the canvas
    const id = setInterval;(() => {
      if (this.y < canvas.height - this.height){
        this.y += 5; 
      }else {
        console.log('stopped at', this.y); 
        clearInterval(id); 
      }
    }, 300)
  }
}



//NOW we need to add key-event handlers for the player sprite: 
//in teh code below, basically we set a listener for which key is down, and each case corresponds to a different key press
//therein we can provide a specific implementation for each one
//example: 
const onKeyDown = function (e) {
  console.log(e.keyCode); 
  switch (e.keyCode){
    case 37:
    case 39:
    case 38:
    case 40:
    case 32:
      e.preventDefault(); 
      break; 
    default: 
      break; 
  }
}

//add an eventlistener to teh window, and this event listener has been defined by the cases above
//so now, each time a key is pressed, this code implementation is referred to by the compiler
window.addEventListener('keydown', onKeyDown); 




//now that we have overriden the default key presses that are programmed to do a specific thing in teh browser, we can addd the funcitonalitites of the up, down , left right key presses to move the actual player object

window.addEventListener("keyup", (evt) => {
  if (evt.key === "ArrowUp") {
    eventEmitter.emit(Messages.KEY_EVENT_UP);
  } else if (evt.key === "ArrowDown") {
    eventEmitter.emit(Messages.KEY_EVENT_DOWN);
  } else if (evt.key === "ArrowLeft") {
    eventEmitter.emit(Messages.KEY_EVENT_LEFT);
  } else if (evt.key === "ArrowRight") {
    eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
  }
});

//event emitter is basically a class that sends messages throughtou the backend of our program
//so the key press is sent to tthe backedn to understand that this was a specific kwy press
//and then later in the code, the backend will send a signal to move the object accordingly. 

//This whole event emitter situation represents the publish/subscribe phenomenon



class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(message, listener) {
    if (!this.listeners[message]) {
      this.listeners[message] = [];
    }
    this.listeners[message].push(listener);
  }
}
