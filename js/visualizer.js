
let currentAlgorithm;
let grid;

let cellDragger ;
let cellUndoRedoManager;

let placingWalls = false;

// Grid params
let cellSize = 33;

function setup() {
    var canvas = createCanvas(1000, 533); // set default size before changing it
    canvas.parent("canva-parent");

    grid = new Grid(1, 1, [0, 0], [0, 0])
    
    adjustCanvasAndGrid()
    
    // set a default algorithm
    currentAlgorithm = new Bfs(grid, grid.get_start_pos(), grid.get_end_pos())
    currentAlgorithm.pause()

    cellDragger = new CellDragger(grid);
    cellUndoRedoManager = new CellUndoRedoManager(grid);
    
}

function adjustCanvasAndGrid() {

    let parentDiv = select("#canva-parent");  
    let divWidth = parentDiv.elt.offsetWidth; 
    let divHeight = parentDiv.elt.offsetHeight;
    
    let cols = Math.floor(divWidth / cellSize);
    let rows = Math.floor(divHeight / cellSize);

    resizeCanvas(cols * cellSize, rows * cellSize);

    grid.initialize(cols, rows, [3, 5], [cols-3, Math.min(16, rows-1)])
}
  
function draw() {
    update()
    
    // change mouse cursor appearance
    cursor(CROSS);

    background(255)
    draw_grid()
}

function update() {

    if(!currentAlgorithm.isOver() && currentAlgorithm.isRunning()) {
        if(currentAlgorithm.hasNextStep()) {
            currentAlgorithm.nextStep()
        } else {
        }
    }

    if(mouseIsPressed && !cellDragger.isDragging()) {
        let i = Math.floor(mouseX / cellSize)
        let j = Math.floor(mouseY / cellSize)

        if(grid.cell_in_grid(i, j)) {


            if(mouseButton === LEFT && grid.get(j, i) == CellState.EMPTY) {

                grid.set(j, i, CellState.WALL)
                placingWalls = true;
                cellUndoRedoManager.recordCellPlacement([j, i])

            } 

            if(mouseButton === RIGHT && currentAlgorithm.isRunning()) {
                stopAlgorithm()
            }

            if(mouseButton == RIGHT && grid.get(j, i) === CellState.WALL) {
                
                grid.set(j, i, CellState.EMPTY)
                cellUndoRedoManager.recordCellRemoval([j, i])
            }

            if(cellDragger.isCellDraggable(i,j) && !placingWalls) {
                cellDragger.dragCell(i, j)

                if(currentAlgorithm.isRunning()) {
                    stopAlgorithm()
                }

            }
        }
    }
    
    if(keyIsPressed) {

        if(keyIsDown(CONTROL) && keyIsDown(90)) {

            if(currentAlgorithm.isRunning()) {
                stopAlgorithm()
            }

            if(keyIsDown(SHIFT)) {
                cellUndoRedoManager.redo();
            } else {
                cellUndoRedoManager.undo();
            }
        }

        if (key === 'p') {
            pauseOrResume()
        }
        if (key === 'r') {
            resetGrid()
        }
    }
}

function mouseReleased() {
    if(cellDragger.isDragging()) {

        let i = Math.floor(mouseY / cellSize)
        let j = Math.floor(mouseX / cellSize)

        if(cellDragger.canDropTo(j, i)) {
            cellDragger.dropTo(j, i)
        }
        cellDragger.releaseDragged()
    }
    
    if(placingWalls) {
        placingWalls = false
        // TODO add placed walls to history
    }
}

function invertOpacity(opacity) {
    if(opacity == 250) {
        return 230
    } else {
        return 250
    }
}

function draw_grid() {
    let cellOpacity = 250
    for (let i = 0; i < grid.cols; i++) {

        if(grid.rows % 2 == 0) {
            cellOpacity = invertOpacity(cellOpacity)
        }

        for (let j = 0; j < grid.rows; j++) {
            
            noStroke();
            fill(cellOpacity);
            rect(i * cellSize , j * cellSize ,cellSize ,cellSize );
            
                
            if (isMouseInCell(i, j)) {

                fill(0, 0, 0, 90);
                rect(i * cellSize , j * cellSize , cellSize ,cellSize );
            }

            // cell state at pos j i
            let cellState = grid.get(j, i)

            if(!cellDragger.cellDragged(j, i)) {

                switch(cellState) {
                    case CellState.VISITED:
                        fill(153, 153, 238, 255);
                        break;
                    case CellState.START:
                        fill(59, 179, 65, 255);
                        break;
                    case CellState.END:
                        fill(184, 62, 93, 255);
                        break;
                    case CellState.PATH:
                        fill(255, 234, 71, 255);
                        break;
                    case CellState.WALL:
                        fill(0, 0, 0, 255);
                        break;
                }
            }

            rect(i * cellSize , j * cellSize , cellSize ,cellSize );

            cellOpacity = invertOpacity(cellOpacity);
        }
    }
}

/**  Inverts running state, if pause -> resume , if resume -> pause */
function pauseOrResume() {
    if(currentAlgorithm.isRunning()) {
        currentAlgorithm.pause()
    } else {
        currentAlgorithm.resume()
    }
}

function resetGrid() {  
    currentAlgorithm.finish()

    grid.initialize(grid.get_cols(), grid.get_rows(), grid.get_start_pos(), grid.get_end_pos())
    
    cellUndoRedoManager.resetHistory()
}

function stopAlgorithm() {
    
    currentAlgorithm.finish()
    grid.remove_visited_cells()
}

function resume() {
    currentAlgorithm.resume()
}

function windowResized() {
    adjustCanvasAndGrid()
    resetGrid()
}


function isMouseInCell(i, j) {
    return mouseX > i * cellSize  && mouseX < (i + 1) * cellSize  && mouseY > j *cellSize  && mouseY < (j + 1) *cellSize 
}

function changeAlgorithm(newAlgorithm) {
    currentAlgorithm = newAlgorithm
}



document.getElementById("run-maze-gen-btn").addEventListener("click", event => {

    resetGrid()

    let selectElement = document.getElementById("maze-gen-select");
    let selectedAlgorithm = selectElement.value;

    // todo refactor to easily add new algorithms
    if(selectedAlgorithm == "randomized-dfs") {
        changeAlgorithm(new RandomizedDfs(grid, grid.get_start_pos()));
    } else if(selectedAlgorithm == "recursive-division") {
        changeAlgorithm(new RecursiveDivision(grid, grid.get_start_pos()));
    } else if(selectedAlgorithm == "prim") {
        changeAlgorithm(new Prim(grid, grid.get_start_pos()));
    }
     else {
        console.error("Selected algorithm doesn't exists")
    }

})

document.getElementById("run-path-finding-btn").addEventListener("click", event => {

    grid.remove_visited_cells()

    let selectElement = document.getElementById("path-finding-select");
    let selectedAlgorithm = selectElement.value;

    if(selectedAlgorithm === "bfs") {
        changeAlgorithm(new Bfs(grid, grid.get_start_pos(), grid.get_end_pos()));
    } else {
        console.error("Selected algorithm doesn't exists")
    }
})

document.getElementById("grid-clear-btn").addEventListener("click", event => {
    resetGrid()
})
    
document.getElementById("pause-btn").addEventListener("click", event => {
    pauseOrResume()
})