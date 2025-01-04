import BaseComponent from "./utils/baseComponent";
import LayerImageComponent from "./layerImgComponent";
import { nameof } from "./utils/nameOf";

LayerImageComponent.logMe();

export default class TileComponent<T> extends BaseComponent {
  private myShadow: ShadowRoot | null = null;

  constructor(
    name: string,
    activateFn: (tile?: TileComponent<T>) => void,
    color?: string,
    hoverColor?: string,
    data?: T
  ) {
    super();
    this.activateFn = activateFn;
    this.name = name ?? "";
    this.color = color ?? "blue";
    this.hoverColor = hoverColor ?? "red";
    this.data = data;
  }

  private _name = "";
  get name(): string {
    return this._name;
  }
  set name(val: string) {
    this._name = val;
    this.build();
  }

  private _color = "";
  get color(): string {
    return this._color;
  }
  set color(val: string) {
    this._color = val;
    this.build();
  }

  private _hoverColor = "";
  get hoverColor(): string {
    return this._hoverColor;
  }
  set hoverColor(val: string) {
    this._hoverColor = val;
    this.build();
  }

  private _width = 240;
  get width(): number {
    return this._width;
  }
  set width(val: number) {
    this._width = val;
    this.build();
  }

  private _height = 240;
  get height(): number {
    return this._height;
  }
  set height(val: number) {
    this._height = val;
    this.build();
  }

  private _round = false;
  get round(): boolean {
    return this._round;
  }
  set round(val: boolean) {
    this._round = val;
    this.build();
  }

  public activateFn: (tile?: TileComponent<T>) => void;

  public readonly data: T | undefined;

  private _enterDate: Date | null = null;

  build = () => {
    if (!this.myShadow) {
      // console.log("tile called without shadow");
      return;
    }

    this.myShadow.innerHTML = this.render();
    this.postrender();
  };

  render = () => {
    return `
          <style>

        .tile-div{
            background-color: ${this.color};
            width: ${this.width}px;
            height:  ${this.height}px;
            box-shadow: 2px 2px lightgrey;
            cursor: pointer, auto;  
            display: flex;
           justify-content: center;
          align-items: center;

          border-radius: ${this.round ? "" + this.width / 2 + "" : "5"}px;

        }
        .tile-div:hover{
            background-color: ${this.hoverColor};
        }

      </style>
        <div class="tile-div">
          <h3> ${this.htmlEncode(this.name)}</h3>
        </div>`;
  };

  postrender = () => {
    const that = this;
    that.myShadow?.querySelector(".tile-div")?.addEventListener("click", () => {
      that.activate();
    });

    that.myShadow
      ?.querySelector(".tile-div")
      ?.addEventListener("mouseenter", () => {
        const now = new Date();
        if (!that._enterDate) {
          that._enterDate = now;
        }

        setTimeout(() => {
          ///console.log("timeout " + that._enterDate);
          if (!that._enterDate) {
            return;
          }
          const diff = new Date().getTime() - that._enterDate.getTime();
          console.log("dif: " + diff + "         " + that._enterDate.getTime());

          if (diff >= 2000) {
            this.activate();
          }
        }, 2050);
      });

    that.myShadow
      ?.querySelector(".tile-div")
      ?.addEventListener("mouseleave", () => {
        console.log("mouseleave  " + that._enterDate);
        that._enterDate = null;
      });
  };

  activate = () => {
    this._enterDate = null;
    if (this.activateFn) {
      this.activateFn(this);
    }
  };

  connectedCallback() {
    try {
      if (!this.myShadow) {
        this.myShadow = this.attachShadow({ mode: "open" }); // closed means it cannot be accessed from the outside
      }
    } catch (e) {
      console.log("error in connectedCallback: " + e);
    }
    this.build();
  }
  //#region static webcomponent methods

  static get observedAttributes() {
    return [
      nameof<TileComponent<any>>("name"),
      nameof<TileComponent<any>>("color"),
      nameof<TileComponent<any>>("hoverColor"),
      nameof<TileComponent<any>>("height"),
      nameof<TileComponent<any>>("width"),
      nameof<TileComponent<any>>("round"),
    ];
  }

  //#endregion

  //#region static methods
  public static logMe() {
    // dummy static method to ensure imports exist
    console.log("tileComponent");
  }

  //#endregion
}
// register component
customElements.define("a-tile", TileComponent);
