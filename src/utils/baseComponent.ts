export default abstract class BaseComponent extends HTMLElement {
  /*
  constructor() {
    super();
  }
    */

  abstract build(): void;

  protected htmlEncode(str: string): string {
    if (!str) {
      return str;
    }
    const textArea = document.createElement("p");
    textArea.textContent = str;
    return textArea.innerHTML;
  }

  //#region Webcomponents

  // connect component
  connectedCallback() {
    console.log("2 base connectCallback");
  }

  disconnectedCallback() {
    console.log("Z base disconnectCallback"); // removed from dom
  }

  // component attributes
  /*  static get observedAttributes() {
    console.log("0 hello-world observedAttributes");
    return ["name"];
  }
   */

  // attribute change
  attributeChangedCallback(property: string, oldValue: any, newValue: any) {
    console.log(
      "attributeChangedCallback " + property + " " + oldValue + " " + newValue
    );

    // for exapmle called when: document.querySelector('my-component').setAttribute('name', 'Everyone');
    if (oldValue === newValue) {
      return;
    }
    const me: any = this;
    me[property] = newValue;

    this.build();
  }

  adoptedCallback() {
    console.log("xx base adoptedCallback"); // moved from one doc to another (????)
  }

  //#endregion
}
