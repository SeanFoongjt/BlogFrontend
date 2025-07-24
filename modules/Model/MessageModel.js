

/**
 * Message factory
 */
function MessageFactory() {
    const self = {
        initialiseFromJson
    }

    function initialiseFromJson(json) {
        const type = json["type"];
        const rawHTML = json["rawHTML"];
        const time = json["time"];
        const encoding = json["encoding"];
        let newMessage;

        if (type === "my-chat") {
            newMessage = SentMessage(rawHTML, time, encoding, json["replyingTo"]);
        } else if (type === "other-chat") {
            newMessage = ReceivedMessage(rawHTML, time, encoding);
        }

        return newMessage;
    }

    return self
}

function ReceivedMessage(rawHTML, time, encoding) {
    return {
        rawHTML,
        time,
        encoding
    }
}

function SentMessage(rawHTML, time, encoding, replyingTo) {
    return {
        rawHTML,
        time,
        encoding,
        replyingTo
    }
}

export { MessageFactory };