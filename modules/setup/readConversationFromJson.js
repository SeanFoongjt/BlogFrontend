//import fs from "Node:fs";
import { createConversation } from "../utilities/createConversation.js";

function readJson(path) {
    const jsonPromise = fetch(path)
        .then(res => res.json());

    return jsonPromise;
}

function createConversationFromJson(conversationJson) {
    const chats = conversationJson["chats"]
    for (const i in chats) {
        createConversation(chats[i]["type"], chats[i]["text"], chats[i]["time"], 
            chats[i]["text"], chats[i]["encoding"], false, chats[i]["imagePath"]);
    }
}

export { readJson, createConversationFromJson };