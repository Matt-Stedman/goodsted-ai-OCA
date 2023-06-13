import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = () => {
  const [blocks, setBlocks] = useState([""]);
  const quillRef = useRef();

  const handleChange = (value) => {
    const formattedValue = value.replace(/<\/?(p|br|div)>/g, "");
    setBlocks(formattedValue.split("<p>"));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const updatedBlocks = blocks.map((block) => {
        if (!block.startsWith("<button>")) {
          return `<button></button>${block}`;
        }
        return block;
      });
    //   updatedBlocks.push("");
      setBlocks(updatedBlocks);
      console.log(updatedBlocks);
    }
  };
  

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        // value={blocks.join("</p>")}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default TextEditor;
