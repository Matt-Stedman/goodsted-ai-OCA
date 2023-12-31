import React, { useState, useEffect } from "react";
import "../../styles/Magic.css";
import {
    reviewEntireOpportunityGenerally,
    reviewEntireOpportunityAgainstChecklist,
    checklist,
} from "../../functions/OpenAi";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import MagicButton from "../components/MagicButton";

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
                    .trim()
                    .replace(/^["']|["']$/g, ""),
                TO: match[2]
                    .replace(/(^[^\w\s]+)|([^\w\s]+$)/g, "")
                    .replace(/(^['"])|(['"]$)/g, "")
                    .trim()
                    .replace(/^["']|["']$/g, ""),
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
     * Function to evaluate if there's any feedback to display
     */
    const displayFeedback = () => {
        return {
            General: Boolean(generalFeedback?.some((item) => Boolean(item))),
            Checklist: Boolean(Object.values(checklistFeedback?.items).some((item) => Boolean(item))),
            Any:
                Boolean(generalFeedback?.some((item) => Boolean(item))) ||
                Boolean(Object.values(checklistFeedback?.items).some((item) => Boolean(item))),
        };
    };

    const clearAllFeedback = () => {
        setGeneralFeedback();
        setChecklistFeedback({ items: [], notes: "" });
    };
    /**
     * Make some general feedback magic
     */
    const makeGeneralMagic = async () => {
        const opportunityContent = props.returnContent();
        setFeedbackLoading(true);
        clearAllFeedback();

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
        if (props.switchOutText(generalFeedback[index].CHANGE, generalFeedback[index].TO)) {
            generalFeedback.splice(index, 1);
        } else {
            const tmp = generalFeedback[index].CHANGE.replace("WE COULDN'T MAKE THIS CHANGE -- ", "");
            generalFeedback[index].CHANGE = "WE COULDN'T MAKE THIS CHANGE -- " + tmp;
            console.log(generalFeedback[index]);
        }
    };

    /**
     * Switch out general proxy
     */
    const deleteGeneralFeedback = (index) => {
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
            {/*Side panel header */}
            {props.blocks?.some((item) => Boolean(item)) && (
                <MagicButton
                    text={displayFeedback().Any ? "✨ Try again ✨" : "✨ Let's improve this ✨"}
                    loading={feedbackLoading}
                    disabled={feedbackLoading}
                    onClick={makeGeneralMagic}
                    style={{ width: "80%", float: "center" }}
                />
            )}
            {/* Clear button and error message */}
            {displayFeedback().Any && (
                <button className="magic-button" onClick={clearAllFeedback} style={{ width: "20%" }}>
                    Clear
                </button>
            )}
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            {/* Side panel content */}
            {displayFeedback().Any && (
                <div className="magic" style={props.style}>
                    <SplitPane
                        style={{ height: props.style.height - 30 }}
                        split="horizontal"
                        sizes={paneSizes}
                        onChange={setPaneSizes}
                    >
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
                                <div style={{ textAlign: "left", padding: "12px" }}>
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
                                        <th style={{ width: "1%" }} />
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayFeedback().General &&
                                        generalFeedback.map((item, index) => (
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
                                                        <img
                                                            src={process.env.PUBLIC_URL + "/assets/switch_icon.png"}
                                                            height="10px"
                                                        />
                                                    </button>{" "}
                                                    {item.TO}
                                                </td>
                                                <td>{item.BECAUSE}</td>
                                                <td style={{ width: "1%" }}>
                                                    <button
                                                        style={{
                                                            padding: "1px 4px 1px 4px",
                                                            border: "#eee solid 1px",
                                                            borderRadius: 10,
                                                            background: "white",
                                                            fontSize: "10px",
                                                        }}
                                                        onClick={() => deleteGeneralFeedback(index)}
                                                    >
                                                        ❌
                                                    </button>
                                                </td>
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
