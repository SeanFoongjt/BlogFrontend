function TitleSectionView(imagePath="", title="") {
    var conversationTitle = document.getElementById("conversation-title");
    var titlePicture = document.getElementById("title-avatar");
    var conversationTitleInput = document.getElementById("conversationTitleInput");
    //conversationTitle.addEventListener("dblclick", renameTitle);

    const self = {
        render,
        changeConversation
    }

    function render() {
        conversationTitle.value = title;
        titlePicture.setAttribute("src", imagePath);
    }  

    function changeConversation(newImagePath, newTitle) {
        imagePath = newImagePath;
        title = newTitle;
        render();
    }

    return self
}

export { TitleSectionView }