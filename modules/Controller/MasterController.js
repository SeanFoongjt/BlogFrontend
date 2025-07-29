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
        getEditor,
        initialise,
        getEditorView
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


    const modelInitialise = model.initialiseFromJson("./json/storage.json");

    

    modelInitialise
        .then(() => self.initialise(model.getSidebarList(), model.getMainConversation()));

    
    
    const cancellableProcesses = [];



    function notifyCancellableProcesses() {
        console.log("Cancel event broadcast!");
        cancellableProcesses.forEach((process) => process.dispatchEvent(cancelEvent));
    }

    function initialise(conversationList, mainConversation) {
        mainWindowController.initialise(mainConversation);
        sidebarController.initialise(conversationList);
        //view.initialise(conversationList, mainConversation);
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


    function getEditor() {
        if (editorView === undefined) {
            editorView = view.getEditor();
        }
        
        return editorView.getEditor();
    }

    function getEditorView() {
        if (editorView === undefined) {
            editorView = view.getEditor();
        }

        return editorView;
    }

    return self;
}

export { MasterController }