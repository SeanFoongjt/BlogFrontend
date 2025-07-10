function createTitleSection() {
    /**
     * Logic for changing the conversation title
     */
    var conversationTitle = document.getElementById("conversationTitle");
    var conversationTitleInput = document.getElementById("conversationTitleInput");
    conversationTitle.addEventListener("dblclick", renameTitle);

    /**
     * Rename the title of the conversation
     */
    function renameTitle() {
        // Make the correct input block visible, hide the existing title
        var inputContainer = document.getElementById("conversationTitleInputContainer");
        conversationTitleInput.value = conversationTitle.innerText;
        conversationTitleInput.innerText = conversationTitle.innerText;
        console.log("Input value: " + conversationTitleInput.value);
        console.log("Inner text: " + conversationTitleInput.innerText);
        conversationTitle.setAttribute("hidden", "");
        inputContainer.removeAttribute("hidden");
        conversationTitleInput.focus();

        // Add event listener for enter key press, enable cancel button
        conversationTitleInput.addEventListener("keypress", validate);
        var cancelButton = document.getElementById("conversationTitleInputCancel");
        cancelButton.addEventListener("click", cleanup);

        // Function to validate name
        function validate(event) {
            if (event.key == "Enter") {
            if (conversationTitleInput.value.trim() != "") {
                event.preventDefault();
                conversationTitle.innerText = conversationTitleInput.value.trim();
            }
            cleanup();
            console.log(conversationTitle.innerText);
            }
        }

        // Cleanup helper function makes input hidden and the new or old conversation title visible
        function cleanup() {
            inputContainer.setAttribute("hidden", "");
            conversationTitle.removeAttribute("hidden");
            conversationTitleInput.removeEventListener("keypress", validate);
            cancelButton.removeEventListener("click", cleanup);
        }
    }

    /**
     * Confirmation popup logic, consisting of constant and variable declarations and an
     * abstract function to create confirmation popups.
     */

    // Constant and variable declarations for confirmation popup
    const confirmationPopup = document.getElementById("confirmation-popup-modal");
    const confirmationPopupBodyText = confirmationPopup.querySelector(".modal-body-text");
    const confirmationPopupTitle = confirmationPopup.querySelector(".modal-title");
    const confirmationPopupFooter = confirmationPopup.querySelector(".modal-footer");
    var confirmButton = confirmationPopupFooter.querySelector("button[name='continue']");

    /**
     * Function to throw up a confirmation popup on the screen before proceeding with the action
     * @param {String} header header of the popup
     * @param {String} body body of the popup
     * @param {Function} functionToExecute action if the user seeks to continue
     */
    function confirmationPopupFunction(header, body, functionToExecute) {
        // cloneNode and reassign to remove all event listeners
        const newButton = confirmButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(newButton, confirmButton);
        confirmButton = newButton;

        // Link function to button, set body and title text
        confirmButton.addEventListener("click", functionToExecute);
        confirmButton.addEventListener("click", notifyCancellableProcesses);
        confirmationPopupBodyText.innerText = body;
        confirmationPopupTitle.innerText = header;
    }

    /**
     * Add appropriate listener to clear conversation button.
     */
    const clearConversationButton = document.getElementById("clear-conversation");
    clearConversationButton.addEventListener(
        "click", 
        () => confirmationPopupFunction(
            "Clear conversation?", 
            "Are you sure you want to clear the conversation?", 
            () => document.getElementById('chatlog').replaceChildren()
        )
    );

    /**
     * Logic to block and unblock a conversation as well as adding of the function
     * to the block conversation button.
     */

    /**
     * Function to block conversation / user
     */
    function blockFunction() {
        // Make chatlog and editor hidden, display "blocked user" screen
        const chatlogEditorContainer = document.getElementById("chatlog-editor-container");
        chatlogEditorContainer.setAttribute("hidden", "");
        const blockedChat = document.getElementById("blocked-chat-container");
        blockedChat.removeAttribute("hidden");

        // Provide option to unblock conversation when appropriate button is clicked
        const unblockButton = document.getElementById("unblock-button");
        unblockButton.addEventListener("click", unblockFunction)
    }

    /**
     * function to unblock conversation
     */
    function unblockFunction() {
        // Make chatlog and editor visible, hide "blocked user" screen
        const blockedChat = document.getElementById("blocked-chat-container");
        blockedChat.setAttribute("hidden", "");
        const chatlogEditorContainer = document.getElementById("chatlog-editor-container");
        chatlogEditorContainer.removeAttribute("hidden");
    }

    // Add appropriate listener to the blockButton
    const blockButton = document.getElementById("block-conversation");
    blockButton.addEventListener(
        "click", 
        () => confirmationPopupFunction(
            "Block user?",
            "Are you sure you want to block this user?",
            blockFunction
        )
    );

    return { conversationTitle };
}

export { createTitleSection }