import { confirmationPopupFunction } from "../../utilities/confirmationPopupFunction.js";

function TitleSectionController(parent) {
    var inputPopup = document.getElementById("input-popup-modal");
    var inputPopupConfirm = inputPopup.querySelector("[name='confirm']")
    var inputPopupInput = inputPopup.querySelector("#modal-input")
    document.getElementById("rename-title").addEventListener("click", renameTitleFunction);
    let titleSectionView;

    const self = {
        setView
    }

    function setView(view) {
        titleSectionView = view;
        view.setController(self);
    }

    /**
     * Function to rename the title of the current conversation
     */
    function renameTitleFunction() {
        inputPopupConfirm.addEventListener("click", confirm);
        inputPopupInput.value = conversationTitle.innerText;
        inputPopupInput.innerText = conversationTitle.innerText;

        function confirm() {
            const newTitle = inputPopupInput.value.trim();
            if (newTitle != "") {
                conversationTitle.innerText = newTitle;
                parent.changeTitle(newTitle);
            }
        }
    }


    var conversationTitle = document.getElementById("conversation-title");
    var conversationTitleInput = document.getElementById("conversationTitleInput");
    conversationTitle.addEventListener("dblclick", renameTitleViaDblClick);


    /**
     * Rename the title of the conversation
     */
    function renameTitleViaDblClick() {
        // Make the correct input block visible, hide the existing title
        var cancel = document.getElementById("conversationTitleInputCancel");
        conversationTitleInput.value = conversationTitle.innerText;
        conversationTitleInput.innerText = conversationTitle.innerText;
        console.log("Input value: " + conversationTitleInput.value);
        console.log("Inner text: " + conversationTitleInput.innerText);
        conversationTitle.setAttribute("hidden", "");
        conversationTitleInput.removeAttribute("hidden");
        cancel.removeAttribute("hidden");
        conversationTitleInput.focus();


        // Add event listener for enter key press, enable cancel button
        conversationTitleInput.addEventListener("keydown", validate);
        var cancelButton = document.getElementById("conversationTitleInputCancel");
        cancelButton.addEventListener("click", cleanup);

        // Function to validate name
        function validate(event) {
            if (event.key == "Enter") {
                if (conversationTitleInput.value.trim() != "") {
                    event.preventDefault();
                    conversationTitle.innerText = conversationTitleInput.value.trim();
                    parent.changeTitle(conversationTitleInput.value.trim());
                }

                cleanup();
                console.log(conversationTitle.innerText);
            }
        }

        // Cleanup helper function makes input hidden and the new or old conversation title visible
        function cleanup() {
            cancel.setAttribute("hidden", "");
            conversationTitleInput.setAttribute("hidden", "");
            conversationTitle.removeAttribute("hidden");
            conversationTitleInput.removeEventListener("keypress", validate);
            cancelButton.removeEventListener("click", cleanup);
        }
    }


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
            parent.block
        )
    );



    /** 
     * Add appropriate listener to clear conversation button.
     */
    const clearConversationButton = document.getElementById("clear-conversation");
    clearConversationButton.addEventListener(
        "click", 
        () => confirmationPopupFunction(
            "Clear conversation?", 
            "Are you sure you want to clear the conversation?", 
            () => {
                document.getElementById('chatlog').replaceChildren();
                parent.notifyCancellableProcesses();
            }
        )
    );

    return self
}

export { TitleSectionController }