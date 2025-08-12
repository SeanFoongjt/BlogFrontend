import { ConversationModel } from './ConversationModel.js';

function ModelManager() {
    const filePromise = fetch("../../json/storage.json");
    const listOfConversations = [];
    let viewManager;
    let views;

    const self = {
        initialiseFromJson,
        getSidebarList,
        getFirstConversation,
        setView,
        forwardMessagesByTitle,
        updateForwardingPopup,
        searchConversationsByTitle,
        closeConversation,
        updateSidebarConversation
    }

    /**
     * Initialise conversation models (and by extension, message models) from a json
     * @param {String} path path of the json
     * @returns A promise that fulfills when all models are populated with data from the json
     */
    async function initialiseFromJson(path) {
        const storedJson = fetch(path)
            .then(res => res.json())
            .then(json => processJson(json));

        function processJson(json) {
            // For each conversation found in the json, create a conversation model and push
            // to list of conversations
            for (const conversationJson of json["conversations"]) {
                const conversationModel = ConversationModel(self)
                conversationModel.initialiseFromJson(conversationJson);
                listOfConversations.push(conversationModel);
            }
        }  
        
        return Promise.all([storedJson]);
    }

    /**
     * Set the view manager. Generally used for initialisation.
     * @param {ViewManager} newView 
     */
    function setView(newView) {
        viewManager = newView;
        views = newView.getViews();
    }

    /**
     * Get sidebar information for all live conversations
     * @returns An array containing sidebar information for all live conversations
     */
    function getSidebarList() {
        const returnList = [];
        for (const conversation of listOfConversations) {
            returnList.push(conversation.sidebarInformation());
        }
        return returnList;
    }

    /**
     * Get the first conversation. Used during initialisation or when closing a conversation
     * @returns 
     */
    function getFirstConversation() {
        console.log(listOfConversations[0]);
        return listOfConversations[0];
    }

    /**
     * Update the sidebar tab of a conversation
     * @param {ConversationModel} conversation conversation to be updated
     */
    function updateSidebarConversation(conversation) {
        views.sidebar.update(conversation);
    }

    /**
     * Forward messages to conversations. These conversations are identified by their titles.
     * @param {MessageModel} message messages to be forwarded to the target conversations
     * @param {Array} conversationList Array containing the titles of target conversations
     * @returns Array of conversation models the message was successfully forwarded to
     */
    function forwardMessagesByTitle(message, conversationList) {
        const resultList = [];
        
        // Filter all conversations to only those whose titles match those in the conversationList
        // argument.
        const filteredList = listOfConversations.filter(
            conversation => conversationList.includes(conversation.title)
        )

        // Then for each conversation model in the filtered list, add the message and update the
        // sidebar tab
        for (var conversation of filteredList) {
            console.log(conversation);
            conversation.addMessage(message);
            resultList.push(conversation);
            updateSidebarConversation(conversation);
        }

        return resultList;
    }

    /**
     * Search for conversation models by their title
     * @param {String} title title of the conversation to be found
     * @returns 
     */
    function searchConversationsByTitle(title) {
        const resultList = [];
        console.log(title);

        // Filter the list such that only conversations whose title could potentially match
        // th argument remains. Return the filtered list.
        return listOfConversations.filter(
            conversation => conversation.title.toLowerCase().startsWith(title.toLowerCase())
        )
    }

    /**
     * Close a conversation. Involves the removal of the conversation model from those tracked in
     * listOfConversations
     * @param {ConversationModel} conversation conversation to be removed
     */
    function closeConversation(conversation) {
        const index = listOfConversations.indexOf(conversation);
        listOfConversations.splice(index, 1)
        updateForwardingPopup();
    }

    /**
     * Update the forwarding popup. Does not render the popup.
     */
    function updateForwardingPopup() {
        viewManager.getModal().loadForwardingPopup(self.getSidebarList());
    }

    return self
}

export { ModelManager };