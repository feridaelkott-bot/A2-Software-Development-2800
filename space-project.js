
// //IMPORTANT NOTE: async and await work hand in hand when we're programming using a js Promise
// //--> Basically, async is a function tha twil pause its execution, when await keyword is encountered
// //--> so the await keyword is used here when loading images, because we want to wait for the Promise function to do its job and return a result, before continuing exeectuion of the rest of our async funciton 
// //--> This is useful here, because when loading two images, we want to wait for both images' results, and then enter the catch block is it wokred or not. 
// //--> it's a cleaner code design, and easier to work with, as the instructor has mentioned. 




//here is teh create hero funciton: 
function createHero() {
  //create a new hero object, 
  hero = new Hero(

    //this is to center teh hero at the bottom center of the screen
    canvas.width / 2 - 45,
    canvas.height - canvas.height / 4
  );
  hero.img = heroImg;//attach the hero image to the hero object
  gameObjects.push(hero);
}


//here is the create enemies funciton: 
function createEnemies() {
  const MONSTER_TOTAL = 5;
  const MONSTER_WIDTH = MONSTER_TOTAL * 98;
  const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  const STOP_X = START_X + MONSTER_WIDTH;
  //the outer for loop creates the rows, the inner for loop creates the columns
  for (let x = START_X; x < STOP_X; x += 98) {
    for (let y = 0; y < 50 * 5; y += 50) {
      const enemy = new Enemy(x, y);
      enemy.img = enemyImg;//assign the enemy image to each created enemy object
      gameObjects.push(enemy);//push teh enemies ontot eh game object array
    }
  }
}

//below is the base class that will be inherited by all of the child classes, 
//the child classes will be the hero object, and the enemies objects
//x, y track the MOVABLE positions of the objects
//and type will track the type of object
//width and height will will decide the size of each png image
class GameObject{
  constructor(x,y){
    this.x = x; 
    this.y = y; 
    this.dead = false; //this will track whether the object should be removed or not
    this.type = ""; 
    this.width = 0; 
    this.height = 0; 
    this.img = undefined; 

  }

  //this draw funciton will be employed for each object with their own specific properties
  draw(ctx){
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); 
  }

  //this is a method that will allow each game object (whether enemy or player) to know its bounds
  //so later in teh code we'll use this to check to see if any of the other objects have crossed a boundary
  rectFromGameObject() {
    return {

      //we''l be using these variables to check to see what the measurements of each field is for the object at hand
      top: this.y, 
      left: this.x,
      bottom: this.y + this.height,
      right: this.x + this.width,

      //practiaclly, this creates a rectangel object with precise boundary coordinates
      //it calculates teh bottom and right edges of the png
      //and it returns a coompletely spearate object (rectangular) that will be used to detect collisiosn
      //-p> effectively, the collisions are NOT detected on teh png images themselves, but on tehse invisible rectangels

    };
  }
}


//here, include a funciton that checks whther two rectangels have intersectied: 
//--> Note that we cannot include this interesction detection within the class, because it takes two rectablge objects as parameters: 
function intersectRect(r1, r2) {


  return !(

    //if left has crossed the right, or 
    //right has crossed the left, or top/bottom have crossed each other
    r2.left > r1.right ||//is r2's left edge past r1's right edge? (True==no overlap)
    r2.right < r1.left ||//is r2's right edge past r1's left edge? (True == no overlap)
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
  
  //then return the NOT (!) of that, meaning, if any of them are true, there is no overlap, so then take !true, to indicate False to the statement that they do overlap
  //returns true when two rectangles collide/overlap each other, and false otherwaise
}








class Hero extends GameObject{
  constructor(x, y){
    super(x,y);//call teh super class to initialize all teh fields
    this.width = 98; 
    this.height = 75; 
    this.type="Hero"; 
    this.speed = 5; //speed is defined only for the player
    this.cooldown = 0; 
  }

  //the fire() method is for allowing the hero to release lasers.
  fire() {

    //in the game objects array, create a new laser object, passing in th especific x and y coordinates of where it will start on the screen
    //then the laser's classs method interval will take tehse values and keep incrementing them so that the laser can move forward on teh screen
    gameObjects.push(new Laser(this.x + this.width/2 - 5, this.y));
    this.cooldown = 500; //add a cooldown variable for the hero object, so that the laser cannot be spewed too foten (utliple rounds after each other)
  
    //so to determine when the hero can use the laser again, we create a time interval: 
    //each 200 ms, we decrease the number 500 to by 100 
    let id = setInterval(() => {
      if (this.cooldown > 0) {
        this.cooldown -= 100;
      } else {
        clearInterval(id);//once the cooldown number reaches 0, we can exit this interval method
      }
    }, 200);
  }
  
  canFire() {
    return this.cooldown == 0;
  }
}


class Enemy extends GameObject{

  constructor(x,y){
    super(x,y); 
    this.width = 98; 
    this.height = 50; 
    this.type = "Enemy"; 

    //this is a timd function, so it is executed after every time interval. In this case, every 300 ms

    const id = setInterval(() => {
      //if there is room to move downwards, because the enemy's height is less than the canvas' height,
      if (this.y < canvas.height - this.height){
        this.y += 5; //+5 is to move downwards, due to the organization of the cartesian plane inside js


      }else {//else if theere is no more room for teh enemy to move down, then print where it stopped, 
        console.log('Stopped at', this.y); //access its current y position to state that that's where it stoopped 
        clearInterval(id); //then this line makes this enemy's movement permanently stop, so it can no longer move down
      }
    }, 300)
  }
}


//below si a laser class that will ealso extend the game object: 
class Laser extends GameObject {
  constructor(x, y) {

    //same idea as above, initialize the aprent class, and the fields that are specific to the laser
    super(x, y);
    //set th elaser's dimensions
    this.width = 9;
    this.height = 33;
    this.type = 'Laser';
    //attach the laser image to the laser object
    this.img = laserImg;
    

    //for a set time frame, allow the laser to keep moving forward (-15 due to cartesian plane implementation in js)
    //--> allow it to keep moving for 100 ms
    let id = setInterval(() => {
      if (this.y > 0) {
        this.y -= 15;
      } else {
        this.dead = true;
        clearInterval(id);
      }
    }, 100);
  }
}




//now, create a collisison detection function, whicih will detect what the laser collides with
function updateGameObjects() {
  const enemies = gameObjects.filter(go => go.type === 'Enemy');
  const lasers = gameObjects.filter(go => go.type === "Laser");
  
  // Test laser-enemy collisions
  lasers.forEach((laser) => {
    enemies.forEach((enemy) => {

      //recall teh intersect Rectangle method we declared above for each game object, 
      //use it here for the laser and the enemies: (view the above comments to see how it was implemented)
      if (intersectRect(laser.rectFromGameObject(), enemy.rectFromGameObject())) {
        
        //if teh collision detection returns true (i.e. they collided)
        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, { //then call emit, to get teh functionality of what is supposed to happen when the laser hits the enemy
          
          //declare the variables of first and last, which are used int emit() implementation below, in order to delete them off the screen
          first: laser,
          second: enemy,
        });
      }
    });
  });

  // Remove destroyed objects
  gameObjects = gameObjects.filter(go => !go.dead);
}

//create a onKeyDown function and attach it to the window: 
const onKeyDown = function (e) {
  console.log(e.keyCode);
  // Add the code from the lesson above to stop default behavior of the browser key presses
  switch (e.keyCode) {
    case 37:
    case 39:
    case 38:
    case 40: // Arrow keys
    case 32:
      e.preventDefault();
      break; // Space, because we're going to manually implement what the space key press should do 
    default:
      break; // do not block other keys
  }
};

window.addEventListener("keydown", onKeyDown);

//the event handler above basically listens for keydown events on teh entire window
//allows other keys to funciton normally, while also letting certain default behaviours of the browser to be not allowed





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

//use the publish subscribe pattern to organize your code by separating event detection from event handling: 
//so add teh following evernt listener to teh window: 
window.addEventListener("keyup", (evt) => {
  if (evt.key === "ArrowUp") {
    eventEmitter.emit(Messages.KEY_EVENT_UP);
  } else if (evt.key === "ArrowDown") {
    eventEmitter.emit(Messages.KEY_EVENT_DOWN);
  } else if (evt.key === "ArrowLeft") {
    eventEmitter.emit(Messages.KEY_EVENT_LEFT);
  } else if (evt.key === "ArrowRight") {
    eventEmitter.emit(Messages.KEY_EVENT_RIGHT);

  }//below will be a space bar event listener to allow for the laser movemetn: 
  //NOTE: I learned that evt.key actually refers to a string, so for the space bar, we use a space character
  else if (evt.key == " "){
    eventEmitter.emit(Messages.KEY_EVENT_SPACE); //this will emit a standardized event emssage, whcih says that when this ky is down (space bar), refer to emit for how this game implementation si supposed to work

  }
});

//the above code detects keyboard input, and converts it to custom game events
//and it separates the input detection from teh game logic
//it also alllows multiple systems to respond to the same input



//now, we need an event emitter class to publish and subscirbe to messages: 


class EventEmitter {
  constructor() {
    this.listeners = {};//this will be to store events to listen to 
  }

  // on() will 
  on(message, listener) {//this registers a callback for an event type, so if message(keyeventup), then it will trigger teh stored listener for that event
    if (!this.listeners[message]) {//look for the specific message
      this.listeners[message] = [];
    }
    this.listeners[message].push(listener);
  }

  //when we have the addEventListener code above, we use the emit() method
  //however, this does not work, if the emit() method is not intiialized herer, to know what to do: 
  emit(message, data) { // so now, emit() will get the message of which kepress it needs to handle, 
    if (this.listeners[message]) {//tehn for each listener in the listeners array, access the listener's eimplementaion of the specific messgae
      this.listeners[message].forEach(listener => listener(message, data));


      //the only reason the data parameter was added was to pass int eh data that is used in teh laser emit
      //in the laser emit, we pass in first.dead = true, and second.dead = true
      //--> so we were basically setting the objects that collided to false, so that they could later be removed 
      //previously, when the emit only included teh message parameter, the data that was supposd to change the fields of the objects were undefined, inhibiting the functionality of this emit method, so the lasers were not showing up, and the objects were nto being erased
      //the other key presses like up and down for the hero do not need the data field because they do not pass in any fields/values to be changed
    
    
    }
  }

}

//decaler the msesages as constants to avoid bugs/typos
const Messages = {
  KEY_EVENT_UP: "KEY_EVENT_UP",
  KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
  KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
  KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",

  //now, want to implement a laser firing system: 
  //we'll define some message types so that different parts of our gae can talk to each other: 
  //so now when there is key events we want to listen for, we can use these constants
  
  KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
  COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
  COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO"

};


//creates a global event emitter to allow the pub/sub system to work
let heroImg, 
    enemyImg, 
    laserImg,
    canvas, ctx, 
    gameObjects = [], //the game objects will be stored here
    hero, 
    eventEmitter = new EventEmitter();



//now, initialise the game

function initGame(){

  //create the game objects
  gameObjects = []; 
  createEnemies(); 
  createHero(); 

  //use event emitter to check for the specific key presses
  eventEmitter.on(Messages.KEY_EVENT_UP, () => {
    hero.y -= 5;//when we press up, that means go "down" on teh js cartesian plane
  })

  //we on
  eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
    hero.y += 5;
  });

  eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
    hero.x -= 5;
  });

  eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
    hero.x += 5;
  });

  //this is an event listener that responds to space key events, 
  //will check the hero game object if it can use the laser (see the implementation above)
  //triggers the laser action when it is allowed to 
  eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
    if (hero.canFire()){
      hero.fire(); 
    }
  })

  //now add a collision handling vent listener for when the laser hits an enemy
  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, {first, second}) => {
    //this event listener receives collison event data with both objects (the enemy and the laser)
    
    //so basically, once the laser hits an enemy, we need to remove both of the objects from the screen
    //so they are then both declared as dead
    //of courrse, we must use teh implementation fo a laser class to achieve this (see above)
    first.dead = true; 
    second.dead = true; 

  });

}


//recall that each game object has a draw method, so here when we draw all of the objects, tehy will each have their own draw method called
function drawGameObjects(ctx){
  gameObjects.forEach(go => go.draw(ctx))
}



//refactor the window.onload function to initialize it the game and set up a game loop on a good interval, 
//we'll also add a laser beam: 
window.onload = async () => {//async to wai tfor the loadTexture to work successfully for each of teh objects
  canvas = document.getElementById("canvas");//get the cavnas
  ctx = canvas.getContext("2d");//render it for 2d methods

  //load the images
  heroImg = await loadTexture("assets/player.png");
  enemyImg = await loadTexture("assets/enemyShip.png");
  laserImg = await loadTexture("assets/laserRed.png");

  initGame();

  //for set intervals (every 100 ms), keep clearing the screen 
  const gameLoopId = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    updateGameObjects(ctx); //call this so that the collided enemies and lasers can be removed
    drawGameObjects(ctx);
    
  }, 100);
};



//now, we want to check for collisions between the spaceship and the enemy
























// function createHero() {

//   //create a new Hero object, and set its width and height to be in the middle of the screen
//   hero = new Hero(
//     canvas.width / 2 - 45,
//     canvas.height - canvas.height / 4
//   );

//   //initialize the values of the hero object in order for them to show up on screen
//   hero.width = 98; 
//   hero.height = 75; 
//   hero.img = heroImg; //add the hero image to this hero object
//   gameObjects.push(hero); //in the gameObjects array, append this hero image. 
// }


// function createEnemies(ctx, canvas, enemyImg) {
//   // TODO draw enemies

//   //--> We want to draw more than ust one enemy, so here ar eth evariables that will allow us to do that: 
//   //these constatns were provvided by the intrsuctor
//   const ENEMY_TOTAL = 5; 
//   const ENEMY_SPACING = 98;
//   const FORMATION_WIDTH = ENEMY_TOTAL * ENEMY_SPACING;
//   const START_X = (canvas.width - FORMATION_WIDTH) / 2;
//   const STOP_X = START_X + FORMATION_WIDTH;

//   //we will set up 5 enemies per row and column , which will creat e a5x5 grid for us: 
//   //--> we will be specifying how much space needs to be in between the enemies, and how big the whole table should be


//   //teh outer for loop creates the rows, and the inner for loop creates the columsn
//   //we will use the above constants for the following nested fo rloop: 
//   for (let x = START_X; x < STOP_X; x += ENEMY_SPACING){
//     for (let y = 0; y < 50*5; y += 50){
//       const enemy = new Enemy(x, y); //create a new enemy object and 
//       enemy.img = enemyImg; //..and attach to it the enemyImg here, so that it can be moved by the object's x and y coordinates that are defined in teh object
//       gameObjects.push(enemy); //add this enemy object to the enemy array we havr declared 
//     }
//   }



// }


// //Now, create a funciton that will draw all of the game objects from the game objects array: 
// function drawGameObjects(ctx){
//   gameObjects.forEach(go => go.draw(ctx)); //this line will go througjh each array element, and calls hte draw(ctx) method on them
//   //so they are all drawn to the canvas' specific 2d rendered context
// }


// // IMPORTANT NOTE : in js the interpreter automatically inserts semicolons, so we don't need to keep inserting them ourselves .







// //NOW THAT THE LESSON IS OVER FOR PART3: WE WILL IMPLEMENT THIS TO OUR ACTUAL GAME: 

// //1. hero controls
// //enemy (automatic) movement


// //--> to start program it's always "npm start"


// //step 1 --> we need to create game objects for the enemies and the player
// //these game objects will be used for us ot program the movement of the sprites on teh screen

// //each object will contain x and y fields to allow for the movement of the object around the screen 

// class GameObject {

//   //each game object that is created will have a contructor that constructs several fields
//   //these fields will be customized based on teh object that encompasses them 
//   //for examples, the type field will be labelled as enemy or player
//   //if the enemy or the player is dead will be different boolean value for each spearate game object
//   //the image will obviously be the same for the enemies, but only one object iwll have the player image
//   constructor(x, y){
//     this.x = x; 
//     this.y = y; 
//     this.dead = false; 
//     this.type = ""; 
//     this.width = 0; 
//     this.height = 0; 
//     this.img = undefined; 
//   }


//   //now, define a draw method that will draw this specific obejct to the screen: 
//   draw(ctx){
//     ctx.drawImage(this.img, this.x, this.y, this.width, this.height); 
//   }
// }





// //NOw, we will use the notion of inheritance which is very useful for not having to repeat code: 
// //create a hero class and a enemy class that both extend the gameObject class and initialize thier own specific fields

// class Hero extends GameObject {
//   constructor(x, y){
//     super(x, y); //call the parent class first, and construc tthe game object. Only then can we override/change some of the fields
    
//     //set the values of the player object 
//     //--> I need to note something important here: each game object will appear (from what I remmebr from other coding projects), will appear as a dot on the screen
//     //it is then our responsibility to "correlate" that dot/object to the specific image
//     //that's why here we have width and height variables
//     //bu thte images will be coordinated with the mathematical movement values here
//     this.width = 98; 
//     this.height = 75; 
//     this.type = "Hero"; 
//     this.speed = 5; 
//   }
// }

// class Enemy extends GameObject {
//   constructor (x, y){

//     //same idea here as witht the playwr object 
//     super(x, y); 
//     this.width = 98; 
//     this.height = 50; 
//     this.type = "Enemy"; 


//     //this interval setup is crucial to making the enemies move automatically
//     //this makes sure that the enemeies stay within the bounds of the canvas
//     const id = setInterval(() => {
//       if (this.y < canvas.height - this.height){
//         this.y += 5; 
//       }else {
//         console.log('stopped at', this.y); 
//         clearInterval(id); 
//       }
//     }, 300).bind(this); 
//   }


//   //Notes on setInterval: it repeatedly runs the code within its block, for every 300 milliseconds, 
//   //this is what allows us to move the objects around consistently. 
// }



// //NOW we need to add key-event handlers for the player sprite: 
// //in teh code below, basically we set a listener for which key is down, and each case corresponds to a different key press
// //therein we can provide a specific implementation for each one
// //example: 
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
// // window.addEventListener('keydown', onKeyDown); 




// //now that we have overriden the default key presses that are programmed to do a specific thing in teh browser, we can addd the funcitonalitites of the up, down , left right key presses to move the actual player object


// //note that for the EvenEmitter to work, ou need a emit() mehod to actually fire the listener's implementations
// window.addEventListener("keyup", (evt) => {
//   if (evt.key === "ArrowUp") {
//     eventEmitter.emit(Messages.KEY_EVENT_UP);
//   } else if (evt.key === "ArrowDown") {
//     eventEmitter.emit(Messages.KEY_EVENT_DOWN);
//   } else if (evt.key === "ArrowLeft") {
//     eventEmitter.emit(Messages.KEY_EVENT_LEFT);
//   } else if (evt.key === "ArrowRight") {
//     eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
//   }
// });

// //event emitter is basically a class that sends messages throughtou the backend of our program
// //so the key press is sent to tthe backedn to understand that this was a specific kwy press
// //and then later in the code, the backend will send a signal to move the object accordingly. 

// //This whole event emitter situation represents the publish/subscribe phenomenon



// //these are variables that will help us set up the event emitter
// const Messages = {
//   KEY_EVENT_UP: "KEY_EVENT_UP",
//   KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
//   KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
//   KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
// };



// class EventEmitter {
//   constructor() {
//     this.listeners = {};
//   }

//   on(message, listener) {
//     if (!this.listeners[message]) {
//       this.listeners[message] = [];
//     }
//     this.listeners[message].push(listener);
//   }


//   //the event emitter only works when the emit() method is defined here, in order to let it run
//   emit(message, ...args){//this looks up all the listeners that are registered under the specific messag (i.e key up / ey down, and runs the on() function associated with it)
//     if (this.listeners[message]){
//       this.listeners[message].forEach(listener => listener(...args)); 
//     }
//   }
// }

// let heroImg, 
//     enemyImg, 
//     laserImg,
//     canvas, ctx, 
//     gameObjects = [], 
//     hero, 
//     eventEmitter = new EventEmitter();



// //initialize the game: 
// function initGame(){
//   gameObjects = []; //create an array for all the game objects, whcih we will use to access them each individually
  
//   createHero(); //call the createHeo function
//   createEnemies(canvas, enemyImg);

//   //below, we will use the event emitter to actually move the sprites around the screen
//   //I want to note that due to the way the canvas is set up, moving down might avtaully be moving "up" 
  
//   eventEmitter.on(Messages.KEY_EVENT_UP, () => {
//     hero.y -= 5;//if user presses up, move the hero 
//   }); 
//   //if the
//   eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
//     hero.y += 5;
//   });

//   eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
//     hero.x -= 5;
//   });

//   eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
//   hero.x += 5; // add this!
//   });

// }

// //now we need to reinitializ the window's onload setup so that the game loop starts when it runs
// window.onload = async () => {

//   //once the window is loaded, we can access the canvas, and create a ctx that allows us to render 2d objects
//   canvas = document.getElementById("canvas"); 
//   ctx = canvas.getContext("2d"); //gets the 2d rendering cintext object
//   heroImg = await loadTexture("assets/player.png") //loads the player image
//   laserImg = await loadTexture("assets/laserRed.png") //loads the laser image object
//   enemyImg = await loadTexture("assets/enemyShip.png")

  
//   //call the init game function which will start the game loop : 
//   initGame(); 
//   createEnemies(ctx, canvas, enemyImg);  //make sure teh createEnemies function is called after the initGame, because otherwiasethe one player that is created within the initGame, will wipe out the previous enemies

//   const gameLoopId = setInterval(() => {
//     ctx.clearRect(0,0,canvas.width, canvas.height); 
//     ctx.fillStyle = "black"; 
//     ctx.fillRect(0,0,canvas.width, canvas.height); 

//     drawGameObjects(ctx); 
    
//   }, 100)
// }
