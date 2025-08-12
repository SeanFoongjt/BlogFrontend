import { encodeText } from "../../utilities/encodeText.js";
import { DateTimeFormatting } from "../../utilities/DateTimeFormatting.js";


function ChatlogView(imagePath) {
    let chatlogController;
    let latestTime;
    let sentMessageTemplate;
    let receivedMessageTemplate;
    let chatlog = document.getElementById("chatlog");
    // Allows for easy printing of new date
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const self = {
        setImage,
        renderConversation,
        renderSentMessage,
        setController,
        clear,
        initialise
    }

    /**
     * Initialisation function, primarily serves to load in templates
     * @param {*} conversation conversation to initialise the chatlog with
     * @returns Promise containing the list of rendered chatbox elements
     */
    async function initialise(conversation) {
        // Initialise templates for sent and received messages
        const loadSentMessage = fetch("../../templates/my-conversation.html")
            .then(res => res.text())
            .then(text => Handlebars.compile(text))
            .then(item => {sentMessageTemplate = item; return 1});

        const loadReceivedMessage = fetch("../../templates/other-conversation.html")
            .then(res => res.text())
            .then(text => Handlebars.compile(text))
            .then(item =>  {receivedMessageTemplate = item; return 1});

        // Once the templates have finished loading, render the conversations
        return Promise.all([loadSentMessage, loadReceivedMessage])
            .then(() => renderConversation(conversation.getListOfMessages()));
    }

    /**
     * Set controller of view, part of initialisation
     * @param {ChatlogController} controller 
     */
    function setController(controller) {
        chatlogController = controller;
        console.log("chatlog controller is present")
    }

    /**
     * Set image path for current conversation
     * @param {String} newImagePath String corresponding to the imagePath
     */
    function setImage(newImagePath) {
        imagePath = newImagePath;
    }  
    

    /**
     * View function to render messages sent from the user
     * @param {Object} message SentMessage created from MessageModel with the appropriate fields
     * @returns HTMLElement corresponding to the message rendered
     */
    function renderSentMessage(message) {
        checkAndRenderNewDay(message.time);

        var contextObj = {
            text : encodeText(message.rawHTML, message.encoding),
            time : DateTimeFormatting.formatTime(message.time),
            encoding: message.encoding,
        }

        // Initialise chatbox, add dropdown menu
        var chatbox = document.createElement("my-chat");
        chatbox.setAttribute("conversation-id", message.id);
        chatbox.innerHTML = sentMessageTemplate(contextObj);

        chatlog.appendChild(chatbox);
        

        // If the chat is replying to another chat, set up a reply banner with text
        // referencing the chat replied
        if (message.replyingTo) {
            var replyBanner = chatbox.shadowRoot.querySelector("div[name='replyBanner']");
            var text = replyBanner.querySelector("span[name='replyText']");

            
            // Inner text used here so that text in reply banner has no formatting
            formatForReply(
                message.replyingTo.querySelector("div[name='text']").innerText,
                chatbox
            );
            

            // make completed replyBanner visible, 
            replyBanner.removeAttribute("hidden");
        }


        // If the message is forwarded from another chat, set up a forward banner with
        // text regerencing the conversation
        if (message.forwardedFrom) {
            console.log(chatbox);
            var forwardBanner = chatbox.shadowRoot.querySelector("div[name='forwardBanner']");
            var text = forwardBanner.querySelector("span[name='forwardText']");
            console.log(text);
            
            text.innerText = "Forwarded from " + message.forwardedFrom;
            forwardBanner.removeAttribute("hidden");
            forwardBanner.style.width = `${chatbox.shadowRoot.querySelector(".text-box").offsetWidth}px`;
            
        }

        
        // Binding of functions like reply, edit, delete and forward
        chatbox.querySelector("[name='reply-button']")
            .addEventListener("click", () => chatlogController.replyFunction(chatbox));
        chatbox.querySelector("[name='edit-button']")
            .addEventListener("click", () => chatlogController.editFunction(chatbox));
        chatbox.querySelector("[name='delete-button']")
            .addEventListener("click", () => chatlogController.deleteFunction(chatbox));
        chatbox.querySelector("[name='forward-button']")
            .addEventListener("click", () => chatlogController.forwardFunction(chatbox));


        // Make dropdown only visible when hovering over the chatbox
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

        // Link message to HTMLElement
        message.setHTMLElement(chatbox);
        return chatbox;
    }

    /**
     * View function to render messages sent from the other party
     * @param {Object} message SentMessage object from MessageModel with the appropriate fields
     * @param {String} imagePath string corresponding to the imagePath of the conversation's image
     * @returns HTMLElement corresponding to the rendered message
     */
    function renderReceivedMessage(message, imagePath="") {
        checkAndRenderNewDay(message.time);

        // Create object to be used to fill in template
        var contextObj = {
            text : encodeText(message.rawHTML, message.encoding),
            time : DateTimeFormatting.formatTime(message.time),
            imgsrc: imagePath,
            encoding: message.encoding,
        }

        // Fetch and fill in template

        // Initialise chatbox, add dropdown menu
        var chatbox = document.createElement("other-chat");
        chatbox.setAttribute("conversation-id", message.id);

        chatbox.innerHTML = receivedMessageTemplate(contextObj);
        chatlog.appendChild(chatbox);
        

        // Add event listeners for reply, forward etc.
        chatbox
            .querySelector("[name='reply-button']")
            .addEventListener("click", () => chatlogController.replyFunction(chatbox));
        chatbox
            .querySelector("[name='forward-button']")
            .addEventListener("click", () => chatlogController.forwardFunction(chatbox));


        // Make dropdown only visible when hovering over the chatbox
        chatbox.addEventListener(
            "mouseover", 
            () => chatbox.querySelector(".chat-dropdown").classList.add("revealed")
        );
        chatbox.addEventListener(
            "mouseout", 
            () => chatbox.querySelector(".chat-dropdown").classList.remove("revealed")
        );

        // Scroll to bottom
        chatlog.scrollTop = chatlog.scrollHeight;

        return chatbox;

    }

    /**
     * Render entire conversation
     * @param {ConversationModel} conversation ConversationModel containing the messages to be rendered
     * @returns list of HTMLElement messages rendered
     */
    function renderConversation(conversation) {
        const listOfChatboxes = [];
        latestTime = undefined;

        // Render all messages in the conversation, checking message type to render
        // the correct chatboxes
        for (const messageModel of conversation) {
            if (messageModel.type === "my-chat") {
                listOfChatboxes.push(renderSentMessage(messageModel));

            } else if (messageModel.type === "other-chat") {
                listOfChatboxes.push(renderReceivedMessage(messageModel, imagePath));
            }
        }

        return listOfChatboxes;
    }

    /**
     * Function to check for and render pill signifying a new day
     * @param {string} time String corresponding to a messages's sent time
     */
    async function checkAndRenderNewDay(time) {
        // If there is a new day, render the rounded pill to signify it
        const messageTime = new Date(time);

        // Check if latestTime has been defined. If not, render that it is a new day.
        // Otherwise, render that it is a new day if there is a difference in date, month or year
        if (latestTime == undefined ||
            latestTime.getDate() != messageTime.getDate() ||
            latestTime.getMonth() != messageTime.getMonth() ||
            latestTime.getFullYear() != messageTime.getFullYear()
        ) {
            // CCreate a container and format the string
            const container = document.createElement("div");
            const timeString = messageTime.getDate() + " " + monthNames[messageTime.getMonth()]

            // Fetch and fill template then use it as HTML
            fetch("../../templates/new-day.html")
                .then(res => res.text())
                .then(text => Handlebars.compile(text))
                .then(template => template({day: timeString}))
                .then(element => container.innerHTML = element)

            chatlog.append(container);
        }

        latestTime = messageTime;
    }

    /**
     * Format the string to be used as text for the reply banner
     * @param {string} string string to be formatted
     * @param {HTMLElement} chatbox chatbox containing the reply banner
     * @param {Promise} promise promise to wait for before textbox is available
     * @returns 
     */
    function formatForReply(string, chatbox, ) {

        var text = chatbox.shadowRoot.querySelector("span[name='replyText']");
        const textbox = chatbox.shadowRoot.querySelector(".text-box");

        let sliced = string.slice(0, Math.round(textbox.clientWidth / 7) - 4)
        text.innerText = sliced + "..";
        console.log(text.clientWidth);

    }

    /**
     * Function to clear the chatlog
     */
    function clear() {
        document.getElementById("chatlog").replaceChildren();
    }

    return self
}

export { ChatlogView }