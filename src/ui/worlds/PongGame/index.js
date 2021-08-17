namespace `ui.worlds` (
    class PongGame extends core.ui.World {
        constructor(element){
            /*Supply core.ui.World with our element*/
            super(element);

            /*By default say we are not ready to render/update/etc.*/
            this.ready = false;

            /**This object will contain the state (pressed / not pressed) of every key*/
            this.keys = {};

            /*Set up all the event listeners*/
            window.addEventListener('keydown', e => this.onKeyInput(e));
            window.addEventListener('keyup',   e => this.onKeyInput(e));
            window.addEventListener('resize', e => this.resizeCanvas());
        }

        async onConnected() {
            /**Make sure core.ui.World is ready*/
            await super.onConnected();

            /*We decalre these objects first, becuase the canvas size is based off of them*/
            /*This object holds genral information about the world*/
            this.world = {
                width: 800,
                height: 600,
                wallWidth: 10,
                wallColor: '#FFFFFF',
                backgroundColor: '#000000'
            }

            /*This object holds information on the positions of the paddles, along with other settings*/
            this.players = {
                range: 500,
                speed: 3,
                height: 75,
                positions: [300, 300],
                scores: [0, 0]
            }

            /*Find the Heads Up Display in our HTML*/
            this.HUD = this.querySelector("#hud");

            /*Find the <canvas> element we are looking for*/
            this.canvas  = this.querySelector("canvas");

            /*Set the canvas to the right size*/
            this.canvas.width = this.world.width;
            this.canvas.height = this.world.height;

            /*Get the rendering context*/
            this.context = this.canvas.getContext('2d');

            /*Make the canvas the right size*/
            this.resizeCanvas();

            /*Start the game*/
            this.startGame();

            /*Final checks to make sure everything went smoothly*/
            if(!this.context) console.error("Could not generate rendering context ")
            else              this.ready = true;
        }

        onFixedUpdate=(timestep, delta)=>{
            /*Make sure we are not booting up, or else there will be an error in the console*/
            if(!this.ready) return;

            /*Get everything from 'this' (shortens code)*/
            const {keys, world, ball, players} = this;

            /*Update the paddles*/
            if     (keys['w'] && !keys['s']) players.positions[0] -= players.speed;
            else if(keys['s'] && !keys['w']) players.positions[0] += players.speed;

            if     (keys['arrowup'] && !keys['arrowdown']) players.positions[1] -= players.speed;
            else if(keys['arrowdown'] && !keys['arrowup']) players.positions[1] += players.speed;

            /*Clamp both paddles so they stay inside of their predetrimented range*/
            players.positions[0] = clamp(players.positions[0], world.height/2 - players.range/2, world.height/2 + players.range/2 - players.height);
            players.positions[1] = clamp(players.positions[1], world.height/2 - players.range/2, world.height/2 + players.range/2 - players.height);

            /**Update the ball's position**/
            ball.x += ball.xSpeed;
            ball.y += ball.ySpeed;

            /*Detect and resolve top + bottom collisions*/
            if(ball.y < world.wallWidth + ball.r){
                ball.y = world.wallWidth + ball.r;
                ball.ySpeed *= -1;
            }else if(ball.y > world.height - world.wallWidth - ball.r){
                ball.y = world.height - world.wallWidth - ball.r;
                ball.ySpeed *= -1;
            };


            /*Left/right side collision dectetion and response*/
            if(ball.x - ball.r < world.wallWidth){
                /*Left paddle*/
                if(ball.y + ball.r > players.positions[0] && ball.y - ball.r < players.positions[0] + players.height) onCollideLeft();

                /*Small side 'helpers'*/
                if(Math.abs(world.height/2 - ball.y) > players.range/2) onCollideLeft();

                /*Declare 'onCollideLeft' function*/
                function onCollideLeft(){
                    ball.xSpeed *= -1.1; //1.1 so the ball picks up speed as the round goes on
                    ball.x = world.wallWidth + ball.r;
                };
            }else if(ball.x + ball.r > world.width - world.wallWidth){
                /*Right paddle*/
                if(ball.y + ball.r > players.positions[1] && ball.y - ball.r < players.positions[1] + players.height) onCollideRight();

                /*Small side 'helpers'*/
                if(Math.abs(world.height/2 - ball.y) > players.range/2) onCollideRight();

                /*Declare 'onCollideRight' function*/
                function onCollideRight(){
                    ball.xSpeed *= -1.1; //1.1 so the ball picks up speed as the round goes on
                    ball.x = world.width - world.wallWidth - ball.r;
                };
            };

            /*Check if the ball is out of bounds, and if so, give the other player points (this also resets the ball)*/
            if(ball.x < -ball.r || ball.x > ball.r + world.width) this.scoreOn(ball.x < -ball.r ? 1 : 0);



            /*Define that clamp function that was used earlier*/
            function clamp (value, min, max){
                value = Math.max(value, min);
                value = Math.min(value, max);
                return value;
            }
        }

        onDraw=()=>{
            /*Make sure we are not booting up*/
            if(!this.ready) return;
            
            /*Get everything from 'this' (shortens code)*/
            const {context, world, ball, players} = this;

            /*Prepare the context*/
            context.clearRect(0, 0, world.width, world.height);

            /*To render the walls, we first draw a wall colored rectangle that fills the whole screen,
              then draw over that for the background.
              The whole square was wall colored, then the rectangles labled Background or BG were filled in
               __________________
              |  ______________  |
              |_|              |_|
              | |              | |
              |B|  Background  |B| 
              |G|              |G|
              |_|              |_|
              | |______________| |
              |__________________|

              This shortens code and limits draw calls, which can increase preformance. 
              (However, it is important to remember this is pong, and preformance [should] not be streched)
              
            */
           
            /**Walls**/
            context.fillStyle = world.wallColor;
            context.fillRect(0, 0, world.width, world.height);

            /*Background*/
            context.fillStyle = world.backgroundColor;
            context.fillRect(world.wallWidth, world.wallWidth, world.width - world.wallWidth * 2, world.height - world.wallWidth * 2);
            context.fillRect(0, (world.height - players.range) / 2, world.wallWidth, players.range);
            context.fillRect(world.width - world.wallWidth, (world.height - players.range) / 2, world.wallWidth, players.range);

            /*Paddles*/
            context.fillStyle = world.wallColor;
            context.fillRect(0, players.positions[0], world.wallWidth, players.height);
            context.fillRect(world.width - world.wallWidth, players.positions[1], world.wallWidth, players.height);

            /**Ball**/
            context.beginPath();
            context.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
            context.fill();

        }

        onKeyInput(e){
            /*First we see if the user pressed a key down, or if they relased one*/
            const keydown = e.type === 'keydown';

            /*Then we check which key it is*/
            const key = e.key.toLowerCase();

            /*Finally, set the detrimented key to the detrimented state in our 'keys' object*/
            this.keys[key] = keydown;
        }

        startGame(){
            this.players.scores = [0, 0];
            this.resetBall();
        }

        scoreOn(number){
            this.players.scores[number]++;
            this.HUD.innerText = `${this.players.scores[0]} : ${this.players.scores[1]}`
            this.resetBall();
        }

        resetBall(){
            /*We need this line so everything is relitive (Changing the world size won't cause the ball to become off center)*/
            const self = this;

            /*Decalre the ball*/
            this.ball = {
                x: self.world.width/2,
                y: self.world.height/2,
                r: self.world.wallWidth,
                ang: Math.random() * Math.PI * 2,
                speed: 5,
                xSpeed: 0,
                ySpeed: 0
            }

            /*We can now get the individual x and y components of the ball's angle, 
              which we will add to the ball's position each frame. (This is faster
              than using trig each frame). However, we need to wait a few seconds
              before relaseing the ball, to give the players a berak. 
            */
            window.setTimeout(() => {
                this.ball.xSpeed = Math.cos(this.ball.ang) * this.ball.speed;
                this.ball.ySpeed = Math.sin(this.ball.ang) * this.ball.speed;
            }, 2000);
            
        }

        resizeCanvas(){
            // Get the height and width of the window
            var height = document.documentElement.clientHeight;
            var width  = document.documentElement.clientWidth;

            let width_height_ratio = this.world.width / this.world.height;

            // This makes sure the canvas is resized in a way that maintains the worlds's width / height ratio.
            if (width / height < width_height_ratio) height = Math.floor(width  / width_height_ratio);
            else                                         width  = Math.floor(height * width_height_ratio);

            // This sets the CSS of the canvas to resize it to the scaled height and width.
            this.context.canvas.style.height = height + 'px';
            this.context.canvas.style.width  = width  + 'px';

            //this centers the canvas
            this.context.canvas.style.marginTop = (innerHeight/2 - height/2) + 'px';
            this.context.canvas.style.marginLeft = (innerWidth/2 - width/2) + 'px';
        }

    }
);
