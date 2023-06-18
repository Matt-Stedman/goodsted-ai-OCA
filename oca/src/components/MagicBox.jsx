import React, { useState, useEffect } from "react";
import "../styles/Magic.css";
import {
    reviewEntireOpportunityGenerally,
    reviewEntireOpportunityAgainstChecklist,
    checklist,
} from "../functions/OpenAi";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

const MagicBox = (props) => {
    // content
    const [preSwitchContent, setPreSwitchContent] = useState();
    const [postSwitchContent, setPostSwitchContent] = useState();
    const [reasonContent, setReasonContent] = useState();

    // responses
    const [generalFeedback, setGeneralFeedback] = useState();
    const [checklistFeedback, setChecklistFeedback] = useState({ items: [], notes: "" });
    const [errorMessage, setErrorMessage] = useState();

    // loading
    const [feedbackLoading, setFeedbackLoading] = useState(false);

    // panes
    const [paneSizes, setPaneSizes] = useState(["80%", "20%"]);

    // const makeMagic = () => {
    //     const blocksAndSelection = props.returnBlockAndSelection();
    //     setPreSwitchContent(blocksAndSelection.selectedText);
    //     // setPostSwitchContent(
    //     console.log(reviewEntireOpportunityGenerally(blocksAndSelection.content));
    // };

    /**
     * Parse the checklist feedback from the text response
     */
    function parseChecklistFeedback(feedbackString) {
        // Retrieve the sections from the checklist (see OpenAI.js)
        const sections = Object.keys(checklist);
        sections.push("Notes");

        let parsedFeedback = {};
        console.log("Checklist feedback string: ", feedbackString);

        // Iterate through each section to evaluate if there was a comment for it
        for (let i = 0; i < sections.length; i++) {
            let sectionValue = null;

            if (sections[i] === "Notes") {
                // Extract the notes text using a regular expression
                const notesRegex = new RegExp(`${sections[i]}: (.+)`, "i");
                const notesMatch = feedbackString.match(notesRegex);
                if (notesMatch) {
                    sectionValue = notesMatch[1];
                }
            } else {
                let clearIndex = feedbackString.indexOf(sections[i] + ": true");
                let missingIndex = feedbackString.indexOf(sections[i] + ": false");
                if (clearIndex !== -1) {
                    sectionValue = true;
                } else if (missingIndex !== -1) {
                    sectionValue = false;
                }
            }

            parsedFeedback[sections[i]] = sectionValue;
        }

        return parsedFeedback;
    }

    /**
     * Parse the general feedback from the text response
     */
    function parseGeneralFeedback(feedbackString) {
        const regex = /CHANGE\s*(.*?)(?=\sTO)\s*TO\s*(.*?)(?=\sBECAUSE)\s*BECAUSE\s*(.*?)(?=CHANGE|$)/gs;
        const parsedFeedback = [];
        let match;
        // console.log("General feedback string: ", feedbackString);

        // Check if literally no feedback string was returned, indicative of a timeout or bad response
        if (!feedbackString) {
            setErrorMessage("There was likely an internal server error 😡");
            console.log("There was likely an internal server error 😡");
            return false;
        }

        // Check if all that was returned was basically "NO FEEDBACK", indicative of very little information provided
        if (feedbackString.replace(/[.,!?;:]/g, "").replace(/\s/g, "") === "NOFEEDBACK") {
            setErrorMessage("I don't think you have written enough yet to get solid feedback 🙄");
            console.log("I don't think you have written enough yet to get solid feedback 🙄");
            return false;
        }

        // Run a loop to capture all matches
        while ((match = regex.exec(feedbackString)) !== null) {
            const change = match[1].trim();

            parsedFeedback.push({
                CHANGE: change
                    .replace(/(^[^\w\s]+)|([^\w\s]+$)/g, "")
                    .replace(/(^['"])|(['"]$)/g, "")
                    .trim(),
                TO: match[2]
                    .replace(/(^[^\w\s]+)|([^\w\s]+$)/g, "")
                    .replace(/(^['"])|(['"]$)/g, "")
                    .trim(),
                BECAUSE: match[3]
                    .replace(/(^[^\w\s]+)|([^\w\s]+$)/g, "")
                    .replace(/(^['"])|(['"]$)/g, "")
                    .trim(),
            });
        }
        setErrorMessage(); // Clear the error message if we get here
        return parsedFeedback;
    }

    /**
     * Make some general feedback magic
     */
    const makeGeneralMagic = async () => {
        const opportunityContent = props.returnContent();
        setFeedbackLoading(true);
        setGeneralFeedback();
        setChecklistFeedback();

        // Check against a checklist to ensure all information is accounted for
        const unparsed_checklistFeedback = await reviewEntireOpportunityAgainstChecklist(opportunityContent);
        const parsed_checklistFeedback = parseChecklistFeedback(unparsed_checklistFeedback);
        if (Object.values(parsed_checklistFeedback).some((item) => Boolean(item))) {
            console.log(parsed_checklistFeedback);
            const { Notes, ...items_without_note } = parsed_checklistFeedback;
            const to_set_feedback = {
                items: items_without_note,
                notes: Notes,
            };
            console.log("checklistFeedback: ", to_set_feedback);
            setChecklistFeedback(to_set_feedback);
        }

        // Get general feedback changes for the entire posting
        const unparsed_generalFeedback = await reviewEntireOpportunityGenerally(opportunityContent);
        const parsed_generalFeedback = parseGeneralFeedback(unparsed_generalFeedback);
        if (parsed_generalFeedback) {
            setGeneralFeedback(parsed_generalFeedback);
        }
        console.log("parsed_generalFeedback: ", parsed_generalFeedback);
        setFeedbackLoading(false);
    };

    /**
     * Switch out general proxy
     */
    const switchOutTextWrapper = (index) => {
        props.switchOutText(generalFeedback[index].CHANGE, generalFeedback[index].TO);
        generalFeedback.splice(index, 1);
    };

    /**
     * Switch out general proxy
     */
    const addSectionToContentWrapper = (section_key) => {
        props.addSectionToContent(`
            <h2>${section_key}</h2>
            <p style="font-style: italic; color: #444">${checklist[section_key]}</p>
            `);
        checklistFeedback.items[section_key] = "ADDED";
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
            style={{
                textAlign: "center",
            }}
        >
            {/* Floating magic button area */}
            <div
                className={`magic magic-box${props.showMagicBox ? "" : " hidden"}`}
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
                    <button className={`magic-button`}>{/* onClick={makeMagic}> */}✨ Magic me! ✨</button>
                )}
            </div>
            {/*Side panel header */}
            {props.blocks?.some((item) => Boolean(item)) && (
                <button
                    className="magic-button"
                    style={{ width: generalFeedback?.some((item) => Boolean(item)) ? "80%" : "100%" }}
                    onClick={makeGeneralMagic}
                    disabled={feedbackLoading}
                >
                    {feedbackLoading ? (
                        <img src="assets/loading_inline.gif" width="130" height="17" />
                    ) : generalFeedback?.some((item) => Boolean(item)) ? (
                        "✨ Try again ✨"
                    ) : (
                        "✨ Let's improve this ✨"
                    )}
                </button>
            )}
            {/* Clear button and error message */}
            {generalFeedback?.some((item) => Boolean(item)) && (
                <button
                    className="magic-button"
                    onClick={() => {
                        setGeneralFeedback();
                    }}
                    style={{ width: "20%" }}
                >
                    Clear
                </button>
            )}
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            {/* Side panel content */}
            {generalFeedback?.some((item) => Boolean(item)) && (
                <div className="magic" style={props.style}>
                    <SplitPane style={{ height: 718 }} split="horizontal" sizes={paneSizes} onChange={setPaneSizes}>
                        {/* Checklist feedback region */}
                        <Pane minSize="15%" style={{ borderBottom: "#bbb 1px solid ", overflow: "auto" }}>
                            <h1>What's missing?</h1>
                            <table className="grid-container">
                                <tbody>
                                    {Object.keys(checklistFeedback.items).map((key, index) => (
                                        <tr key={index}>
                                            <td style={{ width: "90%" }}>
                                                <strong>{key}</strong>
                                                <br />
                                                <span style={{ fontSize: 11, color: "#888", fontStyle: "italic" }}>
                                                    {checklist[key]}
                                                </span>
                                            </td>
                                            <td style={{ width: "10%" }}>
                                                {checklistFeedback.items[key] === "ADDED" ? (
                                                    "❓"
                                                ) : checklistFeedback.items[key] ? (
                                                    "✅"
                                                ) : (
                                                    <button
                                                        className="magic-button"
                                                        onClick={() => addSectionToContentWrapper(key)}
                                                    >
                                                        Add
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {checklistFeedback?.notes && (
                                <div style={{ textAlign: "left", padding: "12px"}}>
                                    <strong>Notes</strong>
                                    <p>{checklistFeedback?.notes}</p>
                                </div>
                            )}
                        </Pane>
                        {/* General feedback region */}
                        <Pane minSize="15%" style={{ overflow: "auto" }}>
                            <h1>General feedback</h1>
                            <table className="grid-container">
                                <thead>
                                    <tr>
                                        <th>
                                            <h2>Try changing</h2>
                                        </th>
                                        <th>
                                            <h2>to</h2>
                                        </th>
                                        <th>
                                            <h2>because</h2>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generalFeedback.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.CHANGE}</td>
                                            <td>
                                                <button
                                                    style={{
                                                        padding: "2px",
                                                        border: "#ddd solid 1px",
                                                        borderRadius: 10,
                                                        background: "white",
                                                        marginRight: "5px",
                                                    }}
                                                    onClick={() => switchOutTextWrapper(index)}
                                                >
                                                    <img src="assets/switch_icon.png" height="10px" />
                                                </button>{" "}
                                                {item.TO}
                                            </td>
                                            <td>{item.BECAUSE}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Pane>
                    </SplitPane>
                </div>
            )}
        </div>
    );
};
export default MagicBox;
