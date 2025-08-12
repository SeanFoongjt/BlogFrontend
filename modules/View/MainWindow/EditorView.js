function EditorView() {
    const editorPrompt = document.querySelector(".editor-click-prompt");
    const editorToolbarContainer = document.querySelector(".editor-toolbar");
    const bottomToolbar = document.querySelector(".bottom-toolbar");
    let editorController;
    editorPrompt.addEventListener("click", show);
    let quill;

    const self = {
        isShowing : false,
        getEditor,
        hide,
        show,
        clear,
        setController
    }

    function setController(controller) {
        editorController = controller;
        quill = controller.getEditor();
    }

    function getEditor() {
        return quill;
    }

    function clear() {
        quill.setContents([{ insert: '\n' }]);
    }


    function hide() {
        if (!self.isShowing) {
            return
        }
        
        const chatlog = document.getElementById("chatlog");

        
        // Remove listeners from chatlog and title section
        chatlog.removeEventListener("click", hide);
        document.getElementById("title-section").removeEventListener("click", editorController.hide);
        document.getElementById("sidebar").removeEventListener("click", editorController.hide);
        
    
        // Adjust height and scroll position of chatlog
        const editorToolbarContainerHeight = 
            editorToolbarContainer.offsetHeight;
        chatlog.style.height = "90%";
        chatlog.style.maxHeight = "90%";
    
        // Hide editor, show prompt
        editorToolbarContainer.setAttribute("hidden", "")
        bottomToolbar.setAttribute("hidden", "");
        editorPrompt.removeAttribute("hidden");
        self.isShowing = false;

        chatlog.scrollTop = 
            Math.max(chatlog.scrollTop - editorToolbarContainerHeight + editorPrompt.offsetHeight, 0);

    }

    function show() {
        if (self.isShowing) {
            return
        }

        // Hide prompt, show and focus on editor
        const chatlog = document.getElementById("chatlog");
        editorToolbarContainer.removeAttribute("hidden");
        bottomToolbar.removeAttribute("hidden");
        const editorPromptHeight = editorPrompt.offsetHeight;
        editorPrompt.setAttribute("hidden", "");
        quill.focus();
        const editorToolbarContainerHeight = editorToolbarContainer.offsetHeight + bottomToolbar.offsetHeight;
        
        document.querySelector(".ql-container").style.height = 
            `calc(100% - ${document.querySelector(".ql-toolbar").offsetHeight}px)`;
    
        // Add listeners to chatlog and title section to hide editor when they are clicked
        chatlog.addEventListener("click", editorController.hide);
        document.getElementById("title-section").addEventListener("click", editorController.hide);
        document.getElementById("sidebar").addEventListener("click", editorController.hide);

        chatlog.scrollTop = chatlog.scrollTop + editorToolbarContainerHeight - editorPromptHeight;
        self.isShowing = true;
        
    }

    return self
}

export { EditorView }