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
    
    /**
     * Set the chatlog view. Generally used for initialisation
     * @param {ChatlogView} view 
     */
    function setView(view) {
        chatlogView = view;
        view.setController(self);
    }

    /**
     * Clear the chatlog
     */
    function clear() {
        chatlogView.clear();
    }


    return self;
}

export { ChatlogController }