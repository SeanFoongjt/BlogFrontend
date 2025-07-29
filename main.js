import { ModelManager } from "./modules/Model/ModelManager.js";
import { MasterController } from "./modules/Controller/MasterController.js";
 
/**
 * Launch app
 */
const controller = MasterController();
const quill = controller.getEditor();
const editorView = controller.getEditorView();




/**
function refreshInputPopup() {
    // Add appropriate listener to the renameTitleButton
    // cloneNode and reassign to remove all event listeners
    const newButton = inputPopupConfirm.cloneNode(true);
    inputPopupConfirm.parentNode.replaceChild(newButton, confirmButton);
    inputPopupConfirm = newButton;

    // Link function to button, set body and title text
    confirmButton.addEventListener("click", renameTitleFunction);
    confirmButton.addEventListener("click", notifyCancellableProcesses);
    confirmationPopupBodyText.innerText = body;
    confirmationPopupTitle.innerText = header;

}
*/

// TODO start
// Web Speech API as supported by major browsers
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
    window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

// Logic for mike button
const mikeButton = document.getElementById('mike-button');
mikeButton.addEventListener("touchstart", mikeStart);
mikeButton.addEventListener("mousedown", mikeStart);
mikeButton.addEventListener("touchend", mikeEnd);
mikeButton.addEventListener("mouseup", mikeEnd);

/**
 * Setup SpeechRecognition object and configure settings
 * continous: Whether more than a single result is recognised each time recognition starts
 * lang: language of recognition
 * interimResults: Whether interim results are given or if only final results are given
 * maxAlternatives: Sets the number of potential alternatives
 */ 
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'en-GB';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

function mikeStart() {
    recognition.start();
    console.log("Begin speech recognition");
}

function mikeEnd() {
    recognition.stop()
    console.log("End speech recognition")
}

recognition.onresult = function(event) {
    const speechText = "";
    for (i = 0; i < event.length; i++) {
        speechText += event.results[i][0].transcript + " ";
    }

    quill.updateContents(new Delta()
        .insert(speechText)
    );
    console.log(speechText);
}

export { editorView, quill }