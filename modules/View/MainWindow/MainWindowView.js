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
        const listOfChatboxes = chatlog.renderConversation(conversation.getListOfMessages())
        titleSection.changeConversation(conversation.imagePath, conversation.title);
        editorView.clear();

        return listOfChatboxes;

    }

    function getViews() {
        return [titleSection, chatlog, editorView];
    }


    function setController(controller, ) {
        mainWindowController = controller;


        /**
         * Send button logic
         */

        // Logic for send button
        const sendButton = document.getElementById('send-button');
        sendButton.addEventListener("click", controller.sendFunction);
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
            const qltoolbarHeight = document.querySelector(".ql-toolbar").offsetHeight;
            const bottomToolbarHeight = document.querySelector(".bottom-toolbar").offsetHeight;
            chatlogElement.style.height = 
                `calc(79% + 100px - ${bottomToolbarHeight + qltoolbarHeight}px - ${newHeight}px)`;
            chatlogElement.style.maxHeight =
                `calc(79% + 100px - ${bottomToolbarHeight + qltoolbarHeight}px - ${newHeight}px)`;

            // Adjust height of chatlog
            if (editorView.isShowing) {
                chatlogElement.scrollTop = chatlogElement.scrollTop + newHeight - prevHeight; 
            }
            prevHeight = newHeight;
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