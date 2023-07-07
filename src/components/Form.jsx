import React, { useState } from "react";
import { Button, Grid, Checkbox, FormControlLabel, TextField, Box, MenuItem } from "@mui/material";
import { Tabs, Tab } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { createOpportunityFromForm } from "../functions/OpenAi";

const causeOptions = [
    "Animal Welfare",
    "Arts & Culture",
    "Black Lives Matter",
    "Children & Youth",
    "Clean water & Sanitation",
    "Community Engagement",
    "COVID-19",
    "Education & Training",
    "Employment & Economic Growth",
    "Environment & Sustainability",
    "Equality & Inclusion",
    "Financial Inclusion",
    "Food & Agriculture",
    "Health & Wellbeing",
    "Homelessness & Housing",
    "Innovation & Infrastructure",
    "Later Life & Elderly",
    "Mental Wellness & Resilience",
    "Migration & Refugees",
    "Partnerships & Collaboration",
    "Peace & Justice",
    "Poverty Relief",
];

const Form = (props) => {
    const [currentTab, setCurrentTab] = useState("1");
    const [performAction, setPerformAction] = useState(false);

    /**
     * Handle the changing of form data
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        props.setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * Handle the submitting of the form
     */
    const handleSubmit = async () => {
        // Do something with the form data
        console.log(props.formData);
        await createOpportunityFromForm(props.formData).then((content) => {
            props.setOpportunityContent(content);
            console.log("Opportunity Content set to: ", content);
        });
    };

    const AIEnhance = () => {};

    /**
     * Handle the changing of tabs
     */
    const handleTabChange = (event, newValue) => {
        setPerformAction(true);
        setTimeout(() => {
            setCurrentTab(newValue);
            setPerformAction(false); // Reset the flag after the action is completed
        }, 100); // Delayed update to wait for 500ms after the action is completed
    };

    return (
        <TabContext value={currentTab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "center" }}>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab label="What do you need help with?" value="1" />
                    <Tab label="About Activity" value="2" />
                    <Tab label="About supporters" value="3" />
                </Tabs>
            </Box>
            <TabPanel style={{ padding: 10, display: "flex", justifyContent: "center" }} value="1">
                <Box sx={{ width: "50%", flexDirection: "column" }}>
                    <TextField
                        name="opportunity_type"
                        label="What do you need help with?"
                        select
                        value={props.formData.opportunity_type}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        {["Mentoring", "Task", "Brainstorming", "Activity"].map((cause) => (
                            <MenuItem key={cause} value={cause}>
                                {cause}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        name="cause"
                        label="What cause is this evolving?"
                        select
                        value={props.formData.cause}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        {causeOptions.map((cause) => (
                            <MenuItem key={cause} value={cause}>
                                {cause}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        variant="contained"
                        onClick={() => {
                            handleTabChange(null, "2");
                        }}
                        style={{ float: "right" }}
                    >
                        Next
                    </Button>
                </Box>
            </TabPanel>
            <TabPanel style={{ padding: 10, display: "flex", justifyContent: "center" }} value="2">
                <Box sx={{ width: "50%", flexDirection: "column" }}>
                    <TextField
                        name="title"
                        label="What is your opportunity title?"
                        value={props.formData.title}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="organisation"
                        label="What organisation is leading this opportunity?"
                        select
                        value={props.formData.organisation}
                        onChange={handleChange}
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
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                    />
                    <TextField
                        name="what_do_you_already_have_in_place"
                        label="What do you already have in place?"
                        value={props.formData.what_do_you_already_have_in_place}
                        onChange={handleChange}
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

                    <Button
                        variant="contained"
                        onClick={() => {
                            handleTabChange(null, "3");
                        }}
                        style={{ float: "right" }}
                    >
                        Next
                    </Button>
                </Box>
            </TabPanel>

            <TabPanel style={{ padding: 10, display: "flex", justifyContent: "center" }} value="3">
                <Box sx={{ width: "50%", flexDirection: "column" }}>
                    <TextField
                        name="skill"
                        label="What main skill is required to help you with this request?"
                        value={props.formData.skill}
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        control={<Checkbox name="open_to_students" onChange={handleChange} margin="normal" />}
                        label="Check this box if you are open to receiving student volunteer support"
                        style={{ fontSize: "0.7em" }}
                    />
                    <TextField
                        name="number_of_volunteers"
                        label="How many volunteers are needed?"
                        value={props.formData.number_of_volunteers}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        type="number"
                    />
                    <TextField
                        name="deadline"
                        label="Deadline"
                        value={props.formData.deadline}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        type="date"
                    />
                    <Button variant="contained" onClick={handleSubmit} style={{ margin: "5px", float: "right" }}>
                        Submit
                    </Button>
                    {/* <Button onClick={AIEnhance} style={{ margin: "5px", float: "right" }}>
                        AI Enhance
                    </Button> */}
                </Box>
            </TabPanel>
        </TabContext>
    );
};

export default Form;
