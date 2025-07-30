import { MessageFactory } from "./MessageModel.js";
import {  } from "../utilities/encodeText.js";
import { DateTimeFormatting } from "../utilities/DateTimeFormatting.js";

function ConversationModel(imagePath="", title="") {
    const listOfMessages = [];
    const messageFactory = MessageFactory();
    const replyMap = new Map();

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
        let latestMessageText;

        if (lastMessage.type === "my-chat") {
            latestMessageText = "You: " + lastMessage.text.replace(/[\r\n]+/gm, " ");

        } else if (lastMessage.type === "other-chat") {
            latestMessageText = lastMessage.text.replace(/[\r\n]+/gm, " ");
        }

        console.log(lastMessage.time);
        const latestMessageTime = DateTimeFormatting.formatTimeForSidebar(lastMessage.time);

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

