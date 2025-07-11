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

    /**
     * Send button logic
     */

    // Logic for send button
    const sendButton = document.getElementById('send-button');
    sendButton.addEventListener("click", send);

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

    function replyMode(object, sendReply) {
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
        replyButton.removeEventListener("click", send);
        const replyAndCleanup = () => {
            sendReply(this.quill);
            cleanup();
        }
        replyButton.addEventListener("click", replyAndCleanup);
        object.addEventListener("cancel", cleanup);

        // Turn reply button back to send button, clear editor, make cancel button hidden again
        function cleanup() {
            cancelButton.setAttribute("hidden", "");
            quill.setText("");
            replyButton.removeEventListener("click", replyAndCleanup);
            object.removeEventListener("cancel", cleanup);
            replyButton.addEventListener("click", send);
            replyButton.innerText="Send";

            // Remove from cancellableProcesses record as it is no longer in the midst of execution
            const index = cancellableProcesses.indexOf(object);
            if (index != -1) {
            cancellableProcesses.splice(index, 1);
            }
            console.log("cleanup complete");
        }
    }

    function editMode(object, confirmEdit) {
        // Get previous encoding
        const textbox = object.shadowRoot.querySelector(".text-box")
        const chatText = object.querySelector("div[name='text']");
        const prevEncoding = chatText.getAttribute("data-encoding");

        // Highlight text currently being edited, record previous background color
        var prevBackground = textbox.style.backgroundColor;
        object.shadowRoot.querySelector(".text-box").style.backgroundColor = "#EBC5CD";

        // Display the editor if it is not showing
        if (!isEditorShowing) {
            displayEditor();
        }

        // Get the text of the chatbox from rawcontentMap to be edited, put it in the editor
        var textToEdit = object.querySelector("div[name='text']");
        quill.root.innerHTML = rawcontentMap.get(object);
        console.log("Quill: " + quill.root.innerHTML);
        console.log("Actual: " + textToEdit.innerHTML);

        // Scroll to editor
        window.scrollTo(0, document.body.scrollHeight);
        quill.focus();
        
        // Make the cancel button visible
        var cancelButton = document.getElementById("cancel-button");
        cancelButton.removeAttribute("hidden");

        // Skip to cleanup if no edit is done
        cancelButton.addEventListener("click", cleanup);

        // Change the send button to edit 
        var editButton = document.getElementById("send-button");
        editButton.innerText = "Edit";
        editButton.removeEventListener("click", send);
        editButton.addEventListener("click", confirmEdit);
        object.addEventListener("cancel", cleanup);

        // Set appropriate encoding type 
        const currEncoding = document.getElementById("encoding-dropup");
        document.getElementById("encoding-dropup-label").innerText = prevEncoding;
        currEncoding.setAttribute("value", prevEncoding);

        // Turn edit button back to send button, clear editor, make cancel button hidden again
        function cleanup() {
            cancelButton.setAttribute("hidden", "");
            quill.setText("");
            editButton.removeEventListener("click", confirmEdit);
            object.removeEventListener("cancel", cleanup);
            editButton.addEventListener("click", send);
            editButton.innerText="Send";

            // Revert chat's background color
            object.shadowRoot.querySelector(".text-box").style.backgroundColor = prevBackground;

            // Remove from cancellableProcesses record as it is no longer in the midst of execution
            const index = cancellableProcesses.indexOf(object);
            if (index != -1) {
            cancellableProcesses.splice(index, 1);
            }
            console.log("cleanup complete");
        }
    }

    return { quill };
}

export { createEditor };