import BaseComponent from "./../utils/baseComponent";

export default class CounterComponent extends BaseComponent {
  constructor() {
    console.log("1  Counter");
    super();

    // inspired by: https://www.youtube.com/watch?v=AvAv-ObQWg4
  }

  private myShadow: ShadowRoot | null = null;

  private counter = 0;

  public static logMe() {
    // dummy static method to ensure imports exist
    console.log("counter current state");
  }

  increment = () => {
    this.counter++;
    this.build();
  };

  build = () => {
    if (!this.myShadow) {
      return;
    }

    this.myShadow.innerHTML = this.render();
    this.postrender();
  };

  render = () => {
    return `<h1> ${this.counter}</h1>
        <button>add one</button>`;
  };

  postrender = () => {
    this.myShadow?.querySelector("button")?.addEventListener("click", () => {
      this.increment();
    });
  };
  connectedCallback() {
    this.myShadow = this.attachShadow({ mode: "open" }); // closed means it cannot be accessed from the outside
    this.build();
    //   shadow.innerHTML = `
    //        <style>
    //        p {
    //           text-align: center;
    //           font-weight: normal;
    //           padding: 1em;
    //           margin: 0 0 2em 0;
    //           background-color: #eee;
    //           border: 1px solid #666;
    //        }
    //        /* :host styles to be applied (couldnt make it work)  */
    //        :host(.rotate90) {
    //           transform: rotate(90deg);
    //        }
    //        </style>

    //        <p>Hello ${this.name}!</p>`;
    // }
  }
}
// register component
customElements.define("a-counter", CounterComponent);
