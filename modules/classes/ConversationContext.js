import { DateTimeFormatting } from ".,/utilities/DateTimeFormatting.js";
import { timeLog } from "console";
import { editFunction, replyFunction, deleteFunction } from "../utilities/chatOptions.js";
import { encodeText } from "../utilities/encodeText.js";


function createConversationContext(conversation, chatlog, editor, titleSection) {
    return {
        conversation,
        chatlog,
        editor,
        titleSection
    }
}