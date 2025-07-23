import { ChatlogView } from "./ChatlogView.js";
import { TitleSectionView } from "./TitleSectionView.js";

function MainWindowView() {
    const chatlog = ChatlogView();
    const titleSection = TitleSectionView();
    const editorView = editorView();

    function render(conversation) {
        chatlog.render(conversation)
        titleSection.render(title, image);

        editorView.clear();
    }
}

export {MainWindowView};