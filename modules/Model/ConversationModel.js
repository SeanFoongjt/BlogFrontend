import { MessageFactory } from "./MessageModel.js";
import { encodeText } from "../utilities/encodeText.js";

function ConversationModel(image="", title="") {
    const listOfMessages = [];

    function initialiseFromJson(json) {
        image = json["imagePath"];
        title = json["title"];

        console.log(json);
        for (const message of json["messages"]) {
            const messageModel = MessageFactory();
            messageModel.initialiseFromJson(message);
            listOfMessages.push(messageModel);
        }
    }

    function sidebarInformation() {
        const lastMessage = listOfMessages[listOfMessages.length - 1]
        const latestMessageText = encodeText(lastMessage[rawHTML]);
        const latestMessageTime = lastMessage[time];
        return {
            image,
            title,
            latestMessageText,
            latestMessageTime
        }
    }

    function addMessage(message) {
        listOfMessages.push(message);
    }

    return {
        image,
        title,
        listOfMessages,
        initialiseFromJson,
        sidebarInformation
    }
}

export { ConversationModel }

