var PLAY = 1;
var END = 0;
var gameState = PLAY;
var mario, marioImage, marioImageInverted, ground, groundImage, invisGround, edges, bground;
var bgroundImage, brick, brickImage;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, depth;
var side = "right";
var obstacleGroup, brickGroup, marioCollided, gameOver, restart, gameoverImg, restartImg;
var score = 0;
var jumpSound,checkpointSound,diesound;


function preload() {
  marioImage = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  marioImageInverted = loadAnimation("left_mario00.png", "left_mario01.png", "left_mario02.png", "left_mario03.png");
  groundImage = loadImage("ground2.png");
  bgroundImage = loadImage("bg.png");
  brickImage = loadImage("brick.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  marioCollided = loadAnimation("collided.png");
  restartImg = loadImage("restart.png");
  gameoverImg = loadImage("gameOver.png");
  jumpSound=loadSound("jump.mp3");
  checkpointSound=loadSound("checkPoint.mp3");
  dieSound=loadSound("die.mp3");
          
}


function setup() {
  createCanvas(500, 300);

  bground = createSprite(0, 0, 500, 300);
  bground.addImage("bground", bgroundImage);
  bground.scale = 2;

  mario = createSprite(50, 260, 20, 40);
  mario.addAnimation("mario", marioImage);
  mario.addAnimation("collided", marioCollided);
  mario.scale = 1.2;
  marioInv = createSprite(40, 270, 20, 40);
  marioInv.addAnimation("marioInv", marioImageInverted);
  marioInv.addAnimation("collide", marioCollided);
  marioInv.visible = false;

  ground = createSprite(250, 277, 500, 20);
  ground.addImage("ground", groundImage);
  ground.scale = 0.5;
  ground.velocityX = -(3+score/100);
  ground.x = (ground.width / 2) - 300;
  console.log(ground.x);

  invisGround = createSprite(250, 265, 500, 20);
  invisGround.visible = false;

  gameOver = createSprite(250, 120);
  gameOver.addImage(gameoverImg);
  gameOver.sacle = 0.5;

  restart = createSprite(250, 160);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  brickGroup = new Group();
  obstacleGroup = new Group();

  mario.setCollider("rectangle", 0, 0, 30, 30);
  //mario.debug=true;
}



function draw() {
  background(220);
  console.log(gameState)
  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    score =score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%50 === 0){
       checkpointSound.play() 
    }
    if (ground.x < 200) {
      ground.x = (ground.width / 2) - 300;
    }
    if (keyDown("space") && mario.y >= 200) {
      mario.velocityY = -10;
      jumpSound.play();
    }
    mario.velocityY = mario.velocityY + 0.5;

    if (keyDown("space") && marioInv.y >= 200) {
      marioInv.velocityY = -10;
    }
    marioInv.velocityY = marioInv.velocityY + 0.5;
    if (keyDown("left") && side === "right") {
      marioInv.x = mario.x;
      marioInv.y = mario.y;
      marioInv.visible = true;
      mario.visible = false;
      marioInv.x -= 2;
      side = "left";
    }
    if (keyDown("left") && side === "left") {
      marioInv.x = marioInv.x -= 2;
    }
    if (keyDown("right") && side === "right") {
      mario.x = marioInv.x;
      marioInv.visible = false;
      mario.visible = true;
      mario.x += 2;

    }
    if (keyDown("right") && side === "left") {
      mario.x = marioInv.x;
      mario.visible = true;
      marioInv.visible = false;
      mario.x += 2;
      side = "right"
    }


    spawnBricks();
    spawnObstacles();

    if (obstacleGroup.isTouching(mario)) {
      gameState = END;
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    dieSound.play();
    obstacleGroup.setVelocityXEach(0);
    brickGroup.setVelocityXEach(0);
    mario.velocityX = 0;
    mario.velocityY = 0;
    obstacleGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);
    mario.changeAnimation("collided", marioCollided);
    //marioInv.changeAnimation("collided",marioCollided);
  }


  mario.collide(invisGround);
  marioInv.collide(invisGround);
  
  if(mousePressedOver(restart)){
   reset();
  }

  drawSprites();
  fill("red");
  text("SCORE:" + score, 400, 50);
}

function reset(){
  gameState=PLAY;
  gameOver.visible= false;
  restart.visible=false;
  obstacleGroup.destroyEach();
  brickGroup.destroyEach();
  mario.changeAnimation("mario",marioImage);
  score=0;
}

function spawnBricks() {
  if (frameCount % 50 === 0) {
    brick = createSprite(300, 200, 30, 10);
    brick.addImage("brick", brickImage);
    brick.scale = 1;
    brick.y = Math.round(random(130, 200));
    brick.velocityX = -5;
    brick.lifetime = 50;
    brick.depth = mario.depth;
    mario.depth = mario.depth + 1;
    brickGroup.add(brick);
  }
}


function spawnObstacles() {
  if (frameCount % 50 === 0) {
    obstacle = createSprite(250, 240, 20, 20);
    obstacle.velocityX = -(5+score/100);
    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;

      default:
        break;

    }
    obstacle.scale = 0.7;
    obstacle.lifetime = 100;
    obstacleGroup.add(obstacle);
  }
}