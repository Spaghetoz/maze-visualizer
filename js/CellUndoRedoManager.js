
/** Defines each action on cells with its corresponding cellstate and opposite action 
 *  For instance, an "add" action corresponds to adding a WALL cell on the grid
*/
const Actions = Object.freeze({    
    add: {
        cell_state: CellState.WALL,
        opposite: "remove",
    },
    remove: {
        cell_state: CellState.EMPTY,
        opposite: "add",
    }
})

/** Handles the cell placement history,
 *  and provide ability to undo / redo placements
 */
class CellUndoRedoManager {

    constructor(grid) {
        this.grid = grid
        /** The stack of the last cell actions (placement or removal)
         *  Records are stored in the form : {}
         */
        this.undo_stack = []
        this.redo_stack = []

        /** The number of maximum recorded actions in the undo stack */
        this.stack_limit = 200
    }

    /** Register a cell placement at a certain position
     */
    recordCellPlacement(pos) {
        this._record("add", pos, this.undo_stack)

        this._emptyRedoStack()
    }

    recordCellRemoval(pos) {
        this._record("remove", pos, this.undo_stack)

        this._emptyRedoStack()
    }

    /** Revert the last recorded action 
     *  For example if a wall was deleted at position (9, 1), bring it back 
    */
    undo() {
        if(this.undo_stack.length === 0) return

        let { action, position } = this.undo_stack.pop()
        let oppositeAction = Actions[action]["opposite"]

        this._record(oppositeAction, position, this.redo_stack)
        this._doActionOnGrid(oppositeAction, position)
    }

    redo() {
        if(this.redo_stack.length === 0) return
        
        let { action, position }= this.redo_stack.pop()
        let oppositeAction = Actions[action]["opposite"]

        this._record(oppositeAction, position, this.undo_stack)
        this._doActionOnGrid(oppositeAction, position)
    }

    resetHistory() {
        this.undo_stack = []
        this.redo_stack = []
    }

    /** Record an action at a certain position to a specific stack 
     * (for instance undo_stack or redo_stack) */
    _record(action, pos, toStack) {
        if (!Actions[action]) throw new Error(`Invalid action: ${action}`)

        if (toStack.length > this.stack_limit) {
            toStack.shift(); 
        }

        toStack.push({"action": action, "position": pos}) 
    }
    
    _emptyRedoStack() {
        this.redo_stack = []
    }

    _doActionOnGrid(action, pos) {
        this.grid.set(pos[0], pos[1], Actions[action]["cell_state"])
    }
}