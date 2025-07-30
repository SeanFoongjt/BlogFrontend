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
        let conversationsHTML = `
            <div class="chat-selection list-group w-100 h-100">
        `;
        const sidebar = document.querySelector(".sidebar");

        const conversationPromise = Promise.all([elementTemplate]).then(array => {
            let sidebarId = 0;
            for (const conversation of listOfConversations) {
                conversation["sidebarId"] = sidebarId;
                currOrder.push(conversation);
                conversationsHTML = conversationsHTML.concat(array[0](conversation));
                sidebarId++;
            }
            conversationsHTML = conversationsHTML.concat("</div>");
            container.innerHTML = conversationsHTML;
            sidebar.appendChild(container);
            activeConversationId = 0;
        });

        conversationsElement = container;
    }




    function update(currConversation) {
        const newMessage = currConversation.sidebarInformation();
        const currElement = document.querySelector(`.sidebar-id-${activeConversationId}`);
        currElement.querySelector(".latest-message-time").innerText = newMessage.latestMessageTime;
        currElement.querySelector(".latest-message-text").innerText = newMessage.latestMessageText;
    }

    function changeActive(index) {

    }

    return self
}

export { SidebarView };