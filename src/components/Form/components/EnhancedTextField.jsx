import { Button, Grid, Checkbox, FormControlLabel, TextField, Box, MenuItem } from "@mui/material";
import { useState } from "react";
const EnhancedTextField = (props) => {
    const [visible, setVisible] = useState(false);
    return (
        <div style={{ width: "100%", position: "relative", display: "inline-block" }}>
            <TextField
                margin="normal"
                name={props.name}
                label={props.label}
                value={props.value}
                onChange={props.onChange}
                fullWidth={true}
                {...props}
            />
            {props.enhanced !== props.value && props.enhanced && (
                <div
                    style={{
                        position: "absolute",
                        top: "12px",
                        right: "-2px",
                        cursor: "pointer",
                    }}
                >
                    <span
                        onMouseEnter={() => setVisible(true)}
                        onMouseLeave={() => setVisible(false)}
                        onClick={() => {
                            props.onChange({
                                target: { name: props.name, value: props.enhanced ?? "Error occured changing this!" },
                            });
                        }}
                    >
                        ✨
                    </span>
                    <span
                        style={{
                            display: visible ? "inline-block" : "none",
                            position: "absolute",
                            left: "25px",
                            top: "-7px",
                            backgroundColor: "#1976D2",
                            color: "#ffffff",
                            padding: "5px",
                            borderRadius: "5px",
                            width: "10em",
                            wordWrap: "break-word",
                        }}
                        id="floating-div"
                    >
                        {props.enhanced}
                    </span>
                </div>
            )}
        </div>
    );
};

export default EnhancedTextField;
