import { Button, TextField, Box, MenuItem } from "@mui/material";

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

const WhatDoYouNeedHelpWith = (props) => {
    return (
        <Box sx={{ width: "50%", flexDirection: "column" }}>
            <TextField
                name="opportunity_type"
                label="What do you need help with?"
                select
                value={props.formData.opportunity_type}
                onChange={props.handleChange}
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
                onChange={props.handleChange}
                fullWidth
                margin="normal"
            >
                {causeOptions.map((cause) => (
                    <MenuItem key={cause} value={cause}>
                        {cause}
                    </MenuItem>
                ))}
            </TextField>
            {props.myButton}
        </Box>
    );
};
export default WhatDoYouNeedHelpWith;
