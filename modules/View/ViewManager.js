import { MainWindowView } from "./MainWindow/MainWindowView.js";
import { ModalView } from "./Modal/ModalView.js";
import { SidebarView } from "./Sidebar/SidebarView.js";

function ViewManager() {
    const sidebar = SidebarView();
    const mainWindow = MainWindowView();
    const modal = ModalView();
    var controller;

    const self = {
        setController,
        getViews,
        getModal,
        renderConversation
    }

    function setController(newController) {
        controller = newController;
    }


    function getMainWindow() {
        return mainWindow;
    }

    function getModal() {
        return modal;
    }


    /**
     * Return the views being managed for linkage to controllers
     * @returns Sidebar, Main window and Modal views
     */
    function getViews() {
        return {
            sidebar, 
            mainWindow,
            modal
        };
    }

    /**
     * Function to render conversation. Primary use is to allow the MasterController to be able
     * to render the conversation
     * @param {ConversationModel} conversation conversation to be rendered
     */
    function renderConversation(conversation) {
        mainWindow.render(conversation);
    }

    
    return self
}

export { ViewManager }