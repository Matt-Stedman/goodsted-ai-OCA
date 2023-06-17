import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import MagicBox from "./MagicBox";
import DOMPurify from "dompurify";

const TextEditor = () => {
    // content
    const [blocks, setBlocks] = useState();

    // positioning
    const [showMagicBox, setShowMagicBox] = useState(false);
    const [magicBoxPosition, setMagicBoxPosition] = useState({ x: 0, y: 0 });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // quill references
    // const [quillValue, setQuillValue] = useState("");
    const quillRef = useRef();
    const editorRef = useRef();
    const unprivilegedEditorRef = useRef();

    /**
     * Handle any time the blocks change, remove imagfes because they're not allowed
     */
    const handleChange = (value) => {
        // console.log("Dirty: ", value);

        let sanitized_value = DOMPurify.sanitize(value, { FORBID_TAGS: ["img", "a"] });
        // console.log("Clean: ", sanitized_value);
        if (sanitized_value !== DOMPurify.sanitize(value)) {
            quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(sanitized_value);
        }
        // const formattedValue = sanitized_value.replace(/<\/p>|<?br>|<?div>|<?h1?>|<?h2?>|<?strong?>/g, "");
        const formattedValue = quillRef.current.getEditor().getText();
        setBlocks(formattedValue.split("\n"));
        // console.log("Set blocks: ", formattedValue);
    };

    /**
     * Switch out text in the editor from a value before to a value after
     */
    const switchOutText = (before, after) => {
        console.log("Replacing : ", before, " with : ", after);
        let currentQuillContents = quillRef.current.getEditor().root.innerHTML;
        console.log("Was: ", currentQuillContents);
        before = before
            .replace("&", /&amp;/g)
            .replace("<", /&lt;/g)
            .replace(">", /&gt;/g)
            .replace('"', /&quot;/g)
            .replace("'", /&apos;/g)
            .replace("'", /&#39;/g);
        currentQuillContents = currentQuillContents.replace(before, after);

        console.log("Becomes: ", currentQuillContents);
        // Clear the conents
        quillRef.current.getEditor().setContents();

        currentQuillContents.replace("<p><br></p>", "");

        // Paste the changes
        quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, currentQuillContents);
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

    /**
     * Helper function to get the block's index in a selection
     * @param {} selection
     */
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
        return blocks[blockIndex];
    };

    /**
     * The Make Magic button's execution
     */
    const returnContent = () => {
        return unprivilegedEditorRef.current.getText();
    };

    /**
     * The Make Magic button's execution
     */
    const returnBlockAndSelection = () => {
        const selection = unprivilegedEditorRef.current.getSelection();
        const content = returnContent();

        if (selection) {
            const { index, length } = selection;

            // Get the text context
            const selectedText = content.substr(index, length);
            // console.log("Selected text: ", selectedText);

            // Get the block index
            const selectedBlock = handleGetSelectedBlock(selection);
            // console.log("Selected Block: ", selectedBlock);
            return {
                selectedText: selectedText,
                selectedBlock: selectedBlock,
                content: content,
            };
        }
        return {};
    };

    /**
     * Decide if we should show the button based on whether there is a selection of text or not.
     */
    const triggerButton = () => {
        const selection = unprivilegedEditorRef.current.getSelection();
        setShowMagicBox(false);
        if (selection) {
            if (selection.length) {
                setShowMagicBox(true);
                setMagicBoxPosition({ x: mousePosition.x, y: mousePosition.y });
            }
        }
    };

    /**
     * Track the mouse movement ready for when we make a selection
     */
    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;

        const editorElement = quillRef.current.editor.container;
        const editorBounds = editorElement.getBoundingClientRect();
        const buttonX = clientX - editorBounds.left;
        const buttonY = clientY - editorBounds.top;
        setMousePosition({ x: buttonX, y: buttonY });

        //   setButtonPosition({ x: buttonX, y: buttonY });
    };

    React.useEffect(() => {
        if (quillRef.current) {
            editorRef.current = quillRef.current.getEditor();
            unprivilegedEditorRef.current = quillRef.current.makeUnprivilegedEditor(editorRef.current);
        }
    }, []);

    return (
        <div style={{ display: "block" }} onMouseMove={handleMouseMove}>
            <ReactQuill
                ref={quillRef}
                // value={quillValue} // Need some to capture the contents from previous, or start with a proposed layout
                onChange={handleChange}
                // onKeyDown={handleKeyPress}
                onChangeSelection={triggerButton}
                theme="snow"
            />
            <MagicBox
                magicBoxPosition={magicBoxPosition}
                blocks={blocks}
                returnContent={returnContent}
                returnBlockAndSelection={returnBlockAndSelection}
                showMagicBox={showMagicBox}
                switchOutText={switchOutText}
            />
        </div>
    );
};

export default TextEditor;
