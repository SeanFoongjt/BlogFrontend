import { sendFunction } from "./modules/utilities/chatOptions.js"
import { ModelManager } from "./modules/Model/ModelManager.js";
import { ViewManager } from "./modules/View/ViewManager.js";
import { MasterController } from "./modules/Controller/MasterController.js";
 
/**
 * Setup logic
 */
// Keeps track of currently executing processes that can be cancelled
const cancelEvent = new Event("cancel");
const cancellableProcesses = [];
function notifyCancellableProcesses() {
    console.log("Cancel event broadcast!");
    cancellableProcesses.forEach((process) => process.dispatchEvent(cancelEvent));
}

function pushCancellableProcess(process) {
    cancellableProcesses.push(process);
}

function removeFromCancellableProcesses(object) {
    // Remove from cancellableProcesses record as it is no longer in the midst of execution
    const index = cancellableProcesses.indexOf(object);
    if (index != -1) {
        cancellableProcesses.splice(index, 1);
    }
}


var rawcontentMap = new Map();



const model = ModelManager();
const view = ViewManager();
model.initialiseFromJson("./json/storage.json")
    .then(() => view.initialise(model.getSidebarList(), model.getMainConversation()));
const controller = MasterController();
const editorView = view.getMainWindow().getEditor();
view.setController(controller);
const quill = view.getEditor();



/**
 * Send button logic
 */

// Logic for send button
const sendButton = document.getElementById('send-button');
sendButton.addEventListener("click", sendFunction);






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

export { editorView, model, quill, rawcontentMap, pushCancellableProcess, removeFromCancellableProcesses, cancelEvent, notifyCancellableProcesses}