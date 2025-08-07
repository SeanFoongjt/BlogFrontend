function CancellableProcessesMonitor() {
    const cancelEvent = new Event("cancel");
    const cancellableProcesses = [];

    const self = {
        notifyCancellableProcesses,
        pushCancellableProcess,
        removeFromCancellableProcesses,
        cancellableProcessesLength
    }

    function notifyCancellableProcesses() {
        console.log("Cancel event broadcast!");
        cancellableProcesses.forEach((process) => process.dispatchEvent(cancelEvent));
    }


    function pushCancellableProcess(process) {
        cancellableProcesses.push(process);
    }


    function removeFromCancellableProcesses(object) {
        // Remove from cancellableProcesses record as it is no longer in the midst of execution
        const index = cancellableProcesses.indexOf(object);
        if (index != -1) {
            cancellableProcesses.splice(index, 1);
        }
    }

    function cancellableProcessesLength() {
        return cancellableProcesses.length;
    }

    return self;
}

const cancellableProcessesMonitor = CancellableProcessesMonitor();

export { cancellableProcessesMonitor }