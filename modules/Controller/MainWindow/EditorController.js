import { cancellableProcessesMonitor as cpm } from "../CancellableProcessesMonitor.js";

function EditorController(parent) {
    let editorView;

    // Initialise editor with custom toolbar
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
        setView,
        getEditor,
        show,
        hide
    }

    /**
     * Set editor view. Used during intialisation
     * @param {EditorView} view 
     */
    function setView(view) {
        editorView = view;
        view.setController(self);
    }

    /**
     * Show the editor
     */
    function show() {
        editorView.show();
    }

    /**
     * Hide the editor
     * @returns 
     */
    function hide() {
        // Disallow editor to be hidden if there is content in the editor or if a chat is 
        // in the midst of being edited or replied to.
        console.log("Controller hide called");
        if (quill.getText().trim() != "" || quill.getContents()["ops"].length != 1 
            || cpm.hasCancellableProcess()) {
            return;
        }

        editorView.hide();
    }

    /**
     * Get a reference to the Quill instance
     * @returns the singleton quill instance
     */
    function getEditor() {
        return quill;
    }

    return self;
}

export { EditorController }