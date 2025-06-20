import { getCurrTimeFormatted } from "./modules/utilities/getCurrTimeFormatted.js";

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
      ['clean']
    ]
  }
});

// Logic for send button
const sendButton = document.getElementById('send-button');
sendButton.addEventListener("click", sendFunction);

// Function for when the send button is clicked
function sendFunction() {

  // Retrieve encoding type
  var encodingType = document.getElementById("encoding-dropup").getAttribute("value");

  // Get text from the editor
  var rawtext = quill.getText()
  quill.setText("");
  rawtext = rawtext.trim();

  // Terminate function early if no actual text is sent
  if (rawtext == "") {
    return;
  }

  // Initialise chatbox, add dropdown menu
  var chatlog = document.getElementById("chatlog");
  var chatbox = document.createElement("my-chat");

  // Create Dropdown container
  var dropdown = document.createElement("div");
  dropdown.setAttribute("slot", "dropdown")
  dropdown.setAttribute("class", "col dropdown show");
  chatbox.appendChild(dropdown);
  //console.log("dropdown created");

  // Create Dropdown button
  var dropdownButton = document.createElement("button");
  dropdownButton.setAttribute("class", "btn btn-secondary dropdown-toggle");
  dropdownButton.setAttribute("type", "button");
  dropdownButton.setAttribute("id", "dropdownMenuButton");
  dropdownButton.setAttribute("data-toggle", "dropdown");
  dropdownButton.setAttribute("aria-haspopup", "true");
  dropdownButton.setAttribute("aria-expanded", "false");
  dropdown.appendChild(dropdownButton);
  //console.log("dropdownButton created");

  // Create Dropdown menu
  var dropdownMenu = document.createElement("div");
  dropdownMenu.setAttribute("class", "dropdown-menu");
  dropdownMenu.setAttribute("aria-labelledby", "dropdownMenuButton");
  dropdown.appendChild(dropdownMenu);
  //console.log("dropdownMenu created");

  // Create Edit button
  var editButton = document.createElement("a");
  editButton.setAttribute("class", "dropdown-item");
  editButton.setAttribute("href", "#");
  editButton.innerText = "Edit";
  dropdownMenu.appendChild(editButton);
  editButton.addEventListener("click", () => editFunction(chatbox));

  // Create Delete button
  var deleteButton = document.createElement("a");
  deleteButton.setAttribute("class", "dropdown-item");
  deleteButton.setAttribute("href", "#");
  deleteButton.innerText = "Delete";
  dropdownMenu.appendChild(deleteButton);
  deleteButton.addEventListener("click", () => chatbox.remove());

  // Create Forward button
  var forwardButton = document.createElement("a");
  forwardButton.setAttribute("class", "dropdown-item");
  forwardButton.setAttribute("href", "#");
  forwardButton.innerText = "Forward";
  dropdownMenu.appendChild(forwardButton);

  // Create Reply button
  var replyButton = document.createElement("a");
  replyButton.setAttribute("class", "dropdown-item");
  replyButton.setAttribute("href", "#");
  replyButton.innerText = "Reply";
  dropdownMenu.appendChild(replyButton);


  const html = marked.parse('# Marked in Node.js\n\nRendered by **marked**.');

  // Create text to go into the slot for actual text of the chat
  var chatText = document.createElement("div");
  chatText.setAttribute("slot", "chatText");
  chatText.setAttribute("name", "text");
  
  // Process text based on encoding type selected
  if (encodingType == "Plaintext") {
    chatText.appendChild(document.createTextNode(rawtext));
  } else if (encodingType == "HTML") {
    chatText.innerHTML = rawtext;
  }  else if (encodingType == "Markdown") {
    chatText.innerHTML = marked.parse(rawtext).trim();
  }
  chatbox.appendChild(chatText);

  // Get time, formatted using module
  var time = document.createElement("span");
  time.setAttribute("slot", "time");
  time.setAttribute("name", "time");
  time.innerText = getCurrTimeFormatted();

  chatbox.appendChild(time);
  chatlog.appendChild(chatbox);
}

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

// Edit function
function editFunction(object) {
  // Get the text of the chatbox to be edited, put it in the editor
  var textToEdit = object.querySelector("div[name='text']");
  quill.setText(textToEdit.innerText);  
  
  // Make the cancel button visible
  var cancelButton = document.getElementById("cancel-button");
  cancelButton.removeAttribute("hidden");

  // Skip to cleanup if no edit is done
  cancelButton.addEventListener("click", cleanup);

  // Change the send button to edit button
  var editButton = document.getElementById("send-button");
  editButton.innerText = "Edit";
  editButton.removeEventListener("click", sendFunction);
  editButton.addEventListener("click", edit);

  // Change text in chatbox to edited text, display '(edited)' after time
  function edit() {
    textToEdit.innerText = quill.getText().trim();
    var subtext = object.querySelector("span[name='time']");
    if (subtext.innerText.slice(-8) != "(edited)") {
      subtext.innerText += " (edited)"
    }
    cleanup();
  }

  // Turn edit button back to send button, clear editor, make cancel button hidden again
  function cleanup() {
    cancelButton.setAttribute("hidden", "");
    quill.setText("");
    editButton.removeEventListener("click", edit);
    editButton.addEventListener("click", sendFunction);
    editButton.innerText="Send";
  }
}

export {editFunction};

