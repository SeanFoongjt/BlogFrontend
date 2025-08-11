import { ModelManager } from "../Model/ModelManager.js";
import { ViewManager } from "../View/ViewManager.js";
import { MainWindowController } from "./MainWindow/MainWindowController.js"
import { ModalController } from "./Modal/ModalController.js";
import { SideBarController } from "./Sidebar/SideBarController.js";


function MasterController() {
    const model = ModelManager();
    const view = ViewManager();
    const self = {
        initialise,
        changeCurrentConversation,
        closeActiveConversation,
        clearActiveConversation,
        model,
        activeConversation : undefined
    }
    const mainWindowController = MainWindowController(self);
    const sidebarController = SideBarController(self);
    const modalController = ModalController(self);

    // Bind views to controllers
    sidebarController.setView(view.getViews().sidebar);
    mainWindowController.setView(view.getViews().mainWindow);
    modalController.setView(view.getViews().modal);
    view.setController(self);
    model.setView(view);


    // Initialise data from json
    const modelInitialise = model.initialiseFromJson("./json/storage.json");

    modelInitialise
        .then(() => self.initialise(
            model.getSidebarList(), 
            model.getFirstConversation(),
        ));


    /**
     * Initialise all other controllers and set active conversation
     * @param {*} conversationList list of all current conversations
     * @param {*} mainConversation conversation to initialise as first active conversation
     */
    function initialise(conversationList, mainConversation) {
        mainWindowController.initialise(mainConversation);
        sidebarController.initialise(conversationList);
        modalController.initialise(conversationList);
        self.activeConversation = mainConversation;
    }

    /**
     * Change the current active conversation
     * @param {ConversationModel} conversation the new active conversation
     */
    function changeCurrentConversation(conversation) {
        self.activeConversation = conversation;
        sidebarController.changeActive(conversation)
        mainWindowController.changeConversation(conversation);
    }

    /**
     * Empty the currently active conversation of all messages. This does not remove the 
     * conversation from the sidebar and messages can still be sent / forwarded
     */
    function clearActiveConversation() {
        self.activeConversation.clearMessages();
        mainWindowController.clearConversation();
        sidebarController.updateConversation(self.activeConversation);
    }

    /**
     * Close the currently active conversation. This deletes all messages and removes it's tab
     * from the sidebar
     */
    function closeActiveConversation() {
        model.closeConversation(self.activeConversation);
        self.activeConversation = model.getFirstConversation();
        sidebarController.closeConversation()
        changeCurrentConversation(self.activeConversation);
    }

    return self;
}

export { MasterController }