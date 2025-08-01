import { MessageFactory } from "./MessageModel.js";
import { DateTimeFormatting } from "../utilities/DateTimeFormatting.js";

function ConversationModel(imagePath="", title="") {
    const listOfMessages = [];
    const messageFactory = MessageFactory();
    const replyMap = new Map();
    const findFunction = id => message => message.id == id;

    const self = {
        imagePath,
        title,
        availableId : undefined,
        initialiseFromJson,
        sidebarInformation,
        addMessage,
        getListOfMessages,
        deleteMessage,
        editMessage
    }

    function initialiseFromJson(json) {
        self.imagePath = json["imagePath"];
        self.title = json["title"];
        self.availableId = Number.parseInt(json["availableId"]);

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

        const latestMessageTime = DateTimeFormatting.formatTimeForSidebar(lastMessage.time);

        return {
            imagePath: self.imagePath,
            title: self.title,
            latestMessageText,
            latestMessageTime,
            self
        }
    }

    function addMessage(message, replyingTo = false) {
        self.availableId += 1;
        listOfMessages.push(message);
        const chatRepliedTo = listOfMessages.find(findFunction(replyingTo)); 

        if (replyMap.get(chatRepliedTo) === undefined) {
            replyMap.set(chatRepliedTo, []);
        }

        if (replyingTo || replyingTo === 0) {
            replyMap.get(chatRepliedTo).push(message);
        }

        console.log(replyMap);
    }

    function editMessage(id, text, rawHTML, encoding) {
        const message = listOfMessages.find(findFunction(id));
        message.rawHTML = rawHTML,
        message.text = text;
        message.encoding = encoding;
        console.log(replyMap.get(message));
        for (const i of replyMap.get(message)) {
            console.log(i);
            console.log(i.htmlElement);
            i.htmlElement.shadowRoot.querySelector("span[name='replyText']").innerText = text;
        }
    }

    function deleteMessage(id) {
        console.log(listOfMessages.find(findFunction(id)));
        for (const i of replyMap.get(listOfMessages.find(findFunction(id)))) {
            const replyText = i.htmlElement.shadowRoot.querySelector("span[name='replyText']");
            replyText.innerText = "Message Deleted";
            replyText.style.fontStyle = "italic";
            replyText.style.color = "#bebebe";
        }
        listOfMessages.splice(listOfMessages.findIndex(findFunction(id)));

        console.log(listOfMessages);
    }

    function getListOfMessages() {
        return listOfMessages;
    }

    return self
}

export { ConversationModel }

