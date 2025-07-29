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
        passFunctions,
        setController
    }

    function setController(controller) {
        titleSectionController = controller;
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

    return self
}

export { TitleSectionView }