import { createEditor } from "./Editor.js"
import { createChatlog} from "./Chatlog.js"
import { createTitleSection } from "./TitleSection.js"

function createConversation() {
    const cancellableProcesses = [];
    const isEditorShowing = false;
    const editor = createEditor();
    const chatlog = createChatlog();
    const titleSection = createTitleSection();

    /**
     * Editor display and hiding logic
     */
    const editorPrompt = document.querySelector(".editor-click-prompt");
    const editorToolbarContainer = document.querySelector(".editor-toolbar");
    const bottomToolbar = document.querySelector(".bottom-toolbar");
    editorPrompt.addEventListener("click", displayEditor);

    function notifyCancellableProcesses() {
        cancellableProcesses
            .forEach((process) => process.dispatchEvent(cancelEvent));
    }

    function addCancellableProcess(process) {
        cancellableProcesses.push(process);
    }

    function removeCancellableProcess(process) {
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

    return {
        isEditorShowing,
        notifyCancellableProcesses,
        addCancellableProcess,
        removeCancellableProcess,
        getContext
    }
}

export { createConversation };