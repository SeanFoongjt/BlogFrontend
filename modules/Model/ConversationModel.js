import { MessageFactory } from "./MessageModel.js";
import { DateTimeFormatting } from "../utilities/DateTimeFormatting.js";

function ConversationModel(parent, imagePath="", title="") {
    var listOfMessages = [];
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
        clearMessages,
        getListOfMessages,
        deleteMessage,
        editMessage,
        getMessage,
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

    /**
     * Function to obtain information needed for a sidebar tab
     * @returns object containing sidebar tab information
     */
    function sidebarInformation() {
        const lastMessage = listOfMessages[listOfMessages.length - 1]
        let latestMessageText;
        let latestMessageTime;

        // If lastMessage is undefined, text and time of latest message should also be undefined
        if (lastMessage == undefined) {

        } else if (lastMessage.type === "my-chat") {
            // Otherwise if sent, the message should start with "You:"
            latestMessageText = "You: " + lastMessage.text.replace(/[\r\n]+/gm, " ");
            latestMessageTime = DateTimeFormatting.formatTimeForSidebar(lastMessage.time);

        } else if (lastMessage.type === "other-chat") {
            latestMessageText = lastMessage.text.replace(/[\r\n]+/gm, " ");
            latestMessageTime = DateTimeFormatting.formatTimeForSidebar(lastMessage.time);
        }

        
        

        return {
            imagePath: self.imagePath,
            title: self.title,
            conversationId : self.conversationId,
            latestMessageText,
            latestMessageTime,
            self
        }
    }

    /**
     * Function to add a message model to the conversation model
     * @param {Object} message message to be added to the conversation model
     * @param {Number} replyingTo whether the message is replying to another message, and if so
     * the conversation id of the message replied to
     */
    function addMessage(message, replyingTo = false) {
        self.availableId += 1;
        listOfMessages.push(message);

        // Set reply map if the message is replying to another message
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

        // Update sidebar and forwarding popup
        parent.updateSidebarConversation(self);
        parent.updateForwardingPopup();


        console.log(replyMap);
    }

    /**
     * Function to edit a message of the conversation
     * @param {*} id id of the message to be edited
     * @param {*} text new text
     * @param {*} rawHTML rawHTMl corresponding to the new text
     * @param {*} encoding new encoding
     */
    function editMessage(id, text, rawHTML, encoding) {
        const message = listOfMessages.find(findFunction(id));
        message.rawHTML = rawHTML,
        message.text = text;
        message.encoding = encoding;

        // When editing the message, if other messages have replied to the message, their reply
        // banners needs to be updated
        if (replyMap.get(message) !=  undefined) {
            for (const i of replyMap.get(message)) {
                console.log(i);
                console.log(i.htmlElement);
                i.htmlElement.shadowRoot.querySelector("span[name='replyText']").innerText = text;
            }
        }

        // Update sidebar and forwarding popup
        parent.updateSidebarConversation(self);
        parent.updateForwardingPopup();
    }


    /**
     * Delete a message from the conversation model
     * @param {*} id if of the message to be deleted
     */
    function deleteMessage(id) {
        // If another message has replied to the message, their reply banner has to be modified
        if (replyMap.get(listOfMessages.find(findFunction(id)) != undefined)) {
            for (const i of replyMap.get(listOfMessages.find(findFunction(id)))) {
                const replyText = i.htmlElement.shadowRoot.querySelector("span[name='replyText']");
                replyText.innerText = "Message Deleted";
                replyText.style.fontStyle = "italic";
                replyText.style.color = "#bebebe";
            }
        }

        listOfMessages.splice(listOfMessages.findIndex(findFunction(id)));

        // Update sidebar and forwarding popup
        parent.updateSidebarConversation(self);
        parent.updateForwardingPopup();
    }

    /**
     * Getter for messages
     * @param {*} id id of the message
     * @returns Message model of the id passed as argument
     */
    function getMessage(id) {
        return listOfMessages.find(message => message.id == id);
    }


    /**
     * Empty conversation of messages
     */
    function clearMessages() {
        listOfMessages = [];
    }

    /**
     * Change the title of the conversation
     * @param {String} newTitle 
     */
    function changeTitle(newTitle) {
        self.title = newTitle;

        // Update sidebar and forwarding popup
        parent.updateSidebarConversation(self);
        parent.updateForwardingPopup();
    }

    /**
     * Getter for all messages
     * @returns A list containing message models corresponding to the messages of the conversation
     */
    function getListOfMessages() {
        return listOfMessages.slice(0);
    }

    /**
     * Block the conversation
     */
    function block() {
        blocked = true;
    }

    /**
     * Unblock the conversation
     */
    function unblock() {
        blocked = false;
    }  

    /**
     * Check whether the conversation is blocked.
     * @returns A boolean representing whether the conversation is blocked.
     */
    function isBlocked() {
        return blocked;
    }

    return self
}

export { ConversationModel }

