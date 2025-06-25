import { formatTime } from "./formatTime.js";
import { editFunction } from "../../main.js";

function createConversation(type, editorHTML, time, text = "", encoding = "Plaintext", imagePath ="") {
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
        deleteButton.addEventListener("click", () => chatbox.remove());

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
    }
    
    // Create text to go into the slot for actual text of the chat
    var chatText = document.createElement("div");
    chatText.setAttribute("slot", "chatText");
    chatText.setAttribute("name", "text");
    
    // Process text based on encoding type selected
    if (encoding == "Plaintext") {
        chatText.innerHTML = editorHTML;
        console.log(chatText.innerHTML);
    } else if (encoding == "HTML") {
        console.log(text);
        chatText.innerHTML = text;
        console.log(chatText.innerHTML);
    }  else if (encoding == "Markdown") {
        //chatText.innerHTML = marked.parse(editorHTML).trim();
        console.log(editorHTML.replace("<p>", "").trim());
        console.log(marked.parse(editorHTML.replace('/^<p>$/i', "").trim()));
        chatText.innerHTML = marked.parse(editorHTML.replace("<p>", "").trim());
    }
    chatbox.appendChild(chatText);

    // Get time, formatted using module
    const timeSpan = document.createElement("span");
    timeSpan.setAttribute("slot", "time");
    timeSpan.setAttribute("name", "time");
    timeSpan.innerText = formatTime(time);

    chatbox.appendChild(timeSpan);
    chatlog.appendChild(chatbox);
}

export { createConversation };