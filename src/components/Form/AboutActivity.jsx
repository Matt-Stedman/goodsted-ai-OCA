import { Button, Grid, Checkbox, FormControlLabel, TextField, Box, MenuItem } from "@mui/material";
import EnhancedTextField from "./components/EnhancedTextField";

const AboutActivity = (props) => {
    return (
        <Box sx={{ width: "50%", flexDirection: "column" }}>
            <EnhancedTextField
                name="title"
                label="What is your opportunity title?"
                value={props.formData.title}
                enhanced={props.enhancedFormData.title}
                onChange={props.handleChange}
            />
            <TextField
                name="organisation"
                label="What organisation is leading this opportunity?"
                value={props.formData.organisation}
                onChange={props.handleChange}
                fullWidth={true}
                select
                margin="normal"
            >
                {["dummy org"].map((org) => (
                    <MenuItem key={org} value={org}>
                        {org}
                    </MenuItem>
                ))}
            </TextField>
            <EnhancedTextField
                name="whatDoYouNeedHelpWith"
                label="What do you need help with?"
                value={props.formData.whatDoYouNeedHelpWith}
                onChange={props.handleChange}
                enhanced={props.enhancedFormData.whatDoYouNeedHelpWith}
                multiline
                rows={4}
            />
            <EnhancedTextField
                name="whatDoYouAlreadyHaveInPlace"
                label="What do you already have in place?"
                value={props.formData.whatDoYouAlreadyHaveInPlace}
                onChange={props.handleChange}
                enhanced={props.enhancedFormData.whatDoYouAlreadyHaveInPlace}
                multiline
                rows={4}
            />
            <div>
                {props.formData.whatDoYouAimToAchieve.map((goal, index) => (
                    <EnhancedTextField
                        name="whatDoYouAimToAchieve"
                        label={`What ${index === 0 ? "" : "else"} do you aim to achieve?`}
                        value={props.formData.whatDoYouAimToAchieve[index]}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            props.setFormData((prevData) => ({
                                ...prevData,
                                whatDoYouAimToAchieve: prevData.whatDoYouAimToAchieve.map((item, i) =>
                                    i === index ? value : item
                                ),
                            }));
                        }}
                        enhanced={props.enhancedFormData.whatDoYouAimToAchieve?.[index]}
                        key={"whatDoYouAimToAchieve_" + index}
                    />
                ))}
                <Button
                    onClick={() => {
                        props.setFormData((prevData) => ({
                            ...prevData,
                            whatDoYouAimToAchieve: [...prevData.whatDoYouAimToAchieve, ""],
                        }));
                    }}
                    style={{ fontSize: "0.7em" }}
                >
                    Add a goal
                </Button>
            </div>
            {props.childElements}
        </Box>
    );
};

export default AboutActivity;
