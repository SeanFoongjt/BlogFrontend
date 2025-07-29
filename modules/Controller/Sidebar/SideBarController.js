function SideBarController(parent) {
    let sidebarView;

    const self = {
        setView,
        initialise
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

    return self;
}

export { SideBarController }