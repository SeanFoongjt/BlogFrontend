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

    function createSentMessage(rawHTML, time, encoding, replyingTo, rawtext, id) {
        const chat = SentMessage(rawHTML, time, encoding, replyingTo, rawtext, id);
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
        let newMessage;

        if (type === "my-chat") {
            newMessage = SentMessage(rawHTML, time, encoding, replyingTo, text, id);
        } else if (type === "other-chat") {
            newMessage = ReceivedMessage(rawHTML, time, encoding, text, id);
        }

        return newMessage;
    }

    return self
}

function ReceivedMessage(rawHTML, time, encoding, text, id) {
    const setHTMLElement = element => self.htmlElement = element;

    const self = {
        rawHTML,
        time,
        encoding,
        type: "other-chat",
        text,
        id,
        htmlElement: undefined,
        setHTMLElement
    }

    return self
}

function SentMessage(rawHTML, time, encoding, replyingTo, text, id) {
    const setHTMLElement = element => self.htmlElement = element;

    const self = {
        rawHTML,
        time,
        encoding,
        replyingTo,
        type: "my-chat",
        text,
        id,
        htmlElement: undefined,
        setHTMLElement
    }

    return self
}

export { MessageFactory };