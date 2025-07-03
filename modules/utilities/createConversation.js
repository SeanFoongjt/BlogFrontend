import { formatTime } from "./formatTime.js";
import { editFunction, replyFunction, deleteFunction } from "../../main.js";
import { encodeText } from "./encodeText.js";
// Refector edit, reply delete functions to abstract from one function or something similar

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
        // Initialise chatbox, add dropdown menu
        var chatlog = document.getElementById("chatlog");
        var chatbox = document.createElement("my-chat");

        // Create Dropdown container
        const dropdown = document.createElement("div");
        dropdown.setAttribute("slot", "dropdown")
        dropdown.setAttribute("class", "col dropdown show ms-xl-5 ms-lg-4");
        chatbox.appendChild(dropdown);

        // Create Dropdown button
        const dropdownButton = document.createElement("button");
        dropdownButton.setAttribute("class", "btn btn-secondary dropdown-toggle");
        dropdownButton.setAttribute("type", "button");
        dropdownButton.setAttribute("id", "dropdownMenuButton");
        dropdownButton.setAttribute("data-bs-toggle", "dropdown");
        dropdownButton.setAttribute("aria-haspopup", "true");
        dropdownButton.setAttribute("aria-expanded", "false");
        
        dropdown.appendChild(dropdownButton);

        // Create Dropdown menu
        const dropdownMenu = document.createElement("div");
        dropdownMenu.setAttribute("class", "dropdown-menu");
        dropdownMenu.setAttribute("aria-labelledby", "dropdownMenuButton");
        dropdown.appendChild(dropdownMenu);

        // Create Edit button
        const editButton = document.createElement("a");
        editButton.setAttribute("class", "dropdown-item");
        editButton.setAttribute("href", "#");
        editButton.innerText = "Edit";
        dropdownMenu.appendChild(editButton);
        editButton.addEventListener("click", () => editFunction(chatbox));

        // Create Delete button
        const deleteButton = document.createElement("a");
        deleteButton.setAttribute("class", "dropdown-item");
        deleteButton.setAttribute("href", "#");
        deleteButton.innerText = "Delete";
        dropdownMenu.appendChild(deleteButton);
        deleteButton.addEventListener("click", () => deleteFunction(chatbox));

        // Create Forward button
        const forwardButton = document.createElement("a");
        forwardButton.setAttribute("class", "dropdown-item");
        forwardButton.setAttribute("href", "#");
        forwardButton.innerText = "Forward";
        dropdownMenu.appendChild(forwardButton);

        // Create Reply button
        const replyButton = document.createElement("a");
        replyButton.setAttribute("class", "dropdown-item");
        replyButton.setAttribute("href", "#");
        replyButton.innerText = "Reply";
        dropdownMenu.appendChild(replyButton);
        replyButton.addEventListener("click", () => replyFunction(chatbox));

        // If the chat is replying to another chat, set up a reply banner with text
        // referencing the chat replied
        if (replyingTo) {
            var replyBanner = chatbox.shadowRoot.querySelector("div[name='replyBanner']");
            var text = replyBanner.querySelector("span[name='replyText']");

            // Inner text used here so that text in reply banner has no formatting
            text.innerText = formatForReply(replyingTo.querySelector("div[name='text']").innerText);

            // Setup and addition of icon
            var replyIcon = document.createElement("i");
            replyIcon.setAttribute("class", "fa-solid fa-sm fa-arrows-turn-right");
            replyIcon.setAttribute("slot", "replyingToIcon");
            chatbox.appendChild(replyIcon);

            // make completed replyBanner visible, 
            replyBanner.removeAttribute("hidden");
            //document.querySelector(".ql-editor").firstChild.focus();
        }
                        
    } else if (type == "other-chat") {
        // Initialise chatbox, add dropdown menu
        var chatlog = document.getElementById("chatlog");
        var chatbox = document.createElement("other-chat");

        // Add image
        var image = document.createElement("img");
        image.setAttribute("slot", "image");
        image.setAttribute("class", "mw-100 ")
        image.src = imagePath;
        chatbox.appendChild(image);

        // Add in reply icon
        var replyIcon = document.createElement("i");
        replyIcon.setAttribute("class", "fa-solid fa-lg fa-reply");
        replyIcon.setAttribute("slot", "replyIcon");
        chatbox.appendChild(replyIcon);

        var replyButton = document.createElement("button");
        replyButton.setAttribute("name", "replyButtonTest");
        chatbox.appendChild(replyButton);
    }
    
    // Create text to go into the slot for actual text of the chat
    var chatText = document.createElement("div");
    chatText.setAttribute("slot", "chatText");
    chatText.setAttribute("name", "text");

    chatText.innerHTML = encodeText(editorHTML, encoding);
    chatbox.appendChild(chatText);

    // Get time, formatted using module
    const timeSpan = document.createElement("span");
    timeSpan.setAttribute("slot", "time");
    timeSpan.setAttribute("name", "time");
    timeSpan.innerText = formatTime(time);

    console.log(chatbox.shadowRoot);
    chatbox.appendChild(timeSpan);
    chatlog.appendChild(chatbox);

    // Can only access shadow root once chatbox appended to chatlog
    if (type == "other-chat") {
        console.log(chatbox.shadowRoot);
        chatbox
            .shadowRoot
            .querySelector("button[name='replyButton']")
            .addEventListener("click", () => replyFunction(chatbox));

        // Center reply button relative to text box
        const textbox = chatbox.shadowRoot.querySelector(".text-box");
        textbox.setAttribute("data-encoding", encoding);
        const replyButton = chatbox.shadowRoot.querySelector(".btn");
        replyButton.style.marginTop = (textbox.offsetHeight - replyButton.offsetHeight) / 2 + "px";

    } else {
        // Center dropdown button relative to text box 
        const textbox = chatbox.shadowRoot.querySelector(".text-box");
        textbox.setAttribute("data-encoding", encoding);
        const padding = (textbox.offsetHeight - chatbox.querySelector(".btn").offsetHeight) / 2;
        chatbox.querySelector(".dropdown").style.paddingTop = (padding).toString() + "px";
    }
    //console.log("Check 2");

    return chatbox;
}

/**
 * Format the string to be used as text for the reply banner
 * @param {string} string string to be formatted
 * @returns 
 */
function formatForReply(string) {
    if (string.length > 60) {
        return string.slice(0,60) + "..."
    } else if (string.length <= 60) {
        return string
    }
}

export { createConversation };