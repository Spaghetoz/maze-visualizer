

/** Generate a maze using the iterative version of the recursive division algorithm.
    This algorithm divides the grid into smaller sections by placing
    horizontal or vertical walls with random openings, using a stack 
    instead of recursion. It continues subdividing regions until no further division 
    is possible (regions too small).  
 */
class RecursiveDivision extends MazeGenAlgorithm {

    constructor(grid, start) {
        super(grid, start)
            
        // "Recursion stack" storing the arguments of the "recursive calls" 
        this.stack = [[0, 0, this.grid.cols, this.grid.rows]]
            
        /**A queue storing the walls to build
            If there are walls pending, we pause the division of new sections
            until those walls are processed first
        */
        this.pending_walls = []
    }
    
    nextStep() {
    
        if(this.hasWallsToBuild()) {
            let wall_pos = this.pending_walls.shift(0)
            this.grid.set(wall_pos[1], wall_pos[0], CellState.WALL)
        } 
        else {
            let [x, y, width, height] = this.stack.pop();
            this.processSection(x,y,width,height)
        }  
    }
    
    hasWallsToBuild() {
        return this.pending_walls.length > 0
    }
    
    processSection(x_pos, y_pos, width, height, randomWallOrientation = false) {
    
        if(!this.isSectionTooSmall(width, height)) {
    
            let wall_vertical; // 1 = vertical wall, 0 = horizontal
            
            if(randomWallOrientation) {
                // choose wall orientation randomly
                wall_vertical = Math.round(Math.random())
            } else {
                // Choose based on section dimensions:
                // horizontal if taller (height > width), vertical otherwise
                if(width < height) {
                    wall_vertical = 0
                } else {
                    wall_vertical = 1
                }
            }
    
            if(wall_vertical) {
                let wall_x = randEven(x_pos, x_pos+width)
                let opening_pos_y = randEven(y_pos, y_pos+height)
        
                this.add_vertical_wall(wall_x, y_pos, height, opening_pos_y)
        
                // Process right section
                this.stack.push([wall_x+1, y_pos, x_pos+width-(wall_x+1), height])
                // Process left section
                this.stack.push([x_pos, y_pos, wall_x-x_pos, height])
            } else {
                let wall_y = randOdd(y_pos, y_pos+height)
                let opening_pos_x = randOdd(x_pos, x_pos+width)
    
                this.add_horizontal_wall(x_pos, wall_y, width, opening_pos_x)
    
                // Process bottom section
                this.stack.push([x_pos, wall_y+1, width, y_pos+height-(wall_y+1)])
                // Process top section
                this.stack.push([x_pos, y_pos, width, wall_y-y_pos])
            }
        }
    }
    
    isSectionTooSmall(section_width, section_height) {
        return section_width <= 1 || section_height <= 1
    }
    
    /** Adds to the queue all the wall cells needed to build a vertical wall */
    add_vertical_wall(x, y, length, opening_pos_y) {
    
        for(let wall_y = y; wall_y < y+length ; wall_y++) {
            let wall_pos = [x, wall_y]
    
            if(this.grid.get(wall_pos[1], wall_pos[0]) === CellState.EMPTY && wall_y !== opening_pos_y) {
                this.pending_walls.push(wall_pos)
            }
        }
    }
    
    add_horizontal_wall(x, y, length, opening_pos_x) {
        for(let wall_x = x; wall_x < x+length; wall_x++) {
            let wall_pos = [wall_x, y]
    
            if(this.grid.get(wall_pos[1], wall_pos[0]) === CellState.EMPTY && wall_x !== opening_pos_x) {
                this.pending_walls.push(wall_pos)
            }
        }
    }
    
    hasNextStep() {
        return this.stack.length > 0
    }
    
    finish() {
        super.finish()
    }
}