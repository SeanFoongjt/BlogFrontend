function EditorView(quill) {
    let isShowing = false;
    const editorPrompt = document.querySelector(".editor-click-prompt");
    const editorToolbarContainer = document.querySelector(".editor-toolbar");
    const bottomToolbar = document.querySelector(".bottom-toolbar");

    const self = {
        setEditor,
        hide,
        show,
        clear
    }

    /** Decide whether to keep here or move to controller
    editorPrompt.addEventListener("click", displayEditor);
    */

    function setEditor(editor) {
        quill = editor;
    }

    function clear() {
        quill.setContents([{ insert: '\n' }]);
    }

    function hide() {
        if (!isShowing) {
            return
        }

        // Disallow editor to be hidden if there is content in the editor or if a chat is 
        // in the midst of being edited or replied to.
        if (quill.getText().trim() != "" || quill.getContents()["ops"].length != 1 || cancellableProcesses.length != 0) {
            return;
        }
        
        // Remove listeners from chatlog and title section
        chatlog.removeEventListener("click", hide);
        document.getElementById("title-section").removeEventListener("click", hide);
        document.getElementById("sidebar").removeEventListener("click", hide);
        
    
        // Adjust height and scroll position of chatlog
        const editorToolbarContainerHeight = editorToolbarContainer.offsetHeight;
        chatlog.scrollTop = Math.max(chatlog.scrollTop - editorToolbarContainerHeight, 0);
        chatlog.style.height = "90%";
        chatlog.style.maxHeight = "90%";
    
        // Hide editor, show prompt
        editorToolbarContainer.setAttribute("hidden", "")
        bottomToolbar.setAttribute("hidden", "");
        editorPrompt.removeAttribute("hidden");
        isShowing = false;
    }

    function show() {
        if (isShowing) {
            return
        }

        // Hide prompt, show and focus on editor
        editorToolbarContainer.removeAttribute("hidden");
        bottomToolbar.removeAttribute("hidden");
        const editorPromptHeight = editorPrompt.offsetHeight;
        editorPrompt.setAttribute("hidden", "");
        quill.focus();
        const editorToolbarContainerHeight = editorToolbarContainer.offsetHeight + bottomToolbar.offsetHeight;
        console.log("editor height: " + editorToolbarContainerHeight);
        chatlog.scrollTop = chatlog.scrollTop + editorToolbarContainerHeight - editorPromptHeight;
        chatlog.style.height = `calc(100% - ${editorToolbarContainerHeight}px)`;
        document.querySelector(".ql-container").style.height = 
            `calc(100% - ${document.querySelector(".ql-toolbar").offsetHeight}px)`;
    
        // Add listeners to chatlog and title section to hide editor when they are clicked
        chatlog.addEventListener("click", hide);
        document.getElementById("title-section").addEventListener("click", hide);
        document.getElementById("sidebar").addEventListener("click", hide);
        isShowing = true;
    }

    return self
}

export { EditorView }