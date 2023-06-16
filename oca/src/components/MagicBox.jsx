import React, { useState, useRef, useEffect } from "react";
import "../styles/Magic.css";

const MagicBox = (props) => {
    const [preSwitchContent, setPreSwitchContent] = useState();
    const [postSwitchContent, setPostSwitchContent] = useState();
    const [reasonContent, setReasonContent] = useState();

    const makeMagic = () => {
        const blocksAndSelection = props.returnBlockAndSelection();
        setPreSwitchContent(blocksAndSelection.selectedText);
        setPostSwitchContent("Hi there");
        // console.log(props.returnBlockAndSelection());
    };

    useEffect(() => {
        if (!props.showMagicBox) {
            setPreSwitchContent(null);
            setPostSwitchContent(null);
            setReasonContent(null);
        }
    }, [props.showMagicBox]);

    return (
        <div
            className={`magic-box${props.showMagicBox ? "" : " hidden"}`}
            style={{
                top: props.magicBoxPosition.y,
                left: props.magicBoxPosition.x,
            }}
        >
            <div className="grid-container">
                {preSwitchContent && (
                    <div className="grid-item left">
                        <h2 className="title">Switch</h2>
                        {preSwitchContent}
                    </div>
                )}
                {postSwitchContent && (
                    <div className="grid-item right top">
                        <h2 className="title">with</h2>
                        {postSwitchContent}
                    </div>
                )}
                {reasonContent && (
                    <div className="grid-item right bottom">
                        <h2 className="title">because</h2>
                        {reasonContent}
                    </div>
                )}
            </div>

            {!postSwitchContent && (
                <button className={`magic-button`} onClick={makeMagic}>
                    Magic me!
                </button>
            )}
        </div>
    );
};
export default MagicBox;
