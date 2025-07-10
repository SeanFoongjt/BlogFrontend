function createEditor() {
    // Initialise editor with custom toolbar
    var Block = Quill.import('blots/block');
    Block.tagName = 'p';
    Quill.register(Block, true);

    const editor = document.getElementById('editor');
    const quill = new Quill("#editor", {
        theme: "snow",
        modules : {
            toolbar:
            [
            [{ 'size': ['small', false, 'large', 'huge']}],
            ['bold', 'italic', 'underline'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'script':'sub'}, {'script': 'super'}],
            ['link', 'image', 'video', 'formula'],
            ['clean']
            ]
        }
    });

    return { quill };

    /**
     * Send button logic
     */

    // Logic for send button
    const sendButton = document.getElementById('send-button');
    sendButton.addEventListener("click", sendFunction);

    /**
     * Send a chat in the conversation
     * @param {Event} event FIGURE OUT WHAT HAPPENED HERE
     * @param {boolean} isReply boolean determining whether the chat is a reply to another chat
     * @returns 
     */
    function send(event, isReply=false) {
        // Retrieve encoding type
        var encodingType = document.getElementById("encoding-dropup").getAttribute("value");

        // Get text from the editor
        var rawtext = quill.getText()
        var contents = quill.getContents();
        console.log(quill.root.innerHTML);
        console.log(quill.getSemanticHTML());
        console.log(quill.getContents());
        var rawHTML = quill.root.innerHTML;
        //console.log(marked.parse(rawHTML));
        quill.setText("");
        rawtext = rawtext.trim();
        //console.log(rawtext);

        // Terminate function early if no actual text is sent
        if (rawtext == "" && contents["ops"].length == 1) {
            console.log("terminated early");
            return;
        }

        // use createConversation to create html component
        const newChat = createConversation(
            "my-chat", 
            rawHTML.trim(), 
            Date.now(), 
            encodingType, 
            replyMap,
            isReply
        );

        // Store original html in rawcontentMap
        rawcontentMap.set(newChat, rawHTML);

        // Automatically scroll to bottom
        chatlog.scrollTop = chatlog.scrollHeight;

        return newChat;
    }

    function replyMode(sendReply) {
        // Scroll to editor (maybe abstract out)?
        window.scrollTo(0, document.body.scrollHeight);
        editor.focus();
        
        // Make the cancel button visible
        var cancelButton = document.getElementById("cancel-button");
        cancelButton.removeAttribute("hidden");

        // Skip to cleanup if no reply is done
        cancelButton.addEventListener("click", cleanup);

        // Change the send button to reply 
        var replyButton = document.getElementById("send-button");
        replyButton.innerText = "Reply";
        replyButton.removeEventListener("click", sendFunction);
        const replyAndCleanup = () => {
            sendReply(this.quill);
            cleanup();
        }
        replyButton.addEventListener("click", replyAndCleanup);
        object.addEventListener("cancel", cleanup);
        cancellableProcesses.push(object);

        // Turn reply button back to send button, clear editor, make cancel button hidden again
        function cleanup() {
            cancelButton.setAttribute("hidden", "");
            quill.setText("");
            replyButton.removeEventListener("click", replyAndCleanup);
            object.removeEventListener("cancel", cleanup);
            replyButton.addEventListener("click", sendFunction);
            replyButton.innerText="Send";

            // Remove from cancellableProcesses record as it is no longer in the midst of execution
            const index = cancellableProcesses.indexOf(object);
            if (index != -1) {
            cancellableProcesses.splice(index, 1);
            }
            console.log("cleanup complete");
        }
    }

    function editMode() {

    }

    function deleteMode() {

    }
}

export { createEditor };