import { ChatlogController } from "./ChatlogController.js";
import { EditorController } from "./EditorController.js";
import { TitleSectionController } from "./TitleSectionController.js";
import { encodeText } from "../../utilities/encodeText.js";
import { MessageFactory } from "../../Model/MessageModel.js";


function MainWindowController(parent) {
    const self = {
        initialise,
        setView,
        sendFunction,
        editFunction,
        replyFunction,
        deleteFunction,
        forwardFunction,
        changeTitle,
        notifyCancellableProcesses : parent.notifyCancellableProcesses,
        pushCancellableProcess : parent.pushCancellableProcess,
        removeFromCancellableProcesses : parent.removeFromCancellableProcesses,
        cancellableProcessesLength : parent.cancellableProcessesLength,
        clearActiveConversation : parent.clearActiveConversation,
        block,
        unblock,
        changeConversation
    }


    const titleSectionController = TitleSectionController(self);
    const chatlogController = ChatlogController(self);
    const editorController = EditorController(self);
    const quill = editorController.getEditor();
    let messageFactory;
    let mainWindowView;


    function setView(view) {
        mainWindowView = view;
        const views = mainWindowView.getViews();
        titleSectionController.setView(views[0]);
        view.setController(self);
        chatlogController.setView(views[1]);
        editorController.setView(views[2]);
        messageFactory = MessageFactory(views[1]);
    }



    // Keeps track of what was in the editor when the message was sent for purposes of edit
    // May need reworking consider safety issues
    const rawcontentMap = new Map();


    function changeTitle(newTitle) {
        parent.activeConversation.changeTitle(newTitle);
        parent.updateSidebarConversation(parent.activeConversation);
    }


    /**
     * Initialise the controller with a given conversation
     * @param {ConversationModel} mainConversation main conversation to initialise with
     */
    function initialise(mainConversation) {
        // Render the conversation and add to rawcontentMap for editFunction
        const chatboxes = mainWindowView.render(mainConversation);
        for (const i in chatboxes) {
            rawcontentMap.set(chatboxes[i], mainConversation.getListOfMessages()[i].rawHTML)
        }
    }


    function changeConversation(newConversation) {
        // blank space with a height of 5px to provide padding to the top of the chatlog
        const blankSpace = document.createElement("div");
        blankSpace.setAttribute("class", "blank-space");
        document.getElementById("chatlog").replaceChildren();
        document.getElementById("chatlog").appendChild(blankSpace);

        const chatboxes = mainWindowView.render(newConversation);
        rawcontentMap.clear();
        for (const i in chatboxes) {
            rawcontentMap.set(chatboxes[i], newConversation.getListOfMessages()[i].rawHTML);
        }
    }
    

    /**
     * Edit a chatbox in the chatlog
     * @param {MyChat} object chatbox to be edited
     */
    function editFunction(object) {
        // Cancel other potentially interfering processes
        parent.notifyCancellableProcesses();

        // Push self to cancellableProcesses
        parent.pushCancellableProcess(object);

        // Get previous encoding
        const textbox = object.shadowRoot.querySelector(".text-box")
        const chatText = object.querySelector("div[name='text']");
        const prevEncoding = chatText.getAttribute("data-encoding");

        // Display the editor if it is not showing
        editorController.show();

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
            const conversationId = object.getAttribute("conversation-id");


            // Terminate function early if no actual text is in the editor
            if (quill.getText().trim() == "" && quill.getContents()["ops"].length == 1) {
                console.log("terminated early due to no text");
                cleanup();
                return;
            }
            
            // TODO check if text and encoding are the same
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

            parent.activeConversation.editMessage(
                conversationId, quill.getText().trim(), quill.root.innerHTML,
                currEncoding.getAttribute("value")
            )
            chatText.setAttribute("data-encoding", currEncoding.getAttribute("value"));
            parent.updateSidebarConversation(parent.activeConversation);
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

            parent.removeFromCancellableProcesses(object);
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
        parent.notifyCancellableProcesses();

        parent.pushCancellableProcess(object);

        // Show editor if it is not currently displayed
        editorController.show();
        
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

            parent.removeFromCancellableProcesses(object);
            console.log("cleanup complete");
        }
    }




    /**
     * Delete a chat box from the chatlog
     * @param {MyChat} object object to be deleted
     */
    function deleteFunction(object) {
        parent.notifyCancellableProcesses();

        parent.activeConversation.deleteMessage(object.getAttribute("conversation-id"));
        parent.updateSidebarConversation(conversation);

        object.remove();
    }




    /**
     * Send a chat in the conversation
     * @param {Event} event FIGURE OUT WHAT HAPPENED HERE
     * @param {boolean} isReply boolean determining whether the chat is a reply to another chat
     * @returns 
     */
    function sendFunction(event, isReply=false) {
        console.log("test");
        // Retrieve encoding type
        var encodingType = document.getElementById("encoding-dropup").getAttribute("value");

        // Get text from the editor
        var rawtext = quill.getText()
        var contents = quill.getContents();
        var rawHTML = quill.root.innerHTML;
        quill.setText("");
        rawtext = rawtext.trim();

        // Terminate function early if no actual text is sent
        if (rawtext == "" && contents["ops"].length == 1) {
            console.log("terminated early");
            return;
        }

        console.log("Available id : " + parent.activeConversation.availableId);
        // use createConversation to create html component
        const [newChat, newElement] = messageFactory.createSentMessage(
            rawHTML.trim(), 
            Date(Date.now()),
            encodingType, 
            isReply,
            rawtext,
            parent.activeConversation.availableId,
            false
        );

        if (!isReply) {
            parent.activeConversation.addMessage(newChat);
        } else {
            parent.activeConversation.addMessage(newChat, isReply.getAttribute("conversation-id"));
        }

        // Store original html in rawcontentMap
        rawcontentMap.set(newElement, rawHTML);

        parent.updateSidebarConversation(parent.activeConversation);

        return newChat;
    }





    /**
     * Function to forward a message to another conversation
     * @param {HTMLElement} messageElement HTMLElement of the message to be forwarded
     */
    function forwardFunction(messageElement) {
        // Popup and confirm button of the popup initialisation
        const forwardingPopup = document.getElementById("forwarding-popup-modal");
        const confirmButton = forwardingPopup.querySelector("[name='confirm']");

        // Add event listener, get the message model via the id of the element
        confirmButton.addEventListener("click", forward);
        forwardingPopup.addEventListener("hidden.bs.modal", cleanup);
        const messageList = parent.activeConversation.getListOfMessages()
        const message = messageList.find(
            chat => chat.id == messageElement.getAttribute("conversation-id")
        );

        let titleList = [];

        // Create a copy of the message and set the ForwardedFrom attribute
        const messageToForward = message.copy();
        messageToForward.type = "my-chat";
        messageToForward.forwardedFrom = parent.activeConversation.title;
        messageToForward.time = Date(Date.now());
        console.log(messageToForward);


        function forward() {
            // Collect titles of ticked conversations into titleList
            for (const child of forwardingPopup.querySelector(".list-group").children) {
                if (child.querySelector("[type='checkbox']").checked == true) {
                    titleList.push(child.querySelector(".conversation-title").innerText);
                }
            }

            // Invoke forwardMessagesByTitle in the ModelManager
            const conversationList = 
                parent.model.forwardMessagesByTitle(messageToForward, titleList);

            // Change conversation to the last conversation message is forwarded to
            parent.changeSidebarConversation(conversationList[conversationList.length - 1]);
            for (const conversation of conversationList) {
                parent.updateSidebarConversation(conversation);
            }
            


            cleanup();
        }

        function cleanup() {
            // Remove the forward function from the confirm button, reset titleList and checkboxes
            confirmButton.removeEventListener("click", forward);
            forwardingPopup.removeEventListener("hide.bs.modal", cleanup);
            titleList = [];
            for (const child of forwardingPopup.querySelector(".list-group").children) {
                child.querySelector("[type='checkbox']").checked = false;
            }
        }
    }




    // Block the current conversation
    function block() {
        parent.activeConversation.block();
        mainWindowView.renderBlocked();
    }

    // Unblock the current conversation
    function unblock(prevHeight) {
        parent.activeConversation.unblock();
        mainWindowView.renderUnblocked(prevHeight);
    }


    return self;

}

export { MainWindowController };