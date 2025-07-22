import { MainWindow } from "./MainWindow";
import { Sidebar } from "./Sidebar";

function ViewManager() {
    const sidebar = Sidebar();
    const mainWindow = MainWindow();

    sidebar.render()
    mainWindow.render();
}