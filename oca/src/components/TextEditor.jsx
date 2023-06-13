import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = () => {
    const [blocks, setBlocks] = useState([""]);

    const quillRef = useRef();
    const editorRef = useRef();
    const unprivilegedEditorRef = useRef();

    const handleChange = (value) => {
        const formattedValue = value.replace(/<\/p>|<?br>|<?div>/g, "");
        setBlocks(formattedValue.split("<p>"));
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            const updatedBlocks = [...blocks];
            //   updatedBlocks.push("");
            setBlocks(updatedBlocks);
            console.log(updatedBlocks);
        }
    };

    const handleGetSelectedBlock = (selection) => {
        // eslint-disable-next-line
        const { index, length } = selection;
        let blockIndex = -1;

        let accumulatedLength = 0;
        for (let i = 0; i < blocks.length; i++) {
            accumulatedLength += blocks[i].length;
            if (index < accumulatedLength) {
                blockIndex = i;
                break;
            }
            accumulatedLength++; // account for the newline character
        }

        console.log("Selected Block Index:", blockIndex);
    };

    const makeMagic = () => {
        const selection = unprivilegedEditorRef.current.getSelection();
        const content = unprivilegedEditorRef.current.getText();

        if (selection) {
            const { index, length } = selection;

            // Get the text context
            const selectedText = content.substr(index, length);
            console.log(selectedText);

            // Get the block index
            handleGetSelectedBlock(selection);
        }

        console.log(blocks);
    };

    React.useEffect(() => {
        if (quillRef.current) {
            editorRef.current = quillRef.current.getEditor();
            unprivilegedEditorRef.current = quillRef.current.makeUnprivilegedEditor(editorRef.current);
        }
    }, []);

    return (
        <div>
            <ReactQuill
                ref={quillRef}
                // value={blocks.join("</p>")}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
            />
            <button onClick={makeMagic}>Magic me!</button>
        </div>
    );
};

export default TextEditor;
