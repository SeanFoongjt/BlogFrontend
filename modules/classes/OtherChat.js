
function createOtherChat(editorHTML, time, encoding = "Plaintext", imagePath="") {
    const replyArray = [];

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

    Promise.all([fillChatbox]) 
        .then(item => {
            chatbox
                .shadowRoot
                .querySelector("button[name='replyButton']")
                .addEventListener("click", () => replyFunction(chatbox));

            // Check whether this can be outside of this function
            const textbox = chatbox.shadowRoot.querySelector(".text-box");
            const replyButton = chatbox.shadowRoot.querySelector(".btn");
            replyButton.style.marginTop = (textbox.offsetHeight - replyButton.offsetHeight) / 2 + "px";
        })
    
    return {
        chatbox,
    }
}

export { createOtherChat }