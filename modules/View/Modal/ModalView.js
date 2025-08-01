function ModalView() {
    let modalController;
    let conversationMap = new Map();

    self = {
        setController,
        confirmationPopupFunction,
        renderForwardingPopup
    }

    function setController(controller) {
        modalController = controller;
    }

    /**
     * Confirmation popup logic, consisting of constant and variable declarations and an
     * abstract function to create confirmation popups.
     */

    // Constant and variable declarations for confirmation popup
    const confirmationPopup = document.getElementById("confirmation-popup-modal");
    const confirmationPopupBodyText = confirmationPopup.querySelector(".modal-body-text");
    const confirmationPopupTitle = confirmationPopup.querySelector(".modal-title");
    const confirmationPopupFooter = confirmationPopup.querySelector(".modal-footer");
    var confirmButton = confirmationPopupFooter.querySelector("button[name='continue']");

    /**
     * Function to throw up a confirmation popup on the screen before proceeding with the action
     * @param {String} header header of the popup
     * @param {String} body body of the popup
     * @param {Function} functionToExecute action if the user seeks to continue
     */
    function confirmationPopupFunction(header, body, functionToExecute) {
        // cloneNode and reassign to remove all event listeners
        const newButton = confirmButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(newButton, confirmButton);
        confirmButton = newButton;

        // Link function to button, set body and title text
        confirmButton.addEventListener("click", functionToExecute);
        confirmButton.addEventListener("click", notifyCancellableProcesses);
        confirmationPopupBodyText.innerText = body;
        confirmationPopupTitle.innerText = header;
    }


    // Constant and variable declarations for forwarding popup
    const forwardingPopup = document.getElementById("forwarding-popup-modal");
    const forwardingPopupBody = forwardingPopup.querySelector(".modal-body");
    const forwardingPopupTitle = forwardingPopup.querySelector(".modal-title");
    const forwardingPopupFooter = forwardingPopup.querySelector(".modal-footer");
    var forwardingConfirmButton = forwardingPopupFooter.querySelector("button[name='confirm']");

    function renderForwardingPopup(conversationList) {
        const list = forwardingPopupBody.querySelector(".list-group");
        console.log(forwardingPopupBody);
        

        var elementTemplate = fetch("../../../templates/forward-menu-item.html")
            .then(res => res.text())
            .then(text => Handlebars.compile(text));


        elementTemplate.then(template => {
            for (const conversation of conversationList) {
                let currOption;
                currOption = document.createElement("template");
                conversation["htmlId"] = "forward-to-" + conversation["title"];
                currOption.innerHTML = template(conversation);
                currOption = currOption.content.firstElementChild;

                currOption.addEventListener(
                    "click", 
                    () => currOption.querySelector("[type='checkbox']").checked = ! currOption.querySelector("[type='checkbox']").checked
                );

                conversationMap.set(currOption, conversation.self);
                list.appendChild(currOption);
            }
        });

    }
    

    return self;
}

export { ModalView }