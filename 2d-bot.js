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

    walk(speed) {
      this.x += speed * this.dx;
      this.y += speed * this.dy;
      if (this.x > this.maxw) this.x = this.maxw;
      if (this.x < 0) this.x = 0;
      if (this.y > this.maxh) this.y = this.maxh;
      if (this.y < 0) this.y = 0;
    }
  
    show2d(p) {
      p.stroke(255,20)
      p.strokeWeight(3);
      let cx;
      let cy;
      for(let r of this.rays) {
        p.line(r.bx, r.by, r.wx, r.wy);
        cx = r.bx;
        cy = r.by;
      }
      p.stroke(255);
      p.strokeWeight(1);
      p.ellipse(cx||this.x,cy||this.y,10,10);
    }

    show3d(p) {
      p.noStroke();
      let cx;
      let cy;
      let xind = 0;
      let step = this.maxw / this.rays.length;

      for(let r of this.rays) {
        let dist = Math.sqrt(r.dist);
        dist = 1 + (dist * this.cos(r.vang-r.pang));
        let len = (50 * this.maxh/dist);
        if (len > this.maxh) len = this.maxh;
        let top = ((this.maxh - len)/2);
        p.fill(p.map(len,0,this.maxh,10,200))
        p.rect(xind, top, 5, len);
        xind += step;
      }
    }
  
    calc(walls) {
      this.rays = [];
      // loop through rays in field of view
      for(let i=0; i<this.v; i+=0.5) {
        let ang = this.d + i - (this.v/2);
        let x3 = this.x;
        let y3 = this.y;
        let x4 = this.x + this.cos(ang);
        let y4 = this.y + this.sin(ang);
        let wd = Infinity;
        let wx = null;
        let wy = null;
        let good = null;
        //loop through walls
        for(let wall of walls) {
          let hit = this.ray(wall.x1,wall.y1,wall.x2,wall.y2,x3,y3,x4,y4);
          if (hit) {
            let dist = ((hit[0]-x3)*(hit[0]-x3)) + ((hit[1]-y3)*(hit[1]-y3));
            if (dist < wd) {
              wd = dist;
              wx = hit[0];
              wy = hit[1];
              good = 1;
            }
          }
        }
        if (good) {
          this.rays.push({bx:this.x, by:this.y, wx: wx, wy: wy, dist: wd, pang: this.d, vang: ang})
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