import React, { useRef, useEffect } from "react";
import { Button, Box } from "@mui/material";

const MagicButton = ({ loading, text, onClick, ...props }) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        const buttonElement = buttonRef.current;
        if (buttonElement) {
            const buttonRect = buttonElement.getBoundingClientRect();
            buttonElement.style.position = "relative";
            buttonElement.style.width = `${buttonRect.width}px`;
            buttonElement.style.height = `${buttonRect.height}px`;
        }
    }, []);

    return (
        <>
            <Box ref={buttonRef} sx={{ position: "relative", display: "inline-block" }} {...props}>
                {loading ? (
                    <img
                        src={process.env.PUBLIC_URL + "/assets/loading_inline.gif"}
                        alt="Loading..."
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    />
                ) : (
                    <Button onClick={onClick} {...props}>
                        {text}
                    </Button>
                )}
            </Box>
        </>
    );
};

export default MagicButton;
