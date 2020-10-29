import '/src/display/worlds/CellularAutomata/simulations/simulation.js';

class ConwaysGameOfLife extends Simulation{
    constructor(world, dropdown){
        super(world, dropdown, `
        <option value="0">Dead</option>
        <option value="1" selected>Alive</option>
    `)
    }

    eval(x, y){
        let numOfNeighbors = 0; 

        for(let yOffset = -1; yOffset < 2; yOffset++){
            for(let xOffset = -1; xOffset < 2; xOffset++){
                /* Handle edge cases */
                if(!this.getCell(x + xOffset, y + yOffset)) continue;
                if(xOffset === 0 && yOffset === 0) continue;
                
                if(this.getCell(x + xOffset, y + yOffset) === 1) numOfNeighbors++;
            }    
        }
        if(numOfNeighbors === 3) return 1;
        if(numOfNeighbors === 2 && this.cells[y][x] === 1) return 1;
        return 0;
    }
    renderEval = (type) => type === 0 ? 'white' : 'black';
}