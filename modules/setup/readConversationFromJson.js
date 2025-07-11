//import fs from "Node:fs";
import { createConversation } from "../utilities/createConversation.js";

/**
 * Read a json from a given path and returns a promise encapsulating the json
 * @param {String} path string representing the path of the json file to be read
 * @returns Promise representing the read json path
 */
function readJson(path) {
    const jsonPromise = fetch(path)
        .then(res => res.json());

    return jsonPromise;
}

/**
 * Convert a JSON to a chatlog. Assumes appropriate formatting
 * @param {JSON} conversationJson JSON object to be converted into a chatlog
 * @returns map corresponding to raw content of each chat for editing purposes
 */
function createConversationFromJson(conversationJson) {
    const chats = conversationJson["chats"]
    const rawcontentMap = new Map();

    for (const i in chats) {
        rawcontentMap.set(
            createConversation(chats[i]["type"], chats[i]["text"], chats[i]["time"], 
                chats[i]["text"], chats[i]["encoding"], false, chats[i]["imagePath"]),
            chats[i]["rawHTML"]
        );
    }
    return rawcontentMap
}

export { readJson, createConversationFromJson };