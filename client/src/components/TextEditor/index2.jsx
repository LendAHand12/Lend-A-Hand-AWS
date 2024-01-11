import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Component } from "react";
import { CloudinaryImageUploadAdapter } from "ckeditor-cloudinary-uploader-adapter";
import {
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
} from "@ckeditor/ckeditor5-image";

class TextEditor extends Component {
  render() {
    const { data, onChangeHandle } = this.props; // <- Dont mind this, just handling objects from props because Im using this as a shared component.

    const custom_config = {
      extraPlugins: [MyCustomUploadAdapterPlugin],
      mediaEmbed: { previewsInData: true },
      toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "blockQuote",
        "insertTable",
        "|",
        "imageUpload",
        "undo",
        "redo",
      ],
      image: {
        toolbar: [
          "imageTextAlternative",
          "toggleImageCaption",
          "imageStyle:inline",
          "imageStyle:block",
          "imageStyle:side",
        ],
      },
      table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
      },
    };

    return (
      <CKEditor
        editor={ClassicEditor}
        config={custom_config}
        data={data}
        onChange={onChangeHandle}
      />
    );
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new CloudinaryImageUploadAdapter(loader, "dhqggkmto", "sdblmpca");
  };
}

export default TextEditor;
