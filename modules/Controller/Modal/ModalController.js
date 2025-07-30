function ModalController(parent) {
    let modalView;


    const self = {
        setView
    }



    function setView(view) {
        modalView = view;
        view.setController(self);
    }

    


    return self;
}

export { ModalController }