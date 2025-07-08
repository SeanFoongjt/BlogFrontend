import { readJson, createConversationFromJson } from "./modules/setup/readConversationFromJson.js";
import { createConversation } from "./modules/utilities/createConversation.js";
import { decodeText, encodeText } from "./modules/utilities/encodeText.js";

/**
 * Setup logic
 */
// Keeps track of currently executing processes that can be cancelled
const cancelEvent = new Event("cancel");
const cancellableProcesses = [];
function notifyCancellableProcesses() {
  cancellableProcesses.forEach((process) => process.dispatchEvent(cancelEvent));
}

// Keeps track of which objects are referenced in other chats reply banners. Key is the chat
// referenced whereas values are the chats referencing / replying to the key
const replyMap = new Map();
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
  var inputContainer = document.getElementById("conversationTitleInputContainer");
  conversationTitleInput.value = conversationTitle.innerText;
  conversationTitleInput.innerText = conversationTitle.innerText;
  console.log("Input value: " + conversationTitleInput.value);
  console.log("Inner text: " + conversationTitleInput.innerText);
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
      console.log(conversationTitle.innerText);
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
  // Hide prompt, show and focus on editor
  editorToolbarContainer.removeAttribute("hidden");
  bottomToolbar.removeAttribute("hidden");
  editorPrompt.setAttribute("hidden", "");
  quill.focus();
  isEditorShowing = true;

  // Adjust height of chatlog
  chatlog.style.height = "62%";
  chatlog.style.maxHeight = "62%";
  chatlog.scrollTop = chatlog.scrollTop + editorToolbarContainer.offsetHeight;

  // Add listeners to chatlog and title section to hide editor when they are clicked
  chatlog.addEventListener("click", hideEditor);
  document.getElementById("textlog").addEventListener("click", hideEditor);
}

/**
 * Hide editor, reverting back to a prompt to open the editor
 * @returns 
 */
function hideEditor() {
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

const resizeObserver = new ResizeObserver((entries) => {
  const resizeChatSize = (newHeight) => {
    console.log("test: " + `${Math.round(newHeight)}px`);
    document.getElementById("chatlog").style.height = 
      `calc(62% + 100px - ${Math.round(newHeight)}px)`;
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
 * Send a chat in the conversation
 * @param {Event} event FIGURE OUT WHAT HAPPENED HERE
 * @param {boolean} isReply boolean determining whether the chat is a reply to another chat
 * @returns 
 */
function sendFunction(event, isReply=false) {
  // Retrieve encoding type
  var encodingType = document.getElementById("encoding-dropup").getAttribute("value");

  // Get text from the editor
  var rawtext = quill.getText()
  var contents = quill.getContents();
  console.log(quill.root.innerHTML);
  console.log(quill.getSemanticHTML());
  console.log(quill.getContents());
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

  // Store original html in rawcontentMap
  rawcontentMap.set(newChat, rawHTML);

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

/**
 * Edit a chatbox in the chatlog
 * @param {MyChat} object chatbox to be edited
 */
function editFunction(object) {
  // Cancel other potentially interfering processes
  notifyCancellableProcesses();

  // Get previous encoding
  const textbox = object.shadowRoot.querySelector(".text-box")
  const chatText = object.querySelector("div[name='text']");
  const prevEncoding = chatText.getAttribute("data-encoding");

  // Display the editor if it is not showing
  if (!isEditorShowing) {
    displayEditor();
  }

  // Get the text of the chatbox from rawcontentMap to be edited, put it in the editor
  var textToEdit = object.querySelector("div[name='text']");
  quill.root.innerHTML = rawcontentMap.get(object);
  console.log("Quill: " + quill.root.innerHTML);
  console.log("Actual: " + textToEdit.innerHTML);

  // Highlight text currently being edited, record previous background color
  var prevBackground = textbox.style.backgroundColor;
  object.shadowRoot.querySelector(".text-box").style.backgroundColor = "#EBC5CD";
  
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

  // Set appropriate encoding type 
  const currEncoding = document.getElementById("encoding-dropup");
  document.getElementById("encoding-dropup-label").innerText = prevEncoding;
  currEncoding.setAttribute("value", prevEncoding);

  // Push self to cancellableProcesses
  cancellableProcesses.push(object);
  console.log(cancellableProcesses);

  // Change text in chatbox to edited text, display '(edited)' after time
  function edit() {
    // Terminate function early if no actual text is in the editor
    if (quill.getText().trim() == "" && quill.getContents()["ops"].length == 1) {
      console.log("terminated early due to no text");
      cleanup();
      return;
    }
    
    // TODO check if text and encoding are the same
    console.log(currEncoding.getAttribute("value"));
    rawcontentMap.set(object, quill.root.innerHTML);
    
    // encode contents of quill editor and put it into the edited chat
    textToEdit.innerHTML = encodeText(
      quill.root.innerHTML, 
      currEncoding.getAttribute("value")
    );

    // Add the '(edited)' subtext next to time of sending the chat
    var subtext = object.querySelector("span[name='time']");
    if (subtext.innerText.slice(-8) != "(edited)") {
      subtext.innerText += " (edited)"
    }

    // Check if the object is referenced in the reply banner of other chats. If yes,
    // change text in these reply banners as appropriate
    if (replyMap.has(object)) {
      replyMap
        .get(object)
        .forEach((chat) => {
          console.log(chat);
          const rawText = quill.getText().trim();
          chat.shadowRoot.querySelector("span[name='replyText']").innerText = formatForReply(rawText);
        });
    }

    chatText.setAttribute("data-encoding", currEncoding.getAttribute("value"));
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

    // Revert chat's background color
    object.shadowRoot.querySelector(".text-box").style.backgroundColor = prevBackground;

    // Remove from cancellableProcesses record as it is no longer in the midst of execution
    const index = cancellableProcesses.indexOf(object);
    if (index != -1) {
      cancellableProcesses.splice(index, 1);
    }
    console.log("cleanup complete");
  }
}

/**
 * Reply to a chat in the chatlog
 * @param {MyChat} object chat being replied to
 */
function replyFunction(object) {
  // Only one cancellableProcess should be active at a time
  notifyCancellableProcesses();

  // Show editor if it is not currently displayed
  if (!isEditorShowing) {
    displayEditor();
  }
  
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
    // Terminate function early if no actual text is sent
    if (quill.getText().trim() == "" && quill.getContents()["ops"].length == 1) {
      console.log("terminated early");
      cleanup();
      return;
    }

    // No event to be sent, but there is object to be replied to
    const newChat = sendFunction(null, object);

    // Have message replied to keep track of how many other messages reference it
    // to change text if an edit is done.
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

    // Remove from cancellableProcesses record as it is no longer in the midst of execution
    const index = cancellableProcesses.indexOf(object);
    if (index != -1) {
      cancellableProcesses.splice(index, 1);
    }
    console.log("cleanup complete");
  }
}

/**
 * Delete a chat box from the chatlog
 * @param {MyChat} object object to be deleted
 */
function deleteFunction(object) {
  notifyCancellableProcesses();

  // Check if object to be deleted is referenced in the reply banners of other chats
  if (replyMap.has(object)) {
    replyMap
      .get(object)
      .forEach((chat) => {
        console.log(chat);
        const replyText = chat.shadowRoot.querySelector("span[name='replyText']");

        // If so, replace all these references to a 'Message Deleted' text that is italic and
        // faded in color
        replyText.innerText = "Message Deleted";
        replyText.style.fontStyle = "italic";
        replyText.style.color = "#bebebe";
    });
  }
  object.remove();
}

export { editFunction, replyFunction, deleteFunction};

