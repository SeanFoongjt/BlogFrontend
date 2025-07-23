import { ChatlogView } from "./ChatlogView.js";
import { EditorView } from "./EditorView.js";
import { TitleSectionView } from "./TitleSectionView.js";

function MainWindowView() {
    const chatlog = ChatlogView();
    const titleSection = TitleSectionView();
    const editorView = EditorView();

    function render(conversation) {
        chatlog.render(conversation)
        titleSection.render(title, image);

        editorView.clear();
    }
}

export {MainWindowView};