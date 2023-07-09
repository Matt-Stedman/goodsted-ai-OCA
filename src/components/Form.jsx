import React, { useState } from "react";
import { Button, Grid, Checkbox, FormControlLabel, TextField, Box, MenuItem } from "@mui/material";
import { Tabs, Tab } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { createOpportunityFromForm, fillinTheRestOfForm } from "../functions/OpenAi";
import WhatDoYouNeedHelpWith from "./Form/WhatDoYouNeedHelpWith";
import AboutActivity from "./Form/AboutActivity";
import AboutSupporters from "./Form/AboutSupporters";

const Form = (props) => {
    const [currentTab, setCurrentTab] = useState("1");
    const [performAction, setPerformAction] = useState(false);
    const [enhancedFormData, setEnhancedFormData] = useState({});
    const [enhancementLoading, setEnhancementLoading] = useState(false);

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

    const AIEnhance = async () => {
        setEnhancementLoading(true);
        console.log(props.formData);
        await fillinTheRestOfForm(props.formData)
            .then((returnedForm) => {
                if (returnedForm) {
                    setEnhancedFormData(returnedForm);
                    console.log("Reviewed form content: ", returnedForm);
                } else {
                    console.log("Error passing form content!");
                }
            })
            .finally(() => {
                setEnhancementLoading(false);
            });
    };

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
                <WhatDoYouNeedHelpWith
                    formData={props.formData}
                    setFormData={props.setFormData}
                    enhancedFormData={enhancedFormData}
                    handleChange={handleChange}
                    childElements={
                        <Button
                            variant="contained"
                            onClick={() => {
                                handleTabChange(null, "2");
                            }}
                            style={{ float: "right" }}
                        >
                            Next
                        </Button>
                    }
                />
            </TabPanel>
            <TabPanel style={{ padding: 10, display: "flex", justifyContent: "center" }} value="2">
                <AboutActivity
                    formData={props.formData}
                    setFormData={props.setFormData}
                    enhancedFormData={enhancedFormData}
                    handleChange={handleChange}
                    childElements={
                        <Button
                            variant="contained"
                            onClick={() => {
                                handleTabChange(null, "3");
                            }}
                            style={{ float: "right" }}
                        >
                            Next
                        </Button>
                    }
                />
            </TabPanel>
            <TabPanel style={{ padding: 10, display: "flex", justifyContent: "center" }} value="3">
                <AboutSupporters
                    formData={props.formData}
                    setFormData={props.setFormData}
                    enhancedFormData={enhancedFormData}
                    handleChange={handleChange}
                    childElements={
                        <div>
                            <Button variant="contained" onClick={handleSubmit} style={{ float: "right" }}>
                                Submit
                            </Button>
                            {enhancementLoading ? (
                                <img
                                    src={process.env.PUBLIC_URL + "/assets/loading_inline.gif"}
                                    width="152.5"
                                    height="36.5"
                                    style={{ float: "right" }}
                                />
                            ) : (
                                <Button onClick={AIEnhance} style={{ float: "right" }}>
                                    ✨ AI Enhance ✨
                                </Button>
                            )}
                        </div>
                    }
                />
            </TabPanel>
        </TabContext>
    );
};

export default Form;
