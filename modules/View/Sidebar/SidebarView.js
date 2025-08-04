function SidebarView() {
    const currOrder = [];
    let conversationsElement;
    let activeConversationId = undefined;
    let sidebarController;

    const self = {
        render,
        changeActive,
        setController,
        update
    }

    function setController(controller) {
        sidebarController = controller;
    }



    /**
     * Conversation searchbar logic
     */
    // Have the cancel button reset the searchbar
    const conversationSearchResetButton = document.getElementById("conversation-search-reset");
    const conversationSearchText = document.getElementById("conversation-search-text");
    conversationSearchResetButton.addEventListener("click", () => {
        conversationSearchText.value = "";
        conversationSearchText.focus();
        conversationSearchResetButton.setAttribute("hidden", "true");
    });

    // Ensure cancel button is revealed when there is text in the conversation searchbar
    conversationSearchText.addEventListener("input", (event) => {
        if (event.data != null) {
            conversationSearchResetButton.removeAttribute("hidden");
        } else if (conversationSearchText.value == "") {
            conversationSearchResetButton.setAttribute("hidden", "");
        }
    })




    
    /**
     * Render the list of conversations passed as an argument in the sidebar
     * @param {Array} listOfConversations 
     */
    function render(listOfConversations) {
        Handlebars.registerHelper('isPositive', function (value) {
            return value > 0;
        });

        var elementTemplate = fetch("../../../templates/sidebar-conversations.html")
            .then(res => res.text())
            .then(text => Handlebars.compile(text));

        const container = document.createElement("div");
        container.setAttribute("class", "w-100 h-100 px-2 list-container");
        const list = document.createElement("div");
        list.setAttribute("class", "chat-selection list-group w-100 h-100");
        container.appendChild(list);
        const sidebar = document.querySelector(".sidebar");

        const conversationPromise = Promise.all([elementTemplate]).then(array => {
            let count = 0;
            let currOption;
            for (const conversation of listOfConversations) {
                const sidebarId = count;
                currOption = document.createElement("template");
                conversation["sidebarId"] = sidebarId;
                currOrder.push(conversation);
                currOption.innerHTML = array[0](conversation);
                currOption = currOption.content.firstElementChild;

                currOption.addEventListener("click", () => changeActive(conversation.self, sidebarId));
                list.appendChild(currOption);
                count++;
            }
            sidebar.appendChild(container);
            activeConversationId = 0;
        });

        console.log(currOrder);
        conversationsElement = container;
    }




    function update(currConversation) {
        const newMessage = currConversation.sidebarInformation();
        const currElement = document.querySelector(`.sidebar-id-${activeConversationId}`);
        currElement.querySelector(".latest-message-time").innerText = newMessage.latestMessageTime;
        currElement.querySelector(".latest-message-text").innerText = newMessage.latestMessageText;
        currElement.querySelector(".conversation-title").innerHTML = 
            `<strong>${currConversation.title}</strong>`;
    }

    function changeActive(conversation, sidebarId) {
        sidebarController.changeConversation(conversation)
        activeConversationId = sidebarId;
        console.log(activeConversationId);
    }

    return self
}

export { SidebarView };