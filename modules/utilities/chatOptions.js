import { decodeText, encodeText } from "./encodeText.js";
import { notifyCancellableProcesses } from "../../main.js";

/**
 * Reply to a chat in the chatlog
 * @param {MyChat} object chat being replied to
 */
function replyFunction(object, replyMap) {
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
function deleteFunction(object, replyMap) {
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

export { replyFunction, editFunction, deleteFunction }