import { MainWindowView } from "./MainWindow/MainWindowView.js";
import { SidebarView } from "./Sidebar/SidebarView.js";

function ViewManager() {
    const sidebar = SidebarView();
    const mainWindow = MainWindowView();

    function initialise(conversationList, mainConversation) {
        sidebar.render(conversationList);
        mainWindow.render(mainConversation);
    }

    sidebar.render()
    mainWindow.render();
}