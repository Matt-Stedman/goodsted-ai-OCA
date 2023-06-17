import React, { useState, useRef, useEffect } from "react";
import "../styles/Magic.css";
import { reviewEntireOpportunitiyGenerally, getFeedbackOnUpdate, finalCheck } from "../functions/OpenAi";

const MagicBox = (props) => {
    // content
    const [preSwitchContent, setPreSwitchContent] = useState();
    const [postSwitchContent, setPostSwitchContent] = useState();
    const [reasonContent, setReasonContent] = useState();

    // responses
    const [generalFeedback, setGeneralFeedback] = useState();
    const [errorMessage, setErrorMessage] = useState();

    // loading
    const [generalFeedbackLoading, setGeneralFeedbackLoading] = useState(false);

    const makeMagic = () => {
        const blocksAndSelection = props.returnBlockAndSelection();
        setPreSwitchContent(blocksAndSelection.selectedText);
        // setPostSwitchContent(
        console.log(reviewEntireOpportunitiyGenerally(blocksAndSelection.content));
    };

    function parseGeneralFeedback(feedbackString) {
        const regex = /CHANGE\s*(.*?)(?=\sTO)\s*TO\s*(.*?)(?=\sBECAUSE)\s*BECAUSE\s*(.*?)(?=CHANGE|$)/gs;
        const feedback = [];
        let match;
        console.log("feedbackString: ", feedbackString);

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

            feedback.push({
                CHANGE: change
                    .replace(/^[^\w\s]+|^[^\w\s]+$/g, "")
                    .replace(/^['"]|['"]$/g, "")
                    .trim(),
                TO: match[2]
                    .replace(/^[^\w\s]+|^[^\w\s]+$/g, "")
                    .replace(/^['"]|['"]$/g, "")
                    .trim(),
                BECAUSE: match[3]
                    .replace(/^[^\w\s]+|^[^\w\s]+$/g, "")
                    .replace(/^['"]|['"]$/g, "")
                    .trim(),
            });
        }
        setErrorMessage(); // Clear the error message if we get here
        return feedback;
    }

    /**
     * Make some general feedback magic
     */
    const makeGeneralMagic = async () => {
        const opportunityContent = props.returnContent();
        setGeneralFeedbackLoading(true);
        const generalFeedback =
            // 'CHANGE "How might we run an effective capital fundraising campaign?" TO "Volunteer to help raise £400,000 to establish Hammersley Home and support vulnerable adults with mental health challenges." BECAUSE the opportunity clearly outlines the goal and purpose of the project.\n\nCHANGE "Remote" UNDER LOCATION TO "Anywhere" BECAUSE the opportunity is not limited to a specific location.\n\nCHANGE "Health & Wellbeing" UNDER Cause TO "Mental Health" BECAUSE it accurately reflects the cause the project supports.\n\nCHANGE "20 hrs" UNDER COMMITMENT TO "Flexible Hours" BECAUSE the opportunity allows for flexibility in volunteering hours.\n\nCHANGE "Beginner" UNDER EXPERIENCE LEVEL TO "All Experience Levels" BECAUSE anyone can volunteer to help.\n\nCHANGE "0 / 6" UNDER CAPACITY TO "Unlimited" BECAUSE there is currently no limit to the number of volunteers that can participate.';
            await reviewEntireOpportunitiyGenerally(opportunityContent);
        const parsed_generalFeedback = parseGeneralFeedback(generalFeedback);
        if (parsed_generalFeedback) {
            setGeneralFeedback(parsed_generalFeedback);
        }
        console.log("parsed_generalFeedback: ", parsed_generalFeedback);
        setGeneralFeedbackLoading(false);
    };

    /**
     * Switch out general proxy
     */
    const switchOutTextWrapper = (index, before, after) => {
        generalFeedback.splice(index, 1);
        props.switchOutText(before, after);
    };

    useEffect(() => {
        if (!props.showMagicBox) {
            setPreSwitchContent(null);
            setPostSwitchContent(null);
            setReasonContent(null);
        }
    }, [props.showMagicBox]);

    return (
        <div>
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
            {props.blocks?.some((item) => Boolean(item)) && (
                <button className="magic-button" onClick={makeGeneralMagic}>
                    {generalFeedbackLoading ? (
                        <img src="assets/loading_inline.gif" width="130" height="17" />
                    ) : (
                        "✨ General magic ✨"
                    )}
                </button>
            )}
            {generalFeedback?.some((item) => Boolean(item)) && (
                <div className="magic">
                    <button
                        className="magic-button"
                        onClick={() => {
                            setGeneralFeedback();
                        }}
                    >
                        Clear
                    </button>
                    <table className="grid-container">
                        <thead>
                            <tr>
                                <th>
                                    <h2>I would change</h2>
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
                                            className="magic-button"
                                            style={{ padding: "2px" }}
                                            onClick={() => props.switchOutText(item.CHANGE, item.TO)}
                                        >
                                            <img src="assets/switch_icon.png" width="15px" />
                                        </button>{" "}
                                        {item.TO}
                                    </td>
                                    <td>{item.BECAUSE}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        </div>
    );
};
export default MagicBox;
