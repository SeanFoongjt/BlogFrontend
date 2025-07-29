function SideBarController() {
    let sidebarView;

    const self = {
        setView
    }

    function setView(view) {
        sidebarView = view;
        view.setController(self);
    }



    function changeConversation() {
            
    }

    return self;
}

export { SideBarController }