import { ChatlogView } from "./ChatlogView.js";
import { EditorView } from "./EditorView.js";
import { TitleSectionView } from "./TitleSectionView.js";

function MainWindowView(imagePath="") {
    const chatlog = ChatlogView(imagePath);
    const titleSection = TitleSectionView(imagePath);
    const editorView = EditorView();
    const quill = editorView.getEditor();

    const self = {
        render,
        getEditor
    }

    const forTitleSection = {
        block,
        unblock
    }

    function render(conversation) {
        chatlog.setImage(conversation.imagePath);
        chatlog.renderConversation(conversation.getListOfMessages())
        titleSection.changeConversation(conversation.imagePath, conversation.title);
        editorView.clear();
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

    function block() {
        const chatlogElement = document.querySelector(".chatlog");
        chatlogElement.setAttribute("hidden", "");

        if (!editorView.isShowing) {
            const editorClickPrompt = document.querySelector(".editor-click-prompt");
            editorClickPrompt.setAttribute("hidden", "");
            
            
        } else {
            const editorToolbar = document.querySelector(".editor-toolbar");
            const bottomToolbar = document.querySelector(".bottom-toolbar");
            bottomToolbar.setAttribute("hidden","");
            editorToolbar.setAttribute("hidden", "");
        }

        const blockedChat = document.getElementById("blocked-chat-container");
        blockedChat.removeAttribute("hidden");
    }

    function unblock() {
        const blockedChat = document.getElementById("blocked-chat-container");
        blockedChat.setAttribute("hidden", "");

        if (!editorView.isShowing) {
            const userInput = document.querySelector(".editor-click-prompt");
            userInput.removeAttribute("hidden");
        } else {
            const editorToolbar = document.querySelector(".editor-toolbar");
            const bottomToolbar = document.querySelector(".bottom-toolbar");
            bottomToolbar.removeAttribute("hidden");
            editorToolbar.removeAttribute("hidden");
        }

        const chatlogElement = document.querySelector(".chatlog");
        chatlogElement.removeAttribute("hidden");

    }

    titleSection.passFunctions(forTitleSection)

    return self
}

export {MainWindowView};