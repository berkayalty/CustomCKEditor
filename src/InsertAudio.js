import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import AudioIcon from "./volumeHigh.svg";
import axios from "axios";

class InsertAudio extends Plugin {
  init() {
    const buttonViewAttr = {
      label: "Ses Ekle",
      icon: AudioIcon,
      tooltip: true,
      withText: false,
    };
    const editor = this.editor;
    editor.ui.componentFactory.add("insertAudio", (locale) => {
      const buttonView = new ButtonView(locale);
      buttonView.set(buttonViewAttr);

      buttonView.on("execute", () => {
        var fileSelector = document.createElement("input");
        fileSelector.setAttribute("type", "file");
        fileSelector.setAttribute("accept", "audio/*");
        fileSelector.click();
        fileSelector.onchange = function (event) {
          editor.isReadOnly = true;
          var file = event.target.files[0];
          let formData = new FormData();
          formData.append("baslik", "ckeditorSes");
          formData.append("aciklama", "ckses");
          formData.append("dosya", file);
          axios
            .post(`${window.globalApiPath}api/file`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((fileResponse) => {
              if (fileResponse.data.status !== "ERROR") {
                var sha1 = fileResponse.data.data.dosyaSHA1;
                axios
                  .get(`${window.globalApiPath}api/file/presignedURL/${sha1}`)
                  .then((response) => {
                    var s3URL = response.data.data;
                    const content = `<audio controls src=${s3URL} preload="none"/><br/>`;
                    const viewFragment = editor.data.processor.toView(content);
                    const modelFragment = editor.data.toModel(viewFragment);
                    editor.model.insertContent(modelFragment);
                    editor.isReadOnly = false;
                  })
                  .catch((err) => {
                    editor.isReadOnly = true;
                  });
              } else {
                editor.isReadOnly = true;
              }
            })
            .catch((err) => {
              editor.isReadOnly = true;
            });
        };
      });
      return buttonView;
    });
  }
}

export default InsertAudio;
