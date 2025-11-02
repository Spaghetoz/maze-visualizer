

class RandomizedDfs extends MazeGenAlgorithm {
    constructor(grid, start) { 
        super(grid, start)

        grid.fill_empty_cells()

        this.stack = []
        this.stack.push(start)
        this.visited = new Set()
        this.visited.add(this.grid.pos_to_str(start[0], start[1]))
        
        /** Stores the previous neighbor of each cell added to the stack
         *  enabling digging a passage 
         */
        this.prevs = {}
        for(let i = 0 ; i < grid.cols; i++) {
            for(let j = 0; j < grid.rows; j++) {
                this.prevs[this.grid.pos_to_str(i, j)] = undefined
            }
        }
    }

    nextStep() {
        let curr = this.stack.pop()
            
        let str_curr = this.grid.pos_to_str(curr[0], curr[1])
        this.visited.add(str_curr)

        this.digIfPossible(curr[1], curr[0])

        let previous = this.prevs[str_curr]

        // Dig a passage between current cell and the cell preceding it
        if(previous !== undefined) {

            this.digIfPossible(previous[1], previous[0])

            let intermediate_cell = [(curr[0]+previous[0])/2, (curr[1]+previous[1])/2]

            this.digIfPossible(intermediate_cell[1], intermediate_cell[0])
        }

        let neighbors = shuffleArray( this.grid.get_neighbors(curr[0], curr[1], 2))

        for(let neighbor of neighbors) {
                
            let str_neighbor = this.grid.pos_to_str(neighbor[0], neighbor[1])

            if(!this.visited.has(str_neighbor)) {

                this.stack.push(neighbor)
                this.prevs[str_neighbor] = curr
            }
        }
    }
    hasNextStep() {
        return this.stack.length > 0
    }

    markAsVisited(i, j) {
        if(this.grid.get(i, j) == CellState.EMPTY) {
            this.grid.set(i, j, CellState.VISITED)
        }
    }

    digIfPossible(i, j) {
        if(this.grid.get(i, j) == CellState.WALL) {
            this.grid.set(i, j, CellState.EMPTY)
        } 
    }

    finish() {
        super.finish()
        this.grid.remove_visited_cells()
    }
}