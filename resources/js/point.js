import {Constraint} from "./constraint.js";


export default class Point {
  constructor (x, y, canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');;
    this.x = x
    this.y = y
    this.px = x
    this.py = y
    this.vx = 0
    this.vy = 0
    this.pinX = null
    this.pinY = null

    this.constraints = []
  }

  update (delta) {
    if (this.pinX && this.pinY) return this

    if (mouse.down) {
      let dx = this.x - mouse.x
      let dy = this.y - mouse.y
      let dist = Math.sqrt(dx * dx + dy * dy)

      if (mouse.button === 1 && dist < mouse.influence) {
        this.px = this.x - (mouse.x - mouse.px)
        this.py = this.y - (mouse.y - mouse.py)
      } else if (dist < mouse.cut) {
        this.constraints = []
      }
    }

    this.addForce(0, gravity)

    let nx = this.x + (this.x - this.px) * friction + this.vx * delta
    let ny = this.y + (this.y - this.py) * friction + this.vy * delta

    this.px = this.x
    this.py = this.y

    this.x = nx
    this.y = ny

    this.vy = this.vx = 0

    if (this.x >= this.canvas.width) {
      this.px = this.canvas.width + (this.canvas.width - this.px) * bounce
      this.x = this.canvas.width
    } else if (this.x <= 0) {
      this.px *= -1 * bounce
      this.x = 0
    }

    if (this.y >= this.canvas.height) {
      this.py = this.canvas.height + (this.canvas.height - this.py) * bounce
      this.y = this.canvas.height
    } else if (this.y <= 0) {
      this.py *= -1 * bounce
      this.y = 0
    }

    return this
  }

  draw () {
    let i = this.constraints.length
    while (i--) this.constraints[i].draw()
  }

  resolve () {
    if (this.pinX && this.pinY) {
      this.x = this.pinX
      this.y = this.pinY
      return
    }

    this.constraints.forEach((constraint) => constraint.resolve())
  }

  attach (point) {
    this.constraints.push(new Constraint(this, point, this.ctx))
  }

  free (constraint) {
    this.constraints.splice(this.constraints.indexOf(constraint), 1)
  }

  addForce (x, y) {
    this.vx += x
    this.vy += y
  }

  pin (pinx, piny) {
    this.pinX = pinx
    this.pinY = piny
  }
}


export {Point}