function ModalController(parent) {
    let modalView;
    let conversationList;


    const self = {
        setView,
        initialise,
        conversationList
    }


    function initialise(conversationList) {
        modalView.renderForwardingPopup(conversationList);
    }

    function setView(view) {
        modalView = view;
        view.setController(self);
    }

    


    return self;
}

export { ModalController }