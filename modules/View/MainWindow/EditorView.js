function EditorView() {
    let isShowing = false;
    const editorPrompt = document.querySelector(".editor-click-prompt");
    const editorToolbarContainer = document.querySelector(".editor-toolbar");
    const bottomToolbar = document.querySelector(".bottom-toolbar");
    editorPrompt.addEventListener("click", show);

    // Initialise editor with custom toolbar

    var Block = Quill.import('blots/block');
    Block.tagName = 'p';
    Quill.register(Block, true);

    const editor = document.getElementById('editor');
    const quill = new Quill("#editor", {
        theme: "snow",
        modules : {
            toolbar:
            [
                [{ 'size': ['small', false, 'large', 'huge']}],
                ['bold', 'italic', 'underline'],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script':'sub'}, {'script': 'super'}],
                ['link', 'image', 'video', 'formula'],
                ['clean']
            ]
        }
    });


    const self = {
        isShowing,
        getEditor,
        hide,
        show,
        clear
    }

    function setEditor(editor) {
        quill = editor;
    }

    function getEditor() {
        return quill;
    }

    function clear() {
        quill.setContents([{ insert: '\n' }]);
    }

    function hide() {
        console.log(isShowing);
        if (!isShowing) {
            return
        }
        
        const chatlog = document.getElementById("chatlog");
        

        // Disallow editor to be hidden if there is content in the editor or if a chat is 
        // in the midst of being edited or replied to.
        /**
        //if (quill.getText().trim() != "" || quill.getContents()["ops"].length != 1 || cancellableProcesses.length != 0) {
        if (quill.getText().trim() != "" || quill.getContents()["ops"].length != 1) {
            return;
        }
            */
        
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
        self.isShowing = false;

    }

    function show() {
        if (isShowing) {
            return
        }


        // Hide prompt, show and focus on editor
        const chatlog = document.getElementById("chatlog");
        editorToolbarContainer.removeAttribute("hidden");
        bottomToolbar.removeAttribute("hidden");
        const editorPromptHeight = editorPrompt.offsetHeight;
        const titleSectionHeight = document.getElementById("title-section").offsetHeight;
        editorPrompt.setAttribute("hidden", "");
        quill.focus();
        const editorToolbarContainerHeight = editorToolbarContainer.offsetHeight + bottomToolbar.offsetHeight;
        console.log("editor height: " + editorToolbarContainerHeight);
        chatlog.scrollTop = chatlog.scrollTop + editorToolbarContainerHeight - editorPromptHeight;
        document.querySelector(".ql-container").style.height = 
            `calc(100% - ${document.querySelector(".ql-toolbar").offsetHeight}px)`;
    
        // Add listeners to chatlog and title section to hide editor when they are clicked
        chatlog.addEventListener("click", hide);
        document.getElementById("title-section").addEventListener("click", hide);
        document.getElementById("sidebar").addEventListener("click", hide);
        isShowing = true;
        self.isShowing = true;
        
    }

    return self
}

export { EditorView }