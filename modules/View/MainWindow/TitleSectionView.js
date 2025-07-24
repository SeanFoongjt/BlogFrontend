function TitleSectionView(imagePath="", title="") {
    var conversationTitle = document.getElementById("conversation-title");
    var titlePicture = document.getElementById("title-avatar");
    var conversationTitleInput = document.getElementById("conversationTitleInput");
    //conversationTitle.addEventListener("dblclick", renameTitle);

    function render() {
        conversationTitle.value = title;
        titlePicture.setAttribute("src", imagePath);
    }  

    function changeConversation(newImagePath, newTitle) {
        imagePath = newImagePath;
        title = newTitle;
        render();
    }

    return {
        render,
        changeConversation
    }
}

export { TitleSectionView }