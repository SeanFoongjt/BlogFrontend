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

    /**
     * Initialisation function
     * @param {ConversationModel} conversation Initial converation to fill main window with
     * @returns Promise that resolves when the chatlog is filled
     */
    function initialise(conversation) {
        // Fill chatlog and set title section
        const chatboxPromise = chatlogView.initialise(conversation)
        titleSectionView.changeConversation(conversation.imagePath, conversation.title)

        // Check for whether the conversation is blocked, react accordingly
        if (conversation.isBlocked()) {
            renderBlocked();
            
        } else {
            renderUnblocked();
        }

        return chatboxPromise;
    }


    /**
     * Returns title section, chatlog and editor views. Used for initialisation of controller
     * @returns Object with title section, chatlog and editor views
     */
    function getViews() {
        return {
            titleSectionView,
            chatlogView,
            editorView
        }
    }


    /**
     * Set main window controller of the view. Generally used during initialisation
     * @param {MainWindowController} controller 
     */
    function setController(controller) {
        mainWindowController = controller;

        // Logic for send button. 
        const sendButton = document.getElementById('send-button');
        sendButton.addEventListener("click", controller.sendFunction);
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

    

    /**
     * Logic for dynamic chat size
     */
    document.getElementById("chatlog").style.height = "90%";
    document.getElementById("editor").style.maxHeight = `${0.6 * window.innerHeight}px`;
    var prevHeight = 0;

    const resizeObserver = new ResizeObserver((entries) => {
        console.log("Editor status: " + editorView.isShowing);
        const resizeChatSize = (newHeight) => {
            //console.log("test: " + `${Math.round(newHeight)}px`);
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
                console.log("chatlog moved");
            }
            prevHeight = newHeight;
        }

        //console.log("Chat resized");

        for (const entry of entries) {
            if (entry.borderBoxSize?.length > 0) {
                if (editorView.isShowing) {
                    //console.log("New height: " + entry.borderBoxSize[0].blockSize);
                    resizeChatSize(entry.borderBoxSize[0].blockSize);
                }
            }
        }
    });

    resizeObserver.observe(document.getElementById("editor"));




    /**
     * Function to render page for blocked conversations
     */
    function renderBlocked() {
        // Hide hatlog
        const chatlogElement = document.querySelector(".chatlog");
        chatlogElement.setAttribute("hidden", "");

        // Set height of chatlog and editor to 0. Needed due to the chatlog-editor-container
        // having a display value of flex.
        const chatlogAndEditor = document.getElementById("chatlog-editor-container");
        const prevHeight = chatlogAndEditor.style.height;
        chatlogAndEditor.style.height = 0;
        
        // Hide editor, then hide the editor click prompt
        editorView.hide()
        const editorClickPrompt = document.querySelector(".editor-click-prompt");
        editorClickPrompt.setAttribute("hidden", "");
        
        // Unhide "chat is blocked" notification
        const blockedChat = document.getElementById("blocked-chat-container");
        blockedChat.removeAttribute("hidden");

        // Provide option to unblock conversation when appropriate button is clicked
        const unblockButton = document.getElementById("unblock-button");
        unblockButton.addEventListener("click", () => mainWindowController.unblock(prevHeight))

    }

    /**
     * Render chatlog specifically when transitioning from a blocked conversation to an unblocked
     * conversation. This differs from render above that is always called regardless of whether
     * the conversation is blocked or unblocked.
     * @param {Number} prevHeight prevHeight of the editor and chatlog before conversation
     * was blocked
     */
    function renderUnblocked(prevHeight) {
        // Unhide chatlog
        const chatlogElement = document.querySelector(".chatlog");
        chatlogElement.removeAttribute("hidden");

        // Set height of chatlog and editor together
        const chatlogAndEditor = document.getElementById("chatlog-editor-container");
        if (prevHeight != undefined) {
            chatlogAndEditor.style.height = prevHeight;
        } else {
            chatlogAndEditor.style.height = "min(88%, calc(100% - 60px))"
        }

        // Hide the "chat is blocked" notification
        const blockedChat = document.getElementById("blocked-chat-container");
        blockedChat.setAttribute("hidden", "");
        
        // Unhide editor click prompt. Note that editor view is always hidden when blocked
        const userInput = document.querySelector(".editor-click-prompt");
        userInput.removeAttribute("hidden");
    }
    

    return self
}

export {MainWindowView};