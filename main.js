// Web Speech API as supported by major browsers
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const editor = document.getElementById('editor');

const quill = new Quill("#editor", {
  theme: "snow",
});

// Logic for send button
const sendButton = document.getElementById('send-button');
sendButton.addEventListener("click", sendFunction);

// Function for when the send button is clicked
function sendFunction() {
  // Get text from editor as well as date
  const text = quill.getText()
  const currDate = new Date(Date.now());
  quill.setText("");
  console.log(text.trim() + " at " + currDate.toDateString());

  // Initialise chatbox, add dropdown menu
  var chatlog = document.getElementById("chatlog");
  var chatbox = document.createElement("my-chat");
  /** 
  chatbox.innerHTML = `
    <div slot="dropdown" class="col dropdown show">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" name="delete-my-chat" href="#">Delete</a>
            <a class="dropdown-item" href="#">Forward</a>
            <a class="dropdown-item" href="#">Reply</a>
        </div>
    </div>
  `
  */

  var dropdown = document.createElement("div");
  dropdown.setAttribute("slot", "dropdown")
  dropdown.setAttribute("class", "col dropdown show");
  chatbox.appendChild(dropdown);
  //console.log("dropdown created");

  var dropdownButton = document.createElement("button");
  dropdownButton.setAttribute("class", "btn btn-secondary dropdown-toggle");
  dropdownButton.setAttribute("type", "button");
  dropdownButton.setAttribute("id", "dropdownMenuButton");
  dropdownButton.setAttribute("data-toggle", "dropdown");
  dropdownButton.setAttribute("aria-haspopup", "true");
  dropdownButton.setAttribute("aria-expanded", "false");
  dropdown.appendChild(dropdownButton);
  //console.log("dropdownButton created");

  var dropdownMenu = document.createElement("div");
  dropdownMenu.setAttribute("class", "dropdown-menu");
  dropdownMenu.setAttribute("aria-labelledby", "dropdownMenuButton");
  dropdown.appendChild(dropdownMenu);
  //console.log("dropdownMenu created");

  var deleteButton = document.createElement("a");
  deleteButton.setAttribute("class", "dropdown-item");
  deleteButton.setAttribute("href", "#");
  deleteButton.innerText = "Delete";
  dropdownMenu.appendChild(deleteButton);
  deleteButton.addEventListener("click", () => chatbox.remove());

  var forwardButton = document.createElement("a");
  forwardButton.setAttribute("class", "dropdown-item");
  forwardButton.setAttribute("href", "#");
  forwardButton.innerText = "Forward";
  dropdownMenu.appendChild(forwardButton);

  var replyButton = document.createElement("a");
  replyButton.setAttribute("class", "dropdown-item");
  replyButton.setAttribute("href", "#");
  replyButton.innerText = "Reply";
  dropdownMenu.appendChild(replyButton);

  // Create text to go into the slot for actual text of the chat
  var chatText = document.createElement("div");
  chatText.setAttribute("slot", "chatText");
  chatText.appendChild(document.createTextNode(text.trim()));
  chatbox.appendChild(chatText);

  chatlog.appendChild(chatbox);
}

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

//import { Marked } from "marked";

