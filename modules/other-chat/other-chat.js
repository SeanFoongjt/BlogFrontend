const otherChatTemplate = document.createElement("template");
otherChatTemplate.innerHTML = `
        <head>
            <script src="https://kit.fontawesome.com/986bcdd23b.js" crossorigin="anonymous"></script>
            <link rel="stylesheet" href="myStyle.css">
        </head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <body>
            <div class="container">
                <div class="row justify-content-start">
                    <!--Image of the person being conversed with-->
                    <div class="col">
                        <slot></slot>
                    </div>

                    <!--Box where the actual text goes-->
                    <div class="col-7 border border-1 rounded border-dark pt-2 pb-2 text-box">
                        <span>
                            More reasonable amounts of text
                        </span>
                    </div>

                    <!--empty space at the end-->
                    <div class="col-4">
                    </div>
                </div>

                <!--Placeholder for the timestamp at the bottom-->
                <div class="row justify-content-start">
                    <div class="col-1"></div>
                    <div class="col-7 text-start">
                        <p style="font-size: 12px;">9.00 a.m.</p>
                    </div>
                </div>
            </div>

        
        </body>
`

class OtherChat extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        console.log("Custom element added to webpage");

        let template = otherChatTemplate;
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }
}

customElements.define("other-chat", OtherChat);