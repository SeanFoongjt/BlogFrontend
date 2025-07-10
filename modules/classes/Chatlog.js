import { readJson, createConversationFromJson } from "../setup/createConversationFromJson.js"

function createChatlog(dataPath) {
    const replyMap = new Map();
    const rawcontentMap = new Map();
    const chats = [];

    // Initialise data from json
    readJson("./json/sample-text-file.json")
        .then(data => rawcontentMap = createConversationFromJson(data, replyMap));

    
    
}

export { createChatlog };