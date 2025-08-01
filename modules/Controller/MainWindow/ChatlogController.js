function ChatlogController(parent) {
    let chatlogView;

    self = {
        setView,
        editFunction: parent.editFunction,
        replyFunction: parent.replyFunction,
        deleteFunction: parent.deleteFunction,
        forwardFunction: parent.forwardFunction
    }

    function setView(view) {
        chatlogView = view;
        view.setController(self);
    }


    return self;
}

export { ChatlogController }