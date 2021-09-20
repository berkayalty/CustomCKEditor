import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import AudioIcon from "./volumeHigh.svg";
import axios from "axios";
class InsertAudio extends Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add("insertAudio", (locale) => {
      const buttonView = new ButtonView(locale);
      buttonView.set({
        label: "Ses Ekle",
        icon: AudioIcon,
        tooltip: true,
      });

      buttonView.on("execute", () => {
        var fileSelector = document.createElement("input");
        fileSelector.setAttribute("type", "file");
        fileSelector.setAttribute("accept", "audio/*");
        fileSelector.click();
        fileSelector.onchange = function (event) {
          var audioId = Math.random().toString(16).slice(2);
          var file = event.target.files[0];
          let formData = new FormData();
          formData.append("baslik", "ckeditorSesWitId");
          formData.append("aciklama", audioId);
          formData.append("dosya", file);
          axios
            .post("https://apidev.examy.net/sinav/api/file", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((fileResponse) => {
              if (fileResponse.data.status !== "ERROR") {
                var sha1 = fileResponse.data.data.dosyaSHA1;
                axios
                  .get(
                    `https://apidev.examy.net/sinav/api/file/presignedURL/${sha1}`
                  )
                  .then((response) => {
                    var s3URL = response.data.data;
                    const content = `<audio controls id=${audioId} src=${s3URL} preload="none"></audio><br/>`;
                    const viewFragment = editor.data.processor.toView(content);
                    const modelFragment = editor.data.toModel(viewFragment);
                    editor.model.insertContent(modelFragment);
                  })
                  .catch((err) => {});
              } else {
              }
            })
            .catch((err) => {});
        };
      });
      return buttonView;
    });
  }
}

export default InsertAudio;
