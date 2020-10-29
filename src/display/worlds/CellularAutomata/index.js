import '/src/display/worlds/CellularAutomata/simulations/CGOL.js';
import '/src/display/worlds/CellularAutomata/simulations/FallingSand.js';
import '/src/display/worlds/CellularAutomata/simulations/Floodfill.js';
import '/src/display/worlds/CellularAutomata/simulations/WireWorld.js';
namespace `display.worlds`(
    class CellularAutomata extends core.ui.World {
        constructor(element){
            super(element);

            this.ready = false;
        }

        async onConnected(){
            await super.onConnected();

            const self = this;
            this.UI = {
                canvas: self.querySelector("canvas"),
                /* Famerate input */
                FRSlider:               self.querySelector("#fr-slider"),
                FRInput:                self.querySelector("#fr-input"),
                /* Dropdowns */
                simulationDropdown:     self.querySelector("#simulation-dropdown"),
                editTypeDropdown:       self.querySelector("#edit-type-dropdown"),
                /* Buttons */
                resetButton:            self.querySelector("#reset-button"),
                randomizeButton:        self.querySelector("#randomize-button"),
                playPauseButton:        self.querySelector("#play-pause-button"),
                stepButton:             self.querySelector("#step-button"),
                editButton:             self.querySelector("#edit-button")
            }

            this.setupEventListeners();

            this.context = this.UI.canvas.getContext('2d');

            this.world = {
                cellSize: 50,
                rows: 20,
                cols: 20
            }

            this.context = this.UI.canvas.getContext('2d');
            
            this.context.canvas.width  = this.world.cols * this.world.cellSize;
            this.context.canvas.height = this.world.rows * this.world.cellSize;
            this.context.imageSmoothingEnabled = false;

            this.currentState = {
                paused: true, 
                edit: false,
            }

            this.simulation = new ConwaysGameOfLife(this.world, this.UI.editTypeDropdown);

            this.resizeCanvas();

            this.ready = true;
        }

        onFixedUpdate=()=>{
            if(!this.ready) return;

            if(!this.currentState.paused)
                this.simulation.step();

            /* Used if with do-while(false) so break statements can be used */
            if(this.mouse.down && this.currentState.edit) do {
                if(this.mouse.relative.x < 0 || this.mouse.relative.x >= this.world.cols) break;
                if(this.mouse.relative.y < 0 || this.mouse.relative.y >= this.world.rows) break;
                if(document.activeElement !== document.body) break;
                this.simulation.edit(this.mouse.relative.x, this.mouse.relative.y, this.UI.editTypeDropdown.value)
            } while(false);
        }

        onDraw=()=>{
            if(!this.ready) return;
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
            this.simulation.render(this.context);
        }

        setupEventListeners(){
            const {resetButton, randomizeButton, playPauseButton, stepButton, editButton, simulationDropdown, FRSlider, FRInput} = this.UI;
            
            resetButton.addEventListener('click', e => this.simulation.reset());
            randomizeButton.addEventListener('click', e => this.simulation.randomize());
            stepButton.addEventListener('click', e => this.simulation.step());
            editButton.addEventListener('click', e => {
                this.currentState.edit = !this.currentState.edit;
                this.UI.editTypeDropdown.hidden = !this.currentState.edit;
            })
            simulationDropdown.addEventListener('change', e => this.simulation = eval('new ' + e.target.value + '(this.world, this.UI.editTypeDropdown)'));
            
            playPauseButton.addEventListener('click', e => {
                this.currentState.paused = !this.currentState.paused;

                playPauseButton.innerHTML = this.currentState.paused ? 'Play' : 'Pause'                
            })
            
            FRInput.addEventListener('change', e => {
                let FR = parseInt(FRInput.value);
                FR = Math.max(Math.min(60, FR), 1);
                FRInput.value = FR;
                FRSlider.value = FR;
                MainLoop.setMaxAllowedFPS(FR);
            })
            FRSlider.addEventListener('change', e => {
                const FR = parseInt(FRSlider.value);
                FRInput.value = FR;
                MainLoop.setMaxAllowedFPS(FR);
            })


            this.mouse = {
                down: false,
                absolute: {
                    x: null,
                    y: null
                },
                relative: {
                    x: null,
                    y: null
                } 
            }
            window.addEventListener('mousedown', e => this.mouse.down = true);
            window.addEventListener('mouseup', e => this.mouse.down = false);

            window.addEventListener('mousemove', e => {
                this.mouse.absolute = {x: e.clientX, y: e.clientY};

                /* Don't ask me how this works */
                let mx = e.clientX - (innerWidth/2 - parseInt(this.UI.canvas.style.width,10)/2);
                let my = e.clientY - (innerHeight/2 - parseInt(this.UI.canvas.style.height,10)/2);
                this.mouse.relative = {
                    x: Math.floor(mx / (parseInt(this.UI.canvas.style.width,10) / this.world.cols)),
                    y: Math.floor(my / (parseInt(this.UI.canvas.style.height, 10) / this.world.rows))
                }
            })
            window.addEventListener('resize', e => this.resizeCanvas());
        }

        resizeCanvas(){
            // Get the height and width of the window
            var height = document.documentElement.clientHeight;
            var width  = document.documentElement.clientWidth;

            let width_height_ratio = this.world.cols / this.world.rows;

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
)