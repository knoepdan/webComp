import BaseComponent from "./utils/baseComponent";
import { nameof } from "./utils/nameOf";
import {
  drawImage,
  getMousePos,
  getImageSize,
  adjustDimensions,
} from "./utils/canvasUtils";

export type DrawType = "arc" | "rect";

export default class LayerImageComponent extends BaseComponent {
  private myShadow: ShadowRoot | null = null;

  private _imagesrc = "";
  get imagesrc(): string {
    return this._imagesrc;
  }
  set imagesrc(value: string) {
    this._imagesrc = value;
    console.log("game: imageSrc set to: " + value);
    this.build();
  }

  private _fillColor = "red";
  get fillColor(): string {
    return this._fillColor;
  }
  set fillColor(value: string) {
    this._fillColor = value;
    this.build();
  }

  private _maxWidth = 800;
  get maxWidth(): number {
    return this._maxWidth;
  }
  set maxWidth(value: number) {
    this._maxWidth = value;
    this.build();
  }

  private _maxHeight = 800;
  get maxHeight(): number {
    return this._maxHeight;
  }
  set maxHeight(value: number) {
    this._maxHeight = value;
    this.build();
  }

  private _drawType: DrawType = "rect";
  get drawType(): DrawType {
    return this._drawType;
  }
  set drawType(value: DrawType) {
    this._drawType = value;
    this.build();
  }

  build = async () => {
    if (!this.myShadow) {
      return;
    }

    this.myShadow.innerHTML = this.render();
    await this.postrender();
  };

  render = () => {
    return `
      <style>

        .img-container{
            position: relative;
            max-width: 100%;
            max-height: 100%;
            cursor: url('laser.cur'), auto;    
        }

        .layer-img-fill{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
        }
        
      </style>

      <div id="cont" class="img-container">
        <canvas id="one" class="layer-img-fill" style="z-index: 40; "></canvas>

        <canvas id="two" class="layer-img-fill" style="z-index: 44 "></canvas>

      </div>`;
  };

  postrender = async () => {
    if (!this.myShadow) {
      return;
    }

    // adjust height and width of the container + image
    const imgSize = await getImageSize(this.imagesrc);
    const targetSize = adjustDimensions(
      imgSize.width,
      imgSize.height,
      this.maxWidth,
      this.maxHeight
    );
    const cont = this.myShadow.getElementById("cont") as HTMLElement;
    cont.style.width = `${targetSize.width}px`;
    cont.style.height = `${targetSize.height}px`;

    const one = this.myShadow.getElementById("one") as HTMLCanvasElement;
    drawImage(one, this.imagesrc, {
      adjustCanvasToImage: true,
      maxWidth: targetSize.width,
      maxHeight: targetSize.height,
    }); // canvas size needs to be adjusted to improve image quality (other approach would be to have img as background)

    const c = this.myShadow.getElementById("two") as HTMLCanvasElement;
    const ctx = c.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, c.width, c.height);
    c.addEventListener("mousemove", this.handleMouseMove);
  };

  handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const canvas = e.currentTarget as HTMLCanvasElement;
    const pos = getMousePos(canvas, e);

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.save(); // save the current state (kind of optional here)
    //ctx.lineWidth = 100;

    //ctx.globalAlpha = 0.1; -> affects transparency of color that is drawn
    //	ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    //	ctx.strokeStyle = "blue";

    this.uncover(ctx, pos);

    // https://www.patrick-wied.at/blog/how-to-create-transparency-in-images-with-html5canvas
    ctx.restore(); // restore the state as it was when this function was called (kind of optional here.. counterpart to save that is previously called)
  };

  uncover(ctx: CanvasRenderingContext2D, pos: { x: number; y: number }) {
    ctx.globalCompositeOperation = "destination-out";
    switch (this.drawType) {
      case "rect":
        ctx.fillRect(pos.x - 15, pos.y - 15, 30, 30);
        break;
      case "arc":
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      default:
        console.log("unknown drawType: " + this.drawType);
        break;
    }
  }

  connectedCallback() {
    this.myShadow = this.attachShadow({ mode: "open" }); // closed means it cannot be accessed from the outside
    this.build();
  }
  //#region static webcomponent methods

  static get observedAttributes() {
    return [
      nameof<LayerImageComponent>("imagesrc"),
      nameof<LayerImageComponent>("fillColor"),
      nameof<LayerImageComponent>("maxWidth"),
      nameof<LayerImageComponent>("maxHeight"),
      nameof<LayerImageComponent>("drawType"),
    ];
  }

  //#endregion

  //#region static methods
  public static logMe() {
    // dummy static method to ensure imports exist
    console.log("layerImgComponent");
  }

  //#endregion
}
// register component
customElements.define("a-layerimg", LayerImageComponent);
