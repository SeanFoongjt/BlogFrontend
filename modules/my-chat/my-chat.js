const myChatTemplate = document.createElement("template");
myChatTemplate.innerHTML = `
        <script src="https://kit.fontawesome.com/986bcdd23b.js" crossorigin="anonymous"></script>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <link rel="stylesheet" href="myStyle.css">
        <div class="row justify-content-end">
            <!--Empty space padding-->
            <div class="col-4"></div>

            <!--Dropdown button-->
            <div class="col dropdown show">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#">Block</a>
                    <a class="dropdown-item" href="#">Clear Conversation</a>
                    <a class="dropdown-item" href="#">Close Conversation</a>
                </div>
            </div>

            <!--Actual text goes here-->
            <div class="col-7 border border-1 rounded border-dark pt-2 pb-2 text-box">
                <span>
                    Placeholder text here, testing overflow overflow overflow overflow
                    Placeholder text here, testing overflow overflow overflow overflow
                </span>
            </div>
        </div>

        <!--Timestamp-->
        <div class="row justify-content-end">
            <div class="col-6 text-end">
                <p style="font-size: 12px;">9.00 a.m.</p>
            </div>
        </div>
`

class MyChat extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        console.log("Custom element added to webpage");

        let template = myChatTemplate;
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }
}

customElements.define("my-chat", MyChat);