const myChatTemplate = document.createElement("template");
myChatTemplate.innerHTML = `
        <script src="https://kit.fontawesome.com/986bcdd23b.js" crossorigin="anonymous"></script>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <link rel="stylesheet" href="my-style.css">
        <div class="row" name="replyBanner" hidden>
            <div class="col-5"></div>
            <div class="col-7">
                <slot name="replyingToIcon"></slot>
                <span style="font-size:14px;" name="replyText">Placeholder text</span>
            </div>
        </div>
        <div class="row justify-content-end">
            <!--Empty space padding-->
            <div class="col-4"></div>

            <!--Slot for dropdown button-->
            <slot name="dropdown"></slot>

            <!--Actual text goes here-->
            <div class="col-7 border border-1 rounded border-dark pt-2 pb-2 my-text-box text-box" name="text-box">
                <slot name="chatText"></slot>
            </div>
        </div>

        <!--Timestamp-->
        <div class="row justify-content-end">
            <div class="col-6 text-end">
                <p style="font-size: 12px;" name="time"><slot name="time">9.00 a.m.</slot></p>
            </div>
        </div>
`

class MyChat extends HTMLElement {
    constructor() {
        super();

        console.log("my-chat element added to webpage");

        let template = myChatTemplate;
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {
    }
}

customElements.define("my-chat", MyChat);