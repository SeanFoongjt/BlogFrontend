//import fs from "Node:fs";
import { createConversation } from "../utilities/createConversation.js";
import { createOtherChat } from "../classes/OtherChat.js";

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
 * @param {Map} replyMap Map that records which chat is replying to which chat
 * @returns map corresponding to raw content of each chat for editing purposes
 */
function createConversationFromJson(conversationJson, replyMap) {
    const chats = conversationJson["chats"]
    const rawcontentMap = new Map();

    for (const i of chats) {
        
        if (i["type"] == "other-chat") {
            rawcontentMap.set( 
                createOtherChat(i["text"], i["time"], i["encoding"], i["imagePath"])
            );
        } else if (i["type"] == "my-chat") {
            rawcontentMap.set(
                createMyChat(i["text"], i["time"], i["encoding"], false)
            );
        }
    }
    return rawcontentMap
}

export { readJson, createConversationFromJson };