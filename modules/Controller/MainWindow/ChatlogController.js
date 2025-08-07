function ChatlogController(parent) {
    let chatlogView;

    self = {
        setView,
        editFunction: parent.editFunction,
        replyFunction: parent.replyFunction,
        deleteFunction: parent.deleteFunction,
        forwardFunction: parent.forwardFunction,
        clear
    }

    function setView(view) {
        chatlogView = view;
        view.setController(self);
    }

    function clear() {
        chatlogView.clear();
    }


    return self;
}

export { ChatlogController }