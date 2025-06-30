import { readJson, createConversationFromJson } from "./modules/setup/readConversationFromJson.js";
import { createConversation } from "./modules/utilities/createConversation.js";

/**
 * Setup logic
 */

const cancelEvent = new Event("cancel");
const cancellableProcesses = [];
const replyMap = new Map();

// Initialise editor with custom toolbar
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

// Initialise data from json
readJson("./json/sample-text-file.json")
  .then(data => createConversationFromJson(data));

function notifyCancellableProcesses() {
  cancellableProcesses.forEach((process) => process.dispatchEvent(cancelEvent));
}


/**
 * Logic for changing the conversation title
 */

var conversationTitle = document.getElementById("conversationTitle");
var conversationTitleInput = document.getElementById("conversationTitleInput");
conversationTitle.addEventListener("dblclick", renameTitle);

function renameTitle() {
  // Make the correct input block visible, hide the existing title
  var inputContainer = document.getElementById("conversationTitleInputContainer");
  conversationTitleInput.setAttribute("placeholder", conversationTitle.innerText);
  conversationTitle.setAttribute("hidden", "");
  inputContainer.removeAttribute("hidden");
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
    }
  }

  // Cleanup helper function makes input hidden and the new or old conversation title visible
  function cleanup() {
    inputContainer.setAttribute("hidden", "");
    conversationTitle.removeAttribute("hidden");
    conversationTitleInput.removeEventListener("keypress", validate);
    cancelButton.removeEventListener("click", cleanup);
  }
}

/**
 * Send button logic
 */

// Logic for send button
const sendButton = document.getElementById('send-button');
sendButton.addEventListener("click", sendFunction);

// Function for when the send button is clicked
function sendFunction(event, isReply=false) {
  // Retrieve encoding type
  var encodingType = document.getElementById("encoding-dropup").getAttribute("value");

  // Get text from the editor
  var rawtext = quill.getText()
  var contents = quill.getContents();
  console.log(quill.root.innerHTML);
  var rawHTML = quill.root.innerHTML;
  //console.log(marked.parse(rawHTML));
  quill.setText("");
  rawtext = rawtext.trim();
  //console.log(rawtext);

  // Terminate function early if no actual text is sent
  if (rawtext == "" && contents["ops"].length == 1) {
    console.log("terminated early");
    return;
  }

  // use createConversation to create html component
  const newChat = createConversation(
    "my-chat", 
    rawHTML.trim(), 
    Date.now(), 
    rawtext, 
    encodingType, 
    isReply
  );

  // Automatically scroll to bottom
  chatlog.scrollTop = chatlog.scrollHeight;

  return newChat;
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

// Function for confirmation popup, takes in header, body and a function to create the popup
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

// function to block conversation
function blockFunction() {
  const chatlogEditorContainer = document.getElementById("chatlog-editor-container");
  chatlogEditorContainer.setAttribute("hidden", "");
  const blockedChat = document.getElementById("blocked-chat-container");
  blockedChat.removeAttribute("hidden");

  // Unblock conversation when appropriate button is clicked
  const unblockButton = document.getElementById("unblock-button");
  unblockButton.addEventListener("click", unblockFunction)
}

// function to unblock conversation
function unblockFunction() {
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

// TODO end

// Edit function, takes in a my-chat web component
function editFunction(object) {
  notifyCancellableProcesses();
  // Get the text of the chatbox to be edited, put it in the editor
  var textToEdit = object.querySelector("div[name='text']");
  quill.setText(textToEdit.innerText);  

  // Highlight text currently being edited
  object.shadowRoot.querySelector(".text-box").style.backgroundColor = "#B4CBF0";
  
  // Scroll to editor
  window.scrollTo(0, document.body.scrollHeight);
  quill.focus();
  
  // Make the cancel button visible
  var cancelButton = document.getElementById("cancel-button");
  cancelButton.removeAttribute("hidden");

  // Skip to cleanup if no edit is done
  cancelButton.addEventListener("click", cleanup);

  // Change the send button to edit 
  var editButton = document.getElementById("send-button");
  editButton.innerText = "Edit";
  editButton.removeEventListener("click", sendFunction);
  editButton.addEventListener("click", edit);
  object.addEventListener("cancel", cleanup);
  notifyCancellableProcesses();
  cancellableProcesses.push(object);
  console.log(cancellableProcesses);

  // Change text in chatbox to edited text, display '(edited)' after time
  function edit() {
    textToEdit.innerText = quill.getText().trim();
    var subtext = object.querySelector("span[name='time']");
    if (subtext.innerText.slice(-8) != "(edited)") {
      subtext.innerText += " (edited)"
    }
    if (replyMap.has(object)) {
      replyMap
        .get(object)
        .forEach((chat) => {
          console.log(chat);
          const rawText = quill.getText().trim();
          chat.shadowRoot.querySelector("span[name='replyText']").innerText = formatForReply(rawText);
        });
    }
    cleanup();
  }

  // Turn edit button back to send button, clear editor, make cancel button hidden again
  function cleanup() {
    cancelButton.setAttribute("hidden", "");
    quill.setText("");
    editButton.removeEventListener("click", edit);
    object.removeEventListener("cancel", cleanup);
    editButton.addEventListener("click", sendFunction);
    editButton.innerText="Send";
    object.shadowRoot.querySelector(".text-box").style.backgroundColor = "#c8e1cc";
    const index = cancellableProcesses.indexOf(object);
    if (index != -1) {
      cancellableProcesses.splice(index, 1);
    }
    console.log("cleanup complete");
  }
}

/**
 * Reply to the object passed to the function as an argument
 */
function replyFunction(object) {
  // Only one cancellableProcess should be active at a time
  notifyCancellableProcesses();
  
  // Scroll to editor
  window.scrollTo(0, document.body.scrollHeight);
  quill.focus();
  
  // Make the cancel button visible
  var cancelButton = document.getElementById("cancel-button");
  cancelButton.removeAttribute("hidden");

  // Skip to cleanup if no reply is done
  cancelButton.addEventListener("click", cleanup);

  // Change the send button to reply 
  var replyButton = document.getElementById("send-button");
  replyButton.innerText = "Reply";
  replyButton.removeEventListener("click", sendFunction);
  replyButton.addEventListener("click", reply);
  object.addEventListener("cancel", cleanup);
  cancellableProcesses.push(object);

  function reply() {
    const newChat = sendFunction(object, object);
    if (!replyMap.has(object)) {
      replyMap.set(object, [newChat]);
    } else {
      replyMap.get(object).push(newChat);
    }
    cleanup();
  }

  // Turn reply button back to send button, clear editor, make cancel button hidden again
  function cleanup() {
    cancelButton.setAttribute("hidden", "");
    quill.setText("");
    replyButton.removeEventListener("click", reply);
    object.removeEventListener("cancel", cleanup);
    replyButton.addEventListener("click", sendFunction);
    replyButton.innerText="Send";
    object.shadowRoot.querySelector(".text-box").style.backgroundColor = "#c8e1cc";
    const index = cancellableProcesses.indexOf(object);
    if (index != -1) {
      cancellableProcesses.splice(index, 1);
    }
    console.log("cleanup complete");
  }
}

function formatForReply(string) {
  if (string.length > 60) {
    return string.slice(0,60) + "..."
  } else if (string.length <= 60) {
    return string
  }
}

export { editFunction, replyFunction, formatForReply };

