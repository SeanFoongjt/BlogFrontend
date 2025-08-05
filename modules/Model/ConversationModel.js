import { MessageFactory } from "./MessageModel.js";
import { DateTimeFormatting } from "../utilities/DateTimeFormatting.js";

function ConversationModel(parent, imagePath="", title="") {
    const listOfMessages = [];
    const messageFactory = MessageFactory();
    const replyMap = new Map();
    const findFunction = id => message => message.id == id;
    let blocked = false;

    const self = {
        imagePath,
        title,
        availableId : undefined,
        conversationId : undefined,
        initialiseFromJson,
        sidebarInformation,
        addMessage,
        getListOfMessages,
        deleteMessage,
        editMessage,
        block,
        unblock,
        isBlocked,
        changeTitle
    }

    function initialiseFromJson(json) {
        self.imagePath = json["imagePath"];
        self.title = json["title"];
        self.availableId = Number.parseInt(json["availableId"]);
        self.conversationId = Number.parseInt(json["conversationId"]);

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
            conversationId : self.conversationId,
            latestMessageText,
            latestMessageTime,
            self
        }
    }

    function addMessage(message, replyingTo = false) {
        self.availableId += 1;
        listOfMessages.push(message);

        if (replyingTo) {
            const chatRepliedTo = listOfMessages.find(findFunction(replyingTo)); 

            if (replyMap.get(chatRepliedTo) === undefined) {
                replyMap.set(chatRepliedTo, []);
            }

            if (replyingTo || replyingTo === 0) {
                replyMap.get(chatRepliedTo).push(message);
            }
        }

        self.latestMessageTime = message.time;

        parent.updateForwardingPopup();

        console.log(replyMap);
    }

    function editMessage(id, text, rawHTML, encoding) {
        const message = listOfMessages.find(findFunction(id));
        message.rawHTML = rawHTML,
        message.text = text;
        message.encoding = encoding;
        console.log(replyMap.get(message));
        if (replyMap.get(message) !=  undefined) {
            for (const i of replyMap.get(message)) {
                console.log(i);
                console.log(i.htmlElement);
                i.htmlElement.shadowRoot.querySelector("span[name='replyText']").innerText = text;
            }
        }

        parent.updateForwardingPopup();
    }

    function deleteMessage(id) {
        console.log(listOfMessages.find(findFunction(id)));
        if (replyMap.get(listOfMessages.find(findFunction(id)) != undefined)) {
            for (const i of replyMap.get(listOfMessages.find(findFunction(id)))) {
                const replyText = i.htmlElement.shadowRoot.querySelector("span[name='replyText']");
                replyText.innerText = "Message Deleted";
                replyText.style.fontStyle = "italic";
                replyText.style.color = "#bebebe";
            }
        }
        listOfMessages.splice(listOfMessages.findIndex(findFunction(id)));
        parent.updateForwardingPopup();

        console.log(listOfMessages);
    }

    function changeTitle(newTitle) {
        self.title = newTitle;
        parent.updateForwardingPopup();
    }

    function getListOfMessages() {
        return listOfMessages;
    }

    function block() {
        blocked = true;
    }

    function unblock() {
        blocked = false;
    }

    function isBlocked() {
        return blocked;
    }

    return self
}

export { ConversationModel }

