import {Point} from "./point.js";

export default class Cloth {
  constructor (canvas,clothX,clothY) {

    this.points = [];
    this.ctx = canvas.getContext('2d');

    let startX = canvas.width / 2 - clothX * spacing / 2;

    for (let y = 0; y <= clothY; y++) {
      for (let x = 0; x <= clothX; x++) {
        let point = new Point (startX + x * spacing, 20 + y * spacing, canvas);
        y === 0 && point.pin (point.x, point.y);
        x !== 0 && point.attach (this.points[this.points.length - 1]);
        y !== 0 && point.attach (this.points[x + (y - 1) * (clothX + 1)]);

        this.points.push (point);
      }
    }
  }

  update (delta) {
    let i = accuracy;

    while (i--) {
      this.points.forEach (point => {
        point.resolve ();
      });
    }

    this.ctx.beginPath ();
    this.points.forEach (point => {
      point.update (delta * delta).draw ();
    });
    this.ctx.stroke ();
  }
}

export {Cloth}