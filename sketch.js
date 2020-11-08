// Trex variables
var trex, trex_running, trex_collided, trex_still, trex_crouch;

// Ground variables
var ground, invisibleGround, groundImage;

// Pterodactyl variables
var pterodactyl, pterodactylImage, pterodactylGroup;

// Cloud variables
var cloud, cloudsGroup, cloudImage;

// Cactus variables
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

// Game over scene
var gameOver, restart;
var gameOverImage, restartImage;

// Groups
var cloudsGroup, obstaclesGroup;

// Scores
var score = 0;
var hiScore = 0;

// Sounds
var jumpSound, deathSound, checkpointSound;

// Gamestates
var PLAY = true;
var END = false;
var gameState = PLAY;

function preload(){
  // All of the image files we need to load
  gameOverImage = loadImage("gameOver-1.png");
  restartImage = loadImage("restart.png");
  
  trex_running = loadAnimation("trex1.png", "trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_still = loadAnimation("trex1.png");
  trex_crouch = loadAnimation("trex_crouch.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  // Pterodactyl
  pterodactylImage = loadImage("pterodactyl.png");
  
  // Sounds
  jumpSound = loadSound("jump.mp3");
  deathSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(600, 200);
  // The Trex sprite
  trex = createSprite(50,180,20,17);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.addAnimation("still", trex_still);
  trex.addAnimation("crouching", trex_crouch);
  trex.scale = 0.5;
  trex.setCollider("rectangle", 0, 0, 55, 55)
  
  // trex.debug = true;
  
  // Ground sprites
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  // Ground hitbox
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  // Score's default value
  score = 0;
  
  // Defining groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  pterodactylGroup = new Group();
  
  // Game over scene sprites
  gameOver = createSprite(300, 80, 30, 30);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 1;
  gameOver.visible = false;
  restart = createSprite(300, 120, 30, 30);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  restart.visible = false;
}

function draw() {
  background("#FFF");
  
  if (gameState) {
        
  // Jumping
  if ((keyDown("space") || keyDown(UP_ARROW)) && trex.y >= 160) {
    trex.changeAnimation("still", trex_still);
    jumpSound.play();
    trex.velocityY = -13;
  } else if (keyDown(DOWN_ARROW) && trex.y >= 160) {
    trex.changeAnimation("crouching", trex_crouch);
  }
    
  // Gravity
  trex.velocityY = trex.velocityY + 0.8
  
  // Ground Moving
  if (ground.x < 0) {
    ground.x = ground.width/2;
  }
  ground.velocityX = -(7 + score / 100);

  // Checkpoint sounds
  if ((score % 100) == 0 && score != 0) {
    checkpointSound.play();
  }
  
  // Increasing the score
  score += Math.round(getFrameRate() / 60);
    
  //spawn the clouds
  spawnClouds();
    
  // spawn the pterodactyls
  if (score > 450) {
    spawnPterodactyls();
  }
  
  //spawn obstacles on the ground
  spawnObstacles();
    
  // Trex collision with the obstacles
    if ((obstaclesGroup.isTouching(trex) || pterodactylGroup.isTouching(trex))) {
      deathSound.play();
      gameState = END;
      // trex.changeAnimation("still", trex_still);
      // jumpSound.play();
      // trex.velocityY = -13;
    }
  
    // Game over scene
  } else if (!gameState) {
    trex.velocityY = 0;
    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided", trex_collided);
    pterodactylGroup.setVelocityXEach(0);
    pterodactylGroup.setLifetimeEach(-1);

    gameOver.visible = true;
    restart.visible = true;
    
  }
  
  // If the user has pressed the restart button
  if (mousePressedOver(restart) && !gameState) {
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    pterodactylGroup.destroyEach();
    
    gameOver.visible = false;
    restart.visible = false;
    
    trex.changeAnimation("running", trex_running);
    
    // Redefine hi scores
    if (score > hiScore) {
      hiScore = score;
    }
    // Reset current score
    score = 0;
    
    // Start playing again
    gameState = PLAY;
  }
  // Display scores
  text("HiScore: " + hiScore, 400, 100)
  text("Score: " + score, 500, 100)
  
  // Stops trex from falling through the ground
  if (trex.isTouching(invisibleGround) && !keyDown(DOWN_ARROW)) {
    trex.changeAnimation("running", trex_running);
  }
  trex.collide(invisibleGround);
  
  
  drawSprites();
}

// Spawns cacti
function spawnObstacles() {
 if (frameCount % 60 === 0) {
   var obstacle = createSprite(650,165,10,40);
   obstacle.velocityX = -(7 + score / 100);
 
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    // assign it to the clouds group
    obstaclesGroup.add(obstacle);
 }
}



// Spawns clouds in the background
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    // assign it to the clouds group
    cloudsGroup.add(cloud);
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
  }
  
}

// Spawns pterodactyls
function spawnPterodactyls() {
  if (frameCount % 230 == 0) {
    pterodactyl = createSprite(630, 100, 40, 10);
    pterodactyl.y = 110
    pterodactyl.addImage(pterodactylImage)
    pterodactyl.scale = 0.1;
    pterodactyl.velocityX = -10
    trex.depth = pterodactyl.depth + 1
    pterodactyl.lifetime = 63;
    pterodactylGroup.add(pterodactyl);
    // pterodactyl.debug = true;
  }
  
}