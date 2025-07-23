

/**
 * Message factory
 */
function MessageFactory() {
    let newMessage;
    
    function initialiseFromJson(json) {
        const type = json["type"];
        const rawHTML = json["rawHTML"];
        const time = json["time"];
        const encoding = json["encoding"];

        if (type === "my-chat") {
            newMessage = SentMessage(rawHTML, time, encoding, json["replyingTo"]);
        } else if (type === "other-chat") {
            newMessage = ReceivedMessage(rawHTML, time, encoding);
        }

        return newMessage;
    }

    return {
        initialiseFromJson
    }
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