

class Bfs extends PathFindingAlgorithm {

    constructor(grid, start, end) {
        super(grid, start, end)
        
        this.visited = new Set()
        this.queue = []
        this.queue.push(start)
        this.visited.add(start)

        for(let i = 0 ; i < grid.cols; i++) {
            for(let j = 0; j < grid.rows; j++) {
                this.prev[this.grid.pos_to_str(i, j)] = undefined
            }
        }

        /**The current cell used to construct the path step by step,
        tracing back from the end cell to the starting cell.*/
        this.current_path_cell = this.end
    }


    nextStep() {

        if(this.isLookingForPath) {
            this.pathFindingNextStep()
        } 
        else if(this.isConstructingPath) {
            this.pathConstructionNextStep()
        }
    }

    hasNextStep() {
        return this.isLookingForPath || this.isConstructingPath
    }

    pathFindingNextStep() {

        if(this.queue.length === 0) {
            this.isLookingForPath = false
            return;
        }

        let curr = this.queue.at(0)
        this.queue.shift()

        let j = curr[0]
        let i = curr[1]

        if(this.targetFound(curr)) {
            this.isLookingForPath = false
            this.isConstructingPath = true
            return
        }
        
        this.visited.add(this.grid.pos_to_str(j, i))

        for(let neighbor of this.grid.get_neighbors(curr[0], curr[1])) {
            let str_neighbor = this.grid.pos_to_str(neighbor[0], neighbor[1])
            if(!this.visited.has(str_neighbor) && this.grid.get(i, j) != CellState.WALL) {
                
                this.queue.push(neighbor)
                this.visited.add(str_neighbor)

                this.prev[str_neighbor] = curr
            } 
        }

        if(this.grid.get(i,j) === CellState.EMPTY) {
            this.grid.set(i, j, 1)
        }
    }


    targetFound(curr) {
        return curr[0] === this.end[0] && curr[1] === this.end[1]
    }

    pathConstructionNextStep() {
        
        if(this.current_path_cell === undefined) {
            this.isConstructingPath = false
            return
        }

        let curr_j = this.current_path_cell[1]
        let curr_i = this.current_path_cell[0]
        
        if(this.grid.get(curr_j, curr_i) === CellState.VISITED) {
            this.grid.set(curr_j, curr_i, 4)
        }
        this.shortestPath.push(this.grid.pos_to_str(curr_i, curr_j))
        this.current_path_cell = this.prev[this.grid.pos_to_str(curr_i, curr_j)]
        
    }

    finish() {
        super.finish()
    }

}