let bot;


let sketch2d = function(p) {
  let wide = 600;
  let high = 600;

  let ang = 0; 
  let view = 60;
  let speed = 2;
  let walls = [];

  p.setup = function() {
    p.createCanvas(wide, high);
    for(let i=0; i<6; ++i) {
      let x1 = p.random(wide);
      let y1 = p.random(high);
      let x2 = p.random(wide);
      let y2 = p.random(high);
      walls.push(new Wall(x1,y1,x2,y2));
    }
    walls.push(new Wall(0, 0, wide, 0));
    walls.push(new Wall(wide, 0, wide, high));
    walls.push(new Wall(wide, high, 0, high));
    walls.push(new Wall(0, high, 0, 0));

    bot = new Bot(wide/2,high/2,ang,view, wide, high);
  }

  p.draw = function() {
    bot.calc(walls);

    p.background(0);

    for(let wall of walls) {
      wall.show(p);
    }
    bot.show2d(p);

    if (p.keyIsDown(p.LEFT_ARROW)) {  
      bot.turn(-speed);
    } 
    if (p.keyIsDown(p.RIGHT_ARROW)) { 
      bot.turn(speed);
    } 
    if (p.keyIsDown(p.UP_ARROW)) { 
        bot.walk(speed)
    } 
    if (p.keyIsDown(p.DOWN_ARROW)) { 
        bot.walk(-speed)
    } 

  }
}

let sketch3d = function(p) {
  let wide = 600;
  let high = 600;

  p.setup = function() {
    p.createCanvas(wide, high);
  }

  p.draw = function() {
    p.background(127);

    p.fill(0,0,80);
    p.rect(0, 0, wide, high/2);
    p.fill(0,80,0);
    p.rect(0, high/2, wide, high/2);

    bot.show3d(p);

  }
}

let sk2d = new p5(sketch2d);
let sk3d = new p5(sketch3d);

