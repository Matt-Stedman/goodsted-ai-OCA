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
            <EnhancedTextField
                name="opportunityType"
                label="What do you need help with?"
                select
                value={props.formData.opportunityType}
                enhanced={props.enhancedFormData.opportunityType}
                onChange={props.handleChange}
            >
                {["Mentoring", "Task", "Brainstorming", "Activity"].map((cause) => (
                    <MenuItem key={cause} value={cause}>
                        {cause}
                    </MenuItem>
                ))}
            </EnhancedTextField>
            <EnhancedTextField
                name="cause"
                label="What cause is this evolving?"
                select
                value={props.formData.cause}
                enhanced={props.enhancedFormData.cause}
                onChange={props.handleChange}
            >
                {causeOptions.map((cause) => (
                    <MenuItem key={cause} value={cause}>
                        {cause}
                    </MenuItem>
                ))}
            </EnhancedTextField>
            {props.childElements}
        </Box>
    );
};
export default WhatDoYouNeedHelpWith;
