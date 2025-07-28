import { TitleSectionController } from "./TitleSectionController.js";

function MainWindowController() {
    const titleSectionController = new TitleSectionController();
    const cancelEvent = new Event("cancel");

}

export { MainWindowController };