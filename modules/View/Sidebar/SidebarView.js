function SidebarView() {
    
    const currOrder = [];

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
            for (const conversation of listOfConversations) {
                currOrder.push(conversation);
                conversationsHTML = conversationsHTML.concat(array[0](conversation));
            }
            conversationsHTML = conversationsHTML.concat("</div>");
            container.innerHTML = conversationsHTML;
            sidebar.appendChild(container);
        });
    }

    function update() {

    }

    function changeActive(index) {

    }

    return {
        render,
        changeActive
    }
}

export { SidebarView };