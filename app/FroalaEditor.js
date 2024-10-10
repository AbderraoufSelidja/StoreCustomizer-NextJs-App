import React from "react";
import dynamic from "next/dynamic";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";

// Dynamically import FroalaEditorComponent with SSR disabled
const FroalaEditorComponent = dynamic(
  () => import("react-froala-wysiwyg"),
  { ssr: false }
);

const FroalaEditor = ({ inputText, setInputText, indice, content, index }) => {
  return (
    <FroalaEditorComponent
      model={indice === "inputText" ? inputText : content[index].value}
      onModelChange={(e) =>
        indice === "inputText" ? setInputText(e) : (content[index].value = e)
      }
      tag="textarea"
      config={{
        toolbarButtons: [
          "bold",
          "italic",
          "underline",
          "strikeThrough",
          "subscript",
          "superscript",
          "fontFamily",
          "fontSize",
          "textColor",
          "backgroundColor",
          "emoticons",
          "insertTable",
          "charCounter",
          "alignJustify",
          "formatOL",
          "formatUL",
          "outdent",
          "indent",
          "quote",
          "insertHR",
          "selectAll",
          "undo",
          "redo",
        ],
        morePragraph: {
          buttons: ["alignLeft", "alignCenter", "lineHeight"],
        },
        moreRich: {
          buttons: ["insertHR", "history", "clearAll"],
        },
      }}
    />
  );
};

export default FroalaEditor;
