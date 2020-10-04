
class Wall {
    constructor(x1, y1, x2, y2, hue) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.lensq = ((y2-y1)*(y2-y1)) + ((x2-x1)*(x2-x1));
        this.dx = x2 - x1;
        this.dy = y2 - y1;
        this.hue = hue;
    }
  
    show(p) {
      p.stroke(this.hue,100,100);
      p.strokeWeight(1);
      p.line(this.x1, this.y1, this.x2, this.y2);
    }

    toPoint(x,y) {
      let A = x - this.x1;
      let B = y - this.y1;
      let C = this.dx;
      let D = this.dy;
    
      let dot = A * C + B * D;
      let param = (this.lensq != 0) ? dot / this.lensq : -1;
    
      let xx, yy, dx, dy;
    
      if (param < 0) {
        xx = this.x1;
        yy = this.y1;
      } else if (param > 1) {
        xx = this.x2;
        yy = this.y2;
      } else {
        xx = this.x1 + param * C;
        yy = this.y1 + param * D;
      }
    
      dx = x - xx;
      dy = y - yy;
      return Math.sqrt((dx*dx) + (dy*dy));      
    }
}