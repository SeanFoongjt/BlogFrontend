import { ChatlogView } from "./ChatlogView.js";
import { EditorView } from "./EditorView.js";
import { TitleSectionView } from "./TitleSectionView.js";

function MainWindowView(imagePath="") {
    const chatlogView = ChatlogView(imagePath);
    const titleSectionView = TitleSectionView(imagePath);
    const editorView = EditorView();
    let mainWindowController;
    const quill = editorView.getEditor();

    const self = {
        render,
        getViews,
        setController,
        renderBlocked,
        initialise,
        renderUnblocked
    }

    function initialise(conversation) {
        const chatboxPromise = chatlogView.initialise(conversation)
        titleSectionView.changeConversation(conversation.imagePath, conversation.title)

        if (conversation.isBlocked()) {
            renderBlocked();
            
        } else {
            renderUnblocked();
        }

        return chatboxPromise;
    }

    function render(conversation) {
        chatlogView.setImage(conversation.imagePath);
        const listOfChatboxes = chatlogView.renderConversation(conversation.getListOfMessages())
        titleSectionView.changeConversation(conversation.imagePath, conversation.title);
        editorView.clear();

        if (conversation.isBlocked()) {
            renderBlocked();
            
        } else {
            renderUnblocked();
        }

        return listOfChatboxes;
    }


    function getViews() {
        return {
            titleSectionView,
            chatlogView,
            editorView
        }
    }


    function setController(controller) {
        mainWindowController = controller;

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

    function renderBlocked() {
        const chatlogElement = document.querySelector(".chatlog");
        chatlogElement.setAttribute("hidden", "");


        const chatlogAndEditor = document.getElementById("chatlog-editor-container");
        const prevHeight = chatlogAndEditor.style.height;
        chatlogAndEditor.style.height = 0;
        

        editorView.hide()
        const editorClickPrompt = document.querySelector(".editor-click-prompt");
        editorClickPrompt.setAttribute("hidden", "");
        
        const blockedChat = document.getElementById("blocked-chat-container");
        blockedChat.removeAttribute("hidden");



        // Provide option to unblock conversation when appropriate button is clicked
        const unblockButton = document.getElementById("unblock-button");
        unblockButton.addEventListener("click", () => mainWindowController.unblock(prevHeight))

    }

    function renderUnblocked(prevHeight) {
        const chatlogElement = document.querySelector(".chatlog");
        chatlogElement.removeAttribute("hidden");

        const chatlogAndEditor = document.getElementById("chatlog-editor-container");

        if (prevHeight != undefined) {
            chatlogAndEditor.style.height = prevHeight;
        } else {
            chatlogAndEditor.style.height = "min(88%, calc(100% - 60px))"
        }

        const blockedChat = document.getElementById("blocked-chat-container");
        blockedChat.setAttribute("hidden", "");

        const userInput = document.querySelector(".editor-click-prompt");
        userInput.removeAttribute("hidden");
    }
    

    return self
}

export {MainWindowView};