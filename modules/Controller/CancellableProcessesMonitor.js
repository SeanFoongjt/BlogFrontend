/**
 * Component of controller that monitors processes that can be cancelled externally like edit,
 * reply etc.
 * @returns instance of the cancellable process monitor with all the necessary methods
 */
function CancellableProcessesMonitor() {
    const cancelEvent = new Event("cancel");
    const cancellableProcesses = [];

    const self = {
        notifyCancellableProcesses,
        pushCancellableProcess,
        removeFromCancellableProcesses,
        hasCancellableProcess
    }

    /**
     * Triggers cancel event for all currently ongoing cancellable process
     */
    function notifyCancellableProcesses() {
        console.log("Cancel event broadcast!");
        cancellableProcesses.forEach((process) => process.dispatchEvent(cancelEvent));
    }


    /**
     * Keep track of a cancellable process
     * @param {Object} process process to keep track of
     */
    function pushCancellableProcess(process) {
        cancellableProcesses.push(process);
    }

    /**
     * Remove process from list of currently tracked processes
     * @param {Object} object process to remove from tracking
     */
    function removeFromCancellableProcesses(object) {
        // Remove from cancellableProcesses record as it is no longer in the midst of execution
        const index = cancellableProcesses.indexOf(object);
        if (index != -1) {
            cancellableProcesses.splice(index, 1);
        }
    }

    /**
     * Check if there is a cancellable process currently being executed
     * @returns boolean representing whether there is currently a cancellable process
     */
    function hasCancellableProcess() {
        return cancellableProcesses.length != 0;
    }

    return self;
}

// Export only this constant such that this is basically a singleton class
const cancellableProcessesMonitor = CancellableProcessesMonitor();

export { cancellableProcessesMonitor }