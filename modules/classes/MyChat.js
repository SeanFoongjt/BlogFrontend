import { createChat } from "./ConversationContext.js"

function createMyChat(editorHTML, context) {
    const chat = createChat();
    const replyMap = new Map();

    /**
     * Reply to this chat
     */
    function reply() {
        // Only one cancellableProcess should be active at a time
        conversation.notifyCancellableProcesses();

        // Show editor if it is not currently displayed
        if (!conversation.isEditorShowing) {
            conversation.displayEditor();
        }

        function sendReply(editor) {
            // Terminate function early if no actual text is sent
            if (editor.getText().trim() == "" && editor.getContents()["ops"].length == 1) {
                console.log("terminated early");
                cleanup();
                return;
            }

            // No event to be sent, but there is object to be replied to
            const newChat = editor.send(null, this);

            // Have message replied to keep track of how many other messages reference it
            // to change text if an edit is done.
            if (!replyMap.includes(object)) {
                replyMap.set(object, [newChat]);
            } else {
                replyMap.get(object).push(newChat);
            }
        }

        editor.replyMode(sendReply);
    }

    return {

        __proto__: context
    }
}