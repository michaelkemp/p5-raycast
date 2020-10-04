let bot;
let wide = 600;
let high = 600;

let sketch2d = function(p) {
  let ang = 0; 
  let view = 60;
  let speed = 2;
  let walls = [];

  p.setup = function() {
    p.createCanvas(wide, high);
    p.colorMode(p.HSB, 360, 100, 100, 1);
    walls.push(new Wall(0, 0, wide, 0, 90));
    walls.push(new Wall(wide, 0, wide, high, 270));
    walls.push(new Wall(wide, high, 0, high, 90));
    walls.push(new Wall(0, high, 0, 0, 270));

    maze(0,wide,0,high,40,"H");

    bot = new Bot(20,20,ang,view, wide, high);
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
  
  // recursive maze algorithm
  function maze(left,right,top,bottom,size,dir) {
    let tmp;
    if (dir == "H") { // horizontal wall
      if ((bottom - top) <= size) { return; }

      tmp = Math.floor((bottom - top)/size) - 1;
      let wy = top + (size * (Math.floor(Math.random() * tmp) + 1));

      tmp = Math.floor((right - left)/size);
      let gap = left + (size * (Math.floor(Math.random() * tmp) + 1)); 
      let gapl = gap - size;
      let gapr = gap;

      if (gapl > left) walls.push(new Wall(left, wy, gapl, wy, 0));
      if (right > gapr) walls.push(new Wall(gapr, wy, right, wy, 0));
      
      maze(left,right,top,wy,size,"V");
      maze(left,right,wy,bottom,size,"V")

    } else { // vertical wall 
      if ((right - left) <= size) { return; }

      let tmp = Math.floor((right - left)/size) - 1;
      let wx = left + (size * (Math.floor(Math.random() * tmp) + 1));

      tmp = Math.floor((bottom - top)/size);
      let gap = top + (size * (Math.floor(Math.random() * tmp) + 1)); 
      let gapt = gap - size;
      let gapb = gap;

      if (gapt > top) walls.push(new Wall(wx, top, wx, gapt, 180));
      if (bottom > gapb)  walls.push(new Wall(wx, gapb, wx, bottom, 180));
      
      maze(left,wx,top,bottom,size,"H")
      maze(wx,right,top,bottom,size,"H")

    }

  }

}

let sketch3d = function(p) {

  p.setup = function() {
    p.createCanvas(wide, high);
    p.colorMode(p.HSB, 360, 100, 100, 1);
  }

  p.draw = function() {
    p.background(0,0,0);

    p.fill(0,0,50);
    p.rect(0, 0, wide, high/2);
    p.fill(0,0,0);
    p.rect(0, high/2, wide, high/2);

    bot.show3d(p);

  }
}

let sk2d = new p5(sketch2d);
let sk3d = new p5(sketch3d);

