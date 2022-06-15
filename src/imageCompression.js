import imageCompression from "browser-image-compression";

export default class ImageHelper {
  async resizeBase64Image(base64Image, isCrop) {
    const compressOptions = {
      maxSizeMB: 0.5, // (default: Number.POSITIVE_INFINITY)
      maxWidthOrHeight: isCrop ? 720 : 1280, // compress file ratio (default: undefined)
      useWebWorker: true, // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
      maxIteration: 10, // optional, max number of iteration to compress the image (default: 10)
      initialQuality: 0.8,
    };
    if (isCrop) {
      var image = new Image();
      image.src = base64Image;
      return new Promise((resolve, reject) => {
        image.onload = async () => {
          const canvas = document.createElement("canvas");
          var canvasContext = canvas.getContext("2d");
          const imageW = image.width;
          const imageH = image.height;
          canvas.width = 720;
          canvas.height = 720;
          var scale = Math.min(canvas.width / imageW, canvas.height / imageH);
          // get the top left position of the image
          var x = canvas.width / 2 - (imageW / 2) * scale;
          var y = canvas.height / 2 - (imageH / 2) * scale;
          canvasContext.drawImage(image, x, y, imageW * scale, imageH * scale);

          const fileImage = await imageCompression.getFilefromDataUrl(
            canvas.toDataURL()
          );
          const compressImage = await imageCompression(
            fileImage,
            compressOptions
          );
          const compressedBase64 = await imageCompression.getDataUrlFromFile(
            compressImage
          );

          resolve(compressedBase64);
        };
      });
    } else {
      const fileImage = await imageCompression.getFilefromDataUrl(base64Image);
      const compressImage = await imageCompression(fileImage, compressOptions);
      const compressedBase64 = await imageCompression.getDataUrlFromFile(
        compressImage
      );
      return compressedBase64;
    }
  }
}
