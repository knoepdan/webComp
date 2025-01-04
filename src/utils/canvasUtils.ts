export interface DrawImageOptions {
  adjustCanvasToImage: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

export interface IDimensions {
  width: number;
  height: number;
}

export const drawImage = (
  canvas: HTMLCanvasElement,
  source: string,
  opt?: DrawImageOptions
) => {
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = () => {
    if (ctx) {
      ctx.imageSmoothingQuality = "high"; // minor effect on image quality
      if (opt?.adjustCanvasToImage) {
        console.log("1 anvas.width: " + canvas.width);
        adjustCanvasSize(canvas, img, opt.maxWidth, opt.maxHeight);
        console.log("2 canvas.width: " + canvas.width);
      }

      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height, // source rectangle
        0,
        0,
        canvas.width,
        canvas.height
      ); // destination rectangle
      // context.drawImage(base_image, 0, 0);
    }
  };
  img.src = source; // e.g: 'img/base.png';  (will trigger onLoad)
};

export const getImageSize = (imageSrc: string) =>
  new Promise<IDimensions>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      /// const { naturalWidth: width, naturalHeight: height } = img;
      /// resolve({ width, height });
      const res: IDimensions = { width: img.width, height: img.height };
      resolve(res);
    };

    img.onerror = () => {
      reject(new Error("There was some problem with the image."));
    };

    img.src = imageSrc; ///URL.createObjectURL(file)
  });

export const adjustCanvasSize = (
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  maxWidth?: number,
  maxHeight?: number
) => {
  if (maxWidth && maxHeight) {
    if (img.width > maxWidth || img.height > maxHeight) {
      if (img.width > img.height) {
        canvas.width = maxWidth;
        canvas.height = (maxWidth / img.width) * img.height;
      } else {
        canvas.height = maxHeight;
        canvas.width = (maxHeight / img.height) * img.width;
      }
    } else {
      canvas.width = img.width;
      canvas.height = img.height;
    }
  } else {
    canvas.width = img.width;
    canvas.height = img.height;
  }
};

export const adjustDimensions = (
  currentWith: number,
  currentHeight: number,
  maxWidth?: number,
  maxHeight?: number
): IDimensions => {
  const dim: IDimensions = { width: currentWith, height: currentHeight };
  if (maxWidth && maxHeight) {
    if (currentWith > maxWidth || currentHeight > maxHeight) {
      if (currentWith > currentHeight) {
        dim.width = maxWidth;
        dim.height = (maxWidth / currentWith) * currentHeight;
      } else {
        dim.height = maxHeight;
        dim.width = (maxHeight / currentHeight) * currentWith;
      }
    } else {
      dim.width = currentWith;
      dim.height = currentHeight;
    }
  } else {
    dim.width = currentWith;
    dim.height = currentHeight;
  }
  return dim;
};

export const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor(
      ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width
    ),
    y: Math.floor(
      ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
    ),
  };
};
