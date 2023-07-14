import React, { useState, useRef, useEffect } from "react";
import { Box, Button } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import "split-pane-react/esm/themes/default.css";

const Reviewer = (props) => {
    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "10px",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    width: "80%",
                }}
            >
                {" "}
                <Box sx={{ padding: "10px", flexDirection: "column", border: "1px solid", borderColor: "divider" }}>
                    <h1>Opportunity Post</h1>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: props.opportunityContent.replace(
                                "</p>",
                                `</p>${
                                    !props.opportunityContent.includes("<img")
                                        ? `<img src="${props.image}" width="300px"/>`
                                        : ""
                                }`
                            ),
                        }}
                    />
                </Box>
                <Box sx={{ padding: "10px", flexDirection: "column", border: "1px solid", borderColor: "divider" }}>
                    <h1>LinkedIn Post</h1>
                    <div>
                        <img src={props.image} width="300px" />
                        <br />
                        <br />
                        <div style={{ whiteSpace: "pre-wrap" }}>{props.linkedInContent}</div>
                    </div>
                </Box>
            </Box>
        </div>
    );
};
export default Reviewer;
