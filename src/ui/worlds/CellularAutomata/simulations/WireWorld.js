import '/src/display/worlds/CellularAutomata/simulations/simulation.js';
class WireWorld extends Simulation{
    constructor(world, dropdown){
        /*
            0: Insulator, 1: Conductor (selected) 2: Electron Head, 3 Electron Tail
        */
        super(world, dropdown, `
            <option value="1">Conductor</option>
            <option value="2">Electron Head</option>
            <option value="3">Electron Tail</option>
            <option value="0">Insulator</option>
        `);
    }

    eval(x, y){
        switch(this.cells[y][x]){
            case 0: return 0;
            case 2: return 3;
            case 3: return 1;
            case 1: 
                let numOfNeighbors = 0; 

                for(let yOffset = -1; yOffset < 2; yOffset++){
                    for(let xOffset = -1; xOffset < 2; xOffset++){
                        /* Handle edge cases */
                        if(!this.getCell(x + xOffset, y + yOffset)) continue;
                        if(xOffset === 0 && yOffset === 0) continue;
                        
                        if(this.getCell(x + xOffset, y + yOffset) === 2) numOfNeighbors++;
                    }    
                }
                if(numOfNeighbors === 1 || numOfNeighbors === 2) return 2;
                else                                             return 1;
            case 3: return 3;
        }
    }

    renderEval(num){
        switch(num){
            /* No need for break statements, becuase the function returns on each case */
            case 0: return 'black';
            case 1: return 'yellow';
            case 2: return 'red';
            case 3: return 'blue';
        }
    }

}