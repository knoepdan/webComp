import BaseComponent from "./utils/baseComponent";
import LayerImageComponent from "./layerImgComponent";

LayerImageComponent.logMe();

export default class StackComponent extends BaseComponent {
  private myShadow: ShadowRoot | null = null;

  build = () => {
    if (!this.myShadow) {
      console.log("stack called without shadow");
      return;
    }

    this.myShadow.innerHTML = this.render();
    this.postrender();
  };

  render = () => {
    return `
        <div style="display:flex; flex-direction: row; flex-wrap: wrap; gap: 50px;">
          <slot></slot>
        </div>`;
  };

  postrender = () => {
    /// this.myShadow?.querySelector("button")?.addEventListener("click", () => {
    ///   this.increment();
    /// });
  };
  connectedCallback() {
    this.myShadow = this.attachShadow({ mode: "open" }); // closed means it cannot be accessed from the outside
    this.build();
  }
  //#region static webcomponent methods

  static get observedAttributes() {
    return [];
  }

  //#endregion

  //#region static methods
  public static logMe() {
    // dummy static method to ensure imports exist
    console.log("stack components");
  }

  //#endregion
}
// register component
customElements.define("a-stack", StackComponent);
