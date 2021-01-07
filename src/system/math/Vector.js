namespace `system.math` (
    class Vector{
        constructor(x, y){
            this.x = x;
            this.y = y;
        }

        setFromVector = (vector) => {
            this.x = vector.x;
            this.y = vector.y;
            return this;
        }
        
        set = (x, y) => {
            this.x = x;
            this.y = y;
            return this;
        } 

        copy = () => new Vector(this.x, this.y);

        
        add = vector => {
            this.x += vector.x;
            this.y += vector.y;
            return this;
        }

        sub = vector => {
            this.x -= vector.x;
            this.y -= vector.y;
            return this;
        }

        mult = multiplier => {
            this.x *= multiplier;
            this.y *= multiplier;
            return this;
        }

        multByVector = vector => {
            this.x *= vector.x;
            this.y *= vector.y;
            return this;
        }

        dist = vector => {
            return Math.sqrt( Math.pow((this.x-vector.x), 2) + Math.pow((this.y-vector.y), 2) );
        }

        distance = vector => {
            return Math.sqrt( Math.pow((this.x-vector.x), 2) + Math.pow((this.y-vector.y), 2) );
        }

        moveTowards = (targetPosition, speed) => {
            let dx = targetPosition.x - this.x;
            let dy = targetPosition.y - this.y;
            let angle = Math.atan2(dy, dx);
            // return [speed * Math.cos(angle), speed * Math.sin(angle)];
            var x = speed * Math.cos(angle);
            var y = speed * Math.sin(angle);
            return new Vector(x, y)
        }

        static towards = (current, targetPosition, speed) => {
            let dx = targetPosition.x - current.x;
            let dy = targetPosition.y - current.y;
            let angle = Math.atan2(dy, dx);
            var x = speed * Math.cos(angle);
            var y = speed * Math.sin(angle);
            return new Vector(x, y)
        }
        
        div = divisor => {
            this.x /= divisor;
            this.y /= divisor;
            return this;
        }

        divByVector = vector => {
            this.x /= vector.x;
            this.y /= vector.y;
        }

        sqMag = () => this.x * this.x + this.y * this.y;

        mag = () => Math.sqrt(this.sqMag());

        norm = () => this.div(this.mag());

        //#region static
        static add = (first, second) => new Vector(first.x + second.x, first.y + second.y);

        static sub = (first, second) => new Vector(first.x - second.x, first.y - second.y);

        static mult = (vector, multiplier) => new Vector(vector.x * multiplier, vector.y * multiplier);

        static multByVector = (first, second) => new Vector(first.x * second.x, first.y * second.y);
        
        static div = (vector, divisor) => new Vector(vector.x / divisor, vector.y / divisor);

        static divByVector = (first, second) => new Vector(first.x / second.x, first.y / second.y);

        static norm = vector => Vector.div(vector, vector.mag); 
        
        static sqMag = vector => vector.x * vector.x + vector.y * vector.y;

        static mag = vector => Math.sqrt(Vector.sqMag(vector));

        


        static angle = (anchor, point) => Math.atan2(anchor.y - point.y, anchor.x - point.x) * 180 / Math.PI + 180
    }
)
