import { formatTime } from "./formatTime.js";
import { editFunction, replyFunction, formatForReply } from "../../main.js";
// Refector edit, reply delete functions to abstract from one function or something similar

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
        //console.log("dropdown created");

        // Create Dropdown button
        const dropdownButton = document.createElement("button");
        dropdownButton.setAttribute("class", "btn btn-secondary dropdown-toggle");
        dropdownButton.setAttribute("type", "button");
        dropdownButton.setAttribute("id", "dropdownMenuButton");
        dropdownButton.setAttribute("data-bs-toggle", "dropdown");
        dropdownButton.setAttribute("aria-haspopup", "true");
        dropdownButton.setAttribute("aria-expanded", "false");
        
        dropdown.appendChild(dropdownButton);
        //console.log("dropdownButton created");

        // Create Dropdown menu
        const dropdownMenu = document.createElement("div");
        dropdownMenu.setAttribute("class", "dropdown-menu");
        dropdownMenu.setAttribute("aria-labelledby", "dropdownMenuButton");
        dropdown.appendChild(dropdownMenu);
        //console.log("dropdownMenu created");

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
        deleteButton.addEventListener("click", () => {
            // Maybe add formatting to make it faded and italic
            if (replyMap.has(object)) {
                replyMap
                    .get(object)
                    .forEach((chat) => {
                    console.log(chat);
                    chat.shadowRoot.querySelector("span[name='replyText']").innerText = "Message Deleted";
                    });
            }
            chatbox.remove()
        });

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

        if (replyingTo) {
            var replyBanner = chatbox.shadowRoot.querySelector("div[name='replyBanner']");
            replyBanner.removeAttribute("hidden")
            var text = replyBanner.querySelector("span[name='replyText']");
            text.innerText = formatForReply(replyingTo.querySelector("div[name='text']").innerText);
            var replyIcon = document.createElement("i");
            replyIcon.setAttribute("class", "fa-solid fa-sm fa-arrows-turn-right");
            replyIcon.setAttribute("slot", "replyingToIcon");
            chatbox.appendChild(replyIcon);
            replyBanner.removeAttribute("hidden");
            document.querySelector(".ql-editor").firstChild.focus();
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
        console.log(chatbox.shadowRoot);
        //console.log(chatbox.shadowRoot.querySelector("button[name='replyButton']"));
        //console.log(chatbox.children);
    }
    
    // Create text to go into the slot for actual text of the chat
    var chatText = document.createElement("div");
    chatText.setAttribute("slot", "chatText");
    chatText.setAttribute("name", "text");
    
    // Process text based on encoding type selected
    if (encoding == "Plaintext") {
        console.log(editorHTML);
        chatText.innerHTML = editorHTML;
        //console.log(chatText.innerHTML);
    } else if (encoding == "HTML") {
        console.log(editorHTML);
        console.log(unescapeHTML(removeP(editorHTML)));
        //console.log(text);
        chatText.innerHTML = unescapeHTML(removeP(editorHTML));
        //console.log(chatText.innerHTML);
    }  else if (encoding == "Markdown") {
        console.log(editorHTML);
        console.log(removeP(editorHTML, "Markdown"));
        console.log(marked.parse(removeP(editorHTML, "Markdown")));
        chatText.innerHTML = marked.parse(removeP(editorHTML, "Markdown"));
    }
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
    }
    console.log("Check 2");

    return chatbox;
}

// Use a sliding window to remove the <p> and </p> inserted by the quill editor
function removeP(string, encoding="HTML") {
    let count = 0;
    let finalString = string;

    for (let i = string.length; i >= 3; i--) {
        // Sliding windows of length 3 and 4 to detect <p> and </p> respectively
        const pWindow = string.substring(i - 3, i);
        const slashPWindow = string.substring(i - 4, i);

        if (slashPWindow === "</p>") {
            count += 1;

            // If count === 1, this is the outermost </p> of a block inserted by quill
            if (count === 1 && encoding == "HTML") {
                finalString = finalString.slice(0, i - 4) + "<br>" + finalString.slice(i);

            } else if (encoding == "Markdown") {
                finalString = finalString.slice(0, i - 4) + "\n" + finalString.slice(i);
            }   
        } else if (pWindow === "<p>") {
            count -= 1;

            // Similarly if count === 0, this is the outermost <p> of a block
            if (count === 0  && encoding == "HTML") {
                finalString = finalString.slice(0, i-3) + finalString.slice(i);

            } else if (encoding == "Markdown") {
                finalString = finalString.slice(0, i - 3) + finalString.slice(i);
            }
        }
    }
    if (encoding == "Markdown") {
        finalString = finalString.replaceAll("<br>", "\n");
        //finalString = finalString.replaceAll("</iframe>", "</iframe>\n\n");

    }

    return finalString
}

function unescapeHTML(string) {
    let finalString = string;
    finalString = finalString.replaceAll("&lt;", "<");
    finalString = finalString.replaceAll("&gt;", ">");
    finalString = finalString.replaceAll("&quot", '"');
    finalString = finalString.replaceAll("&#39", "'");
    finalString = finalString.replaceAll("&apos", "'");
    finalString = finalString.replaceAll("&amp", "&");

    return finalString;
}

export { createConversation };