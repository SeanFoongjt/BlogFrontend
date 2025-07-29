function ChatlogController(parent) {
    let chatlogView;

    self = {
        setView,
        editFunction: parent.editFunction,
        replyFunction: parent.replyFunction,
        deleteFunction: parent.deleteFunction
    }

    function setView(view) {
        chatlogView = view;
        view.setController(self);
    }


    return self;
}

export { ChatlogController }