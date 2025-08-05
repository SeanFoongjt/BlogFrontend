function SidebarView() {
    const currOrder = [];
    let conversationsElement;
    let activeConversationId = 0;
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

        var container;
        if (conversationsElement == undefined) {
            container = document.createElement("div");
        } else {
            container = conversationsElement;
            console.log(container);
            container.replaceChildren();
        }
        
        container.setAttribute("class", "w-100 h-100 px-2 list-container");
        const list = document.createElement("div");
        list.setAttribute("class", "chat-selection list-group w-100 h-100");
        container.appendChild(list);
        const sidebar = document.querySelector(".sidebar");

        const conversationPromise = Promise.all([elementTemplate]).then(array => {
            let currOption;
            for (const conversation of listOfConversations) {
                currOption = document.createElement("template");
                currOrder.push(conversation);
                currOption.innerHTML = array[0](conversation);
                currOption = currOption.content.firstElementChild;

                currOption.addEventListener("click", () => changeActive(conversation.self));
                console.log(currOption);
                list.appendChild(currOption);
            }
            sidebar.appendChild(container);

            const currActive = document.querySelector(`.sidebar-id-${activeConversationId}`);
            if (currActive != undefined) {
                currActive.classList.add("active-css");
            }
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

    function changeActive(conversation) {
        sidebarController.changeConversation(conversation)
        document.querySelector(`.sidebar-id-${activeConversationId}`).classList.remove("active-css");
        activeConversationId = conversation.conversationId;
        document.querySelector(`.sidebar-id-${activeConversationId}`).classList.add("active-css");
        
        console.log(activeConversationId);
    }

    return self
}

export { SidebarView };