import { MainWindowView } from "./MainWindow/MainWindowView.js";
import { SidebarView } from "./Sidebar/SidebarView.js";

function ViewManager() {
    const sidebar = SidebarView();
    const mainWindow = MainWindowView();
    var controller;

    const self = {
        initialise,
        getMainWindow,
        setController,
        getEditor
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

    return self
}

export { ViewManager }