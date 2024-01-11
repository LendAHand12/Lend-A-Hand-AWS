import { useRef } from "react";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

const TextEditor = (props) => {
  const editor = useRef();

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  const handleImageUpload = (
    targetImgElement,
    index,
    state,
    imageInfo,
    remainingFilesCount
  ) => {
    console.log(targetImgElement, index, state, imageInfo, remainingFilesCount);
  };

  return (
    <SunEditor
      {...props}
      setAllPlugins={false}
      placeholder="Vui lòng nhập nội dung..."
      getSunEditorInstance={getSunEditorInstance}
      height="100%"
      onImageUpload={handleImageUpload}
      setOptions={{
        height: 200,
        buttonList: buttonList.formatting, // Or Array of button list, eg. [['font', 'align'], ['image']]
        // plugins: [font] set plugins, all plugins are set by default
        // Other option
      }}
    />
  );
};
export default TextEditor;
