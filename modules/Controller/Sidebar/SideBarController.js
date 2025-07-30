function SideBarController(parent) {
    let sidebarView;

    const self = {
        setView,
        initialise,
        updateCurrentConversation
    }

    function setView(view) {
        sidebarView = view;
        view.setController(self);
    }


    function initialise(conversationList) {
        sidebarView.render(conversationList);
    }

    function changeConversation() {
            
    }

    function updateCurrentConversation(conversation) {
        sidebarView.update(conversation);
    }

    return self;
}

export { SideBarController }