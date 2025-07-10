import { readJson, createConversationFromJson } from "./modules/setup/readConversationFromJson.js";
import { createConversation } from "./modules/classes/Conversation.js";


const conversation = createConversation();

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
    encodingType, 
    replyMap,
    isReply
  );

  // Store original html in rawcontentMap
  rawcontentMap.set(newChat, rawHTML);

  // Automatically scroll to bottom
  chatlog.scrollTop = chatlog.scrollHeight;

  return newChat;
}

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