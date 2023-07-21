import React, { useState } from "react";
import MagicBox from "../OpportunityEditor/MagicBox";
import { Box, TextField } from "@mui/material";
import "../../styles/Magic.css";
import MagicButton from "../components/MagicButton";
import { autoPopulateForm } from "../../functions/OpenAi";

const StartPopup = (props) => {
    const [showPopup, setShowPopup] = useState(props.showPopup);
    const [inYourOwnWords, setInYourOwnWords] = useState("");

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const autoPopulateAction = async () => {
        props.setEnhancementLoading(true);
        console.log(props.formData);
        await autoPopulateForm(inYourOwnWords)
            .then((returnedForm) => {
                if (returnedForm) {
                    props.setFormData(returnedForm);
                    console.log("Reviewed form content: ", returnedForm);
                } else {
                    console.log("Error passing form content!");
                }
            })
            .finally(() => {
                props.setEnhancementLoading(false);
                setShowPopup(false);
            });
    };

    return (
        <>
            {showPopup && (
                <div className="StartPopup">
                    <span className="CloseIcon" onClick={handleClosePopup}>
                        &#x2715;
                    </span>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "center",
                            background: "white",
                        }}
                    >
                        <TextField
                            name="inYourOwnWords"
                            label="In a few words, describe what you need help with"
                            value={inYourOwnWords}
                            onChange={(e) => {
                                setInYourOwnWords(e.target.value);
                            }}
                            fullWidth={true}
                            multiline
                            rows={3}
                        />
                        <MagicButton
                            style={{ fontSize: "1em", marginTop: "10px" }}
                            text="✨AI✨"
                            loading={props.enhancementLoading}
                            onClick={autoPopulateAction}
                        />
                    </Box>
                </div>
            )}
        </>
    );
};

export default StartPopup;
