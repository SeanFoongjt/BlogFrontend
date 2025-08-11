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

    async function initialiseFromJson(path) {
        const storedJson = filePromise
            .then(res => res.json())
            .then(json => processJson(json));

        function processJson(json) {

            // For each conversation found in the json, create a conversation model and push
            // to list of conversations
            for (const conversationJson of json["conversations"]) {
                const conversationModel = ConversationModel(self)
                conversationModel.initialiseFromJson(conversationJson);
                console.log(conversationModel);
                listOfConversations.push(conversationModel);
            }
        }  
        
        return Promise.all([storedJson]);
    }

    function setView(newView) {
        viewManager = newView;
        views = newView.getViews();
    }

    function getSidebarList() {
        const returnList = [];
        for (const conversation of listOfConversations) {
            returnList.push(conversation.sidebarInformation());
        }
        return returnList;
    }

    function getFirstConversation() {
        console.log(listOfConversations[0]);
        return listOfConversations[0];
    }

    function updateSidebarConversation(conversation) {
        views.sidebar.update(conversation);
    }

    function forwardMessagesByTitle(message, conversationList) {
        const resultList = [];
        
        const filteredList = listOfConversations.filter(
            conversation => conversationList.includes(conversation.title)
        )

        for (var conversation of filteredList) {
            console.log(conversation);
            conversation.addMessage(message);
            resultList.push(conversation);
            updateSidebarConversation(conversation);
        }

        return resultList;
    }

    function searchConversationsByTitle(title) {
        const resultList = [];
        console.log(title);

        for (const conversation of listOfConversations) {
            if (conversation.title.toLowerCase().startsWith(title.toLowerCase())) {
                resultList.push(conversation);
            }
        }

        return resultList;
    }

    function closeConversation(conversation) {
        const index = listOfConversations.indexOf(conversation);
        console.log(index);
        listOfConversations.splice(index, 1)
        console.log(listOfConversations);
        updateForwardingPopup();
    }

    function updateForwardingPopup() {
        viewManager.getModal().renderForwardingPopup(self.getSidebarList());
    }

    return self
}

export { ModelManager };