function SideBarController(parent) {
    let sidebarView;

    const self = {
        setView,
        initialise,
        updateConversation,
        changeConversation : parent.changeCurrentConversation,
        changeActive,
        closeConversation
    }

    function setView(view) {
        sidebarView = view;
        view.setController(self);
    }



    /**
     * Conversation searchbar logic
     */
    // Have the cancel button reset the searchbar
    const conversationSearchResetButton = document.getElementById("conversation-search-reset");
    const conversationSearchText = document.getElementById("conversation-search-text");
    conversationSearchResetButton.addEventListener("click", searchCleanup);

    // Ensure cancel button is revealed when there is text in the conversation searchbar
    conversationSearchText.addEventListener("input", search);


    function search(event) {
        if (event.data != null) {
            conversationSearchResetButton.removeAttribute("hidden");
        } else if (conversationSearchText.value == "") {
            conversationSearchResetButton.setAttribute("hidden", "");
        }

        const conversationList = parent.model.searchConversationsByTitle(
            conversationSearchText.value
        );
        const sidebarList = conversationList.map(conversation => conversation.sidebarInformation());
        sidebarView.render(sidebarList);
    }

    function searchCleanup(event) {
        conversationSearchText.value = "";
        conversationSearchText.focus();
        conversationSearchResetButton.setAttribute("hidden", "true");
        sidebarView.render(parent.model.getSidebarList());
    }




    function closeConversation(conversation) {
        sidebarView.closeConversation(conversation);
    }

    function initialise(conversationList) {
        sidebarView.render(conversationList);
    }

    function changeConversation(conversation) {
        sidebarView.changeActive(conversation);
        parent.changeCurrentConversation(conversation);
    }

    function changeActive(conversation) {
        sidebarView.changeActive(conversation);
    }

    function updateConversation(conversation) {
        sidebarView.update(conversation);
    }

    return self;
}

export { SideBarController }