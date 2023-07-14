import axios from "axios";

const chatGPTClient = axios.create({
    baseURL: "https://europe-west1-goodsted-ai.cloudfunctions.net/chatProxy",
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
    },
});

const imageClient = axios.create({
    baseURL: "https://europe-west1-goodsted-ai.cloudfunctions.net/imageProxy",
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
    },
});

const sterilizeFormData = (raw_form_data) => {
    let form_data = {};
    for (const key in raw_form_data) {
        if (Object.prototype.hasOwnProperty.call(raw_form_data, key)) {
            const value = raw_form_data[key];
            if (typeof value === "string") {
                form_data[key] = value.replace(/"/g, "'").replace(/\n/g, " ");
            } else {
                form_data[key] = value;
            }
        }
    }
    return form_data;
};

/**
 * Function to create general feedback for the entire posting
 */
export async function reviewEntireOpportunityGenerally(opportunity) {
    const prompt = `
        I am writing a volunteering opportunity on a volunteering platform called Goodsted. I want this opportunity to be clearer, friendlier, and more attractive to get more applicants.
        Give me a clear list of changes to make for the opportunity as bullet points in the style of "CHANGE [original this] TO [clearer/better this] BECAUSE [human-friendly reason]".
        For each change, you must only and always include the "CHANGE", "TO", and "BECAUSE" tags in each line you return. You must not use any other keyword.
        The opportunity is:
        '${opportunity}'`;

    const response = await chatGPTClient.post("/", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        max_tokens: 100,
    });

    console.log(response);

    return response.data.choices[0].message.content;
}

export const checklist = {
    Title: "Provide a clear, engaging title that sums up the volunteering opportunity.",
    "Organization's Information": "Include the name of your organization and a brief introduction of what you do.",
    "Purpose of the Volunteer Position":
        "Explain why this volunteer role exists and its relevance to the organization's mission.",
    "Key Responsibilities": "List the tasks the volunteer will be expected to perform.",
    "Skills and Experience Required":
        "Outline any necessary skills or experience that would be beneficial for the role.",
    "Time Commitment": "Clearly state the expected time commitment (e.g., 5 hours per week, one-day event).",
    "Training and Support": "Mention any training or support that will be provided to the volunteer.",
    Location: "If applicable, specify whether the work is remote or in a specific location.",
    "Benefits to the Volunteer":
        "What will the volunteer gain from this experience? This could be anything from acquiring new skills, meeting new people, or the satisfaction of contributing to a good cause.",
    "How to Apply":
        "Provide instructions on how volunteers can express their interest or apply. Include contact information for any further questions.",
    Deadline: "If applicable, mention the deadline for application or the date by which volunteers are needed.",
    Acknowledgement: "Acknowledge the potential volunteers' time and thank them for considering your opportunity.",
};

/**
 *  Function to evalute what's missing from the post
 */
export async function reviewEntireOpportunityAgainstChecklist(opportunity) {
    const prompt = `
        Evaluate the following volunteering opportunity post for completeness, evaluated against each topic (line by line) in the following checklist, indicating whether each is present (with "true") or missing ("false"):

        Please provide your evaluation by including "true" or "false" after each topic based on its presence or absence in the volunteering opportunity post. Use the format: "Topic: true" if the topic is present or "Topic: false" if the topic is missing.

        ${Object.entries(checklist)
            .map(([topic, description]) => `- ${topic}: ${description}`)
            .join("\n")}

        In addition, please provide any general notes or feedback in a single paragraph under the "Notes" section.

        Example response:
        ${Object.keys(checklist)
            .map((topic) => `${topic}: true`)
            .join("\n")}

        Notes: Please consider adding more details about the organization's background and the specific training and support provided to volunteers.

        The opportunity is: '${opportunity}'`;

    const response = await chatGPTClient.post("/", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    console.log(response);
    let content = response.data.choices[0].message.content;

    return content;
}

/**
 * Function to create a posting given a form response
 */
export async function createOpportunityFromForm(raw_form_data) {
    const form_data = sterilizeFormData(raw_form_data);

    const prompt = `
        I am writing a volunteering opportunity.
        Please convert the following bulletpoints (at the end of my message, under THIS IS THE DATA), not including their description:
        
        ${Object.entries(checklist)
            .map(([topic, description]) => `- ${topic}: ${description}`)
            .join("\n")}

        For each topic, either list what you find in the opportunity text or can reliably infer, however if you cannot find any information relating to that topic just completely ignore it.
        So if there is no Deadline detailed, for example, do not return the deadline topic.
        Include html formatting for headers where each header is <h1> .. </h1> and each topic is wrapped in <p> .. </p>.
        Include any other html styling you feel is appropriate (e.g. <strong> and <em>), and add emojis. Write in a friendly style.

        THIS IS THE DATA:
        
        *What do we want to achieve?*
        ${form_data.whatDoYouAimToAchieve}
        
        *What do we need help with?*
        ${form_data.whatDoYouNeedHelpWith}
        
        *What do we already have in place?*
        ${form_data.whatDoYouAlreadyHaveInPlace}

        
        *Meta data*
        Location: ${form_data.location}
        Title: ${form_data.title}
        Cause: ${form_data.cause}
        Deadline: ${form_data.deadline}
        Skills: ${form_data.skill}
        Secondary Skills: ${form_data.secondarySkills.map((skill) => skill).join(", ")}
        Poster: ${form_data.user}
        Organisation: ${form_data.organisation}
        Experience Required: ${form_data.experience}
        `;

    const response = await chatGPTClient.post("/", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    console.log(response);
    let content = response.data.choices[0].message.content;

    return content;
}

/**
 * Function to create a posting given a form response
 */
export async function fillinTheRestOfForm(raw_form_data) {
    const form_data = sterilizeFormData(raw_form_data);

    const prompt = `
I am writing a volunteering opportunity.
Given the below form, fill in any and all missing values as best as you can (including any secondary skills and prior experience you feel could be useful), and re-write fields you feel are unclear.
Be succinct, clear, concise, and human-friendly.
You must return ONLY a JSON-parsible response!
{
    "whatDoYouAimToAchieve":  [${form_data.whatDoYouAimToAchieve.map((skill) => `"${skill}"`).join(", ")}],
    "whatDoYouNeedHelpWith": "${form_data.whatDoYouNeedHelpWith}",
    "whatDoYouAlreadyHaveInPlace": "${form_data.whatDoYouAlreadyHaveInPlace}",
    "location": "${form_data.location}",
    "title": "${form_data.title}",
    "cause": "${form_data.cause}",
    "deadline": "${form_data.deadline}",
    "skill": "${form_data.skill}",
    "secondarySkills": [${form_data.secondarySkills.map((skill) => `"${skill}"`).join(", ")}],
    "user": "${form_data.user}",
    "experience": "${form_data.experience}"
}
        `;

    /*
        ${
            form_data.organisation
                ? ` For context, I have also included information about the enterprise here, which you can use if it helps (but do not report anything back for this): 
            {${form_data.organisation}}`
                : ""
        }
        */
    console.log(prompt);
    const response = await chatGPTClient.post("/", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
    });

    console.log(response);
    let content = response.data.choices[0].message.content;
    try {
        // Find the start and end indices of the JSON-parsable region
        const startIndex = content.indexOf("{");
        const endIndex = content.lastIndexOf("}");

        if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
            throw new Error("JSON-parsable region not found");
        }

        // Extract the JSON-parsable region
        const jsonContent = content.substring(startIndex, endIndex + 1);

        // Parse the extracted JSON content
        const formContent = JSON.parse(jsonContent);

        // Perform any additional processing or logic here

        // Return the extracted fields or perform any other desired operations
        return {
            whatDoYouAimToAchieve: formContent.whatDoYouAimToAchieve,
            whatDoYouNeedHelpWith: formContent.whatDoYouNeedHelpWith,
            whatDoYouAlreadyHaveInPlace: formContent.whatDoYouAlreadyHaveInPlace,
            location: formContent.location,
            title: formContent.title,
            cause: formContent.cause,
            deadline: formContent.deadline,
            skill: formContent.skill,
            secondarySkills: formContent.secondarySkills,
            user: formContent.user,
            experience: formContent.experience,
        };
    } catch (error) {
        console.error("Error parsing form content:", error);
        return null;
    }
}

/**
 * Function to create a posting given a form response
 */
export async function createLinkedInPostFromForm(raw_form_data) {
    const form_data = sterilizeFormData(raw_form_data);

    const prompt = `
        I am writing a volunteering opportunity, and now I need you to make me a friendly and exciting LinkedIn post.
        You must:
        1. Use some emojis, because this is a friendly post
        2. Keep it succinct (~100 words)! No one wants to read a long LinkedIn post.
        3. Have a call to action, we want people to sign up to this opportunity!
        4. Sound like a friendly human, we're inspiring strangers to join us!
        5. Use line breaks just to keep it more legible.
        6. Reference ${form_data.organization} and @Goodsted in the post

        Write this LinkedIn post considering the following opportunity notes:
        
        What we want to achieve:  [${form_data.whatDoYouAimToAchieve.map((skill) => `"${skill}"`).join(", ")}],
        What we need help with: "${form_data.whatDoYouNeedHelpWith}",
        Location: "${form_data.location}",
        Title: "${form_data.title}",
        Cause: "${form_data.cause}",
        Main Skill: "${form_data.skill}",
        Deadline: "${form_data.deadline}"
        `;

    const response = await chatGPTClient.post("/", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    console.log(response);
    let content = response.data.choices[0].message.content;

    return content;
}

/**
 * Function to create a prompt given form data
 */
export async function createImagePromptFromForm(raw_form_data) {
    const form_data = sterilizeFormData(raw_form_data);

    const prompt = `
        Write me a prompt for Dall E 2 of no more than 20 words that can generate an exciting image that summarizes this opportunity post: 
    
        What we want to achieve:  [${form_data.whatDoYouAimToAchieve.map((skill) => `"${skill}"`).join(", ")}],
        What we need help with: "${form_data.whatDoYouNeedHelpWith}",
        Location: "${form_data.location}",
        Title: "${form_data.title}",
        Cause: "${form_data.cause}",
        Main Skill: "${form_data.skill}",
        `;

    const response = await chatGPTClient.post("/", {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    console.log(response);
    let content = response.data.choices[0].message.content;
    return content.replace(/["':]/g, "");
}

/**
 * Function to create a images given a prompt
 */
export async function createImageGivenOpportunity(prompt_used) {
    if (!prompt_used) {
        return null;
    }
    const response = await imageClient.post("/", {
        prompt: prompt_used,
        n: 4,
        size: "1024x1024",
    });

    console.log(response);
    return response.data.data;
}
