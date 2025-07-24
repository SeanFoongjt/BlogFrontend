import { DateTimeFormatting } from "./DateTimeFormatting.js";
import { editFunction, replyFunction, deleteFunction } from "./chatOptions.js";
import { encodeText } from "./encodeText.js";

/**
 * Function to create a chat / conversation. Can be used for both sides of the conversation
 * @param {string} type type of chat, i.e. chat from the writer or from the person being talked to
 * @param {string} editorHTML contents of editor as is
 * @param {string} time string representing time conversation was made
 * @param {string} text raw text of conversation, without any formatting
 * @param {string} encoding format of text between Plaintext, HTML and Markdown, default is Plaintext.
 * @param {HTMLElement} replyingTo chat that conversation is replying to, default is false
 * @param {string} imagePath image path for photo for if conversation is from other person
 * @returns 
 */
function createConversation(type, editorHTML, time, text = "", encoding = "Plaintext", 
    replyingTo=false, imagePath ="") {
    if (type == "my-chat") {
        console.log(encoding);
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
                        
    } else if (type == "other-chat") {
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
    }

    chatlog.appendChild(chatbox);

    // Can only access shadow root once chatbox appended to chatlog
    if (type == "other-chat") {
        chatbox
            .shadowRoot
            .querySelector("button[name='reply-button']")
            .addEventListener("click", () => replyFunction(chatbox));

    } else {
        // Center dropdown button relative to text box 
        var finalPromise = Promise.all([fillChatbox])
            .then(item => {
                chatbox.querySelector("[name='reply-button']")
                    .addEventListener("click", () => replyFunction(chatbox));
                chatbox.querySelector("[name='edit-button']")
                    .addEventListener("click", () => editFunction(chatbox));
                chatbox.querySelector("[name='delete-button']")
                    .addEventListener("click", () => deleteFunction(chatbox));
            });
    }
    //console.log("Check 2");

    return chatbox;
}

/**
 * Format the string to be used as text for the reply banner.
 * NOTE: CAN LIKELY REPLACE WITH TEXT-OVERFLOW: ELLIPSIS
 * @param {string} string string to be formatted
 * @param {HTMLElement} chatbox chatbox containing the reply banner
 * @param {Promise} promise promise to wait for before textbox is available
 * @returns 
 */
function formatForReply(string, chatbox, promise) {
    return Promise.all([promise]).then(item => {
        var text = chatbox.shadowRoot.querySelector("span[name='replyText']");
        const textbox = chatbox.shadowRoot.querySelector(".text-box");

        let sliced = string.slice(0, Math.round(textbox.clientWidth / 7) - 4)
        text.innerText = sliced + "..";
        console.log(text.clientWidth);

    }) 
}

export { createConversation };