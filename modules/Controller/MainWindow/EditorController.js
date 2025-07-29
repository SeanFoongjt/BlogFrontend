function EditorController(parent) {
    let editorView;

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
        setView,
        getEditor,
        show,
        hide
    }

    function setView(view) {
        editorView = view;
        view.setController(self);
    }

    function show() {
        editorView.show();
    }

    function hide() {
        // Disallow editor to be hidden if there is content in the editor or if a chat is 
        // in the midst of being edited or replied to.
        console.log("Controller hide called");
        if (quill.getText().trim() != "" || quill.getContents()["ops"].length != 1 
            || parent.cancellableProcessesLength() != 0) {
            return;
        }

        editorView.hide();
    }

    function getEditor() {
        return quill;
    }

    return self;
}

export { EditorController }