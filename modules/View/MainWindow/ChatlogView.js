import { deleteFunction, editFunction, replyFunction } from "../../utilities/chatOptions.js";


function ChatlogView(imagePath) {
    const self = {
        setImage,
        renderConversation,
        renderSentMessage,
        renderReceivedMessage
    }
    
    function setImage(newImagePath) {
        imagePath = newImagePath;
    }  

    function renderSentMessage(editorHTML, time, encoding="Plaintext", replyingTo="false") {
        var contextObj = {
            text : encodeText(editorHTML, encoding),
            time : DateTimeFormatting.formatTime(time),
            encoding: encoding,
        }
        var conversationTemplate = fetch("../../templates/my-conversation.html")
            .then(res => res.text())
            .then(text => Handlebars.compile(text))
            .then(template => template(contextObj));

        // Initialise chatbox, add dropdown menu
        var chatlog = document.getElementById("chatlog");
        var chatbox = document.createElement("my-chat");

        var fillChatbox = conversationTemplate.then(item => chatbox.innerHTML = item);

        // If the chat is replying to another chat, set up a reply banner with text
        // referencing the chat replied
        if (replyingTo) {
            var replyBanner = chatbox.shadowRoot.querySelector("div[name='replyBanner']");
            var text = replyBanner.querySelector("span[name='replyText']");

            // Inner text used here so that text in reply banner has no formatting
            fillChatbox = formatForReply(
                replyingTo.querySelector("div[name='text']").innerText,
                chatbox,
                fillChatbox
            );

            // make completed replyBanner visible, 
            replyBanner.removeAttribute("hidden");
        }

        chatlog.appendChild(chatbox);
        
        
        // Can move binding of functions to controller most likely, though can also just
        // stay here
        var finalPromise = Promise.all([fillChatbox])
            .then(item => {
                chatbox.querySelector("[name='reply-button']")
                    .addEventListener("click", () => replyFunction(chatbox));
                chatbox.querySelector("[name='edit-button']")
                    .addEventListener("click", () => editFunction(chatbox));
                chatbox.querySelector("[name='delete-button']")
                    .addEventListener("click", () => deleteFunction(chatbox));
            });

        return chatbox;
    }

    function renderReceivedMessage(editorHTML, time, encoding="Plaintext", imagePath="") {
        var contextObj = {
            text : encodeText(editorHTML, encoding),
            time : DateTimeFormatting.formatTime(time),
            imgsrc: imagePath,
            encoding: encoding,
        }
        var conversationTemplate = fetch("../../templates/other-conversation.html")
            .then(res => res.text())
            .then(text => Handlebars.compile(text))
            .then(template => template(contextObj))

        // Initialise chatbox, add dropdown menu
        var chatlog = document.getElementById("chatlog");
        var chatbox = document.createElement("other-chat");

        var fillChatbox = conversationTemplate.then(item => chatbox.innerHTML = item);

        chatlog.appendChild(chatbox);
        

        chatbox
            .shadowRoot
            .querySelector("button[name='reply-button']")
            .addEventListener("click", () => replyFunction(chatbox));

        return chatbox;

    }

    function renderConversation(conversation) {
        for (const message of conversation) {
            if (message.type === "my-chat") {
                renderSentMessage(message.rawHTML, 
                    message.time, message.encoding, message.replyingTo
                );

            } else if (message.type === "other-chat") {
                renderReceivedMessage(message.rawHTML, 
                    message.time, message.encoding, imagePath
                )
            }
        }
    }



    return self
}

export { ChatlogView }