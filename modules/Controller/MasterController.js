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
        updateSidebarConversation,
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


    const modelInitialise = model.initialiseFromJson("./json/storage.json");

    modelInitialise
        .then(() => self.initialise(
            model.getSidebarList(), 
            model.getFirstConversation(),
        ));


    function initialise(conversationList, mainConversation) {
        mainWindowController.initialise(mainConversation);
        sidebarController.initialise(conversationList);
        modalController.initialise(conversationList);
        self.activeConversation = mainConversation;
    }

    function updateSidebarConversation(conversation) {
        sidebarController.updateConversation(conversation);
    }

    function changeCurrentConversation(conversation) {
        self.activeConversation = conversation;
        sidebarController.changeActive(conversation)
        mainWindowController.changeConversation(conversation);
    }

    function clearActiveConversation() {
        self.activeConversation.clearMessages();
        mainWindowController.clearConversation();
        sidebarController.updateConversation(self.activeConversation);
    }

    function closeActiveConversation() {
        model.closeConversation(self.activeConversation);
        self.activeConversation = model.getFirstConversation();
        sidebarController.closeConversation()
        changeCurrentConversation(self.activeConversation);
    }

    return self;
}

export { MasterController }