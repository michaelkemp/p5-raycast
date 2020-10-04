class Bot {
    constructor(x,y, d,v, maxw, maxh) {
      this.x = x;
      this.y = y;
      this.d = d;
      this.dx = this.cos(this.d);
      this.dy = this.sin(this.d);
      this.v = v;
      this.maxw = maxw;
      this.maxh = maxh;
      this.rays = [];
    }

    cos(angle) {
      return Math.cos(angle*3.14159265359/180);
    }
    sin(angle) {
      return Math.sin(angle*3.14159265359/180);
    }

    turn(d) {
      this.d += d;
      this.dx = this.cos(this.d);
      this.dy = this.sin(this.d);
    }

    walk(speed,walls) {
      let nx = this.x + (speed * this.dx);
      let ny = this.y + (speed * this.dy);
      let cx = false;
      let cy = false;
      for(let wall of walls) {
        if (wall.toPoint(nx,this.y)<5) cx = true;
        if (wall.toPoint(this.x,ny)<5) cy = true;
      }
      if (!cx) this.x = nx;
      if (!cy)  this.y = ny;
    }
  
    show2d(p) {
      p.stroke(0,0,80,0.2);
      p.strokeWeight(2);
      for(let r of this.rays) {
        p.line(this.x, this.y, r.wallx, r.wally);
      }
      p.stroke(255);
      p.strokeWeight(1);
      p.ellipse(this.x,this.y,10,10);
    }

    show3d(p) {
      p.noStroke();
      let cx;
      let cy;
      let xind = 0;
      let step = this.maxw / this.rays.length;

      for(let r of this.rays) {
        let dist = r.walld;
        dist = dist * this.cos(r.off);
        let len = 10*this.maxh/dist;
        let top = ((this.maxh - len)/2);
        p.fill(r.hue,100,p.map(len,10,this.maxh*2,30,100));
        p.rect(xind, top, 3, len);
        xind += step;
      }
    }
  
    calc(walls) {
      this.rays = [];
      // loop through rays in field of view
      for(let i=0; i<this.v; i+=0.25) {
        let ang = this.d + i - (this.v/2);
        let x3 = this.x;
        let y3 = this.y;
        let x4 = this.x + this.cos(ang);
        let y4 = this.y + this.sin(ang);
        let wd = Infinity;
        let wx = null;
        let wy = null;
        let wh = null;
        let good = null;
        // loop through walls
        for(let wall of walls) {
          let hit = this.ray(wall.x1,wall.y1,wall.x2,wall.y2,x3,y3,x4,y4);
          if (hit) {
            let dist = ((hit[0]-x3)*(hit[0]-x3)) + ((hit[1]-y3)*(hit[1]-y3));
            if (dist < wd) {
              wd = dist;
              wx = hit[0];
              wy = hit[1];
              wh = wall.hue;
              good = 1;
            }
          }
        }
        if (good) {
          this.rays.push({wallx: wx, wally: wy, walld: Math.sqrt(wd), off: (this.d-ang), hue: wh})
        }
      }
    }

    ray(x1,y1,x2,y2,x3,y3,x4,y4) {
      const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
      if (den == 0) {
        return;
      }
      const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
      const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
      if (t > 0 && t < 1 && u > 0) {
        const x = x1 + t * (x2 - x1);
        const y = y1 + t * (y2 - y1);
        return [x,y];
      } else {
        return;
      }
    }
  }