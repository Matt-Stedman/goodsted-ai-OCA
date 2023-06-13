import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = () => {
    const [blocks, setBlocks] = useState([""]);

    const handleChange = (value) => {
        const lines = value.split("\n");
        setBlocks(lines);
        console.log(lines);
    };

    return (
        <div>
            {blocks.map((block, index) => (
                <ReactQuill
                    key={index}
                    value={block}
                    onChange={(value) => handleChange(value)}
                />
            ))}
        </div>
    );
};

export default TextEditor;
