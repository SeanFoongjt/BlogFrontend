import { ModelManager } from "../Model/ModelManager.js";
import { ViewManager } from "../View/ViewManager.js";
import { MainWindowController } from "./MainWindow/MainWindowController.js"
import { ModalController } from "./Modal/ModalController.js";
import { SideBarController } from "./Sidebar/SideBarController.js";


function MasterController() {
    const model = ModelManager();
    const view = ViewManager();
    const self = {
        notifyCancellableProcesses,
        pushCancellableProcess,
        removeFromCancellableProcesses,
        cancellableProcessesLength,
        initialise,
        updateSidebarConversation,
        changeCurrentConversation,
        closeActiveConversation,
        showForwardingPopup,
        changeSidebarConversation,
        clearActiveConversation,
        model,
        activeConversation : undefined
    }
    const mainWindowController = MainWindowController(self);
    const sidebarController = SideBarController(self);
    const modalController = ModalController(self);

    // Bind views to controllers
    sidebarController.setView(view.getViews()[0]);
    mainWindowController.setView(view.getViews()[1]);
    modalController.setView(view.getViews()[2]);
    let editorView = undefined;
    view.setController(self);
    model.setView(view);


    const modelInitialise = model.initialiseFromJson("./json/storage.json");

    const cancelEvent = new Event("cancel");

    

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
        //view.initialise(conversationList, mainConversation);
    }

    
    
    const cancellableProcesses = [];



    function notifyCancellableProcesses() {
        console.log("Cancel event broadcast!");
        cancellableProcesses.forEach((process) => process.dispatchEvent(cancelEvent));
    }


    function pushCancellableProcess(process) {
        cancellableProcesses.push(process);
    }


    function removeFromCancellableProcesses(object) {
        // Remove from cancellableProcesses record as it is no longer in the midst of execution
        const index = cancellableProcesses.indexOf(object);
        if (index != -1) {
            cancellableProcesses.splice(index, 1);
        }
    }

    function cancellableProcessesLength() {
        return cancellableProcesses.length;
    }


    function updateSidebarConversation(conversation) {
        sidebarController.updateConversation(conversation);
    }

    function changeCurrentConversation(conversation) {
        self.activeConversation = conversation;
        mainWindowController.changeConversation(conversation);
    }

    function changeSidebarConversation(conversation) {
        sidebarController.changeActive(conversation);
    }

    function clearActiveConversation() {
        self.activeConversation.clearMessages();
        sidebarController.updateConversation(self.activeConversation);
    }

    function closeActiveConversation() {
        model.closeConversation(self.activeConversation);
        self.activeConversation = model.getFirstConversation();
        sidebarController.closeConversation()
        changeCurrentConversation(self.activeConversation);
        changeSidebarConversation(self.activeConversation);
    }

    function showForwardingPopup() {
        return;
    }


    return self;
}

export { MasterController }