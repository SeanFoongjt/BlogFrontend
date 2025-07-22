import * as fs from 'node:fs/promises';

function ModelManager() {
    const fileHandle = fs.open("../../json/storage.json");

    function saveToJson(path) {
        fileHandle.then(handle => handle.write())

    }

    function initialiseFromJson(path) {
        const storedJson = fileHandle
            .then(handle => handle.read())
            .then(data => data.json());

        
    }
}