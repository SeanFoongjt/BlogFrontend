function ModalView() {
    let modalController;

    self = {
        setController
    }

    function setController(controller) {
        modalController = controller;
    }

    return self;
}

export { ModalView }