import { encodeText } from "../../utilities/encodeText.js";
import { DateTimeFormatting } from "../../utilities/DateTimeFormatting.js";


function ChatlogView(imagePath) {
    let chatlogController;
    let latestTime;
    let chatlog = document.getElementById("chatlog");
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const self = {
        setImage,
        renderConversation,
        renderSentMessage,
        setController
    }

    function setController(controller) {
        chatlogController = controller;
        console.log("chatlog controller is present")
    }

    function setImage(newImagePath) {
        imagePath = newImagePath;
    }  
    

    function renderSentMessage(message) {
        var contextObj = {
            text : encodeText(message.rawHTML, message.encoding),
            time : DateTimeFormatting.formatTime(message.time),
            encoding: message.encoding,
        }


        const messageTime = new Date(message.time);
        if (latestTime == undefined) {
            renderNewDay(messageTime);

        } else if (latestTime.getDate() != messageTime.getDate() || latestTime.getMonth() != messageTime.getMonth()) {
            renderNewDay(messageTime);
        }
        latestTime = messageTime;
        console.log(typeof latestTime);


        var conversationTemplate = fetch("../../templates/my-conversation.html")
            .then(res => res.text())
            .then(text => Handlebars.compile(text))
            .then(template => template(contextObj));

        // Initialise chatbox, add dropdown menu
        var chatbox = document.createElement("my-chat");
        chatbox.setAttribute("conversation-id", message.id);

        var fillChatbox = conversationTemplate.then(item => chatbox.innerHTML = item);

        // If the chat is replying to another chat, set up a reply banner with text
        // referencing the chat replied
        if (message.replyingTo) {
            var replyBanner = chatbox.shadowRoot.querySelector("div[name='replyBanner']");
            var text = replyBanner.querySelector("span[name='replyText']");

            
            // Inner text used here so that text in reply banner has no formatting
            fillChatbox = formatForReply(
                message.replyingTo.querySelector("div[name='text']").innerText,
                chatbox,
                fillChatbox
            );
            

            // make completed replyBanner visible, 
            replyBanner.removeAttribute("hidden");
        }

        if (message.forwardedFrom) {
            var forwardBanner = chatbox.shadowRoot.querySelector("div[name='forwardBanner']");
            var text = forwardBanner.querySelector("span[name='forwardText']");
            
            fillChatbox.then(item => {
                text.innerText = "Forwarded from " + message.forwardedFrom;
                forwardBanner.removeAttribute("hidden");
                forwardBanner.style.width = `${chatbox.shadowRoot.querySelector(".text-box").offsetWidth}px`;
            });

            // make completed replyBanner visible, 
            
        }

        chatlog.appendChild(chatbox);
        
        
        // Can move binding of functions to controller most likely, though can also just
        // stay here
        var finalPromise = Promise.all([fillChatbox])
            .then(item => {
                chatbox.querySelector("[name='reply-button']")
                    .addEventListener("click", () => chatlogController.replyFunction(chatbox));
                chatbox.querySelector("[name='edit-button']")
                    .addEventListener("click", () => chatlogController.editFunction(chatbox));
                chatbox.querySelector("[name='delete-button']")
                    .addEventListener("click", () => chatlogController.deleteFunction(chatbox));
                chatbox.querySelector("[name='forward-button']")
                    .addEventListener("click", () => chatlogController.forwardFunction(chatbox));

                chatbox.addEventListener(
                    "mouseover", 
                    () => chatbox.querySelector(".chat-dropdown").classList.add("revealed")
                );
                chatbox.addEventListener(
                    "mouseout", 
                    () => chatbox.querySelector(".chat-dropdown").classList.remove("revealed")
                );

                // Scroll to bottom of chatlog
                chatlog.scrollTop = chatlog.scrollHeight;
            });

        message.setHTMLElement(chatbox);
        return chatbox;
    }

    function renderReceivedMessage(message, imagePath="") {
        var contextObj = {
            text : encodeText(message.rawHTML, message.encoding),
            time : DateTimeFormatting.formatTime(message.time),
            imgsrc: imagePath,
            encoding: message.encoding,
        }


        const messageTime = new Date(message.time);
        if (latestTime == undefined) {
            renderNewDay(messageTime);

        } else if (latestTime.getDate() != messageTime.getDate() || latestTime.getMonth() != messageTime.getMonth()) {
            renderNewDay(messageTime);
        }
        latestTime = messageTime;
        

        var conversationTemplate = fetch("../../templates/other-conversation.html")
            .then(res => res.text())
            .then(text => Handlebars.compile(text))
            .then(template => template(contextObj))

        // Initialise chatbox, add dropdown menu
        var chatbox = document.createElement("other-chat");
        chatbox.setAttribute("conversation-id", message.id);

        var fillChatbox = conversationTemplate.then(item => chatbox.innerHTML = item);
        chatlog.appendChild(chatbox)
        

        conversationTemplate.then(item =>  {
            chatbox
                .querySelector("[name='reply-button']")
                .addEventListener("click", () => chatlogController.replyFunction(chatbox));
            chatbox
                .querySelector("[name='forward-button']")
                .addEventListener("click", () => chatlogController.forwardFunction(chatbox));

            chatbox.addEventListener(
                "mouseover", 
                () => chatbox.querySelector(".chat-dropdown").classList.add("revealed")
            );
            chatbox.addEventListener(
                "mouseout", 
                () => chatbox.querySelector(".chat-dropdown").classList.remove("revealed")
            );
            chatlog.scrollTop = chatlog.scrollHeight;
        });

        return chatbox;

    }

    function renderConversation(conversation) {
        const listOfChatboxes = [];
        latestTime = undefined;

        for (const messageModel of conversation) {
            if (messageModel.type === "my-chat") {
                listOfChatboxes.push(renderSentMessage(messageModel));

            } else if (messageModel.type === "other-chat") {
                listOfChatboxes.push(renderReceivedMessage(messageModel, imagePath));
            }
        }

        return listOfChatboxes;
    }

    async function renderNewDay(time) {
        const container = document.createElement("div");
        const timeString = time.getDate() + " " + monthNames[time.getMonth()]

        fetch("../../templates/new-day.html")
            .then(res => res.text())
            .then(text => Handlebars.compile(text))
            .then(template => template({day: timeString}))
            .then(element => container.innerHTML = element)

        chatlog.append(container);
    }

    /**
     * Format the string to be used as text for the reply banner.
     * @param {string} string string to be formatted
     * @param {HTMLElement} chatbox chatbox containing the reply banner
     * @param {Promise} promise promise to wait for before textbox is available
     * @returns 
     */
    async function formatForReply(string, chatbox, promise) {
        return Promise.all([promise]).then(item => {
            var text = chatbox.shadowRoot.querySelector("span[name='replyText']");
            const textbox = chatbox.shadowRoot.querySelector(".text-box");

            let sliced = string.slice(0, Math.round(textbox.clientWidth / 7) - 4)
            text.innerText = sliced + "..";
            console.log(text.clientWidth);

        }) 
    }



    return self
}

export { ChatlogView }