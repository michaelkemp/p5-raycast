
class Wall {
    constructor(x1, y1, x2, y2, hue) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.hue = hue;
    }
  
    show(p) {
      p.stroke(this.hue,100,100);
      p.strokeWeight(1);
      p.line(this.x1, this.y1, this.x2, this.y2);
    }
}