import { readJson, createConversationFromJson } from "./modules/setup/readConversationFromJson.js";
import { createConversation } from "./modules/utilities/createConversation.js";
import { sendFunction } from "./modules/utilities/chatOptions.js"

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

// Keep track of whether editor is visible
var isEditorShowing = false;

var rawcontentMap = new Map();

// Initialise editor with custom toolbar

var Block = Quill.import('blots/block');
Block.tagName = 'p';
Quill.register(Block, true);

const editor = document.getElementById('editor');
const quill = new Quill("#editor", {
    theme: "snow",
    modules : {
        toolbar:
        [
            [{ 'size': ['small', false, 'large', 'huge']}],
            ['bold', 'italic', 'underline'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'script':'sub'}, {'script': 'super'}],
            ['link', 'image', 'video', 'formula'],
            ['clean']
        ]
    }
});

console.log("Quill from main: " + quill);

// Initialise data from json
readJson("./json/sample-text-file.json")
    .then(data => rawcontentMap = createConversationFromJson(data));

/**
 * Logic for changing the conversation title
 */
var conversationTitle = document.getElementById("conversationTitle");
var conversationTitleInput = document.getElementById("conversationTitleInput");
conversationTitle.addEventListener("dblclick", renameTitle);

/**
 * Rename the title of the conversation
 */
function renameTitle() {
    // Make the correct input block visible, hide the existing title
    var cancel = document.getElementById("conversationTitleInputCancel");
    conversationTitleInput.value = conversationTitle.innerText;
    conversationTitleInput.innerText = conversationTitle.innerText;
    console.log("Input value: " + conversationTitleInput.value);
    console.log("Inner text: " + conversationTitleInput.innerText);
    conversationTitle.setAttribute("hidden", "");
    conversationTitleInput.removeAttribute("hidden");
    cancel.removeAttribute("hidden");
    conversationTitleInput.focus();

    // Add event listener for enter key press, enable cancel button
    conversationTitleInput.addEventListener("keypress", validate);
    var cancelButton = document.getElementById("conversationTitleInputCancel");
    cancelButton.addEventListener("click", cleanup);

    // Function to validate name
    function validate(event) {
      if (event.key == "Enter") {
            if (conversationTitleInput.value.trim() != "") {
                event.preventDefault();
                conversationTitle.innerText = conversationTitleInput.value.trim();
            }
            cleanup();
            console.log(conversationTitle.innerText);
      }
    }

    // Cleanup helper function makes input hidden and the new or old conversation title visible
    function cleanup() {
        cancel.setAttribute("hidden", "");
        conversationTitleInput.setAttribute("hidden", "");
        conversationTitle.removeAttribute("hidden");
        conversationTitleInput.removeEventListener("keypress", validate);
        cancelButton.removeEventListener("click", cleanup);
    }
}

/**
 * Editor display and hiding logic
 */
const editorPrompt = document.querySelector(".editor-click-prompt");
const editorToolbarContainer = document.querySelector(".editor-toolbar");
const bottomToolbar = document.querySelector(".bottom-toolbar");
editorPrompt.addEventListener("click", displayEditor);

/**
 * Show the editor. Activated when the prompt to open editor is clicked.
 */
function displayEditor() {
    if (isEditorShowing) {
        return;
    }

    // Hide prompt, show and focus on editor
    editorToolbarContainer.removeAttribute("hidden");
    bottomToolbar.removeAttribute("hidden");
    editorPrompt.setAttribute("hidden", "");
    quill.focus();
    const editorToolbarContainerHeight = editorToolbarContainer.offsetHeight + bottomToolbar.offsetHeight;
    console.log(chatlog.scrollTop + editorToolbarContainerHeight);
    chatlog.scrollTop = chatlog.scrollTop + editorToolbarContainerHeight - editorPrompt.offsetHeight;

    // Add listeners to chatlog and title section to hide editor when they are clicked
    chatlog.addEventListener("click", hideEditor);
    document.getElementById("textlog").addEventListener("click", hideEditor);
    isEditorShowing = true;
}

/**
 * Hide editor, reverting back to a prompt to open the editor
 * @returns 
 */
function hideEditor() {
    if (!isEditorShowing) {
        return;
    }

    console.log(cancellableProcesses);

    // Disallow editor to be hidden if there is content in the editor or if a chat is 
    // in the midst of being edited or replied to.
    if (quill.getText().trim() != "" || quill.getContents()["ops"].length != 1 || cancellableProcesses.length != 0) {
        return;
    }
  
    // Remove listeners from chatlog and title section
    chatlog.removeEventListener("click", hideEditor);
    document.getElementById("textlog").removeEventListener("click", hideEditor);

    // Adjust height and scroll position of chatlog
    const editorToolbarContainerHeight = editorToolbarContainer.offsetHeight;
    chatlog.scrollTop = Math.max(chatlog.scrollTop - editorToolbarContainerHeight, 0);
    chatlog.style.height = "90%";
    chatlog.style.maxHeight = "90%";

    // Hide editor, show prompt
    editorToolbarContainer.setAttribute("hidden", "")
    bottomToolbar.setAttribute("hidden", "");
    editorPrompt.removeAttribute("hidden");
    isEditorShowing = false;
}

/**
 * Logic for dynamic chat size
 */
document.getElementById("chatlog").style.height = "90%";
document.getElementById("editor").style.maxHeight = `${0.6 * window.innerHeight}px`;
console.log(0.8 * window.innerHeight);
var prevHeight = 0;

const resizeObserver = new ResizeObserver((entries) => {
    console.log("Editor status: " + isEditorShowing);
    const resizeChatSize = (newHeight) => {
        console.log("test: " + `${Math.round(newHeight)}px`);
        const chatlog = document.getElementById("chatlog");
        chatlog.style.height = 
            `calc(62% + 100px - ${Math.round(newHeight)}px)`;
        chatlog.style.maxHeight =
            `calc(62% + 100px - ${Math.round(newHeight)}px)`;

        // Adjust height of chatlog
        chatlog.scrollTop = chatlog.scrollTop + newHeight - prevHeight; 
        prevHeight = newHeight;
        //document.getElementById("chatlog").style.height = "40%";
    }

    console.log("Chat resized");

    for (const entry of entries) {
        if (entry.borderBoxSize?.length > 0) {
            if (isEditorShowing) {
                console.log("New height: " + entry.borderBoxSize[0].blockSize);
                resizeChatSize(entry.borderBoxSize[0].blockSize);
            }
        }
    }
});

resizeObserver.observe(document.getElementById("editor"));

/**
 * Send button logic
 */

// Logic for send button
const sendButton = document.getElementById('send-button');
sendButton.addEventListener("click", sendFunction);

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

/**
 * Add appropriate listener to clear conversation button.
 */
const clearConversationButton = document.getElementById("clear-conversation");
clearConversationButton.addEventListener(
    "click", 
    () => confirmationPopupFunction(
        "Clear conversation?", 
        "Are you sure you want to clear the conversation?", 
        () => document.getElementById('chatlog').replaceChildren()
    )
);

/**
 * Logic to block and unblock a conversation as well as adding of the function
 * to the block conversation button.
 */

/**
 * Function to block conversation / user
 */
function blockFunction() {
    // Make chatlog and editor hidden, display "blocked user" screen
    const chatlogEditorContainer = document.getElementById("chatlog-editor-container");
    chatlogEditorContainer.setAttribute("hidden", "");
    const blockedChat = document.getElementById("blocked-chat-container");
    blockedChat.removeAttribute("hidden");

    // Provide option to unblock conversation when appropriate button is clicked
    const unblockButton = document.getElementById("unblock-button");
    unblockButton.addEventListener("click", unblockFunction)
}

/**
 * function to unblock conversation
 */
function unblockFunction() {
    // Make chatlog and editor visible, hide "blocked user" screen
    const blockedChat = document.getElementById("blocked-chat-container");
    blockedChat.setAttribute("hidden", "");
    const chatlogEditorContainer = document.getElementById("chatlog-editor-container");
    chatlogEditorContainer.removeAttribute("hidden");
}

// Add appropriate listener to the blockButton
const blockButton = document.getElementById("block-conversation");
blockButton.addEventListener(
    "click", 
    () => confirmationPopupFunction(
        "Block user?",
        "Are you sure you want to block this user?",
        blockFunction
    )
);



/**
 * Function to rename title
 */
var inputPopup = document.getElementById("input-popup-modal");
var inputPopupConfirm = inputPopup.querySelector("[name='confirm']")
var inputPopupInput = inputPopup.querySelector("#modal-input")

document.getElementById("rename-title").addEventListener("click", renameTitleFunction);

function renameTitleFunction() {
    inputPopupConfirm.addEventListener("click", confirm);
    inputPopupInput.value = conversationTitle.innerText;
    inputPopupInput.innerText = conversationTitle.innerText;

    function confirm() {
        const newTitle = inputPopupInput.value.trim();
        if (newTitle != "") {
            conversationTitle.innerText = newTitle;
        }
    }
}

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

export { displayEditor, quill, rawcontentMap, pushCancellableProcess, removeFromCancellableProcesses, cancelEvent, notifyCancellableProcesses}