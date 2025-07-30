

/**
 * Message factory
 */
function MessageFactory(chatlogView = undefined) {
    const self = {
        initialiseFromJson,
        createSentMessage
    }

    function createSentMessage(rawHTML, time, encoding, replyingTo, rawtext) {
        const chat = SentMessage(rawHTML, time, encoding, replyingTo, rawtext);
        if (chatlogView != undefined) {
            chatlogView.renderSentMessage(
                chat.rawHTML, chat.time, chat.encoding, chat.replyingTo
            );
        }

        return chat;
    }

    function initialiseFromJson(json) {
        const type = json["type"];
        const rawHTML = json["rawHTML"];
        const time = json["time"];
        const encoding = json["encoding"];
        const text = json["text"];
        const replyingTo = !(json["replyingTo"] == "false")
        const id = json["id"];
        let newMessage;

        if (type === "my-chat") {
            newMessage = SentMessage(rawHTML, time, encoding, replyingTo, text);
        } else if (type === "other-chat") {
            newMessage = ReceivedMessage(rawHTML, time, encoding, text);
        }

        return newMessage;
    }

    return self
}

function ReceivedMessage(rawHTML, time, encoding, text) {
    const self = {
        rawHTML,
        time,
        encoding,
        type: "other-chat",
        text
    }

    return self
}

function SentMessage(rawHTML, time, encoding, replyingTo, text) {
    const self = {
        rawHTML,
        time,
        encoding,
        replyingTo,
        type: "my-chat",
        text
    }

    return self
}

export { MessageFactory };