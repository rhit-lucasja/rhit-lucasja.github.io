/*
 * CITATION: Got the idea to create reusable navbar and footer components from the process indicated below.
 *
 * Google Search: how do I create a navbar in html and reuse it across pages in a raw html/js/css site -ai
 * 
 * Solution based off info at URL: https://www.reddit.com/r/Frontend/comments/v2lqvv/begginer_question_how_to_write_reusable_part_of_a/
 * And URL: https://medium.com/@anuradha.mcs18.du/create-reusable-web-components-in-html-897ef9e72811
 * 
 */

const navTemplate = document.createElement("template");
navTemplate.innerHTML = `
    <style>
        .toolbar {
            background-color: darkred;
            padding: 8px;
            margin: 4px;

            a {
                color: white;
                padding: 0 8px;
                text-decoration: none;
            }

            a:hover {
                color: lightgray;
                cursor: pointer;
                text-decoration: underline;
            }

            a:visited {
                color: lightgray;
            }
        }
    </style>

    <nav class="toolbar">
        <a href="index.html">Home</a>
        <a href="resume.html">My Credentials</a>
        <a href="portfolio.html">My Projects</a>
    </nav>
`;

class CustomNavbar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(navTemplate.content);
    }
}

window.customElements.define("custom-navbar", CustomNavbar);

const footTemplate = document.createElement("template");
footTemplate.innerHTML = `
    <style>
        .toolbar {
            background-color: darkred;
            padding: 8px;
            margin: 4px;

            a {
                color: white;
                padding: 0 8px;
                text-decoration: none;
            }

            a:hover {
                color: lightgray;
                cursor: pointer;
                text-decoration: underline;
            }

            a:visited {
                color: lightgray;
            }
        }
    </style>

    <div class="toolbar">
        <a href="https://www.linkedin.com/in/jack-lucas-82087a328">LinkedIn Profile</a>
        <a href="https://app.joinhandshake.com/profiles/bd69k6">Handshake Profile</a>
        <a href="https://github.com/rhit-lucasja">GitHub Profile</a>
    </div>
`;

class CustomFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(footTemplate.content);
    }
}

window.customElements.define("custom-footer", CustomFooter);