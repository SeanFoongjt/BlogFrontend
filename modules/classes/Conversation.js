import { createEditor } from "./Editor.js"
import { createChatlog} from "./Chatlog.js"
import { createTitleSection } from "./TitleSection.js"
import { createChat } from "./Chat.js"

function createConversation(dataPath) {
    const cancellableProcesses = [];
    const isEditorShowing = false;
    const quill = createEditor();
    const titleSection = createTitleSection();
    
    /**
     * Editor display and hiding logic
     */
    const editorPrompt = document.querySelector(".editor-click-prompt");
    const editorToolbarContainer = document.querySelector(".editor-toolbar");
    const bottomToolbar = document.querySelector(".bottom-toolbar");
    editorPrompt.addEventListener("click", displayEditor);


    /**
     * Show the editor. Activated when the prompt to open editor is clicked.
     */
    function displayEditor() {
        // Hide prompt, show and focus on editor
        editorToolbarContainer.removeAttribute("hidden");
        bottomToolbar.removeAttribute("hidden");
        editorPrompt.setAttribute("hidden", "");
        console.log(quill);
        quill.focus();
        isEditorShowing = true;

        // Adjust height of chatlog
        chatlog.style.height = "62%";
        chatlog.style.maxHeight = "62%";
        chatlog.scrollTop = chatlog.scrollTop + editorToolbarContainer.offsetHeight;

        // Add listeners to chatlog and title section to hide editor when they are clicked
        chatlog.addEventListener("click", hideEditor);
        document.getElementById("textlog").addEventListener("click", hideEditor);
    }

    /**
     * Hide editor, reverting back to a prompt to open the editor
     * @returns 
     */
    function hideEditor() {
        // Disallow editor to be hidden if there is content in the editor or if a chat is 
        // in the midst of being edited or replied to.
        if (quill.getText().trim() != "" || quill.getContents()["ops"].length != 1 || cancellableProcesses.length != 0) {
            return;
        }
        
        // Remove listeners from chatlog and title section
        chatlog.removeEventListener("click", hideEditor);
        document.getElementById("textlog").removeEventListener("click", hideEditor);

        // Adjust height and scroll position of chatlog
        const editorToolbarContainerHeight = editorToolbarContainer.offsetHeight;
        chatlog.scrollTop = Math.max(chatlog.scrollTop - editorToolbarContainerHeight, 0);
        chatlog.style.height = "90%";
        chatlog.style.maxHeight = "90%";

        // Hide editor, show prompt
        editorToolbarContainer.setAttribute("hidden", "")
        bottomToolbar.setAttribute("hidden", "");
        editorPrompt.removeAttribute("hidden");
        isEditorShowing = false;
    }

    function notifyCancellableProcesses() {
        cancellableProcesses
            .forEach((process) => process.dispatchEvent(cancelEvent));
    }

    function addCancellableProcess(process) {
        cancellableProcesses.push(process);
    }

    function removeCancellableProcess(object) {
        const index = cancellableProcesses.indexOf(object);
        if (index != -1) {
            cancellableProcesses.splice(index, 1);
        }
    }

    
    /**
     * Logic for dynamic chat size
     */
    document.getElementById("chatlog").style.height = "90%";
    document.getElementById("editor").style.maxHeight = `${0.6 * window.innerHeight}px`;
    console.log(0.8 * window.innerHeight);

    const resizeObserver = new ResizeObserver((entries) => {
        const resizeChatSize = (newHeight) => {
            console.log("test: " + `${Math.round(newHeight)}px`);
            document.getElementById("chatlog").style.height = 
            `calc(62% + 100px - ${Math.round(newHeight)}px)`;
            //document.getElementById("chatlog").style.height = "40%";
        }

        console.log("Chat resized");

        for (const entry of entries) {
            if (entry.borderBoxSize?.length > 0) {
                if (isEditorShowing) {
                    console.log("New height: " + entry.borderBoxSize[0].blockSize);
                    resizeChatSize(entry.borderBoxSize[0].blockSize);
                }
            }
        }
    });

    resizeObserver.observe(document.getElementById("editor"));

    function getContext() {
        return {
            conversation, 
            chatlog,
            editor,
            titleSection
        }
    }

    const conversation = {
        isEditorShowing,
        notifyCancellableProcesses,
        addCancellableProcess,
        removeCancellableProcess,
        getContext

    }
    const chatlog = createChatlog(dataPath, conversation);
    return conversation
}

export { createConversation };