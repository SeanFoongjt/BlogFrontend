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
        getViews,
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

    function getEditor() {
        return mainWindow.getEditor();
    }

    function getViews() {
        return [sidebar, mainWindow, modal];
    }

    return self
}

export { ViewManager }