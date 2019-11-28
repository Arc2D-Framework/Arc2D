namespace("core.ui.Particle", class {
    constructor(w,h,drawArea,defaultSpeed,variantSpeed,particleColor,defaultRadius,variantRadius){
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.speed = defaultSpeed + Math.random() * variantSpeed;
        this.directionAngle = Math.floor(Math.random() * 360);
        this.color = particleColor;
        this.radius = defaultRadius + Math.random() * variantRadius;
        this.vector = {
            x: Math.cos(this.directionAngle) * this.speed,
            y: Math.sin(this.directionAngle) * this.speed
        };
        this.update = function () {
            this.border();
            this.x += this.vector.x;
            this.y += this.vector.y;
        };
        this.border = function () {
            if (this.x >= w || this.x <= 0) {
                this.vector.x *= -1;
            }
            if (this.y >= h || this.y <= 0) {
                this.vector.y *= -1;
            }
            if (this.x > w) this.x = w;
            if (this.y > h) this.y = h;
            if (this.x < 0) this.x = 0;
            if (this.y < 0) this.y = 0;
        };
        this.draw = function () {
            drawArea.beginPath();
            drawArea.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            drawArea.closePath();
            drawArea.fillStyle = this.color;
            drawArea.fill();
        };
    }
})
