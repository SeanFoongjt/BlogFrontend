import { MainWindowView } from "./MainWindow/MainWindowView.js";
import { SidebarView } from "./Sidebar/SidebarView.js";

function ViewManager(quill) {
    const sidebar = SidebarView();
    const mainWindow = MainWindowView(quill);

    function initialise(conversationList, mainConversation) {
        sidebar.render(conversationList);
        mainWindow.render(mainConversation);
        console.log(conversationList);
        console.log(mainConversation);
    }

    return {
        initialise
    }
}

export { ViewManager }