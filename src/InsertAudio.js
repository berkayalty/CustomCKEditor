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
          var file = event.target.files[0];
          let formData = new FormData();
          formData.append("baslik", "ckeditorSes");
          formData.append("aciklama", "ckeditorSes");
          formData.append("dosya", file);
          axios
            .post("https://apidev.examy.net/sinav/api/file", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((fileResponse) => {
              console.log("fileResponse ->", fileResponse);
              var sha1 = fileResponse.data.data.dosyaSHA1;
              const content = `
              <div class="audioContainer" id=${sha1}>
                <audio controls></audio><br/>
              </div>`;
              const viewFragment = editor.data.processor.toView(content);
              const modelFragment = editor.data.toModel(viewFragment);
              editor.model.insertContent(modelFragment);
            });
        };
      });
      return buttonView;
    });
  }
}

export default InsertAudio;
