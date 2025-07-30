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
    //confirmButton.addEventListener("click", notifyCancellableProcesses);
    confirmationPopupBodyText.innerText = body;
    confirmationPopupTitle.innerText = header;
}


export { confirmationPopupFunction }