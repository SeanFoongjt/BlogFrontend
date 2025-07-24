import { ChatlogView } from "./ChatlogView.js";
import { EditorView } from "./EditorView.js";
import { TitleSectionView } from "./TitleSectionView.js";

function MainWindowView(quill, imagePath="") {
    const chatlog = ChatlogView(imagePath);
    const titleSection = TitleSectionView(imagePath);
    const editorView = EditorView(quill);

    function render(conversation) {
        chatlog.render(conversation.messages)
        titleSection.render(conversation.title, conversation.imagePath);
        editorView.clear();
    }
}

export {MainWindowView};