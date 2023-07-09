import { Button, Grid, Checkbox, FormControlLabel, TextField, Box, MenuItem } from "@mui/material";

const AboutActivity = (props) => {
    return (
        <Box sx={{ width: "50%", flexDirection: "column" }}>
            <TextField
                name="title"
                label="What is your opportunity title?"
                value={props.formData.title}
                onChange={props.handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="organisation"
                label="What organisation is leading this opportunity?"
                select
                value={props.formData.organisation}
                onChange={props.handleChange}
                fullWidth
                margin="normal"
            >
                {["dummy org"].map((org) => (
                    <MenuItem key={org} value={org}>
                        {org}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                name="what_do_you_need_help_with"
                label="What do you need help with?"
                value={props.formData.what_do_you_need_help_with}
                onChange={props.handleChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
            />
            <TextField
                name="what_do_you_already_have_in_place"
                label="What do you already have in place?"
                value={props.formData.what_do_you_already_have_in_place}
                onChange={props.handleChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
            />
            <div>
                {props.formData.what_do_you_aim_to_achieve.map((goal, index) => (
                    <TextField
                        name="what_do_you_aim_to_achieve"
                        label={`What ${index === 0 ? "" : "else"} do you aim to achieve?`}
                        value={props.formData.what_do_you_aim_to_achieve[index]}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            props.setFormData((prevData) => ({
                                ...prevData,
                                what_do_you_aim_to_achieve: prevData.what_do_you_aim_to_achieve.map((item, i) =>
                                    i === index ? value : item
                                ),
                            }));
                        }}
                        fullWidth
                        margin="normal"
                        key={"what_do_you_aim_to_achieve_" + index}
                    />
                ))}
                <Button
                    onClick={() => {
                        props.setFormData((prevData) => ({
                            ...prevData,
                            what_do_you_aim_to_achieve: [...prevData.what_do_you_aim_to_achieve, ""],
                        }));
                    }}
                    style={{ fontSize: "0.7em" }}
                >
                    Add a goal
                </Button>
            </div>
            <Grid item xs={12}></Grid>
            {props.myButton}
        </Box>
    );
};

export default AboutActivity;
