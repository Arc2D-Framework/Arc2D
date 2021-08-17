import '/src/display/worlds/CellularAutomata/simulations/simulation.js';

class FallingSand extends Simulation{
    constructor(world, dropdown){
        super(world, dropdown, `
            <option value="0">Air</option>
            <option value="1" selected>Sand</option>
        `)
    }
    
    renderEval = num => num === 0 ? 'white' : 'brown';
    
    /* This simulation overides the default step method, because it does not use a buffer */
    step = () => {
        this.forEachCell((x, y) => {
            /* Make sure it's not an air cell */
            if(this.cells[y][x] === 0) return;
            /* Make sure the cell below it exists (if not then it is in the last row) */
            if(this.getCell(x, y + 1) === null) return;
            if(this.getCell(x, y + 1) === 0){
                this.cells[y][x] = 0;
                this.cells[y + 1][x] = 1;
            }
        });
    }
}