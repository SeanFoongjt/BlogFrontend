function EditorController() {
    let editorView;

    const self = {
        setView
    }

    function setView(view) {
        editorView = view;
        view.setController(self);
    }

    return self;
}

export { EditorController }