import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const EnhancedImageField = ({ src, selected, onClick, ...props }) => {
    const [hover, setHover] = useState(false);

    useEffect(() => {
        if (selected) {
            console.log("I'm selected");
        }
    }, [selected]);

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%", // Adjust the width as needed
                maxHeight: "300px",
                overflow: "hidden",
                cursor: "pointer", // Set the cursor to a click icon
            }}
            onMouseEnter={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
            onClick={onClick}
            {...props}
        >
            {selected && (
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        fontSize: "1em",
                        zIndex: 2,
                    }}
                >
                    ✅
                </div>
            )}
            {hover && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "#fff4", // Overlay background color with transparency
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "5em",
                        color: "#fff",
                        zIndex: 1, // Set the z-index to overlay the contents
                    }}
                >
                    ✔
                </div>
            )}
            <img
                src={src}
                style={{
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    zIndex: 0, // Set the z-index to keep the image below the overlays
                }}
                {...props}
            />
        </Box>
    );
};

export default EnhancedImageField;
