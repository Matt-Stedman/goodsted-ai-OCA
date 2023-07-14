import { Button, Grid, Checkbox, FormControlLabel, TextField, Box, MenuItem } from "@mui/material";
import EnhancedTextField from "./components/EnhancedTextField";

const AboutSupporters = (props) => {
    return (
        <Box sx={{ width: "50%", flexDirection: "column" }}>
            <EnhancedTextField
                name="skill"
                label="What main skill is required to help you with this request?"
                value={props.formData.skill}
                enhanced={props.enhancedFormData.skill}
                onChange={props.handleChange}
            />
            <div>
                {props.formData.secondarySkills.map((goal, index) => (
                    <EnhancedTextField
                        name="secondarySkills"
                        label={`What other skills would be helpful to have?`}
                        value={props.formData.secondarySkills[index]}
                        enhanced={props.enhancedFormData.secondarySkills?.[index]}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            props.setFormData((prevData) => ({
                                ...prevData,
                                secondarySkills: prevData.secondarySkills.map((item, i) =>
                                    i === index ? value : item
                                ),
                            }));
                        }}
                        key={"secondarySkills_" + index}
                    />
                ))}
                <Button
                    onClick={() => {
                        props.setFormData((prevData) => ({
                            ...prevData,
                            secondarySkills: [...prevData.secondarySkills, ""],
                        }));
                    }}
                    style={{ fontSize: "0.7em" }}
                >
                    Add a skill
                </Button>
            </div>
            <TextField
                name="experience"
                label="What level of experience is required?"
                select
                value={props.formData.experience}
                onChange={props.handleChange}
                fullWidth={true}
                margin="normal"
            >
                {["No experience needed", "Beginner", "Intermediate", "Expert"].map((cause) => (
                    <MenuItem key={cause} value={cause}>
                        {cause}
                    </MenuItem>
                ))}
            </TextField>
            <FormControlLabel
                control={<Checkbox name="open_to_students" onChange={props.handleChange} margin="normal" />}
                label="Check this box if you are open to receiving student volunteer support"
                style={{ fontSize: "0.7em" }}
            />
            <TextField
                name="number_of_volunteers"
                label="How many volunteers are needed?"
                value={props.formData.number_of_volunteers}
                enhanced={props.enhancedFormData.number_of_volunteers}
                onChange={props.handleChange}
                fullWidth={true}
                margin="normal"
                type="number"
            />
            <TextField
                name="deadline"
                label="Deadline"
                value={props.formData.deadline}
                onChange={props.handleChange}
                fullWidth={true}
                margin="normal"
                type="date"
            />
            {props.childElements}
        </Box>
    );
};

export default AboutSupporters;
