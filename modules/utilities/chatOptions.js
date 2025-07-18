import { displayEditor, pushCancellableProcess, quill, rawcontentMap, removeFromCancellableProcesses, cancelEvent, notifyCancellableProcesses} from "../../main.js";
import { encodeText } from "./encodeText.js";
import { createConversation } from "./createConversation.js";



console.log(document.querySelector("div.ql-editor.ql-blank"));
const quill2 = document.getElementsByClassName("ql-editor");
console.log(quill2);
console.log(quill2.item(1));

// Keeps track of which objects are referenced in other chats reply banners. Key is the chat
// referenced whereas values are the chats referencing / replying to the key
const replyMap = new Map();

/**
 * Edit a chatbox in the chatlog
 * @param {MyChat} object chatbox to be edited
 */
function editFunction(object) {
    // Cancel other potentially interfering processes
    notifyCancellableProcesses();

    // Push self to cancellableProcesses
    pushCancellableProcess(object);

    // Get previous encoding
    const textbox = object.shadowRoot.querySelector(".text-box")
    const chatText = object.querySelector("div[name='text']");
    const prevEncoding = chatText.getAttribute("data-encoding");

    // Display the editor if it is not showing
    displayEditor();

    // Get the text of the chatbox from rawcontentMap to be edited, put it in the editor
    var textToEdit = object.querySelector("div[name='text']");
    quill.root.innerHTML = rawcontentMap.get(object);
    console.log("Quill: " + quill.root.innerHTML);
    console.log("Actual: " + textToEdit.innerHTML);

    // Highlight text currently being edited, record previous background color
    var prevBackground = textbox.style.backgroundColor;
    object.shadowRoot.querySelector(".text-box").style.backgroundColor = "#EBC5CD";
    
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
                chat
                    .shadowRoot
                    .querySelector("span[name='replyText']")
                    .innerText = formatForReply(rawText);
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

        removeFromCancellableProcesses(object);
        console.log("cleanup complete");
    }
}




/**
 * Reply to a chat in the chatlog
 * @param {MyChat} object chat being replied to
 */
function replyFunction(object) {
    console.log("Enter replyFunction");
    // Only one cancellableProcess should be active at a time
    notifyCancellableProcesses();

    pushCancellableProcess(object);

    // Show editor if it is not currently displayed
    displayEditor();
    
    // Make the cancel button visible
    var cancelButton = document.getElementById("cancel-button");
    cancelButton.removeAttribute("hidden");

    // Skip to cleanup if no reply is done
    cancelButton.addEventListener("click", cleanup);
    console.log("Step 1");

    // Change the send button to reply 
    var replyButton = document.getElementById("send-button");
    replyButton.innerText = "Reply";
    replyButton.removeEventListener("click", sendFunction);
    replyButton.addEventListener("click", reply);
    object.addEventListener("cancel", cleanup);


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

        removeFromCancellableProcesses(object);
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

    // Some bug, probably has to do with async shenanigans
    // Automatically scroll to bottom
    chatlog.scrollTo(0, chatlog.scrollHeight);

    return newChat;
}

export { editFunction, replyFunction, deleteFunction, sendFunction, cancelEvent }