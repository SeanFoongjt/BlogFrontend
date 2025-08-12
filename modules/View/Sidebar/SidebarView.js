/**
 * Function to create the Sidebar View object as well as all its related functions / fields
 * @returns object corresponding to the sidebar view of the chat
 */
function SidebarView() {
    let currOrder = [];
    let list;
    let activeConversationId = 0;
    let sidebarController;
    let elementTemplate;

    const self = {
        render,
        changeActive,
        setController,
        update,
        closeConversation,
        initialise
    }

    /**
     * Function to set controller of the view, used during intiialisation
     * @param {SidebarController} controller 
     */
    function setController(controller) {
        sidebarController = controller;
    }

    /**
     * Initialise templates, helpers and fields as well as render the intiial list of conversations
     * @param {Array} conversationList list of conversations to be rendered in the sidebar
     */
    function initialise(conversationList) {
        // Handlebars helper for checking if a value is positive
        Handlebars.registerHelper('isPositive', function (value) {
            return value > 0;
        });

        // Handlebars helper for checking if a value is defined
        Handlebars.registerHelper('isDefined', function (value) {
            return value != undefined;
        });

        // fetch template for the sidebar tab
        elementTemplate = fetch("../../../templates/sidebar-conversations.html")
            .then(res => res.text())
            .then(text => Handlebars.compile(text));
    

        // Initialise container and list-group that will hold the tabs
        const container = document.createElement("div");
        container.setAttribute("class", "w-100 h-100 px-2 list-container");
        const sidebar = document.querySelector(".sidebar");
        sidebar.appendChild(container);

        list = document.createElement("div");
        list.setAttribute("class", "chat-selection list-group w-100 h-100");
        container.appendChild(list);
    

        // Assign Handlebars template to elementTemplate, render initial sidebar
        elementTemplate.then(item => {
            elementTemplate = item; 
            render(conversationList);
        });
    }

    
    /**
     * Render the list of conversations passed as an argument in the sidebar
     * @param {Array} listOfConversations 
     */
    function render(listOfConversations) {
        // empty list-group 
        list.replaceChildren();

        let currOption;
        for (const conversation of listOfConversations) {
            // Populate currOrder
            currOrder.push(conversation);

            // make currOption a template element and make its inner HTML the filled in
            // Handlebars template
            currOption = document.createElement("template");
            currOption.innerHTML = elementTemplate(conversation);

            // Reassign currOption's first child, which is now a valid HTMLElement corresponding
            // to the Handlebars template / conversation tab, to currOption
            currOption = currOption.content.firstElementChild;

            // Add event listener to the tab to change conversation on click
            currOption.addEventListener("click", () => {
                // Change conversation if different conversation is selected or if on mobile
                if (activeConversationId != conversation.conversationId ||
                    document.querySelector(".chat-container").style.display == "none"
                ) {
                    sidebarController.changeConversation(conversation.self)
                }
            });
            
            // Add the tab to the list
            list.appendChild(currOption);
        }
        

        // Change css of active conversation to make it look active
        const currActive = document.querySelector(`.sidebar-id-${activeConversationId}`);
        if (currActive != undefined) {
            currActive.classList.add("active-css");
        }
    }


    /**
     * Function to update the sidebar tab of a conversation to reflect new information
     * @param {ConversationModel} conversation conversation corresponging to the tab to be updated
     */
    function update(conversation) {
        const newMessage = conversation.sidebarInformation();
        const currElement = document.querySelector(`.sidebar-id-${conversation.conversationId}`);

        if (newMessage.latestMessageTime == undefined) {
            currElement.querySelector(".latest-message-time").setAttribute("hidden","");
        } else {
            currElement.querySelector(".latest-message-time").removeAttribute("hidden");
            currElement.querySelector(".latest-message-time").innerText = newMessage.latestMessageTime;
        }

        if (newMessage.latestMessageText == undefined) {
            currElement.querySelector(".latest-message-text").setAttribute("hidden", "");
        } else {
            currElement.querySelector(".latest-message-text").removeAttribute("hidden");
            currElement.querySelector(".latest-message-text").innerText = newMessage.latestMessageText;
        }
        
        
        currElement.querySelector(".conversation-title").innerHTML = 
            `<strong>${conversation.title}</strong>`;
    }

    /**
     * Function to change the active conversation. Generally just a change in css
     * @param {ConversationModel} conversation conversationModel that the active conversation
     * is to be changed into
     */
    function changeActive(conversation) {
        document.querySelector(`.sidebar-id-${activeConversationId}`).classList.remove("active-css");
        activeConversationId = conversation.conversationId;
        document.querySelector(`.sidebar-id-${activeConversationId}`).classList.add("active-css");
        
        console.log(activeConversationId);
    }

    /**
     * Function to close the conversation. For the sidebar view this involves primarily the 
     * deletion of the tab that would have allowed access to the conversation
     */
    function closeConversation(conversation) {
        document.querySelector(`.sidebar-id-${conversation.conversationId}`).remove();
        currOrder = currOrder.filter(item => item.conversationId != conversation.conversationId);

        activeConversationId = currOrder[0].conversationId;
    }

    return self
}

export { SidebarView };