let bot;
let wide = 600;
let high = 600;
let hall = 40;

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

    if (Math.random() > 0.5) {
      maze(0,wide,0,high,hall,"H");
    } else {
      btMaze(wide,high,hall);
    }

    bot = new Bot(hall/2,hall/2,ang,view, wide, high);
  }

  p.draw = function() {
    bot.calc(walls);
    p.background(0);
    for(let wall of walls) {
      wall.show(p);
    }
    bot.show2d(p);
    if (p.keyIsDown(p.LEFT_ARROW))  bot.turn(-speed);
    if (p.keyIsDown(p.RIGHT_ARROW)) bot.turn(speed);
    if (p.keyIsDown(p.UP_ARROW))    bot.walk(speed,walls);
    if (p.keyIsDown(p.DOWN_ARROW))  bot.walk(-speed,walls); 
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

  // backtracking maze algorithm
  function btMaze(wide,high,hall) {
    let grid = [];
    let stack = [];
    let cols = Math.floor(wide/hall);
    let rows = Math.floor(high/hall);
    let current, next, dc, dr;

    // setup grid
    for(let y=0;y<rows;++y) {
      for(let x=0; x<cols; ++x) {
        grid.push(new Cell(x,y,hall,cols,rows));
      }
    }

    current = Math.floor(grid.length/2); // create maze from center
    grid[current].visited = true;
    let visited = 1;

    // Backtracking Loop
    while(visited < grid.length-1){

      next = grid[current].unVisited(grid);
      if (next >= 0) {
        stack.push(current);

        // Remove Walls
        dc = grid[current].col - grid[next].col;
        dr = grid[current].row - grid[next].row;
        if (dc > 0) { grid[current].wl = false; grid[next].wr = false; }
        if (dc < 0) { grid[current].wr = false; grid[next].wl = false; }
        if (dr > 0) { grid[current].wt = false; grid[next].wb = false; }
        if (dr < 0) { grid[current].wb = false; grid[next].wt = false; }

        current = next;
        grid[current].visited = true;
        ++visited;
      } else if (stack.length > 0) {
        current = stack.pop();
      }
    }

    for(let i=0;i<grid.length;++i) {
      grid[i].buildWalls();
    }
  }

  class Cell {
    constructor(col, row, size, cols, rows) {
        this.col = col;
        this.row = row;
        this.size = size;
        this.cols = cols;
        this.rows = rows;
        this.wt = true;
        this.wb = true;
        this.wl = true;
        this.wr = true;
        this.visited = false;
    }

    getI(x,y) {
      if ((x<0) || (y<0) || (x>this.cols-1) || (y>this.rows-1)) {
        return -1;
      } else {
        return (y * this.cols) + x;
      }
    }

    unVisited(grid) {
      let unviz = [];
      let ti = this.getI(this.col,   this.row-1);
      let bi = this.getI(this.col,   this.row+1);
      let li = this.getI(this.col-1, this.row);
      let ri = this.getI(this.col+1, this.row);
      if (ti >= 0 && !grid[ti].visited) unviz.push(ti); 
      if (bi >= 0 && !grid[bi].visited) unviz.push(bi); 
      if (li >= 0 && !grid[li].visited) unviz.push(li); 
      if (ri >= 0 && !grid[ri].visited) unviz.push(ri); 
      if (unviz.length > 0) {
        return unviz[Math.floor(Math.random() * unviz.length)];
      } else {
        return -1;
      }
    }

    buildWalls() {
      let x = this.col * this.size;
      let y = this.row * this.size;
      let s = this.size;
      if ( (this.col < this.cols-1) && this.wr) walls.push(new Wall(x+s,   y, x+s, y+s, 180));
      if ( (this.row < this.rows-1) && this.wb) walls.push(new Wall(x+s, y+s, x,   y+s,   0));
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

