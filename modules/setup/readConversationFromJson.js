//import fs from "Node:fs";
import { formatTime } from "../utilities/formatTime.js";
import { editFunction } from "../../main.js";

function readJson(path) {
    const jsonPromise = fetch(path)
        .then(res => res.json());

    return jsonPromise;
    /**
    fs.readfile("../../../json/sample-text-file.json", utf8, (err, data) => {
        
    });
    */
    //let json = require("../../../json/sample-text-file.json");
}

function createConversation(conversationJson) {
    for (const i in conversationJson["chats"]) {
        if (conversationJson["chats"][i]["type"] == "my-chat") {
            // Initialise chatbox, add dropdown menu
            const chatlog = document.getElementById("chatlog");
            const chatbox = document.createElement("my-chat");

            // Create Dropdown container
            var dropdown = document.createElement("div");
            dropdown.setAttribute("slot", "dropdown")
            dropdown.setAttribute("class", "col dropdown show");
            chatbox.appendChild(dropdown);
            //console.log("dropdown created");

            // Create Dropdown button
            var dropdownButton = document.createElement("button");
            dropdownButton.setAttribute("class", "btn btn-secondary dropdown-toggle");
            dropdownButton.setAttribute("type", "button");
            dropdownButton.setAttribute("id", "dropdownMenuButton");
            dropdownButton.setAttribute("data-toggle", "dropdown");
            dropdownButton.setAttribute("aria-haspopup", "true");
            dropdownButton.setAttribute("aria-expanded", "false");
            dropdown.appendChild(dropdownButton);
            //console.log("dropdownButton created");

            // Create Dropdown menu
            var dropdownMenu = document.createElement("div");
            dropdownMenu.setAttribute("class", "dropdown-menu");
            dropdownMenu.setAttribute("aria-labelledby", "dropdownMenuButton");
            dropdown.appendChild(dropdownMenu);
            //console.log("dropdownMenu created");

            // Create Edit button
            var editButton = document.createElement("a");
            editButton.setAttribute("class", "dropdown-item");
            editButton.setAttribute("href", "#");
            editButton.innerText = "Edit";
            dropdownMenu.appendChild(editButton);
            editButton.addEventListener("click", () => editFunction(chatbox));

            // Create Delete button
            var deleteButton = document.createElement("a");
            deleteButton.setAttribute("class", "dropdown-item");
            deleteButton.setAttribute("href", "#");
            deleteButton.innerText = "Delete";
            dropdownMenu.appendChild(deleteButton);
            deleteButton.addEventListener("click", () => chatbox.remove());

            // Create Forward button
            var forwardButton = document.createElement("a");
            forwardButton.setAttribute("class", "dropdown-item");
            forwardButton.setAttribute("href", "#");
            forwardButton.innerText = "Forward";
            dropdownMenu.appendChild(forwardButton);

            // Create Reply button
            var replyButton = document.createElement("a");
            replyButton.setAttribute("class", "dropdown-item");
            replyButton.setAttribute("href", "#");
            replyButton.innerText = "Reply";
            dropdownMenu.appendChild(replyButton);

            // Create text to go into the slot for actual text of the chat
            var chatText = document.createElement("div");
            chatText.setAttribute("slot", "chatText");
            chatText.setAttribute("name", "text");
            
            chatText.appendChild(document.createTextNode(conversationJson["chats"][i]["text"]));
            chatbox.appendChild(chatText);

            // Get time, formatted using module
            var time = document.createElement("span");
            time.setAttribute("slot", "time");
            time.setAttribute("name", "time");
            time.innerText = formatTime(conversationJson["chats"][i]["time"]);

            chatbox.appendChild(time);
            chatlog.appendChild(chatbox);
                            
        } else if (conversationJson["chats"][i]["type"] == "other-chat") {
            // Initialise chatbox, add dropdown menu
            var chatlog = document.getElementById("chatlog");
            var chatbox = document.createElement("other-chat");

            // Create text to go into the slot for actual text of the chat
            var chatText = document.createElement("div");
            chatText.setAttribute("slot", "chatText");
            chatText.setAttribute("name", "text");
            
            chatText.appendChild(document.createTextNode(conversationJson["chats"][i]["text"]));
            chatbox.appendChild(chatText);

            // Get time, formatted using module
            var time = document.createElement("span");
            time.setAttribute("slot", "time");
            time.setAttribute("name", "time");
            time.innerText = formatTime(conversationJson["chats"][i]["time"]);

            chatbox.appendChild(time);
            chatlog.appendChild(chatbox);
        }
    }
}

export { readJson, createConversation };