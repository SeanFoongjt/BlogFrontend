import { readJson, createConversationFromJson } from "../setup/readConversationFromJson.js"
import { createChat } from "./Chat.js"

function createChatlog(dataPath, conversation) {
    const replyMap = new Map();
    var rawcontentMap = new Map();
    const chatInstance = createChat(conversation);
    const chats = [];

    function createChatlogFromJson(conversationJson) {
        const chats = conversationJson["chats"]
        const rawcontentMap = new Map();

        for (const i of chats) {
            
            if (i["type"] == "other-chat") {
                const newChat = createOtherChat(i["text"], i["time"], i["encoding"], i["imagePath"]);
                Object.setPrototypeOf(newChat, )
                rawcontentMap.set( 
                    newChat
                );
            } else if (i["type"] == "my-chat") {
                const newChat = createMyChat(i["text"], i["time"], i["encoding"], false)
                rawcontentMap.set(
                    newChat
                );
            }
        }
        return rawcontentMap
    }

    readJson(dataPath)
        .then(data => rawcontentMap = createChatlogFromJson(data, replyMap));
}

export { createChatlog };