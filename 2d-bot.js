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
  
    show(p) {
      p.stroke(255);
      p.ellipse(this.x,this.y,5,5);
    }
  
    look(p,walls) {
      p.stroke(255,50)
      // loop through rays in field of view
      for(let i=0; i<this.v; i+=0.5) {
        let ang = this.d + i - (this.v/2);
        let x3 = this.x;
        let y3 = this.y;
        let x4 = this.x + this.cos(ang);
        let y4 = this.y + this.sin(ang);
        let cd = Infinity;
        let cx = null;
        let cy = null;
        let good = null;
        //loop through walls
        for(let wall of walls) {
          let hit = this.ray(wall.x1,wall.y1,wall.x2,wall.y2,x3,y3,x4,y4);
          if (hit) {
            let dist = ((hit[0]-x3)*(hit[0]-x3)) + ((hit[1]-y3)*(hit[1]-y3));
            if (dist < cd) {
              cd = dist;
              cx = hit[0];
              cy = hit[1];
              good = 1;
            }
          }
        }
        if (good) {
          p.line(this.x, this.y, cx, cy);
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