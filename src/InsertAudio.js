import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import AudioIcon from "./volumeHigh.svg";
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
        fileSelector.onchange = function () {
          var files = this.files;
          const file = files[0];
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          }).then((res) => {
            const content = `<audio controls id="audioContainer" src=${res}></audio><br/>`;
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
