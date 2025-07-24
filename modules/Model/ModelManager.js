//import * as fs from 'C:/Users/SBFJTSEA/AppData/Local/Microsoft/TypeScript/5.8/node_modules/@types/node/fs';
import { ConversationModel } from './ConversationModel.js';

function ModelManager() {
    const filePromise = fetch("../../json/storage.json");
    const listOfConversations = [];

    const self = {
        initialiseFromJson,
        getSidebarList,
        getMainConversation
    }

    async function initialiseFromJson(path) {
        const storedJson = filePromise
            .then(res => res.json())
            .then(json => processJson(json));

        function processJson(json) {

            // For each conversation found in the json, create a conversation model and push
            // to list of conversations
            for (const conversationJson of json["conversations"]) {
                const conversationModel = ConversationModel()
                conversationModel.initialiseFromJson(conversationJson);
                console.log(conversationModel);
                listOfConversations.push(conversationModel);
            }
        }  
        
        return Promise.all([storedJson]);
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

    return self

        // I dont think this is possible (usage of fs in the web environment)
    /** 
    function saveToJson(path) {
        const objectToWrite = {
            "conversations" : [],
        }
        filePromise.then(handle => {
            for (const conversation of listOfConversations) {
                objectToWrite["conversations"].push(conversation);
            }
            handle.writeFile(objectToWrite.stringify());
        })
    }
    */

}

export { ModelManager };