import { MessageFactory } from "./MessageModel.js";
import { encodeText } from "../utilities/encodeText.js";

function ConversationModel(imagePath="", title="") {
    const listOfMessages = [];
    const messageFactory = MessageFactory();

    const self = {
        imagePath,
        title,
        initialiseFromJson,
        sidebarInformation,
        addMessage
    }

    function initialiseFromJson(json) {
        imagePath = json["imagePath"];
        title = json["title"];

        console.log(json);
        for (const message of json["messages"]) {
            
            const messageModel = messageFactory.initialiseFromJson(message);
            listOfMessages.push(messageModel);
        }
    }

    function sidebarInformation() {
        const lastMessage = listOfMessages[listOfMessages.length - 1]
        const latestMessageText = encodeText(lastMessage.rawHTML);
        const latestMessageTime = lastMessage.time.substring(lastMessage.time.length - 5);
        return {
            imagePath,
            title,
            latestMessageText,
            latestMessageTime
        }
    }

    function addMessage(message) {
        listOfMessages.push(message);
    }

    return self
}

export { ConversationModel }

