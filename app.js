// app.js

import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import GeneralHtmlSupport from "@ckeditor/ckeditor5-html-support/src/generalhtmlsupport";
import HtmlComment from "@ckeditor/ckeditor5-html-support/src/htmlcomment";
import SourceEditing from "@ckeditor/ckeditor5-source-editing/src/sourceediting";
import InsertAudio from "./plugins/InsertAudio";

ClassicEditor.create(document.querySelector("#editor"), {
  plugins: [
    SourceEditing,
    GeneralHtmlSupport,
    HtmlComment,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    InsertAudio,
  ],
  toolbar: ["undo", "redo", "bold", "italic", "insertAudio", "sourceEditing"],
  language: "tr",
  htmlSupport: {
    allow: [
      {
        name: /.*/,
        attributes: true,
        classes: true,
        styles: true,
      },
    ],
  },
})
  .then((editor) => {
    console.log("Editor was initialized", editor);
  })
  .catch((error) => {
    console.error(error.stack);
  });
