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

    /**
     * Set sidebar view of the controller, used during initialisation
     * @param {SidebarView} view 
     */
    function setView(view) {
        sidebarView = view;
        view.setController(self);
    }

    /**
     * Initialise the sidebar, generally just involves rendering via view
     * @param {Array} conversationList list of conversations to render
     */
    function initialise(conversationList) {
        sidebarView.initialise(conversationList);
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


    /**
     * Search the sidebar for a conversation
     * @param {Event} event input event to detect
     */
    function search(event) {
        // As long as the searchbar is not empty, display the search reset button
        if (event.data != null) {
            conversationSearchResetButton.removeAttribute("hidden");
        } else if (conversationSearchText.value == "") {
            conversationSearchResetButton.setAttribute("hidden", "");
        }

        // Ask the model manager to search for conversation models that fit the 
        const conversationList = parent.model.searchConversationsByTitle(
            conversationSearchText.value
        );

        // Get the sidebar information for each conversation that fit the search and render them
        const sidebarList = conversationList.map(conversation => conversation.sidebarInformation());
        sidebarView.render(sidebarList);
    }

    /**
     * Function to reset searchbar
     * @param {Event} event event that triggers the function. Should generally be on clicking the
     * reset button
     */
    function searchCleanup(event) {
        // Set searchbar to empty and focus on it
        conversationSearchText.value = "";
        conversationSearchText.focus();

        // hide the reset button
        conversationSearchResetButton.setAttribute("hidden", "true");

        // Render all conversations
        sidebarView.render(parent.model.getSidebarList());
    }



    /**
     * Close the conversation, i.e. remove the tab from the sidebar
     * @param {ConversationModel} conversation conversation to be closed
     */
    function closeConversation(conversation) {
        sidebarView.closeConversation(conversation);
    }

    
    /**
     * Change the currently active conversation
     * @param {ConverastionModel} conversation Conversation to be made the new active conversation
     */
    function changeActive(conversation) {
        sidebarView.changeActive(conversation);
    }

    /**
     * Update a conversation with new information (title, latest message)
     * @param {ConverasationModel} conversation conversation to update
     */
    function updateConversation(conversation) {
        sidebarView.update(conversation);
    }

    return self;
}

export { SideBarController }