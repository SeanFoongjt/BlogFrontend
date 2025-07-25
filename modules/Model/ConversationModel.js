import { MessageFactory } from "./MessageModel.js";
import { encodeText } from "../utilities/encodeText.js";

function ConversationModel(imagePath="", title="") {
    const listOfMessages = [];
    const messageFactory = MessageFactory();
    const repltMap = new Map();

    const self = {
        imagePath,
        title,
        initialiseFromJson,
        sidebarInformation,
        addMessage,
        getListOfMessages
    }

    function initialiseFromJson(json) {
        self.imagePath = json["imagePath"];
        self.title = json["title"];

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
            imagePath: self.imagePath,
            title: self.title,
            latestMessageText,
            latestMessageTime
        }
    }

    function addMessage(message) {
        listOfMessages.push(message);
    }

    function getListOfMessages() {
        return listOfMessages;
    }

    return self
}

export { ConversationModel }

