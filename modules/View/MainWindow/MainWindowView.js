import { ChatlogView } from "./ChatlogView.js";
import { EditorView } from "./EditorView.js";
import { TitleSectionView } from "./TitleSectionView.js";

function MainWindowView(imagePath="") {
    const chatlog = ChatlogView(imagePath);
    const titleSection = TitleSectionView(imagePath);
    const editorView = EditorView();
    let mainWindowController;
    const quill = editorView.getEditor();

    const self = {
        render,
        getEditor,
        getViews,
        setController
    }

    const forTitleSection = {
    }

    function render(conversation) {
        chatlog.setImage(conversation.imagePath);
        chatlog.renderConversation(conversation.getListOfMessages())
        titleSection.changeConversation(conversation.imagePath, conversation.title);
        editorView.clear();
    }

    function getViews() {
        return [titleSection, chatlog, editorView];
    }


    function setController(controller, ) {
        mainWindowController = controller;
    }

    /**
     * Logic for dynamic chat size
     */
    document.getElementById("chatlog").style.height = "90%";
    document.getElementById("editor").style.maxHeight = `${0.6 * window.innerHeight}px`;
    var prevHeight = 0;

    const resizeObserver = new ResizeObserver((entries) => {
        console.log("Editor status: " + editorView.isShowing);
        const resizeChatSize = (newHeight) => {
            console.log("test: " + `${Math.round(newHeight)}px`);
            const chatlogElement = document.getElementById("chatlog");
            chatlogElement.style.height = 
                `calc(59% + 100px - ${newHeight}px)`;
            chatlogElement.style.maxHeight =
                `calc(59% + 100px - ${newHeight}px)`;

            // Adjust height of chatlog
            chatlogElement.scrollTop = chatlogElement.scrollTop + newHeight - prevHeight; 
            prevHeight = newHeight;
            //document.getElementById("chatlog").style.height = "40%";
        }

        console.log("Chat resized");

        for (const entry of entries) {
            if (entry.borderBoxSize?.length > 0) {
                if (editorView.isShowing) {
                    console.log("New height: " + entry.borderBoxSize[0].blockSize);
                    resizeChatSize(entry.borderBoxSize[0].blockSize);
                }
            }
        }
    });

    resizeObserver.observe(document.getElementById("editor"));




    function getEditor() {
        return editorView;
    }

    return self
}

export {MainWindowView};