import { Button, TextField, Box, MenuItem } from "@mui/material";
import EnhancedTextField from "./components/EnhancedTextField";

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
                fullWidth
                value={props.formData.opportunity_type}
                margin="normal"
                onChange={props.handleChange}
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
                fullWidth 
                margin="normal"
                value={props.formData.cause}
                onChange={props.handleChange}
            >
                {causeOptions.map((cause) => (
                    <MenuItem key={cause} value={cause}>
                        {cause}
                    </MenuItem>
                ))}
            </TextField>
            {props.childElements}
        </Box>
    );
};
export default WhatDoYouNeedHelpWith;
