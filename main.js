import { MasterController } from "./modules/Controller/MasterController.js";
 
/**
 * Launch app
 */
const controller = MasterController("./json/storage.json");

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