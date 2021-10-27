/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module upload/adapters/base64uploadadapter
 */

/* globals window */

import ImageHelper from "./imageCompression";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import FileRepository from "@ckeditor/ckeditor5-upload/src/filerepository";

/**
 * A plugin that converts images inserted into the editor into [Base64 strings](https://en.wikipedia.org/wiki/Base64)
 * in the {@glink builds/guides/integration/saving-data editor output}.
 *
 * This kind of image upload does not require server processing – images are stored with the rest of the text and
 * displayed by the web browser without additional requests.
 *
 * Check out the {@glink features/image-upload/image-upload comprehensive "Image upload overview"} to learn about
 * other ways to upload images into CKEditor 5.
 *
 * @extends module:core/plugin~Plugin
 */
export default class CustomBase64Uploader extends Plugin {
  /**
   * @inheritDoc
   */
  static get requires() {
    return [FileRepository];
  }

  /**
   * @inheritDoc
   */
  static get pluginName() {
    return "CustomBase64Uploader";
  }

  /**
   * @inheritDoc
   */
  init() {
    //isCrop sended from react component inside config object
    const isCrop = this.editor.config.get("reactConfig.imageCrop");
    this.editor.plugins.get(FileRepository).createUploadAdapter = (loader) => {
      return new Adapter(loader, isCrop);
    };
  }
}

/**
 * The upload adapter that converts images inserted into the editor into Base64 strings.
 *
 * @private
 * @implements module:upload/filerepository~UploadAdapter
 */
class Adapter {
  /**
   * Creates a new adapter instance.
   *
   * @param {module:upload/filerepository~FileLoader} loader
   */
  constructor(loader, isCrop) {
    /**
     * `FileLoader` instance to use during the upload.
     *
     * @member {module:upload/filerepository~FileLoader} #loader
     */
    this.loader = loader;
    this.imageHelper = new ImageHelper();
    this.isCrop = isCrop;
  }

  /**
   * Starts the upload process.
   *
   * @see module:upload/filerepository~UploadAdapter#upload
   * @returns {Promise}
   */
  upload() {
    return new Promise((resolve, reject) => {
      const reader = (this.reader = new window.FileReader());
      reader.addEventListener("load", async () => {
        const base64Image = await this.imageHelper.resizeBase64Image(
          reader.result,
          this.isCrop
        );
        resolve({ default: base64Image });
      });

      reader.addEventListener("error", (err) => {
        reject(err);
      });

      reader.addEventListener("abort", () => {
        reject();
      });

      this.loader.file.then((file) => {
        reader.readAsDataURL(file);
      });
    });
  }

  /**
   * Aborts the upload process.
   *
   * @see module:upload/filerepository~UploadAdapter#abort
   * @returns {Promise}
   */
  abort() {
    this.reader.abort();
  }
}
