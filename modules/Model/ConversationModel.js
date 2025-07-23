import { MessageFactory } from "./MessageModel.js";
import { encodeText } from "../utilities/encodeText.js";

function ConversationModel(imagePath="", title="") {
    const listOfMessages = [];
    const messageFactory = MessageFactory();

    function initialiseFromJson(json) {
        imagePath = json["imagePath"];
        title = json["title"];

        console.log(json);
        for (const message of json["messages"]) {
            
            const messageModel = messageFactory.initialiseFromJson(message);
            listOfMessages.push(messageModel);
        }

        console.log(listOfMessages);
    }

    function sidebarInformation() {
        const lastMessage = listOfMessages[listOfMessages.length - 1]
        console.log(lastMessage);
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

    return {
        imagePath,
        title,
        listOfMessages,
        initialiseFromJson,
        sidebarInformation
    }
}

export { ConversationModel }

