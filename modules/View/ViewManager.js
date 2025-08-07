import { MainWindowView } from "./MainWindow/MainWindowView.js";
import { ModalView } from "./Modal/ModalView.js";
import { SidebarView } from "./Sidebar/SidebarView.js";

function ViewManager() {
    const sidebar = SidebarView();
    const mainWindow = MainWindowView();
    const modal = ModalView();
    var controller;

    const self = {
        initialise,
        getMainWindow,
        setController,
        getEditor,
        getModal,
        getViews,
        renderConversation
    }

    function setController(newController) {
        controller = newController;
    }

    function initialise(conversationList, mainConversation) {
        sidebar.render(conversationList);
        mainWindow.render(mainConversation);
    }

    function getMainWindow() {
        return mainWindow;
    }

    function getModal() {
        return modal;
    }

    function getEditor() {
        return mainWindow.getEditor();
    }

    function getViews() {
        return {
            sidebar, 
            mainWindow,
            modal
        };
    }

    function renderConversation(conversation) {
        mainWindow.render(conversation);
    }

    

    return self
}

export { ViewManager }