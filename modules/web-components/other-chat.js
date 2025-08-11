const otherChatTemplate = document.createElement("template");
otherChatTemplate.innerHTML = `
    <head>
        <link rel="stylesheet" href="my-style.css">
    </head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <body>
        <div class="">
            <div class="justify-content-start d-flex">
                <!--Image of the person being conversed with-->
                <div class="pe-2">
                    <slot name="image"></slot>
                </div>

                <div class="d-flex flex-column">
                    <div class="d-flex flex-row align-items-center">
                        <!--Box where the actual text goes-->
                        <div class="border-1 rounded border-dark py-2 px-3 other-text-box text-box flex-shrink-1">
                            <slot name="chatText">
                            </slot>
                        </div>

                        <slot name="dropdown"></slot>
                    </div>

                    <div class="row justify-content-start">
                        <div class="text-start">
                            <p style="font-size: 12px; margin-bottom:5px;"><slot name="time"></slot></p>
                        </div>
                    </div>
                </div>
                
                
            </div>
        </div>
    </body>
`

class OtherChat extends HTMLElement {
    constructor() {
        super();
        console.log("other-chat element added to webpage");

        let template = otherChatTemplate;
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {
    }
}

customElements.define("other-chat", OtherChat);