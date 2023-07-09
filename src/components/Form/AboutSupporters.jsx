import { Button, Grid, Checkbox, FormControlLabel, TextField, Box, MenuItem } from "@mui/material";

const AboutSupporters = (props) => {
    return (
        <Box sx={{ width: "50%", flexDirection: "column" }}>
            <TextField
                name="skill"
                label="What main skill is required to help you with this request?"
                value={props.formData.skill}
                onChange={props.handleChange}
                fullWidth
                margin="normal"
            />
            <div>
                {props.formData.secondary_skills.map((goal, index) => (
                    <TextField
                        name="secondary_skills"
                        label={`What other skills would be helpful to have?`}
                        value={props.formData.secondary_skills[index]}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            props.setFormData((prevData) => ({
                                ...prevData,
                                secondary_skills: prevData.secondary_skills.map((item, i) =>
                                    i === index ? value : item
                                ),
                            }));
                        }}
                        fullWidth
                        margin="normal"
                        key={"secondary_skills_" + index}
                    />
                ))}
                <Button
                    onClick={() => {
                        props.setFormData((prevData) => ({
                            ...prevData,
                            secondary_skills: [...prevData.secondary_skills, ""],
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
                fullWidth
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
                onChange={props.handleChange}
                fullWidth
                margin="normal"
                type="number"
            />
            <TextField
                name="deadline"
                label="Deadline"
                value={props.formData.deadline}
                onChange={props.handleChange}
                fullWidth
                margin="normal"
                type="date"
            />
            {props.myButton}
        </Box>
    );
};

export default AboutSupporters;
