import '/src/display/worlds/CellularAutomata/simulations/simulation.js';

class FloodFill extends Simulation{
    constructor(world, dropdown){
        super(world, dropdown, `
        <option value="0">Empty</option>
        <option value="1">Filled</option>
        <option value="2" selected>Wall</option>
        `)
    }
    eval(x, y){
        if(this.cells[y][x] === 1) return 1;
        if(this.cells[y][x] === 2) return 2;

        /* Cell is Empty (0) */
        if(this.getCell(x - 1, y) === 1) return 1;
        if(this.getCell(x, y - 1) === 1) return 1;
        if(this.getCell(x + 1, y) === 1) return 1;
        if(this.getCell(x, y + 1) === 1) return 1;
         
        /* No neighbor is full */
        return 0;
    }
    renderEval(num){
        switch(num){
            case 0: return 'white';
            case 1: return 'blue';
            case 2: return 'black';
        }
    }
}