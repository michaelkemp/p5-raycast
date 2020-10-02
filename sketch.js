

let bot;
let ang = 0; 
let view = 100;
let speed = 4;
let walls = [];
let intwalls = 6

function setup() {
  createCanvas(800, 800);
  for(let i=0; i<intwalls; ++i) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = random(width);
    let y2 = random(height);
    walls.push(new Wall(x1,y1,x2,y2));
  }
  walls.push(new Wall(0, 0, width, 0));
  walls.push(new Wall(width, 0, width, height));
  walls.push(new Wall(width, height, 0, height));
  walls.push(new Wall(0, height, 0, 0));

  bot = new Bot(width/2,height/2,ang,view);
}

function draw() {
  background(0);

  for(let wall of walls) {
    wall.show();
  }
  bot.show();
  bot.look(walls);


  if (keyIsDown(LEFT_ARROW)) {  
    bot.turn(-speed);
  } 
  if (keyIsDown(RIGHT_ARROW)) { 
    bot.turn(speed);
  } 
  if (keyIsDown(UP_ARROW)) { 
      bot.walk(speed)
  } 
  if (keyIsDown(DOWN_ARROW)) { 
      bot.walk(-speed)
  } 

}