function ChatlogController() {
    let chatlogView;

    self = {

    }

    function setView(view) {
        chatlogView = view;
        view.setController(self);
    }

    return self;
}

export { ChatlogController }