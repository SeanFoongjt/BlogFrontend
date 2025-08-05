//import * as fs from 'C:/Users/SBFJTSEA/AppData/Local/Microsoft/TypeScript/5.8/node_modules/@types/node/fs';
import { ConversationModel } from './ConversationModel.js';

function ModelManager() {
    const filePromise = fetch("../../json/storage.json");
    const listOfConversations = [];
    let viewManager;
    let views = {};

    const self = {
        initialiseFromJson,
        getSidebarList,
        getMainConversation,
        setView,
        forwardMessagesByTitle,
        updateForwardingPopup,
        searchConversationsByTitle
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
        const temp = newView.getViews();
        views = {
            sidebar: temp[0],
            mainWindow : temp[1],
            modal : temp[2]
        }
    }

    function getSidebarList() {
        const returnList = [];
        for (const conversation of listOfConversations) {
            returnList.push(conversation.sidebarInformation());
        }
        return returnList;
    }

    function getMainConversation() {
        console.log(listOfConversations[0]);
        return listOfConversations[0];
    }

    function forwardMessagesByTitle(message, conversationList) {
        const filteredList = listOfConversations.filter(
            conversation => conversationList.includes(conversation.title)
        )

        for (var conversation of filteredList) {
            console.log(conversation);
            conversation.addMessage(message);
        }

        return conversation;
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

    function updateForwardingPopup() {
        viewManager.getModal().renderForwardingPopup(self.getSidebarList());
    }

    return self
}

export { ModelManager };