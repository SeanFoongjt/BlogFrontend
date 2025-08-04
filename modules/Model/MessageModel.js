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

    function createSentMessage(rawHTML, time, encoding, replyingTo, rawtext, id, forwardedFrom) {
        const chat = SentMessage(rawHTML, time, encoding, replyingTo, rawtext, id, forwardedFrom);
        if (chatlogView != undefined) {
            var element = chatlogView.renderSentMessage(
                chat
            );
        }

        return [chat, element];
    }

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

function ReceivedMessage(rawHTML, time, encoding, text, id, forwardedFrom) {
    const setHTMLElement = element => self.htmlElement = element;
    const setForwardedFrom = string => self.forwardedFrom = string;

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
        setForwardedFrom,
        copy: () => copy(self)
    }

    return self
}

function SentMessage(rawHTML, time, encoding, replyingTo, text, id, forwardedFrom) {
    const setHTMLElement = element => self.htmlElement = element;
    const setForwardedFrom = string => self.forwardedFrom = string;


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
        setForwardedFrom,
        copy : () => copy(self)
    }

    return self
}

function copy(object) {
    const objectToReturn = {}
    Object.assign(objectToReturn, object);
    const setForwardedFrom = string => objectToReturn.forwardedFrom = string;
    const setHTMLElement = element => objectToReturn.htmlElement = element;
    objectToReturn.setHTMLElement = setHTMLElement;
    objectToReturn.setForwardedFrom = setForwardedFrom;
    objectToReturn.copy = () => copy(objectToReturn);

    console.log(objectToReturn);
    return objectToReturn;
}

export { MessageFactory };