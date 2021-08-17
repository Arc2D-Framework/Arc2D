/* Base Simulation class */
class Simulation{
    constructor(world, dropdown, html = ''){
        this.rows = world.rows;
        this.cols = world.cols; 
        this.cellSize = world.cellSize;
        this.cells = [];
        dropdown.innerHTML = html;
        this.cellTypes = (html.match(/<option/g) || []).length;
        this.reset();
        this.randomize();
    }

    edit = (x, y, type) => this.cells[y][x] = parseInt(type);
    

    reset = () => this.cells = this.generateEmptyArr();
    render = context => this.forEachCell((x, y) => {
        context.fillStyle = this.renderEval(this.cells[y][x]);
        context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    });
    randomize = () => this.forEachCell((x, y) => this.cells[y][x] = Math.floor(Math.random() * this.cellTypes));
    step = () => {
        const buffer = this.generateEmptyArr();
        this.forEachCell((x, y) => buffer[y][x] = this.eval(x, y));
        this.cells = buffer;
    }

    renderEval(num){}
    eval(x, y){}

    /* Generates an empty cell grid (Zeroed out) */
    generateEmptyArr(){
        const arr = [];

        this.forEachCell((x, y) => {
            /* Make sure no 0s are pushed into a row that hasn't been created yet */
            if(!arr[y]) arr[y] = [];
            
            /* Set to 0 by default */
            arr[y][x] = 0;
        })
        
        /* Return all zero array */
        return arr;
    }

    /* 
    * Helper function, which loops through all of the possible (x, y)
    * pairs in the cell grid and applies a callback to each one. The only
    * reason that it loops backwards is so the "Falling Sand" simulation 
    * uses less code. (It would not work if we looped from top to bottom)
    * All of the other simulations do not care which way we loop through,
    * becuase they use a buffer.
    */
    forEachCell(funct){
        for(let y = this.rows - 1; y > -1; y--){
            for(let x = this.cols - 1; x > -1; x--){
                funct(x, y);
            }
        }
    }

    getCell(x, y){
        if(x < 0 || x >= this.cols) return false;
        if(y < 0 || y >= this.rows) return false;
        return this.cells[y][x];
    }
}