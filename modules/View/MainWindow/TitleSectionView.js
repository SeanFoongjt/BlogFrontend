import { confirmationPopupFunction } from "../../utilities/confirmationPopupFunction.js";

function TitleSectionView(imagePath="", title="") {
    var conversationTitle = document.getElementById("conversation-title");
    var titlePicture = document.getElementById("title-avatar");
    var conversationTitleInput = document.getElementById("conversationTitleInput");
    let titleSectionController;
    var functions;
    //conversationTitle.addEventListener("dblclick", renameTitle);

    const self = {
        render,
        changeConversation,
        setController
    }

    /**
     * Set title section controller. Generally used for initialisation
     * @param {TitleSectionController} controller 
     */
    function setController(controller) {
        titleSectionController = controller;
    }

    /**
     * Render the title section of the main window.
     */
    function render() {
        conversationTitle.innerText = title.trim()
        titlePicture.setAttribute("src", imagePath);
    }  

    /**
     * Change the title section to match a new conversation
     * @param {String} newImagePath image path to image of the new conversation
     * @param {String} newTitle title of the new conversation
     */
    function changeConversation(newImagePath, newTitle) {
        imagePath = newImagePath;
        title = newTitle;
        render();
    }



    // Make conversation options button width same as height
    const dropdownMenuButton = document.getElementById("dropdown-menu-button");
    dropdownMenuButton.style.width = `${dropdownMenuButton.offsetHeight}px`;

    addEventListener("resize", () => {
        dropdownMenuButton.style.width = `${dropdownMenuButton.offsetHeight}px`;
    });


    return self
}

export { TitleSectionView }