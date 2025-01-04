class AppComponent extends HTMLElement {
  name: string;
  constructor() {
    console.log("1 hello-world constructor");
    super();
    this.name = "World";
  }
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "closed" }); // closed means it cannot be accessed from the outside
    shadow.innerHTML = `
         <style>
         p {
            text-align: center;
            font-weight: normal;
            padding: 1em;
            margin: 0 0 2em 0;
            background-color: #eee;
            border: 1px solid #666;
         }
         /* :host styles to be applied (couldnt make it work)  */
         :host(.rotate90) {
            transform: rotate(90deg);
         }
         </style>

         <p>Hello ${this.name}!</p>`;
  }
}
// register component
customElements.define("a-app", AppComponent);
