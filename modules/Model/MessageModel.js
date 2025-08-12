/**
 * Message factory
 * @param {Object} chatlogView chatlogView linked to the factory
 * @returns object representing the factory
 */
function MessageFactory(chatlogView = undefined) {
    const self = {
        initialiseFromJson,
        createSentMessage
    }

    /**
     * Create a sent message with the appropriate fields. Also renders the message if a view has
     * been passed to the MessageFactory instance
     * @param {String} rawHTML 
     * @param {String} time 
     * @param {String} encoding 
     * @param {String || Number} replyingTo 
     * @param {String} rawtext 
     * @param {String || Number} id 
     * @param {String || Number} forwardedFrom 
     * @returns A SentMessage object
     */
    function createSentMessage(rawHTML, time, encoding, replyingTo, rawtext, id, forwardedFrom) {
        const chat = SentMessage(rawHTML, time, encoding, replyingTo, rawtext, id, forwardedFrom);
        if (chatlogView != undefined) {
            var element = chatlogView.renderSentMessage(
                chat
            );
        }

        return [chat, element];
    }

    /**
     * Initialise a message model from a JSON object
     * @param {JSON} json 
     * @returns The message object corresponding to the correct message type
     */
    function initialiseFromJson(json) {
        const type = json["type"];
        const rawHTML = json["rawHTML"];
        const time = json["time"];
        const encoding = json["encoding"];
        const text = json["text"];
        const replyingTo = !(json["replyingTo"] == "false")
        const id = Number.parseInt(json["id"]);
        const forwardedFrom = !(json["replyingTo"] == "false");
        let newMessage;

        if (type === "my-chat") {
            newMessage = SentMessage(rawHTML, time, encoding, replyingTo, text, id, forwardedFrom);
        } else if (type === "other-chat") {
            newMessage = ReceivedMessage(rawHTML, time, encoding, text, id, forwardedFrom);
        }

        return newMessage;
    }

    return self
}

/**
 * Function to create a received message object with the appropriate fields
 * @param {String} rawHTML 
 * @param {String} time 
 * @param {String} encoding 
 * @param {String} text 
 * @param {String || Number} id 
 * @param {String || Number} forwardedFrom 
 * @returns 
 */
function ReceivedMessage(rawHTML, time, encoding, text, id, forwardedFrom) {
    const setHTMLElement = element => self.htmlElement = element;

    const self = {
        rawHTML,
        time,
        encoding,
        type: "other-chat",
        text,
        id,
        forwardedFrom,
        htmlElement: undefined,
        setHTMLElement,
        copy: () => copy(self)
    }

    return self
}

/**
 * Function to create a sent message object with the appropriate fields.
 * @param {String} rawHTML 
 * @param {String} time 
 * @param {String} encoding 
 * @param {String || Number} replyingTo 
 * @param {String} text 
 * @param {String || Number} id 
 * @param {String || Number} forwardedFrom 
 * @returns 
 */
function SentMessage(rawHTML, time, encoding, replyingTo, text, id, forwardedFrom) {
    const setHTMLElement = element => self.htmlElement = element;


    const self = {
        rawHTML,
        time,
        encoding,
        replyingTo,
        type: "my-chat",
        text,
        id,
        forwardedFrom,
        htmlElement: undefined,
        setHTMLElement,
        copy : () => copy(self)
    }

    return self
}

/**
 * Function to create a copy of a message decoupled from replies
 * @param {Object} message Message to be copied
 * @returns 
 */
function copy(message) {
    const objectToReturn = {}
    // Copy fields
    Object.assign(objectToReturn, message);
    
    // Reassign setHTMLElement and copy function to work on the new message's fields
    const setHTMLElement = element => objectToReturn.htmlElement = element;
    objectToReturn.setHTMLElement = setHTMLElement;
    objectToReturn.copy = () => copy(objectToReturn);

    // Remove reply coupling, set time
    objectToReturn.replyingTo = false;
    objectToReturn.time = Date(Date.now());
    
    return objectToReturn;
}

export { MessageFactory };