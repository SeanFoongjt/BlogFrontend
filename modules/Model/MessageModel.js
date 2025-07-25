

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
        const replyingTo = !(json["replyingTo"] == "false")
        const id = json["id"];
        let newMessage;

        if (type === "my-chat") {
            newMessage = SentMessage(rawHTML, time, encoding, replyingTo);
        } else if (type === "other-chat") {
            newMessage = ReceivedMessage(rawHTML, time, encoding);
        }

        return newMessage;
    }

    return self
}

function ReceivedMessage(rawHTML, time, encoding) {
    const self = {
        rawHTML,
        time,
        encoding,
        type: "other-chat"
    }

    return self
}

function SentMessage(rawHTML, time, encoding, replyingTo) {
    const self = {
        rawHTML,
        time,
        encoding,
        replyingTo,
        type: "my-chat"
    }

    return self
}

export { MessageFactory };