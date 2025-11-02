

/** A class that represents an algorithm that can be executed step by step, 
 *  allowing to control its execution and providing the ability to 
 *  visualize each step (such as drawing a grid at each step).
 * 
 *  This class can be extended to implement specific algorithms, such as pathfinding, sorting, etc.
 */
class RealtimeAlgorithm {

    constructor() {
        this.running = true   // TODO change
        this.over = false
    }
    /** Execute the code for a single step in a loop / recursion
     *  Acts like the body of a loop.
     *  Must be implemented by subclasses.
    */
    nextStep() {
        throw new Error("Must implement method when inheriting");
    }

    /** Used in nextstep function, indicates if the algorithm should continue
     *  It acts as the condition in while loop for recursion.
    */
    hasNextStep() {
        throw new Error("Must implement hasNextStep");
    }

    /** Method to use when the algorithm is considered finished 
     *  Must call **`super.finish()`** to ensure the algorithm is set as over
    */
    finish() {
        this.over = true
    }

    isOver() {
        return this.over
    }

    isRunning() {
        return this.running
    }

    pause() {
        this.running = false
    }
    resume() {
        this.running = true
    }
}
