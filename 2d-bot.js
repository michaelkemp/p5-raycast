class Bot {
    constructor(x,y, d, v) {
      this.x = x;
      this.y = y;
      this.d = d;
      this.dx = cos(radians(this.d));
      this.dy = sin(radians(this.d));
      this.v = v;
    }

    turn(d) {
      this.d += d;
      this.dx = cos(radians(this.d));
      this.dy = sin(radians(this.d));
    }

    walk(speed) {
      this.x += speed * this.dx;
      this.y += speed * this.dy;
      if (this.x > width) this.x = width;
      if (this.x < 0) this.x = 0;
      if (this.y > height) this.y = height;
      if (this.y < 0) this.y = 0;
      
    }
  

    lookAt(x, y) {
      this.dir.x = x - this.pos.x;
      this.dir.y = y - this.pos.y;
      this.dir.normalize();
    }
  
    show() {
      stroke(255);
      ellipse(this.x,this.y,5,5);
    }
  
    look(walls) {
      stroke(255,50)
      // loop through rays in field of view
      for(let i=0; i<this.v; i+=0.5) {
        let ang = radians(this.d + (i - (this.v/2)));
        let x3 = this.x;
        let y3 = this.y;
        let x4 = this.x + cos(ang);
        let y4 = this.y + sin(ang);
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
          line(this.x, this.y, cx, cy);
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
        //console.log(x1,y1,x2,y2,x3,y3,x4,y4,t,u);
        const x = x1 + t * (x2 - x1);
        const y = y1 + t * (y2 - y1);
        console.log(x,y);
        return [x,y];

      } else {
        return;
      }
    }
  }