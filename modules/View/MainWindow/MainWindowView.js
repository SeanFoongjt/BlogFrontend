import { ChatlogView } from "./ChatlogView.js";
import { EditorView } from "./EditorView.js";
import { TitleSectionView } from "./TitleSectionView.js";

function MainWindowView(quill, imagePath="") {
    const chatlog = ChatlogView(imagePath);
    const titleSection = TitleSectionView(imagePath);
    const editorView = EditorView(quill);

    const self = {
        render
    }

    function render(conversation) {
        console.log(conversation);
        chatlog.renderConversation(conversation.getListOfMessages())
        titleSection.changeConversation(conversation.imagePath, conversation.title);
        editorView.clear();
    }

    return self
}

export {MainWindowView};