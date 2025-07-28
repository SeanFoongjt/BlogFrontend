import { model } from "../../../main.js";

function TitleSectionView(imagePath="", title="") {
    var conversationTitle = document.getElementById("conversation-title");
    var titlePicture = document.getElementById("title-avatar");
    var conversationTitleInput = document.getElementById("conversationTitleInput");
    var functions;
    //conversationTitle.addEventListener("dblclick", renameTitle);

    const self = {
        render,
        changeConversation,
        passFunctions
    }

    function render() {
        conversationTitle.innerText = title.trim()
        titlePicture.setAttribute("src", imagePath);
    }  

    function changeConversation(newImagePath, newTitle) {
        imagePath = newImagePath;
        title = newTitle;
        render();
    }


    function passFunctions(functionObject) {
        functions = functionObject;
    }



    // Make conversation options button width same as height
    const dropdownMenuButton = document.getElementById("dropdown-menu-button");
    dropdownMenuButton.style.width = `${dropdownMenuButton.offsetHeight}px`;

    addEventListener("resize", () => {
        dropdownMenuButton.style.width = `${dropdownMenuButton.offsetHeight}px`;
    });





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
        confirmButton.addEventListener("click", model.notifyCancellableProcesses);
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

    /**
     * Function to block conversation / user
     */
    function blockFunction() {
        functions.block();

        // Provide option to unblock conversation when appropriate button is clicked
        const unblockButton = document.getElementById("unblock-button");
        unblockButton.addEventListener("click", unblockFunction)
    }

    /**
     * function to unblock conversation
     */
    function unblockFunction() {
        functions.unblock()
    }

    return self
}

export { TitleSectionView }