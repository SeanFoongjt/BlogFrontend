import { chatInstance } from "./Chat.js";

function createMyChat(editorHTML, time, encoding = "Plaintext", replyingTo = false) {
    const replyArray = [];

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

    chatlog.appendChild(chatbox);

    // Center dropdown button relative to text box 
    Promise.all([fillChatbox])
        .then(item => {
            const textbox = chatbox.shadowRoot.querySelector(".text-box");
            const buttonHeight = chatbox.querySelector(".btn").offsetHeight;
            const padding = (textbox.offsetHeight - buttonHeight) / 2;
            chatbox.querySelector(".dropdown").style.paddingTop = (padding).toString() + "px";
            chatbox.querySelector("a[name='delete-button']").onclick = () => deleteChat(chatbox);
            chatbox.querySelector("a[name='reply-button']").onclick = () => reply(chatbox);
            chatbox.querySelector("a[name='edit-button']").onclick = () => edit(chatbox);
        });

    /**
     * Reply to this chat
     */
    function reply() {
        // Only one cancellableProcess should be active at a time
        conversation.notifyCancellableProcesses();

        // Push self to cancellable processes
        cancellableProcesses.push(object);

        // Show editor if it is not currently displayed
        if (!conversation.isEditorShowing) {
            conversation.displayEditor();
        }

        function sendReply(editor) {
            // Terminate function early if no actual text is sent
            if (editor.getText().trim() == "" && editor.getContents()["ops"].length == 1) {
                console.log("terminated early");
                cleanup();
                return;
            }

            // No event to be sent, but there is object to be replied to
            const newChat = editor.send(null, this);

            // Have message replied to keep track of how many other messages reference it
            // to change text if an edit is done.
            replyArray.push(newChat);
        }

        editor.replyMode(sendReply);
    }

    /**
     * Edit self in the chatlog
     */
    function edit() {
        // Cancel other potentially interfering processes
        conversation.notifyCancellableProcesses();

        // Push self to cancellableProcesses
        cancellableProcesses.push(object);
        console.log(cancellableProcesses);

        // Change text in chatbox to edited text, display '(edited)' after time
        function confirmEdit() {
            // Terminate function early if no actual text is in the editor
            if (quill.getText().trim() == "" && quill.getContents()["ops"].length == 1) {
                console.log("terminated early due to no text");
                cleanup();
                return;
            }
            
            // TODO check if text and encoding are the same
            chatlog.rawcontentMap.set(object, quill.root.innerHTML);
            
            // encode contents of quill editor and put it into the edited chat
            textToEdit.innerHTML = encodeText(
                quill.root.innerHTML, 
                currEncoding.getAttribute("value")
            );

            // Add the '(edited)' subtext next to time of sending the chat
            var subtext = object.querySelector("span[name='time']");
            if (subtext.innerText.slice(-8) != "(edited)") {
                subtext.innerText += " (edited)"
            }

            // Check if the object is referenced in the reply banner of other chats. If yes,
            // change text in these reply banners as appropriate
            replyMap
                .forEach((chat) => {
                    console.log(chat);
                    const rawText = quill.getText().trim();
                    chat.shadowRoot.querySelector("span[name='replyText']").innerText = formatForReply(rawText);
                });

            chatText.setAttribute("data-encoding", currEncoding.getAttribute("value"));
            cleanup();
        }

        editor.editMode(this, confirmEdit);
    }


    return {
        chatbox,
        __proto__: chatInstance
    }
}