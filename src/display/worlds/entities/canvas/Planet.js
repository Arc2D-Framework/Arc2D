/**
 * The Planet class - an orbiting circle.
 *
 * @param {Object} center
 *   An object with `x` and `y` parameters representing coordinates for the
 *   center of the planet's orbit.
 * @param {Number} radius
 *   The radius of the planet.
 * @param {Number} [orbitRadius=0]
 *   The radius of the planet's orbit.
 * @param {Number} [velocity=0]
 *   The velocity of the planet.
 * @param {String} [color='black']
 *   The color of the planet.
 */

import '/src/display/worlds/entities/canvas/Circle.js';
namespace `display.worlds.entities.canvas` (
    class Planet {
        constructor(center, radius, orbitRadius, velocity, color){
            this.center = center;
            this.x = center.x + orbitRadius;
            this.y = center.y;
            this.lastX = this.x;
            this.lastY = this.y;
            this.radius = radius;
            this.orbitRadius = orbitRadius || 0;
            this.velocity = velocity || 0;
            this.theta = 0;
            this.color = color || 'black';
        }


        /**
         * Updates the planet's position.
         *
         * @param {Number} delta
         *   The amount of time since the last time the planet was updated, in seconds.
         */
        onFixedUpdate (delta) {
            // console.log("delta",delta)
            this.lastX = this.x;
            this.lastY = this.y;
            this.theta += this.velocity * delta;
            this.x = this.center.x + Math.cos(this.theta) * this.orbitRadius;
            this.y = this.center.y + Math.sin(this.theta) * this.orbitRadius;
        }


        /**
         * Draws the planet.
         *
         * @param {Number} interpolationPercentage
         *   How much to interpolate between frames.
         */
        onDraw (interpolationPercentage,context) {
            // Interpolate with the last position to reduce stuttering.
            var x = this.lastX + (this.x - this.lastX) * interpolationPercentage,
                y = this.lastY + (this.y - this.lastY) * interpolationPercentage;
            context.circle(x, y, this.radius, this.color);
        }
    }
);

